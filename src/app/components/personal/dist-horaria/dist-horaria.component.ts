import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AsistencialSelectorComponent } from 'src/app/components/personal/personal-contenido/asistencial-selector/asistencial-selector.component';
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


@Component({
  selector: 'app-dist-horaria',
  templateUrl: './dist-horaria.component.html',
  styleUrls: ['./dist-horaria.component.css'],
})
export class DistHorariaComponent {

  inputValue: string = '';
  suscription!: Subscription;
  asistencial: Asistencial | null = null;
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

  horasStatus: string = '';
  horasMessage: string = '';
  horasMessageClass: string = '';

  servicios: Servicio[] = [];
  hospitales: Hospital[] = [];
  capss: CapsDto[] = [];

  private distribucionesConsultorio: DistribucionConsultorio[] = [];
  private distribucionesGuardia: DistribucionGuardia[] = [];
  private distribucionesGira: DistribucionGira[] = [];
  private distribucionesOtro: DistribucionOtro[] = [];

  isButtonDisabled: boolean = true;
  isPanelsEnabled: boolean = true;

  options: any[] | undefined;
  

  constructor(
    private http: HttpClient,
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
    this.suscription = this.asistencialService.currentAsistencial$.subscribe(asistencial => {
      this.asistencial = asistencial;
      console.log('Asistencial recibido:', this.asistencial);

      if (!this.asistencial?.id) {
        this.location.back();
        } else {
        this.idPersona = this.asistencial.id;
        this.listServicios();
        this.listCaps();
        this.verificarMesesDisponibles();
        this.loadCargaHoraria();
        this.filterLegajosAndGetTipoGuardia();
      }

    this.distribucionConsultorioService.list().subscribe(data => {
      this.distribucionesConsultorio = data;
    });
    
    this.distribucionGuardiaService.list().subscribe(data => {
      this.distribucionesGuardia = data;
    });
    
    this.distribucionGiraService.list().subscribe(data => {
      this.distribucionesGira = data;
    });
    
    this.distribucionOtroService.list().subscribe(data => {
      this.distribucionesOtro = data;
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
    return this.fb.group({
      dia: ['', Validators.required],
      horaIngreso: ['', Validators.required],
      idServicio: ['', Validators.required],
      tipoGuardia: ['', Validators.required],
      cantidadHoras: ['', Validators.required],
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

  createConsultorio(): FormGroup {
    return this.fb.group({
      //tipoConsultorio: ['', Validators.required],
      dia: ['', Validators.required],
      cantidadHoras: ['', Validators.required],
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

  createGira(): FormGroup {
    return this.fb.group({
      dia: ['', Validators.required],
      cantidadHoras: ['', Validators.required],
      horaIngreso: ['', Validators.required],
      puestoSalud: ['', Validators.required],
      descripcion: ['', Validators.required],
      destino: ['', Validators.required]
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

  createOtro(): FormGroup {
    return this.fb.group({
      dia: ['', Validators.required],
      cantidadHoras: ['', Validators.required],
      horaIngreso: ['', Validators.required],
      descripcion: ['', Validators.required],
      lugar: ['', Validators.required]
    });
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

      console.log('TipoGuardias disponibles (CARGO o AGRUPACION):', this.tipoGuardias);
      console.log('ID del primer efector:', this.idEfector);
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
      } else if (totalHoras < this.cargaHoraria) {
        this.horasMessage = `Total de horas cargadas: ${totalHoras}. Debes alcanzar ${this.cargaHoraria} hs entre todos los formularios.`;
        this.horasMessageClass = 'pending-message';
        this.isButtonDisabled = true;
      } else {
        this.horasMessage = `Has cargado un total de ${totalHoras} hs`;
        this.horasMessageClass = 'success-message';
        this.isButtonDisabled = !this.guardiaForm.valid && !this.consultorioForm.valid && !this.giraForm.valid && !this.otroForm.valid;
      }
    } else {
      this.horasMessage = '';
      this.horasMessageClass = '';
      this.isButtonDisabled = !this.guardiaForm.valid && !this.consultorioForm.valid  && !this.giraForm.valid && !this.otroForm.valid;
    }
  }

  updateFechas() {
    const mesVigencia = this.vigenciaForm.get('mesVigencia')?.value;
    const idPersonaSeleccionado = this.idPersona;
  
    // Verificación de datos (esto sigue presente si es necesario para validar los campos)
    if (!mesVigencia) {
      console.warn('Mes de vigencia no está definido.');
      return;
    }
    if (!idPersonaSeleccionado) {
      console.warn('ID de persona no está definido.');
      return;
    }
  
    const fechaInicio = moment(mesVigencia).startOf('month').toDate();
    const fechaFinalizacion = moment(mesVigencia).endOf('month').toDate();
  
    this.vigenciaForm.patchValue({
      fechaInicio: fechaInicio,
      fechaFinalizacion: fechaFinalizacion
    });
  
    this.isPanelsEnabled = true;
  }
  
/*
  updateFechas() {
    const mesVigencia = this.vigenciaForm.get('mesVigencia')?.value;
    const idPersonaSeleccionado = this.idPersona;
  
    // Verificación de datos
    if (!mesVigencia) {
      console.warn('Mes de vigencia no está definido.');
      return;
    }
    if (!idPersonaSeleccionado) {
      console.warn('ID de persona no está definido.');
      return;
    }
  
    const fechaInicio = moment(mesVigencia).startOf('month').toDate();
    const fechaFinalizacion = moment(mesVigencia).endOf('month').toDate();
  
    this.vigenciaForm.patchValue({
      fechaInicio: fechaInicio,
      fechaFinalizacion: fechaFinalizacion
    });
  
    // Obtener mes y año de vigencia
    const mesesParaVerificar = [];
    let inicio = moment().add(1, 'month').startOf('month'); // Comienza desde el siguiente mes
    const fin = moment(mesVigencia).endOf('month');
  
    while (inicio.isSameOrBefore(fin, 'month')) {
      mesesParaVerificar.push({ mes: inicio.month(), año: inicio.year() });
      inicio.add(1, 'month');
    }
  
    // Verificar si ya hay registros en cada uno de los meses calculados
    let existenRegistros = false;
    for (const { mes, año } of mesesParaVerificar) {
      if (
        this.verificarRegistros(this.distribucionesConsultorio, mes, año, idPersonaSeleccionado) ||
        this.verificarRegistros(this.distribucionesGuardia, mes, año, idPersonaSeleccionado) ||
        this.verificarRegistros(this.distribucionesGira, mes, año, idPersonaSeleccionado) ||
        this.verificarRegistros(this.distribucionesOtro, mes, año, idPersonaSeleccionado)
      ) {
        existenRegistros = true;
        break; // Si se encuentra al menos un registro, salir del bucle
      }
    }
  
    if (existenRegistros) {
      this.toastr.warning('Ya existen cargas para uno o más de los meses seleccionados.', 'Carga no permitida', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      this.isPanelsEnabled = false; // Deshabilitar los paneles
    } else {
      this.isPanelsEnabled = true; // Habilitar los paneles si no existen registros
    }
  }
        
  private verificarRegistros(distribuciones: any[], mes: number, año: number, idPersona: number): boolean {
    return distribuciones.some(distribucion => {
      const fechaDistribucionInicio = new Date(distribucion.fechaInicio);
      const fechaDistribucionFin = new Date(distribucion.fechaFinalizacion);
      const activo = distribucion.activo; // Verifica que 'activo' es correcto
      const personaId = distribucion.persona.id; // Verifica que 'persona' tiene la propiedad 'id'
  
      // Log para depuración
      console.log('Verificando distribución:', {
        activo,
        personaId,
        idPersona,
        fechaDistribucionInicio,
        fechaDistribucionFin,
        mes,
        año
      });
  
      return (
        activo &&
        personaId === idPersona &&
        // Verifica que el mes y el año coincidan tanto en inicio como en fin
        ((fechaDistribucionInicio.getMonth() === mes && fechaDistribucionInicio.getFullYear() === año) ||
        (fechaDistribucionFin.getMonth() === mes && fechaDistribucionFin.getFullYear() === año))
      );
    });
  }
    */
  listServicios(): void {
    this.servicioService.list().subscribe(data => {
      console.log('Lista de servicios:', data);
      this.servicios = data;
    }, error => {
      console.log(error);
    });
  }

  listCaps(): void {
    if (this.idEfector) {
      this.hospitalService.listActiveCapsByHospitalId(this.idEfector).subscribe(data => {
        console.log('Caps activos para el efector:', data);
        this.capss = data; // Asigna los datos obtenidos a capss
      }, error => {
        console.log('Error al listar caps activos:', error);
      });
    } else {
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
          console.log(`Mes ${mesNombreCapitalizado} (${mes.format('YYYY-MM')}) está disponible y se agrega al select.`);
          mesesVerificar.push({ nombre: mesNombreCapitalizado, fecha: fechaFinalizacion });
        } else {
          console.log(`Mes ${mesNombreCapitalizado} (${mes.format('YYYY-MM')}) NO está disponible y no se agrega al select.`);
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
      this.toastr.warning('Los próximos 6 meses ya poseen una distribución cargada.', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
        });
  
      // Redirigir si no hay un asistencial id
      if (this.asistencial && this.asistencial.id) {
        this.asistencialService.setCurrentAsistencial(this.asistencial);
        this.router.navigate(['/personal-dh']);
      } else {
        console.error('El objeto asistencial no tiene un id.');
      }
    } 
    // Si hay al menos un mes ocupado
    else if (mesesOcupados.length > 0) {
      const mesesOcupadosStr = mesesOcupados.join(", ");
      this.toastr.warning(`${mesesOcupadosStr} ya poseen una distribución cargada.`);
    }
  
    // Log de todos los meses disponibles
    console.log("Meses disponibles para el select:", this.meses.map(m => m.nombre).join(", "));
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

    console.log('Datos a guardar:', {
        guardia: this.guardiaForm.value,
        consultorio: this.consultorioForm.value,
        gira: this.giraForm.value,
        otro: this.otroForm.value,
    });

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
    const mesesVerificados = this.meses; // Aquí ya tenemos los meses verificados

    // Calcula los meses solo para los meses verificados
    const guardiaMeses = this.calcularMeses(mesVigencia, mesesVerificados);
    const consultorioMeses = this.calcularMeses(mesVigencia, mesesVerificados);
    const giraMeses = this.calcularMeses(mesVigencia, mesesVerificados);
    const otroMeses = this.calcularMeses(mesVigencia, mesesVerificados);

    // Guarda guardias
    if (this.guardiaForm.valid) {
        const guardiaFormArray = this.guardiaForm.get('guardias') as FormArray;
        guardiaFormArray.controls.forEach((control) => {
            guardiaMeses.forEach((mes) => {
                const distribucionGuardiaDto = new DistribucionGuardiaDto(
                    control.value.dia,
                    control.value.cantidadHoras,
                    this.idPersona ?? null,
                    this.idEfector ?? 0,
                    mes.fechaInicio, // Fecha de inicio calculada
                    mes.fechaFinalizacion, // Fecha de finalización calculada
                    control.value.horaIngreso,
                    control.value.tipoGuardia,
                    control.value.idServicio.id
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
                    control.value.puestoSalud,
                    control.value.descripcion,
                    control.value.destino
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
                    control.value.descripcion,
                    control.value.lugar
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
              this.asistencialService.setCurrentAsistencial(this.asistencial);
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
calcularMeses(mesVigencia: string, mesesVerificados: Array<{ nombre: string, fecha: moment.Moment }>): Array<{ mes: string, fechaInicio: Date, fechaFinalizacion: Date }> {
    const meses: Array<{ mes: string, fechaInicio: Date, fechaFinalizacion: Date }> = [];

    // Aquí solo se van a calcular los meses verificados
    mesesVerificados.forEach((mesVerificado) => {
        const mesNombreCapitalizado = mesVerificado.nombre;
        
        // Asegurarse de que la fecha de finalización sea el último día del mes
        const fechaFinalizacion = mesVerificado.fecha.endOf('month').startOf('day').toDate();

        meses.push({
            mes: mesNombreCapitalizado,
            fechaInicio: mesVerificado.fecha.startOf('month').toDate(),
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

  compareCaps(c1: Hospital, c2: Hospital): boolean {
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
      this.asistencialService.setCurrentAsistencial(this.asistencial);
      this.router.navigate(['/personal-dh']);
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
  }

}