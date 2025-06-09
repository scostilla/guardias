import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { DistribucionGuardiaService } from 'src/app/services/personal/distribucionGuardia.service';
import { DistribucionGuardiaDto } from 'src/app/dto/personal/DistribucionGuardiaDto';
import { DistribucionConsultorioService } from 'src/app/services/personal/distribucionConsultorio.service';
import { DistribucionConsultorioDto } from 'src/app/dto/personal/DistribucionConsultorioDto';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { ServicioSummaryDto } from 'src/app/dto/Configuracion/ServicioSummaryDto';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { CapsDto } from 'src/app/dto/Configuracion/CapsDto';
import { DistribucionGiraService } from 'src/app/services/personal/distribucionGira.service';
import { DistribucionOtroService } from 'src/app/services/personal/distribucionOtro.service';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { DistribucionGiraDto } from 'src/app/dto/personal/DistribucionGiraDto';
import { DistribucionOtroDto } from 'src/app/dto/personal/DistribucionOtroDto';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import * as moment from 'moment';

interface HorarioDistribucion {
  dia: string;
  horaInicio: string; // en formato HH:mm
  cantidadHoras: number;
}

interface Tipos {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-personal-dh-edit',
  templateUrl: './personal-dh-edit.component.html',
  styleUrls: ['./personal-dh-edit.component.css'],
})
export class PersonalDhEditComponent {

  inputValue: string = '';
  suscription!: Subscription;
  asistencial: Asistencial | null = null;
  idPersona!: number;
  fechaSeleccionada!: string;
  tipoGuardias: TipoGuardia[] = [];
  guardiaForm!: FormGroup;
  consultorioForm!: FormGroup;
  giraForm!: FormGroup;
  otroForm!: FormGroup;
  vigenciaForm!: FormGroup;
  nombreProfesion: string = '';
  tipoGuardia: string = '';
  
  step = -1;
  cantidadHoras: number = 0;
  minDate!: Date;

  cargaHoraria?: number;
  idEfector: number | undefined = undefined;
  tiposGuardiaOptions: { nombre: string }[] = [];
  meses: { nombre: string; fecha: moment.Moment; }[] = [];

  horasStatus: string = '';
  horasMessage: string = '';
  horasMessageClass: string = '';
  solapamientoMessage: string = '';
  solapamientoMessageClass: string = '';

  servicios: ServicioSummaryDto[] = [];
  hospitales: Hospital[] = [];
  capss: CapsDto[] = [];
  efectorId: number | null = null;

  guardiasOriginales: any[] = [];
  consultoriosOriginales: any[] = [];
  girasOriginales: any[] = [];
  otrosOriginales: any[] = [];

  public distribucionesGuardiaIds: number[] = [];
  public distribucionesConsultorioIds: number[] = [];
  public distribucionesGiraIds: number[] = [];
  public distribucionesOtroIds: number[] = [];

  isButtonDisabled: boolean = true;
  addButtonDisabled: boolean = false;

  options: any[] | undefined;
  
  tipos: Tipos[] = [
    { value: 'PASE_DE_SALA', viewValue: 'Pase de sala' },
    { value: 'ATENEO', viewValue: 'Ateneo' },
    { value: 'CONSULTORIO_EN_CAPS', viewValue: 'Consultorio en CAPS' },
    { value: 'OTROS', viewValue: 'Otros' },
  ];

  constructor(
    public dialog: MatDialog,
    public dialogReg: MatDialog,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private distribucionGuardiaService: DistribucionGuardiaService,
    private distribucionConsultorioService: DistribucionConsultorioService,
    private distribucionGiraService: DistribucionGiraService,
    private distribucionOtroService: DistribucionOtroService,
    private efectorService: EfectorService,
    private hospitalService: HospitalService,
    private asistencialService: AsistencialService,
    private cronoService: CronogramaTentativoService,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.guardiaForm = this.fb.group({
      guardias: this.fb.array([this.createGuardia()])
    });

    this.consultorioForm = this.fb.group({
      consultorios: this.fb.array([this.createConsultorio()])
    });

    this.giraForm = this.fb.group({
      giras: this.fb.array([this.createGira()])
    });

    this.otroForm = this.fb.group({
      otros: this.fb.array([this.createOtro()])
    });

    this.vigenciaForm = this.fb.group({
      mesVigencia: [null, Validators.required],
      fechaInicio: [{ value: null, disabled: true }],
      fechaFinalizacion: [{ value: null, disabled: true }]
    });

    this.minDate = new Date();
    this.subscribeToFormChanges();
  }
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const asistencialId = params['asistencialId'];
      const fechaInicioParam = params['fechaInicio'];

if (!fechaInicioParam || !moment(fechaInicioParam, 'YYYY-MM-DD', true).isValid()) {
  this.toastr.error('La fecha de inicio proporcionada no es válida.', 'Error', {
    timeOut: 6000,
    positionClass: 'toast-top-center',
    progressBar: true
  });
  this.isButtonDisabled = false;
  return;
}

this.fechaSeleccionada = fechaInicioParam;
  
