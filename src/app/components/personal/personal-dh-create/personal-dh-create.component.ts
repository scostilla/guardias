import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { DistribucionGuardiaService } from 'src/app/services/personal/distribucionGuardia.service';
import { DistribucionGuardiaDto } from 'src/app/dto/personal/DistribucionGuardiaDto';
import { DistribucionConsultorioService } from 'src/app/services/personal/distribucionConsultorio.service';
import { DistribucionConsultorioDto } from 'src/app/dto/personal/DistribucionConsultorioDto';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { ServicioService } from 'src/app/services/servicio.service';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { CapsDto } from 'src/app/dto/Configuracion/CapsDto';
import { DistribucionGiraService } from 'src/app/services/personal/distribucionGira.service';
import { DistribucionOtroService } from 'src/app/services/personal/distribucionOtro.service';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import * as moment from 'moment';
import { DistribucionGiraDto } from 'src/app/dto/personal/DistribucionGiraDto';
import { DistribucionOtroDto } from 'src/app/dto/personal/DistribucionOtroDto';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

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
  selector: 'app-personal-dh-create',
  templateUrl: './personal-dh-create.component.html',
  styleUrls: ['./personal-dh-create.component.css']
})
export class PersonalDhCreateComponent {
  inputValue: string = '';
  suscription!: Subscription;
  asistencial: Asistencial | null = null;
  asistencialId!: number;
  idPersona!: number;
  tipoGuardias: TipoGuardia[] = [];
  guardiaForm!: FormGroup;
  consultorioForm!: FormGroup;
  giraForm!: FormGroup;
  otroForm!: FormGroup;
  vigenciaForm!: FormGroup;
  
  step = -1;
  cantidadHoras: number = 0;
  minDate!: Date;

  cargaHoraria?: number;
  idEfector: number | undefined = undefined;
  tiposGuardiaOptions: { nombre: string }[] = [];
  meses: { nombre: string; fecha: moment.Moment; }[] = [];
  mesesSeleccionados: Array<{ nombre: string, fecha: moment.Moment }> = [];

  horasStatus: string = '';
  horasMessage: string = '';
  horasMessageClass: string = '';
  solapamientoMessage: string = '';
  solapamientoMessageClass: string = '';

  servicios: Servicio[] = [];
  hospitales: Hospital[] = [];
  capss: CapsDto[] = [];


  isButtonDisabled: boolean = true;
  addButtonDisabled: boolean = false;
  isPanelsEnabled: boolean = true;

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
    private router: Router,
    private distribucionGuardiaService: DistribucionGuardiaService,
    private distribucionConsultorioService: DistribucionConsultorioService,
    private distribucionGiraService: DistribucionGiraService,
    private distribucionOtroService: DistribucionOtroService,
    private servicioService: ServicioService,
    private hospitalService: HospitalService,
    private asistencialService: AsistencialService,
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
    this.suscription = this.asistencialService.currentAsistencialId$.subscribe(id => {
      if (id === null) {
        this.location.back();
        return;
      }
  
      this.asistencialService.detail(id).subscribe({
        next: (asistencial) => {
          this.asistencial = asistencial;
          this.idPersona = asistencial.id!;
  
          this.listServicios();
          this.filterLegajosAndGetTipoGuardia();
          this.listCaps();
          this.verificarMesesDisponibles();
          this.loadCargaHoraria();
        },
        error: (err) => {
          console.error('Error al cargar asistencial por id:', err);
          this.location.back();
        }
      });
    });
  }
  
  ngOnDestroy(): void {
    if (this.suscription) {
      this.suscription.unsubscribe();
    }
  }

  private subscribeToFormChanges(): void {
    this.guardiaForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.consultorioForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.giraForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.otroForm.valueChanges.subscribe(() => this.updateHorasStatus());
  }

