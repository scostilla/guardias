import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { AsistencialEfectorDto } from 'src/app/dto/Configuracion/asistencial/AsistencialEfectorDto';
import { DistribucionGuardiaService } from 'src/app/services/personal/distribucionGuardia.service';
import { DistribucionGuardia } from 'src/app/models/personal/DistribucionGuardia';
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
import { CapsService } from 'src/app/services/Configuracion/caps.service';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import * as moment from 'moment';
import { DistribucionGiraDto } from 'src/app/dto/personal/DistribucionGiraDto';
import { DistribucionOtroDto } from 'src/app/dto/personal/DistribucionOtroDto';
import { DistribucionGira } from 'src/app/models/personal/DistribucionGira';
import { DistribucionOtro } from 'src/app/models/personal/DistribucionOtro';
import { DistribucionConsultorio } from 'src/app/models/personal/DistribucionConsultorio';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

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
  mesSeleccionado!: string;
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

  horasStatus: string = '';
  horasMessage: string = '';
  horasMessageClass: string = '';

  servicios: Servicio[] = [];
  hospitales: Hospital[] = [];
  capss: CapsDto[] = [];

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
    private servicioService: ServicioService,
    private hospitalService: HospitalService,
    private capsService: CapsService,
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
    this.route.queryParams.subscribe(params => {
      const asistencialId = params['asistencialId'];
      const mesSeleccionado = params['mes'];
  
      if (!mesSeleccionado || !mesSeleccionado.includes('-')) {
        this.toastr.error('El mes y año seleccionado es inválido o está vacío.', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.isButtonDisabled = false;
        return;
      }
  
      this.mesSeleccionado = mesSeleccionado;
  
      this.suscription = this.asistencialService.currentAsistencialId$.subscribe(id => {
        if (id === null) {
          this.location.back();
          return;
        }
  
        this.asistencialService.detail(id).subscribe({
          next: (asistencial) => {
            this.asistencial = asistencial;
            this.idPersona = asistencial.id!;
  
            // Ya con el objeto completo
            this.listServicios();
            this.filterLegajosAndGetTipoGuardia();
            this.listCaps();
            this.generarMeses();
            this.loadCargaHoraria();
            this.loadDistribuciones(mesSeleccionado);
          },
          error: (err) => {
            console.error('Error al obtener el asistencial:', err);
            this.location.back();
          }
        });
      });
    });
  }
      
  private subscribeToFormChanges(): void {
    this.guardiaForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.consultorioForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.giraForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.otroForm.valueChanges.subscribe(() => this.updateHorasStatus());
  }
  
  getMesFormateado(): string {
    const [mes, anio] = this.mesSeleccionado.split('-');
    return moment(`${anio}-${mes}`, 'YYYY-MM').format('MMMM YYYY');
  }

  loadDistribuciones(mesSeleccionado: string): void {
    // Extraer mes y año del formato MM-YYYY
    const [mes, anio] = mesSeleccionado.split('-');
    
    // Crear la fecha de inicio usando el mes y año extraídos
    const fechaInicio = `${anio}-${mes.padStart(2, '0')}-01`;
  
    // Filtrar las distribuciones por asistencial.id y fecha de inicio
    const idAsistencial = this.asistencial?.id;
  
    if (!idAsistencial) {
      this.toastr.error('Asistencial no encontrado.');
      return;
    }

    // Obtener distribuciones de Consultorio filtradas
    this.distribucionConsultorioService.getActivoByPersonaFechaInicio(idAsistencial, fechaInicio)
      .subscribe(distribucionesConsultorio => {
        this.updateForm(distribucionesConsultorio, this.consultorioForm);
        this.distribucionesConsultorioIds = distribucionesConsultorio.map(d => d.id).filter((id): id is number => id !== undefined);  // Guardamos los IDs
    });  

    // Obtener distribuciones de Guardia filtradas
    this.distribucionGuardiaService.getActivoByPersonaFechaInicio(idAsistencial, fechaInicio)
      .subscribe(distribucionesGuardia => {
        this.updateForm(distribucionesGuardia, this.guardiaForm);
        this.distribucionesGuardiaIds = distribucionesGuardia.map(d => d.id).filter((id): id is number => id !== undefined);  // Guardamos los IDs
    });
    
    // Obtener distribuciones de Gira filtradas
    this.distribucionGiraService.getActivoByPersonaFechaInicio(idAsistencial, fechaInicio)
      .subscribe(distribucionesGira => {
        this.updateForm(distribucionesGira, this.giraForm);
        this.distribucionesGiraIds = distribucionesGira.map(d => d.id).filter((id): id is number => id !== undefined);  // Guardamos los IDs
    });  

    // Obtener distribuciones de Otros filtradas
    this.distribucionOtroService.getActivoByPersonaFechaInicio(idAsistencial, fechaInicio)
      .subscribe(distribucionesOtro => {
        this.updateForm(distribucionesOtro, this.otroForm);
        this.distribucionesOtroIds = distribucionesOtro.map(d => d.id).filter((id): id is number => id !== undefined);  // Guardamos los IDs
    });  
  }    

  private updateForm(distribuciones: any[], formGroup: FormGroup): void {
    // Resetear el FormArray antes de agregar los nuevos registros
    const formArray = (formGroup.get('consultorios') || formGroup.get('guardias') || formGroup.get('giras') || formGroup.get('otros')) as FormArray;
    formArray.clear();
  
    // Añadir los registros obtenidos a la forma
    distribuciones.forEach(d => {
      let form;
      //console.log('Distribución recibida:', d); // Log de la distribución recibida
      // Asegurarse de que horaIngreso esté en el formato adecuado
      const horaIngresoFormateada = moment(d.horaIngreso, 'HH:mm:ss').format('HH:mm');
  
      if (formGroup === this.consultorioForm) {
        form = this.createConsultorio();
        form.patchValue({
          dia: d.dia,
          cantidadHoras: d.cantidadHoras,
          horaIngreso: horaIngresoFormateada,
          idServicio: d.servicio,
        });
      } else if (formGroup === this.guardiaForm) {
        form = this.createGuardia();
        form.patchValue({
          dia: d.dia,
          horaIngreso: horaIngresoFormateada,
          idServicio: d.servicio,
          tipoGuardia: d.tipoGuardia,
          cantidadHoras: d.cantidadHoras,
        });
        //console.log('Después de patchValue (Guardia):', form.value);
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
        form.patchValue({
          dia: d.dia,
          cantidadHoras: d.cantidadHoras,
          horaIngreso: horaIngresoFormateada,
          descripcion: d.descripcion,
          lugar: d.lugar,
        });
      }
  
      formArray.push(form);
    });
  }
    
  createGuardia(): FormGroup {
    return this.fb.group({
      dia: ['', Validators.required],
      horaIngreso: ['', Validators.required],
      idServicio: ['', Validators.required],
      tipoGuardia: ['', Validators.required],
      cantidadHoras: ['', [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)]],
    });
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
    this.guardias.removeAt(index);
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

    // Validación de formularios
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

    // Extraer mes y año de mesSeleccionado (formato MM-YYYY)
    const [mes, anio] = this.mesSeleccionado.split('-');

    // Crear la fecha de inicio y fecha de finalización usando Moment.js
    const fechaInicio = moment([parseInt(anio), parseInt(mes) - 1]).startOf('month').toDate();
    const fechaFinalizacion = moment([parseInt(anio), parseInt(mes) - 1]).endOf('month').startOf('day').toDate();

    // Log para ver las fechas de inicio y finalización
    //console.log('Fecha de inicio:', fechaInicio);
    //console.log('Fecha de finalización:', fechaFinalizacion);

    // Convertir fechaInicio a formato string 'yyyy-MM-dd' para usar con el servicio
    const fechaInicioString = moment(fechaInicio).format('YYYY-MM-DD');

    // Log para ver el string de fecha en formato 'yyyy-MM-dd'
    //console.log('Fecha de inicio (string):', fechaInicioString);
    
    // Paso 1: Eliminar distribuciones existentes
    const deletePromises: Promise<any>[] = [];

    // Eliminar distribuciones de Guardia
    this.distribucionesGuardiaIds.forEach((id: number) => {
        if (id) {
            deletePromises.push(this.distribucionGuardiaService.delete(id).toPromise());
        }
    });

    // Eliminar distribuciones de Consultorio
    this.distribucionesConsultorioIds.forEach((id: number) => {
        if (id) {
            deletePromises.push(this.distribucionConsultorioService.delete(id).toPromise());
        }
    });

    // Eliminar distribuciones de Gira
    this.distribucionesGiraIds.forEach((id: number) => {
        if (id) {
            deletePromises.push(this.distribucionGiraService.delete(id).toPromise());
        }
    });

    // Eliminar distribuciones de Otro
    this.distribucionesOtroIds.forEach((id: number) => {
        if (id) {
            deletePromises.push(this.distribucionOtroService.delete(id).toPromise());
        }
    });

    // Paso 2: Esperar a que todas las eliminaciones terminen
    Promise.all(deletePromises)
        .then(() => {
          const savePromises: Promise<any>[] = [];
          const errorMessages: string[] = [];

        // Guardar guardias
        if (this.guardiaForm.valid) {
          const guardiaFormArray = this.guardiaForm.get('guardias') as FormArray;
          guardiaFormArray.controls.forEach((control) => {
              const distribucionGuardiaDto = new DistribucionGuardiaDto(
                  control.value.dia,
                  control.value.cantidadHoras,
                  this.idPersona ?? null,
                  this.idEfector ?? 0,
                  fechaInicio,
                  fechaFinalizacion,
                  control.value.horaIngreso,
                  control.value.tipoGuardia,
                  control.value.idServicio.id
              );

              savePromises.push(
                  this.distribucionGuardiaService.save(distribucionGuardiaDto).toPromise()
                      .catch(() => {
                          errorMessages.push(`Guardia en ${fechaInicio}: ${distribucionGuardiaDto.dia}`);
                      })
              );
          });
      }

      // Guardar consultorios
      if (this.consultorioForm.valid) {
          const consultorioFormArray = this.consultorioForm.get('consultorios') as FormArray;
          consultorioFormArray.controls.forEach((control) => {
              const distribucionConsultorioDto = new DistribucionConsultorioDto(
                  control.value.dia,
                  control.value.cantidadHoras,
                  this.idPersona ?? null,
                  this.idEfector ?? 0,
                  fechaInicio,
                  fechaFinalizacion,
                  control.value.horaIngreso,
                  control.value.idServicio.id,
                  "EXTERNO"
              );

              savePromises.push(
                  this.distribucionConsultorioService.save(distribucionConsultorioDto).toPromise()
                      .catch(() => {
                          errorMessages.push(`Consultorio en ${fechaInicio}: ${distribucionConsultorioDto.dia}`);
                      })
              );
          });
      }

      // Guardar giras médicas
      if (this.giraForm.valid) {
          const giraFormArray = this.giraForm.get('giras') as FormArray;
          giraFormArray.controls.forEach((control) => {
              const distribucionGiraDto = new DistribucionGiraDto(
                  control.value.dia,
                  control.value.cantidadHoras,
                  this.idPersona ?? null,
                  this.idEfector ?? 0,
                  fechaInicio,
                  fechaFinalizacion,
                  control.value.horaIngreso,
                  control.value.puestoSalud,
                  //control.value.descripcion,
                  //control.value.destino
              );

              savePromises.push(
                  this.distribucionGiraService.save(distribucionGiraDto).toPromise()
                      .catch(() => {
                          errorMessages.push(`Gira en ${fechaInicio}: ${distribucionGiraDto.dia}`);
                      })
              );
          });
      }

      // Guardar otras actividades
      if (this.otroForm.valid) {
          const otroFormArray = this.otroForm.get('otros') as FormArray;
          otroFormArray.controls.forEach((control) => {
              const distribucionOtroDto = new DistribucionOtroDto(
                  control.value.dia,
                  control.value.cantidadHoras,
                  this.idPersona ?? null,
                  this.idEfector ?? 0,
                  fechaInicio,
                  fechaFinalizacion,
                  control.value.horaIngreso,
                    control.value.descripcion ?? null,
                    control.value.lugar,
                    control.value.tipo,
              );

              savePromises.push(
                  this.distribucionOtroService.save(distribucionOtroDto).toPromise()
                      .catch(() => {
                          errorMessages.push(`Otro en ${fechaInicio}: ${distribucionOtroDto.dia}`);
                      })
              );
          });
      }

      // Enviar las nuevas distribuciones para guardar
      Promise.all(savePromises)
          .then(() => {
              // Mostrar mensaje de éxito
              this.toastr.success('Se ha guardado exitosamente la distribución horaria.', 'Éxito', {
                  timeOut: 6000,
                  positionClass: 'toast-top-center',
                  progressBar: true
              });

              // Si hubo errores, mostrar detalle
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

  }).catch(() => {
      this.toastr.error('Error al eliminar distribuciones antiguas.', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
      });
      this.isButtonDisabled = false;
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