      this.suscription = this.asistencialService.currentAsistencialId$.subscribe(id => {
        if (id === null) {
          this.location.back();
          return;
        }
  
        this.asistencialService.detail(id).subscribe({
          next: (asistencial) => {
            this.asistencial = asistencial;
            this.idPersona = asistencial.id!;
            const legajoActivo = asistencial.legajos.find(l => l.activo);
            this.nombreProfesion = legajoActivo?.profesion?.nombre || 'Sin profesión';
  
            // Ya con el objeto completo
            this.listServicios();
            this.filterLegajosAndGetTipoGuardia();
            this.listCaps();
            this.generarMeses();
            this.loadCargaHoraria();
            this.loadDistribuciones(fechaInicioParam);
          },
          error: (err) => {
            console.error('Error al obtener el asistencial:', err);
            this.location.back();
          }
        });
      });
    });

    this.efectorId = this.efectorService.getCurrentEfectorId();
  }
      
  private subscribeToFormChanges(): void {
    this.guardiaForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.consultorioForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.giraForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.otroForm.valueChanges.subscribe(() => this.updateHorasStatus());
  }

mostrarOpcion(horas: number, tipoGuardia: string): boolean {
  if (tipoGuardia !== 'CARGO') {
    return false;
  }

  if (this.nombreProfesion === 'Medico') {
    return horas === 12 || horas === 24;
  }

  if (this.nombreProfesion === 'Bioquimico') {
    return horas === 8 || horas === 12 || horas === 24;
  }

  return false;
}

  
getFechaFormateada(): string {
  return moment(this.fechaSeleccionada, 'YYYY-MM-DD').format('MMMM YYYY');
}

loadDistribuciones(fechaInicio: string): void {
  const fechaInicioMoment = moment(fechaInicio, 'YYYY-MM-DD');
  const fechaFinMoment = fechaInicioMoment.clone().endOf('month');
  const idAsistencial = this.asistencial?.id;

  if (!idAsistencial) {
    this.toastr.error('Asistencial no encontrado.');
    return;
  }

  const fechaInicioStr = fechaInicioMoment.format('YYYY-MM-DD');
  const fechaFinStr = fechaFinMoment.format('YYYY-MM-DD');

  // Guardias
  this.distribucionGuardiaService.listByActivoByPersonAndFechaInicioAndFechaFin(idAsistencial, fechaInicioStr, fechaFinStr)
    .subscribe(distribucionesGuardia => {
      this.updateForm(distribucionesGuardia, this.guardiaForm);
      this.distribucionesGuardiaIds = distribucionesGuardia.map(d => d.id).filter((id): id is number => id !== undefined);
    });

  // Consultorios
  this.distribucionConsultorioService.listByActivoByPersonAndFechaInicioAndFechaFin(idAsistencial, fechaInicioStr, fechaFinStr)
    .subscribe(distribucionesConsultorio => {
      this.updateForm(distribucionesConsultorio, this.consultorioForm);
      this.distribucionesConsultorioIds = distribucionesConsultorio.map(d => d.id).filter((id): id is number => id !== undefined);
    });

  // Giras
  this.distribucionGiraService.listByActivoByPersonAndFechaInicioAndFechaFin(idAsistencial, fechaInicioStr, fechaFinStr)
    .subscribe(distribucionesGira => {
      this.updateForm(distribucionesGira, this.giraForm);
      this.distribucionesGiraIds = distribucionesGira.map(d => d.id).filter((id): id is number => id !== undefined);
    });

  // Otros
  this.distribucionOtroService.listByActivoByPersonAndFechaInicioAndFechaFin(idAsistencial, fechaInicioStr, fechaFinStr)
    .subscribe(distribucionesOtro => {
      this.updateForm(distribucionesOtro, this.otroForm);
      this.distribucionesOtroIds = distribucionesOtro.map(d => d.id).filter((id): id is number => id !== undefined);
    });
}

  private updateForm(distribuciones: any[], formGroup: FormGroup): void {
    // Resetear el FormArray antes de agregar los nuevos registros
    const formArray = (formGroup.get('consultorios') || formGroup.get('guardias') || formGroup.get('giras') || formGroup.get('otros')) as FormArray;
    formArray.clear();

    //Guardo datos originales para usar en cierres del save
    if (formGroup === this.guardiaForm) {
      this.guardiasOriginales = distribuciones;
    } else if (formGroup === this.consultorioForm) {
      this.consultoriosOriginales = distribuciones;
    } else if (formGroup === this.giraForm) {
      this.girasOriginales = distribuciones;
    } else if (formGroup === this.otroForm) {
      this.otrosOriginales = distribuciones;
    }

    // Añadir los registros obtenidos a la forma
    distribuciones.forEach(d => {
      let form;
      //console.log('Distribución recibida:', d); // Log de la distribución recibida
      // Asegurarse de que horaIngreso esté en el formato adecuado
      const horaIngresoFormateada = moment(d.horaIngreso, 'HH:mm:ss').format('HH:mm');
  
      if (formGroup === this.guardiaForm) {
        form = this.createGuardia();
          console.log('🟡 Patch Guardia - Valores recibidos:', {
              dia: d.dia,
              horaIngreso: horaIngresoFormateada,
              idServicio: d.servicio,
              tipoGuardia: d.tipoGuardia,
              cantidadHoras: d.cantidadHoras
            });
        form.patchValue({
          dia: d.dia,
          horaIngreso: horaIngresoFormateada,
          idServicio: d.servicio,
          tipoGuardia: d.tipoGuardia,
          cantidadHoras: d.cantidadHoras,
        });
      } else if (formGroup === this.consultorioForm) {
        form = this.createConsultorio();
          const horas = Math.floor(d.cantidadHoras);
          const minutos = Math.round((d.cantidadHoras - horas) * 60);

        form.patchValue({
          dia: d.dia,
          horas: horas,
          minutos: minutos,
          horaIngreso: horaIngresoFormateada,
          idServicio: d.servicio,
        });
      } else if (formGroup === this.giraForm) {
        form = this.createGira();
        form.patchValue({
          dia: d.dia,
          cantidadHoras: d.cantidadHoras,
          horaIngreso: horaIngresoFormateada,
          puestoSalud: d.puestoSalud,
          //descripcion: d.descripcion,
          //destino: d.destino,
        });
      } else if (formGroup === this.otroForm) {
        form = this.createOtro();
          const horas = Math.floor(d.cantidadHoras);
          const minutos = Math.round((d.cantidadHoras - horas) * 60);

        form.patchValue({
          dia: d.dia,
          horas: horas,
          minutos: minutos,
          horaIngreso: horaIngresoFormateada,
          descripcion: d.descripcion,
          lugar: d.lugar,
          tipo: d.tipo,
        });
      }
  
      formArray.push(form);
    });
  }
    