createGuardia(): FormGroup {
  const guardiaForm = this.fb.group({
    dia: ['', Validators.required],
    horaIngreso: ['', Validators.required],
    idServicio: ['', Validators.required],
    tipoGuardia: ['', Validators.required],
    cantidadHoras: ['', [Validators.required, Validators.min(4), Validators.pattern(/^[1-9]\d*$/)]],
  });

  // Suscribirse a cambios en tipoGuardia
  guardiaForm.get('tipoGuardia')?.valueChanges.subscribe(value => {
    const cantidadHorasControl = guardiaForm.get('cantidadHoras');

    if (value === 'CARGO') {
      cantidadHorasControl?.setValue('24');
      cantidadHorasControl?.disable();
    } else {
      cantidadHorasControl?.enable();
      cantidadHorasControl?.setValue(null);
    }
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
      cantidadHoras: ['', [Validators.required, Validators.min(1), Validators.pattern(/^\d+(\.\d{1})?$/)]],
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
      cantidadHoras: ['', [
        Validators.required,
        Validators.min(1),
        Validators.pattern(/^\d+(\.\d{1})?$/)
      ]],
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

    const consultorioHoras = (this.consultorioForm.get('consultorios') as FormArray).controls.reduce((sum, formGroup) => {
      return sum + (Number(formGroup.get('cantidadHoras')?.value) || 0);
    }, 0);

    const giraHoras = (this.giraForm.get('giras') as FormArray).controls.reduce((sum, formGroup) => {
      return sum + (Number(formGroup.get('cantidadHoras')?.value) || 0);
    }, 0);

    const otroHoras = (this.otroForm.get('otros') as FormArray).controls.reduce((sum, formGroup) => {
      return sum + (Number(formGroup.get('cantidadHoras')?.value) || 0);
    }, 0);

    const totalHoras = guardiaHoras + consultorioHoras + giraHoras + otroHoras;

    if (this.cargaHoraria !== undefined) {
      if (totalHoras > this.cargaHoraria) {
        this.horasMessage = 'Has superado el total de horas posibles';
        this.horasMessageClass = 'error-message';
        this.isButtonDisabled = true;
        this.addButtonDisabled = true;
      } else if (totalHoras < this.cargaHoraria) {
        this.horasMessage = `Total de horas cargadas: ${totalHoras}. Debes alcanzar ${this.cargaHoraria} hs entre todos los formularios.`;
        this.horasMessageClass = 'pending-message';
        this.isButtonDisabled = true;
        this.addButtonDisabled = false;
      } else {
        this.horasMessage = `Has cargado un total de ${totalHoras} hs`;
        this.horasMessageClass = 'success-message';
        this.isButtonDisabled = !this.guardiaForm.valid && !this.consultorioForm.valid && !this.giraForm.valid && !this.otroForm.valid;
        this.addButtonDisabled = true;
      }
    } else {
      this.horasMessage = '';
      this.horasMessageClass = '';
      this.isButtonDisabled = !this.guardiaForm.valid && !this.consultorioForm.valid  && !this.giraForm.valid && !this.otroForm.valid;
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
  horarios.push({
    dia: form.value.dia,
    horaInicio: form.value.horaIngreso,
    cantidadHoras: +form.value.cantidadHoras
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
  horarios.push({
    dia: form.value.dia,
    horaInicio: form.value.horaIngreso,
    cantidadHoras: +form.value.cantidadHoras
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


  updateFechas(): void {
    const mesSeleccionado = this.vigenciaForm.get('mesVigencia')?.value;

    if (!mesSeleccionado) {
        return;
    }

    // Encuentra el índice del mes seleccionado en la lista de meses generados
    const indiceMesSeleccionado = this.meses.findIndex(m => m.fecha.isSame(mesSeleccionado, 'month'));

    if (indiceMesSeleccionado !== -1) {
        // Filtra los meses desde el primero hasta el seleccionado (inclusive)
        this.mesesSeleccionados = this.meses.slice(0, indiceMesSeleccionado + 1);
    }

    //console.log('Meses seleccionados para guardar:', this.mesesSeleccionados);
}
  
  listServicios(): void {
    this.servicioService.list().subscribe(data => {
      //console.log('Lista de servicios:', data);
      this.servicios = data;
    }, error => {
      console.log(error);
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

  private async verificarMesDisponible(mes: number, anio: number): Promise<boolean> {
    // Llamadas al servicio para verificar si hay distribuciones activas para el mes y año dados
    const guardiaDisponible = this.distribucionGuardiaService.existsByActivoPersonaAndFechaInicio(this.idPersona, mes, anio).toPromise();
    const consultorioDisponible = this.distribucionConsultorioService.existsByActivoPersonaAndFechaInicio(this.idPersona, mes, anio).toPromise();
    const giraDisponible = this.distribucionGiraService.existsByActivoPersonaAndFechaInicio(this.idPersona, mes, anio).toPromise();
    const otroDisponible = this.distribucionOtroService.existsByActivoPersonaAndFechaInicio(this.idPersona, mes, anio).toPromise();
  
    // Esperamos que todas las promesas se resuelvan
    const [guardia, consultorio, gira, otro] = await Promise.all([guardiaDisponible, consultorioDisponible, giraDisponible, otroDisponible]);
  
    // Si alguna de las distribuciones devuelve 'true', significa que ese mes está ocupado
    return !(guardia || consultorio || gira || otro);
  }
  
  private async verificarMesesDisponibles(): Promise<void> {
    const hoy = new Date();
    const mesesVerificar: { nombre: string; fecha: moment.Moment }[] = [];
    const mesesOcupados: string[] = []; // Array para almacenar los meses ocupados
  
    // Limpiar meses antes de agregar nuevos
    this.meses = [];
  
    // Generamos los meses para verificar su disponibilidad
    const mesesVerificaciones = [];
  
    for (let i = 1; i <= 6; i++) {
      const mes = moment(new Date(hoy.getFullYear(), hoy.getMonth() + i, 1));
      const mesNombreCapitalizado = mes.format('MMMM').charAt(0).toUpperCase() + mes.format('MMMM').slice(1);
      const fechaFinalizacion = mes.endOf('month');
      
      // Añadir la verificación de cada mes a un array de promesas
      const mesVerificacion = this.verificarMesDisponible(mes.month() + 1, mes.year()).then(isAvailable => {
        if (isAvailable) {
          //console.log(`Mes ${mesNombreCapitalizado} (${mes.format('YYYY-MM')}) está disponible y se agrega al select.`);
          mesesVerificar.push({ nombre: mesNombreCapitalizado, fecha: fechaFinalizacion });
        } else {
          //console.log(`Mes ${mesNombreCapitalizado} (${mes.format('YYYY-MM')}) NO está disponible y no se agrega al select.`);
          mesesOcupados.push(mesNombreCapitalizado); // Agregar mes ocupado a la lista
        }
      });
  
      mesesVerificaciones.push(mesVerificacion);
    }
  
    // Esperamos a que todas las verificaciones terminen
    await Promise.all(mesesVerificaciones);
  
    // Asignamos los meses disponibles a la propiedad meses
    this.meses = mesesVerificar;
  
    // Si todos los meses están ocupados
    if (mesesOcupados.length === 6) {
      this.toastr.warning('Los próximos 6 meses ya poseen una distribución cargada.', 'Aviso', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
        });
  
      // Redirigir si no hay un asistencial id
      if (this.asistencial && this.asistencial.id) {
        this.router.navigate(['/personal-dh']);
      } else {
        console.error('El objeto asistencial no tiene un id.');
      }
    } 
    // Si hay al menos un mes ocupado
    else if (mesesOcupados.length > 0) {
      const mesesOcupadosStr = mesesOcupados.join(" / ");
      this.toastr.warning(`Ya existe una distribución cargada para ${mesesOcupadosStr}`, 'Aviso', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
    });
    }
  
    // Log de todos los meses disponibles
    //console.log("Meses disponibles para el select:", this.meses.map(m => m.nombre).join(", "));
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

    const mesVigencia = this.vigenciaForm.get('mesVigencia')?.value;

    if (this.idEfector === undefined) {
        this.toastr.error('El profesional no esta definido o no posee un legajo.', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
        });
        this.isButtonDisabled = false;
        return;
    }

    /*console.log('Datos a guardar:', {
        guardia: this.guardiaForm.value,
        consultorio: this.consultorioForm.value,
        gira: this.giraForm.value,
        otro: this.otroForm.value,
    });*/

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

    const savePromises: Promise<any>[] = [];
    const errorMessages: string[] = [];

    // Filtrar los meses verificados
    const mesesSeleccionados = this.mesesSeleccionados; 

    // Calculamos los meses solo para los meses seleccionados
    const guardiaMeses = this.calcularMeses(this.mesesSeleccionados);
    const consultorioMeses = this.calcularMeses(this.mesesSeleccionados);
    const giraMeses = this.calcularMeses(this.mesesSeleccionados);
    const otroMeses = this.calcularMeses(this.mesesSeleccionados);

    // Guarda guardias
    if (this.guardiaForm.valid) {
        const guardiaFormArray = this.guardiaForm.get('guardias') as FormArray;
          guardiaFormArray.controls.forEach((control) => {
            const controlValue = control.getRawValue(); // 🔁 aquí traes todos los campos, incluso los deshabilitados

            guardiaMeses.forEach((mes) => {
              const distribucionGuardiaDto = new DistribucionGuardiaDto(
                controlValue.dia,
                controlValue.cantidadHoras,
                this.idPersona ?? null,
                this.idEfector ?? 0,
                mes.fechaInicio,
                mes.fechaFinalizacion,
                controlValue.horaIngreso,
                controlValue.tipoGuardia,
                controlValue.idServicio.id
              );

              savePromises.push(
                this.distribucionGuardiaService.save(distribucionGuardiaDto).toPromise()
                  .catch(() => {
                    errorMessages.push(`Guardia en ${mes.mes}: ${distribucionGuardiaDto.dia}`);
                  })
              );
            });
          });    
        }

    // Guarda consultorios
    if (this.consultorioForm.valid) {
        const consultorioFormArray = this.consultorioForm.get('consultorios') as FormArray;
        consultorioFormArray.controls.forEach((control) => {
            consultorioMeses.forEach((mes) => {
                const distribucionConsultorioDto = new DistribucionConsultorioDto(
                    control.value.dia,
                    control.value.cantidadHoras,
                    this.idPersona ?? null,
                    this.idEfector ?? 0,
                    mes.fechaInicio,
                    mes.fechaFinalizacion,
                    control.value.horaIngreso,
                    control.value.idServicio.id,
                    "EXTERNO"
                );

                savePromises.push(
                    this.distribucionConsultorioService.save(distribucionConsultorioDto).toPromise()
                        .catch(() => {
                            errorMessages.push(`Consultorio en ${mes.mes}: ${distribucionConsultorioDto.dia}`);
                        })
                );
            });
        });
    }

    // Guarda giras médicas
    if (this.giraForm.valid) {
        const giraFormArray = this.giraForm.get('giras') as FormArray;
        giraFormArray.controls.forEach((control) => {
            giraMeses.forEach((mes) => {
                const distribucionGiraDto = new DistribucionGiraDto(
                    control.value.dia,
                    control.value.cantidadHoras,
                    this.idPersona ?? null,
                    this.idEfector ?? 0,
                    mes.fechaInicio,
                    mes.fechaFinalizacion,
                    control.value.horaIngreso,
                    control.value.puestoSalud.id,
                    //control.value.descripcion,
                    //control.value.destino
                );

                savePromises.push(
                    this.distribucionGiraService.save(distribucionGiraDto).toPromise()
                        .catch(() => {
                            errorMessages.push(`Gira médica en ${mes.mes}: ${distribucionGiraDto.dia}`);
                        })
                );
            });
        });
    }

    // Guarda otras actividades
    if (this.otroForm.valid) {
        const otroFormArray = this.otroForm.get('otros') as FormArray;
        otroFormArray.controls.forEach((control) => {
            otroMeses.forEach((mes) => {
                const distribucionOtroDto = new DistribucionOtroDto(
                    control.value.dia,
                    control.value.cantidadHoras,
                    this.idPersona ?? null,
                    this.idEfector ?? 0,
                    mes.fechaInicio,
                    mes.fechaFinalizacion,
                    control.value.horaIngreso,
                    control.value.descripcion ?? null,
                    control.value.lugar,
                    control.value.tipo,
                );

                savePromises.push(
                    this.distribucionOtroService.save(distribucionOtroDto).toPromise()
                        .catch(() => {
                            errorMessages.push(`Otra actividad en ${mes.mes}: ${distribucionOtroDto.dia}`);
                        })
                );
            });
        });
    }

    // Envia los datos cargados para guardar
    Promise.all(savePromises)
        .then(() => {
            this.toastr.success('Se ha guardado exitosamente la distribución horaria.', 'Éxito', {
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

            if (this.asistencial && this.asistencial.id) {
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
}

// Modificada la función para aceptar meses verificados como parámetro
calcularMeses(mesesSeleccionados: Array<{ nombre: string, fecha: moment.Moment }>): Array<{ mes: string, fechaInicio: Date, fechaFinalizacion: Date }> {
  const meses: Array<{ mes: string, fechaInicio: Date, fechaFinalizacion: Date }> = [];

  // Iterar sobre los meses seleccionados
  mesesSeleccionados.forEach((mesSeleccionado) => {
      const mesNombreCapitalizado = mesSeleccionado.nombre;
      
      // Asegurarse de que la fecha de finalización sea el último día del mes
      const fechaFinalizacion = mesSeleccionado.fecha.endOf('month').startOf('day').toDate();

      // Agregar el mes al arreglo resultante
      meses.push({
          mes: mesNombreCapitalizado,
          fechaInicio: mesSeleccionado.fecha.startOf('month').toDate(),
          fechaFinalizacion: fechaFinalizacion,
      });
  });

  return meses;
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

get isMesVigenciaSelected(): boolean {
  return !!this.vigenciaForm.get('mesVigencia')?.value;
}

get isPanelEnabled(): boolean {
  return this.isMesVigenciaSelected && this.isPanelsEnabled;
}

get isPanel0Expanded(): boolean {
  return this.isPanelEnabled && this.step === 0;
}

get isPanel1Expanded(): boolean {
  return this.isPanelEnabled && this.step === 1;
}

get isPanel2Expanded(): boolean {
  return this.isPanelEnabled && this.step === 2;
}

get isPanel3Expanded(): boolean {
  return this.isPanelEnabled && this.step === 3;
}

  compareServicio(s1: Servicio, s2: Servicio): boolean {
    return s1 && s2 ? s1.id === s2.id : s1 === s2;
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
    this.toastr.info('No se guardaron datos.', 'Cancelado', {
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