hasDatos(form: FormGroup): boolean {
  return Object.values(form.controls).some(control => {
    const value = control.value;
    return value !== null && value !== '' && value !== undefined;
  });
}

isFormArrayWithDataValid(array: FormArray): boolean {
  const formsWithData = array.controls.filter(control => this.hasDatos(control as FormGroup));
  return formsWithData.length === 0 || formsWithData.every(control => control.valid);
}

allFormsWithDataAreValid(): boolean {
  return (
    this.isFormArrayWithDataValid(this.guardias) &&
    this.isFormArrayWithDataValid(this.consultorios) &&
    this.isFormArrayWithDataValid(this.giras) &&
    this.isFormArrayWithDataValid(this.otros)
  );
}

createGuardia(): FormGroup {
  const guardiaForm = this.fb.group({
    dia: ['', Validators.required],
    horaIngreso: ['', Validators.required],
    idServicio: ['', Validators.required],
    tipoGuardia: ['', Validators.required],
    cantidadHoras: [null, Validators.required], // Validador genérico inicial
  });

  guardiaForm.get('tipoGuardia')?.valueChanges.subscribe(value => {
    const cantidadHorasControl = guardiaForm.get('cantidadHoras');

    // Resetear valor para evitar valores inválidos previos
    cantidadHorasControl?.setValue(null);

    if (value === 'CARGO') {
      // Valida que sea uno de los valores permitidos (8, 12, 24)
      cantidadHorasControl?.setValidators([
        Validators.required,
        control => {
          const val = control.value;
          return [8,12,24].includes(val) ? null : { invalidOption: true };
        }
      ]);
    } else if (value === 'AGRUPACION') {
      // Validadores para número entero >= 4
      cantidadHorasControl?.setValidators([
        Validators.required,
        Validators.min(4),
        Validators.pattern(/^[1-9]\d*$/)
      ]);
    } else {
      // Por defecto solo required
      cantidadHorasControl?.setValidators([Validators.required]);
    }

    cantidadHorasControl?.updateValueAndValidity();
  });

  return guardiaForm;
}

  get guardias() {
    return (this.guardiaForm.get('guardias') as FormArray);
  }

  addGuardia(): void {
    this.guardias.push(this.createGuardia());
  }

  removeGuardia(index: number): void {
    this.guardias.removeAt(index);
  }

  areAllFormsGuardiaValid(): boolean {
    return this.guardias.controls.every(form => form.valid);
  }

  hasNoGuardias(): boolean {
    return this.guardias.length === 0;
  }

  createConsultorio(): FormGroup {
    return this.fb.group({
      //tipoConsultorio: ['', Validators.required],
      dia: ['', Validators.required],
      horas: [null, [Validators.required, Validators.min(1)]],
      minutos: [null, [Validators.required, Validators.min(0), Validators.max(59)]],
      horaIngreso: ['', Validators.required],
      idServicio: ['', Validators.required]
    });
  }

  get consultorios() {
    return (this.consultorioForm.get('consultorios') as FormArray);
  }

  addConsultorio(): void {
    this.consultorios.push(this.createConsultorio());
  }

  removeConsultorio(index: number): void {
    this.consultorios.removeAt(index);
  }

  areAllFormsConsultorioValid(): boolean {
    return this.consultorios.controls.every(form => form.valid); // Verifica que todos los formularios sean válidos
  }

  hasNoConsultorio(): boolean {
    return this.consultorios.length === 0;
  }

  createGira(): FormGroup {
    return this.fb.group({
      dia: ['', Validators.required],
      cantidadHoras: ['', [Validators.required, Validators.min(1), Validators.pattern(/^\d+(\.\d{1})?$/)]],
      horaIngreso: ['', Validators.required],
      puestoSalud: ['', Validators.required],
      //descripcion: ['', Validators.required],
      //destino: ['', Validators.required]
    });
  }

  get giras() {
    return (this.giraForm.get('giras') as FormArray);
  }

  addGira(): void {
    this.giras.push(this.createGira());
  }

  removeGira(index: number): void {
    this.giras.removeAt(index);
  }

  areAllFormsGiraValid(): boolean {
    return this.giras.controls.every(form => form.valid); // Verifica que todos los formularios sean válidos
  }

  hasNoGira(): boolean {
    return this.giras.length === 0;
  }

  createOtro(): FormGroup {
    const grupo = this.fb.group({
      dia: ['', Validators.required],
      horas: [null, [Validators.required, Validators.min(1)]],
      minutos: [null, [Validators.required, Validators.min(0), Validators.max(59)]],
      horaIngreso: ['', Validators.required],
      descripcion: [''], // inicialmente sin validadores
      lugar: ['', Validators.required],
      tipo: ['', Validators.required]
    });

    // Reacciona al cambio del campo 'tipo' de esta instancia
    grupo.get('tipo')?.valueChanges.subscribe((valor) => {
      const descripcionControl = grupo.get('descripcion');
      if (valor === 'OTROS') {
        descripcionControl?.setValidators(Validators.required);
      } else {
        descripcionControl?.clearValidators();
        descripcionControl?.setValue('');
      }
      descripcionControl?.updateValueAndValidity();
    });

    return grupo;
  }

  get otros() {
    return (this.otroForm.get('otros') as FormArray);
  }

  addOtro(): void {
    this.otros.push(this.createOtro());
  }

  removeOtro(index: number): void {
    this.otros.removeAt(index);
  }

  areAllFormsOtroValid(): boolean {
    return this.otros.controls.every(form => form.valid); // Verifica que todos los formularios sean válidos
  }

  hasNoOtro(): boolean {
    return this.otros.length === 0;
  }
  
  filterLegajosAndGetTipoGuardia() {
    if (this.asistencial) {
      // Filtrar los legajos activos y que no son autoridad
      const legajosFiltrados = this.asistencial.legajos.filter(legajo => 
        legajo.activo === true && legajo.esAutoridad === false
      );

      // Limpiar tipoGuardias y idEfector antes de asignar nuevos valores
      this.tipoGuardias = [];
      this.idEfector = undefined;  // Limpiamos idEfector

      // Obtener los tipoGuardias de los legajos filtrados
      legajosFiltrados.forEach(legajo => {
        // Filtrar los tipoGuardias por el nombre "CARGO" o "AGRUPACION"
        const tipoGuardiasFiltrados = legajo.tipoGuardias.filter(tipoGuardia => 
          tipoGuardia.nombre === 'CARGO' || tipoGuardia.nombre === 'AGRUPACION'
        );

        // Agregar los tipoGuardias filtrados al array de tipoGuardias
        this.tipoGuardias = [...this.tipoGuardias, ...tipoGuardiasFiltrados];

        // Obtener el primer efector del legajo (si existe) y asignarlo a idEfector
        if (legajo.efectores.length > 0 && this.idEfector === undefined) {
          this.idEfector = legajo.efectores[0].id;  // Solo tomamos el primer efector
        }
      });

      //console.log('TipoGuardias disponibles (CARGO o AGRUPACION):', this.tipoGuardias);
      //console.log('ID del primer efector:', this.idEfector);
    }
  }  
  
  loadCargaHoraria(): void { 
    const legajosActivos = this.asistencial?.legajos.filter(legajo => legajo.activo);
    
    if (legajosActivos && legajosActivos.length > 0) {
      const ultimoLegajoActivo = legajosActivos.sort((a, b) => b.id! - a.id!)[0];
  
      if (ultimoLegajoActivo.revista?.cargaHoraria) {
        this.cargaHoraria = ultimoLegajoActivo.revista.cargaHoraria.cantidad;
      } else {
        this.cargaHoraria = undefined; // Si no hay carga horaria
        console.warn('No hay carga horaria definida para el último legajo activo');
      }
    } else {
      this.cargaHoraria = undefined; // No hay legajos activos
      console.warn('No hay legajos activos disponibles');
    }
  }
        
  private updateHorasStatus(): void {
    const guardiaHoras = (this.guardiaForm.get('guardias') as FormArray).controls.reduce((sum, formGroup) => {
      return sum + (Number(formGroup.get('cantidadHoras')?.value) || 0);
    }, 0);

    const consultorioHoras = (this.consultorioForm.get('consultorios') as FormArray).controls.reduce((sum, formGroup, i) => {
      const horas = Number(formGroup.get('horas')?.value) || 0;
      const minutos = Number(formGroup.get('minutos')?.value) || 0;
      const cantidadDecimal = horas + minutos / 60;
      console.log(`Consultorio ${i}: ${horas}h ${minutos}min = ${cantidadDecimal}`);
      return sum + cantidadDecimal;
    }, 0);

    const giraHoras = (this.giraForm.get('giras') as FormArray).controls.reduce((sum, formGroup) => {
      return sum + (Number(formGroup.get('cantidadHoras')?.value) || 0);
    }, 0);

    const otroHoras = (this.otroForm.get('otros') as FormArray).controls.reduce((sum, formGroup, i) => {
      const horas = Number(formGroup.get('horas')?.value) || 0;
      const minutos = Number(formGroup.get('minutos')?.value) || 0;
      const cantidadDecimal = horas + minutos / 60;
      console.log(`otros ${i}: ${horas}h ${minutos}min = ${cantidadDecimal}`);
      return sum + cantidadDecimal;
    }, 0);

    const totalHoras = guardiaHoras + consultorioHoras + giraHoras + otroHoras;

if (this.cargaHoraria !== undefined) {
  if (totalHoras > this.cargaHoraria) {
    this.horasMessage = 'Has superado el total de horas posibles';
    this.horasMessageClass = 'error-message';
    this.isButtonDisabled = true;
    this.addButtonDisabled = true;
  } else if (totalHoras < this.cargaHoraria) {
    this.horasMessage = `Total de horas cargadas: ${this.formatHorasDecimal(totalHoras)}. Debes alcanzar ${this.cargaHoraria} entre todos los formularios.`;
    this.horasMessageClass = 'pending-message';
    this.isButtonDisabled = true;
    this.addButtonDisabled = false;
  } else {
    this.horasMessage = `Has cargado un total de ${totalHoras}`;
    this.horasMessageClass = 'success-message';
    this.isButtonDisabled = !this.allFormsWithDataAreValid();
    this.addButtonDisabled = true;
  }
} else {
  this.horasMessage = '';
  this.horasMessageClass = '';
    this.isButtonDisabled = !this.allFormsWithDataAreValid();
}
// Verificar solapamiento de horarios
const horarios: HorarioDistribucion[] = [];
this.guardias.controls.forEach(form => {
  const raw = form.getRawValue();
  horarios.push({
    dia: raw.dia,
    horaInicio: raw.horaIngreso,
    cantidadHoras: +raw.cantidadHoras
  });
});

this.consultorios.controls.forEach(form => {
  const horas = Number(form.get('horas')?.value) || 0;
  const minutos = Number(form.get('minutos')?.value) || 0;
  const cantidadDecimal = horas + minutos / 60;

  horarios.push({
    dia: form.value.dia,
    horaInicio: form.value.horaIngreso,
    cantidadHoras: cantidadDecimal
  });
});

this.giras.controls.forEach(form => {
  horarios.push({
    dia: form.value.dia,
    horaInicio: form.value.horaIngreso,
    cantidadHoras: +form.value.cantidadHoras
  });
});

this.otros.controls.forEach(form => {
  const horas = Number(form.get('horas')?.value) || 0;
  const minutos = Number(form.get('minutos')?.value) || 0;
  const cantidadDecimal = horas + minutos / 60;

  horarios.push({
    dia: form.value.dia,
    horaInicio: form.value.horaIngreso,
    cantidadHoras: cantidadDecimal
  });
});

if (this.haySolapamiento(horarios)) {
  this.solapamientoMessage = 'Error: hay horarios superpuestos entre las diferentes distribuciones cargadas.';
  this.solapamientoMessageClass = 'error-message';
  this.isButtonDisabled = true;
  return;
} else {
  this.solapamientoMessage = '';
  this.solapamientoMessageClass = '';
}
  }

  private formatHorasDecimal(decimal: number): string {
  const horas = Math.floor(decimal);
  const minutos = Math.round((decimal - horas) * 60);
  return `${horas}:${minutos.toString().padStart(2, '0')} hs`;
}

private haySolapamiento(horarios: HorarioDistribucion[]): boolean {
  // Convertir los días a fechas concretas usando una base arbitraria (ej: la semana actual)
  const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  const baseFecha = moment().startOf('week'); // Empieza en domingo

  const rangos: { inicio: moment.Moment, fin: moment.Moment }[] = [];

  for (const h of horarios) {
    if (!h.dia || !h.horaInicio || !h.cantidadHoras) continue;

    const indexDia = diasSemana.indexOf(h.dia.toLowerCase());
    if (indexDia === -1) continue;

    const fechaBase = moment(baseFecha).add(indexDia + 1, 'days'); // +1 para empezar en lunes
    const inicio = moment(`${fechaBase.format('YYYY-MM-DD')} ${h.horaInicio}`, 'YYYY-MM-DD HH:mm');
    const fin = moment(inicio).add(h.cantidadHoras, 'hours');

    // Comparar con todos los rangos existentes
    for (const r of rangos) {
      if (inicio.isBefore(r.fin) && fin.isAfter(r.inicio)) {
        return true;
      }
    }

    rangos.push({ inicio, fin });
  }

  return false;
}
            
  listServicios(): void {
    this.hospitalService.getActiveServicesByHospital(this.efectorId!).subscribe((data: ServicioSummaryDto[]) => {
      this.servicios = data;
    });
  }

  listCaps(): void {
    //console.log('idEfector en listCaps:', this.idEfector); // Verifica el valor de idEfector
    if (this.idEfector) {
      this.hospitalService.listActiveCapsByHospitalId(this.idEfector).subscribe(
        data => {
          console.log('Caps activos para el efector:', data); // Verifica los datos
          this.capss = data;
        },
        error => {
          console.error('Error al listar caps activos:', error); // Verifica si hay errores
        }
      );
    } else {
      console.warn('idEfector no tiene un valor válido en listCaps.');
      this.capss = []; // Si no hay idEfector, limpiar los caps
    }
  }

  //Permite el select mes de vigencia cree la ultima fecha del mes elegido
  private generarMeses(): void {
    const hoy = new Date();
    this.meses = [];
    
    // Comienza desde el mes siguiente al actual
    for (let i = 1; i <= 6; i++) {
        const mes = moment(new Date(hoy.getFullYear(), hoy.getMonth() + i, 1));
        
        const fechaInicio = mes.startOf('month').toDate();
        const fechaFinalizacion = moment(mes).endOf('month');
  
        const mesNombreCapitalizado = mes.format('MMMM').charAt(0).toUpperCase() + mes.format('MMMM').slice(1);
    
        this.meses.push({ nombre: mesNombreCapitalizado, fecha: fechaFinalizacion });
    }
}

  // Verifica los campos en cada form para colocar su estado (en proceso o finalizado)
  isFormStarted(form: FormGroup): boolean {
    return form.dirty;
  }
  
  isFormComplete(form: FormGroup): boolean {
    return this.isFormStarted(form) && form.valid;
  }
  
  hasIncompleteFields(form: FormGroup): boolean {
    return this.isFormStarted(form) && !form.valid;
  }

  cerrarPanel() {
    this.step = -1;
  }

saveDistribuciones() {
  this.isButtonDisabled = true;

  if (this.idEfector === undefined) {
    this.toastr.error('El profesional no está definido o no posee un legajo.', 'Error', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.isButtonDisabled = false;
    return;
  }

  const formChecks = [
    { form: this.guardiaForm, name: 'Guardias' },
    { form: this.consultorioForm, name: 'Consultorio' },
    { form: this.giraForm, name: 'Giras médicas' },
    { form: this.otroForm, name: 'Otras actividades' }
  ];

  for (const { form, name } of formChecks) {
    if (form.dirty && !form.valid) {
      this.toastr.warning(`Faltan datos obligatorios para el panel ${name}.`, 'Advertencia', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      this.isButtonDisabled = false;
      return;
    }
  }

  const fechaSeleccionada = moment(this.fechaSeleccionada);
  const esMesActual = moment().isSame(fechaSeleccionada, 'month');
  
  const fechaInicio = esMesActual
    ? moment().add(1, 'week').startOf('isoWeek').toDate()
    : fechaSeleccionada.clone().startOf('month').toDate();

  const fechaFinalizacion = moment(fechaInicio).endOf('month').startOf('day').toDate();
  const fechaFinalizacionCierre = moment().startOf('day').toDate();

  this.cronoService.existenCronogramasDesdeFecha(
    moment(fechaInicio).format('YYYY-MM-DD'),
    this.idPersona,
    this.idEfector
  ).subscribe((existen: boolean) => {
    if (existen) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: 'Existen cronogramas tentativos, relacionados a la fecha deseas modificar.<br/>Si prosigues, los tentativos serán anulados y deberás crear nuevos tentativos.<br/><span class="negrita">¿Quieres proseguir?</span>',
          title: 'Existen tentativos',
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.continuarSaveDistribuciones(esMesActual, fechaInicio);
        } else {
          this.isButtonDisabled = false;
        }
      });
    } else {
      this.continuarSaveDistribuciones(esMesActual, fechaInicio);
    }
  });
}

continuarSaveDistribuciones(esMesActual: boolean, fechaInicio: Date) {
  const fechaFinalizacion = moment(fechaInicio).endOf('month').startOf('day').toDate();
  const fechaFinalizacionCierre = moment().startOf('day').toDate();

  const savePromises: Promise<any>[] = [];
  const deletePromises: Promise<any>[] = [];
  const errorMessages: string[] = [];

  // Paso 1: Guardar cierres si es el mes actual
  if (esMesActual) {
    const cerrarDistribuciones = (
      originales: any[],
      tipo: string,
      service: any,
      dtoClass: any
    ) => {
      originales.forEach((original: any) => {
        let cierreDto: any;

        if (dtoClass === DistribucionGuardiaDto) {
          const idServicio =
            original.idServicio?.id ??
            original.idServicio ??
            original.servicio?.id ??
            null;

          cierreDto = new DistribucionGuardiaDto(
            original.dia,
            original.cantidadHoras,
            original.idPersona ?? this.idPersona,
            original.idEfector ?? this.idEfector,
            moment(original.fechaInicio).toDate(),
            fechaFinalizacionCierre,
            original.horaIngreso,
            original.tipoGuardia,
            idServicio
          );
        } else if (dtoClass === DistribucionConsultorioDto) {
          const idServicio =
            original.idServicio?.id ??
            original.idServicio ??
            original.servicio?.id ??
            null;

          cierreDto = new DistribucionConsultorioDto(
            original.dia,
            original.cantidadHoras,
            original.idPersona ?? this.idPersona,
            original.idEfector ?? this.idEfector,
            moment(original.fechaInicio).toDate(),
            fechaFinalizacionCierre,
            original.horaIngreso,
            idServicio,
            'EXTERNO'
          );
        } else if (dtoClass === DistribucionGiraDto) {
          cierreDto = new DistribucionGiraDto(
            original.dia,
            original.cantidadHoras,
            original.idPersona ?? this.idPersona,
            original.idEfector ?? this.idEfector,
            moment(original.fechaInicio).toDate(),
            fechaFinalizacionCierre,
            original.horaIngreso,
            original.puestoSalud
          );
        } else if (dtoClass === DistribucionOtroDto) {
          cierreDto = new DistribucionOtroDto(
            original.dia,
            original.cantidadHoras,
            original.idPersona ?? this.idPersona,
            original.idEfector ?? this.idEfector,
            moment(original.fechaInicio).toDate(),
            fechaFinalizacionCierre,
            original.horaIngreso,
            original.descripcion,
            original.lugar,
            original.tipo
          );
        }

        console.log(`[CIERRE][${tipo}] DTO enviado:`, cierreDto);
        savePromises.push(
          service.save(cierreDto).toPromise().catch(() =>
            errorMessages.push(`${tipo} cierre: ${original.dia}`)
          )
        );
      });
    };

    cerrarDistribuciones(this.guardiasOriginales, 'Guardia', this.distribucionGuardiaService, DistribucionGuardiaDto);
    cerrarDistribuciones(this.consultoriosOriginales, 'Consultorio', this.distribucionConsultorioService, DistribucionConsultorioDto);
    cerrarDistribuciones(this.girasOriginales, 'Gira', this.distribucionGiraService, DistribucionGiraDto);
    cerrarDistribuciones(this.otrosOriginales, 'Otro', this.distribucionOtroService, DistribucionOtroDto);
  }

  // Paso 2: Eliminar distribuciones anteriores (soft delete)
  this.cronoService.updateCronogramasDesdeFecha(
    moment(fechaInicio).format('YYYY-MM-DD'),
    this.idPersona,
    this.idEfector!
  ).subscribe(() => {
    // luego eliminar
    const eliminarDistribuciones = (ids: number[], service: any) => {
      ids.forEach((id: number) => {
        if (typeof id === 'number' && id >= 0) {
          deletePromises.push(service.delete(id).toPromise());
        }
      });
    };

    eliminarDistribuciones(this.distribucionesGuardiaIds, this.distribucionGuardiaService);
    eliminarDistribuciones(this.distribucionesConsultorioIds, this.distribucionConsultorioService);
    eliminarDistribuciones(this.distribucionesGiraIds, this.distribucionGiraService);
    eliminarDistribuciones(this.distribucionesOtroIds, this.distribucionOtroService);

    Promise.all(deletePromises)
      .then(() => {
        // Paso 3: Guardar nuevas distribuciones
        const guardarNuevasDistribuciones = (
          formArray: FormArray,
          tipo: string,
          service: any,
          dtoClass: any
        ) => {
          formArray.controls.forEach((control) => {
            const data = control.getRawValue();
            let cantidadHoras: number;

            if (tipo === 'Consultorio') {
              const horas = Number(data.horas) || 0;
              const minutos = Number(data.minutos) || 0;
              cantidadHoras = horas + minutos / 60;
            } else {
              cantidadHoras = Number(data.cantidadHoras);
            }

            let nuevoDto: any;

            if (dtoClass === DistribucionGuardiaDto) {
              nuevoDto = new DistribucionGuardiaDto(
                data.dia,
                cantidadHoras,
                this.idPersona,
                this.idEfector ?? 0,
                fechaInicio,
                fechaFinalizacion,
                data.horaIngreso,
                data.tipoGuardia,
                data.idServicio?.id
              );
            } else if (dtoClass === DistribucionConsultorioDto) {
                const cantidadHorasDecimal =
                (Number(data.horas) || 0) + (Number(data.minutos) || 0) / 60;

              nuevoDto = new DistribucionConsultorioDto(
                data.dia,
                cantidadHorasDecimal,
                this.idPersona,
                this.idEfector ?? 0,
                fechaInicio,
                fechaFinalizacion,
                data.horaIngreso,
                data.idServicio?.id,
                'EXTERNO'
              );
            } else if (dtoClass === DistribucionGiraDto) {
              nuevoDto = new DistribucionGiraDto(
                data.dia,
                cantidadHoras,
                this.idPersona,
                this.idEfector ?? 0,
                fechaInicio,
                fechaFinalizacion,
                data.horaIngreso,
                data.puestoSalud.id
              );
            } else if (dtoClass === DistribucionOtroDto) {
                const cantidadHorasDecimal =
                (Number(data.horas) || 0) + (Number(data.minutos) || 0) / 60;

              nuevoDto = new DistribucionOtroDto(
                data.dia,
                cantidadHorasDecimal,
                this.idPersona,
                this.idEfector ?? 0,
                fechaInicio,
                fechaFinalizacion,
                data.horaIngreso,
                data.descripcion,
                data.lugar,
                data.tipo
              );
            }

console.log(`[NUEVO][${tipo}] DTO enviado:`, nuevoDto);
            savePromises.push(
              service.save(nuevoDto).toPromise().catch(() =>
                errorMessages.push(`${tipo} nuevo: ${data.dia}`)
              )
            );
          });
        };

        if (this.guardiaForm.valid) {
          guardarNuevasDistribuciones(this.guardiaForm.get('guardias') as FormArray, 'Guardia', this.distribucionGuardiaService, DistribucionGuardiaDto);
        }

        if (this.consultorioForm.valid) {
          guardarNuevasDistribuciones(this.consultorioForm.get('consultorios') as FormArray, 'Consultorio', this.distribucionConsultorioService, DistribucionConsultorioDto);
        }

        if (this.giraForm.valid) {
          guardarNuevasDistribuciones(this.giraForm.get('giras') as FormArray, 'Gira', this.distribucionGiraService, DistribucionGiraDto);
        }

        if (this.otroForm.valid) {
          guardarNuevasDistribuciones(this.otroForm.get('otros') as FormArray, 'Otro', this.distribucionOtroService, DistribucionOtroDto);
        }

        Promise.all(savePromises)
          .then(() => {
            this.toastr.success('Se ha guardado exitosamente la nueva distribución horaria.', 'Éxito', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });

            if (errorMessages.length > 0) {
              this.toastr.error(`No se pudo guardar las siguientes distribuciones: ${errorMessages.join(', ')}`, 'Error', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
            }

            if (this.asistencial?.id) {
              this.router.navigate(['/personal-dh']);
            } else {
              console.error('El objeto asistencial no tiene un id.');
            }
          })
          .catch(() => {
            this.toastr.error('Ocurrió un error al guardar uno o más formularios.', 'Error', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
          })
          .finally(() => {
            this.isButtonDisabled = false;
          });
      })
      .catch(() => {
        this.toastr.error('Error al eliminar distribuciones antiguas.', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.isButtonDisabled = false;
      });
  });
}

  nextStep(): void {
    this.step = (this.step + 1) % 4;
  }

  prevStep(): void {
    this.step = (this.step - 1 + 4) % 4;
  }

  setStep(index: number) {
    this.step = index;
  }

  goToStep(numeroPaso: number): void {
  this.step = numeroPaso;
  }

get isPanel0Expanded(): boolean {
  return this.step === 0;
}

get isPanel1Expanded(): boolean {
  return this.step === 1;
}

get isPanel2Expanded(): boolean {
  return this.step === 2;
}

get isPanel3Expanded(): boolean {
  return this.step === 3;
}

compareServicio(s1: Servicio, s2: any): boolean {
  return s1 && s2 ? s1.id === s2.id : s1 === s2;  // Comparar por el `id`
}

  compareHospital(h1: Hospital, h2: Hospital): boolean {
    return h1 && h2 ? h1.id === h2.id : h1 === h2;
  }

  compareAsistencial(a1: Asistencial, a2: Asistencial): boolean {
    return a1 && a2 ? a1.id === a2.id : a1 === a2;
  }

  compareCaps(c1: CapsDto, c2: CapsDto): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  limpiarGuardia() {
    this.guardiaForm.reset();
  }

  limpiarConsultorio() {
    this.consultorioForm.reset();
  }

  limpiarGira() {
    this.giraForm.reset();
  }

  limpiarOtro() {
    this.otroForm.reset();
  }

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    if (this.asistencial && this.asistencial.id) {
      this.router.navigate(['/personal-dh']);
  } else {
      console.error('El objeto asistencial no tiene un id.');
    }        
}

}