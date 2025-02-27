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

  private distribucionesConsultorio: DistribucionConsultorio[] = [];
  private distribucionesGuardia: DistribucionGuardia[] = [];
  private distribucionesGira: DistribucionGira[] = [];
  private distribucionesOtro: DistribucionOtro[] = [];

  isButtonDisabled: boolean = true;

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
    this.route.queryParams.subscribe(params => {
      const asistencialId = params['asistencialId'];
      const mesSeleccionado = params['mes'];
  
      // Suscripción al observable currentAsistencial$
      this.suscription = this.asistencialService.currentAsistencial$.subscribe(asistencial => {
        this.asistencial = asistencial;
        if (this.asistencial?.id) {
          this.idPersona = this.asistencial.id;
          this.listServicios();
          this.listCaps();
          this.generarMeses();
          this.loadCargaHoraria();
          this.filterLegajosAndGetTipoGuardia();
          this.loadDistribuciones(mesSeleccionado);
          
        }
      });
    });
  
    // Otros servicios que necesites cargar
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
  }
    
  private subscribeToFormChanges(): void {
    this.guardiaForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.consultorioForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.giraForm.valueChanges.subscribe(() => this.updateHorasStatus());
    this.otroForm.valueChanges.subscribe(() => this.updateHorasStatus());
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
  
    // Obtener distribuciones de Consultorio filtradas por fecha y activo
    this.distribucionConsultorioService.getDistribucionesByFechaInicio(fechaInicio)
      .subscribe(distribucionesConsultorio => {
        // Filtrar por asistencial.id y activo = true
        const distribucionesConsultorioFiltradas = distribucionesConsultorio.filter(d => 
          d.persona.id === idAsistencial && d.activo === true
        );
        this.updateForm(distribucionesConsultorioFiltradas, this.consultorioForm);
      });
  
    // Obtener distribuciones de Guardia filtradas por fecha y activo
    this.distribucionGuardiaService.getDistribucionesByFechaInicio(fechaInicio)
      .subscribe(distribucionesGuardia => {
        // Filtrar por asistencial.id y activo = true
        const distribucionesGuardiaFiltradas = distribucionesGuardia.filter(d => 
          d.persona.id === idAsistencial && d.activo === true
        );
        this.updateForm(distribucionesGuardiaFiltradas, this.guardiaForm);
      });
  
    // Obtener distribuciones de Gira filtradas por fecha y activo
    this.distribucionGiraService.getDistribucionesByFechaInicio(fechaInicio)
      .subscribe(distribucionesGira => {
        // Filtrar por asistencial.id y activo = true
        const distribucionesGiraFiltradas = distribucionesGira.filter(d => 
          d.persona.id === idAsistencial && d.activo === true
        );
        this.updateForm(distribucionesGiraFiltradas, this.giraForm);
      });
  
    // Obtener distribuciones de Otro filtradas por fecha y activo
    this.distribucionOtroService.getDistribucionesByFechaInicio(fechaInicio)
      .subscribe(distribucionesOtro => {
        // Filtrar por asistencial.id y activo = true
        const distribucionesOtroFiltradas = distribucionesOtro.filter(d => 
          d.persona.id === idAsistencial && d.activo === true
        );
        this.updateForm(distribucionesOtroFiltradas, this.otroForm);
      });
  }
    
  private updateForm(distribuciones: any[], formGroup: FormGroup): void {
    // Resetear el FormArray antes de agregar los nuevos registros
    const formArray = (formGroup.get('consultorios') || formGroup.get('guardias') || formGroup.get('giras') || formGroup.get('otros')) as FormArray;
    formArray.clear();
  
    // Añadir los registros obtenidos a la forma
    distribuciones.forEach(d => {
      let form;
      console.log('Distribución recibida:', d); // Log de la distribución recibida
      // Asegurarse de que horaIngreso esté en el formato adecuado
      const horaIngresoFormateada = moment(d.horaIngreso, 'HH:mm:ss').format('HH:mm');
  
      if (formGroup === this.consultorioForm) {
        form = this.createConsultorio();
        form.patchValue({
          dia: d.dia,
          cantidadHoras: d.cantidadHoras,
          horaIngreso: horaIngresoFormateada,
          idServicio: d.servicio ? d.servicio.id : null,
        });
      } else if (formGroup === this.guardiaForm) {
        form = this.createGuardia();
        form.patchValue({
          dia: d.dia,
          horaIngreso: horaIngresoFormateada,
          idServicio: d.servicio ? d.servicio.id : null,
          tipoGuardia: d.tipoGuardia,
          cantidadHoras: d.cantidadHoras,
        });
        console.log('Después de patchValue (Guardia):', form.value);
      } else if (formGroup === this.giraForm) {
        form = this.createGira();
        form.patchValue({
          dia: d.dia,
          cantidadHoras: d.cantidadHoras,
          horaIngreso: horaIngresoFormateada,
          puestoSalud: d.puestoSalud,
          descripcion: d.descripcion,
          destino: d.destino,
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
  

  /*openAsistencialDialog(): void {
    const dialogRef = this.dialog.open(AsistencialSelectorComponent, {
      width: '800px',
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Inicializar selectedAsistencial y limpiar inputValue al principio, pero no asignar id aún
        this.selectedAsistencial = result;
        this.inputValue = ''; // Dejar vacío el inputValue inicialmente
        this.idEfector = undefined; // Asegurarse de que idEfector esté vacío también
  
        // Filtrar legajos activos y que no sean autoridades
        const legajosActivos = result.idLegajos.filter((legajo: { activo: boolean; esAutoridad: boolean }) => 
          legajo.activo === true && legajo.esAutoridad === false
        );
  
        // Obtener el último legajo activo
        const ultimoLegajoActivo = legajosActivos.sort((a: { id: number }, b: { id: number }) => b.id - a.id)[0];
  
        if (ultimoLegajoActivo) {
          if (ultimoLegajoActivo.efectores && ultimoLegajoActivo.efectores.length > 0) {
            // Se usa el primer efector de la lista
            this.idEfector = ultimoLegajoActivo.efectores[0].id;
            this.listCaps();
          } else {
            this.idEfector = undefined;
            this.capss = [];
          }
  
          if (ultimoLegajoActivo.revista && ultimoLegajoActivo.revista.cargaHoraria) {
            this.cargaHoraria = ultimoLegajoActivo.revista.cargaHoraria.cantidad;
            this.isProfessionalLoaded = true;
            this.tiposGuardiaOptions = ultimoLegajoActivo.tipoGuardias; // Usamos tipoGuardias desde el último legajo activo
  
            // Filtrar para verificar si existen "CARGO" o "AGRUPACION"
            const tieneGuardiaCargoAgrupacion = this.tiposGuardiaOptions.some(tipo => tipo.nombre.includes('CARGO') || tipo.nombre.includes('AGRUPACION'));
  
            if (!tieneGuardiaCargoAgrupacion) {
              // Limpiar el valor en inputValue y no asignar id
              this.inputValue = '';
              this.cargaHoraria = undefined;
              this.isProfessionalLoaded = false;    
              this.toastr.warning('El profesional seleccionado no posee guardia de cargo o agrupación en su legajo activo', 'Aviso', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
            } else {
              // Asignar inputValue y id solo si se encuentra una guardia de "CARGO" o "AGRUPACION"
              this.inputValue = `${result.apellido} ${result.nombre}`;
              this.updateIdPersona(result.id); // Asignamos el id correctamente
              console.log('Tipos de guardia:', this.tiposGuardiaOptions);
            }
          } else {
            this.cargaHoraria = undefined;
            this.isProfessionalLoaded = false;
            this.toastr.warning('El profesional seleccionado no posee una revista.', 'Aviso', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
          }
        } else {
          // Limpiar inputValue y no asignar id cuando no se encuentra un legajo activo válido
          this.inputValue = '';
          this.cargaHoraria = undefined;
          this.isProfessionalLoaded = false;
          this.toastr.warning('El profesional seleccionado no posee un legajo válido o activo.', 'Aviso', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
  
        console.log('Asistencial recibido en el componente principal:', this.selectedAsistencial);
        console.log('ID Efector:', this.idEfector);
      } else {
        this.toastr.info('No se seleccionó un profesional', 'Información', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }, error => {
      this.toastr.error('Ocurrió un error al abrir el diálogo de Asistencial', 'Error', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      console.error('Error al abrir el diálogo de carga de profesional:', error);
    });
  }*/
      
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

/*    const consultorioHoras = Number(this.consultorioForm.get('cantidadHoras')?.value ?? 0);
    const giraHoras = Number(this.giraForm.get('cantidadHoras')?.value ?? 0);
    const otroHoras = Number(this.otroForm.get('cantidadHoras')?.value ?? 0);*/
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

updateFechas(): void {
  const idPersonaSeleccionado = this.idPersona;

  // Verificación de datos
  if (!idPersonaSeleccionado) {
    console.warn('ID de persona no está definido.');
    return;
  }

  // Extraer mes y año de mesSeleccionado (formato MM-YYYY)
  const [mes, anio] = this.mesSeleccionado.split('-');
  
  // Crear la fecha de inicio y fecha de finalización usando el mes y el año
  const fechaInicio = moment([parseInt(anio), parseInt(mes) - 1]).startOf('month').toDate();
  const fechaFinalizacion = moment([parseInt(anio), parseInt(mes) - 1]).endOf('month').toDate();

  // Actualizar las fechas en el formulario
  this.vigenciaForm.patchValue({
    fechaInicio: fechaInicio,
    fechaFinalizacion: fechaFinalizacion
  });

}
            
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

    // Obtener mesSeleccionado
    const mesSeleccionado = this.mesSeleccionado; // Asumiendo que mesSeleccionado es una variable ya cargada (ej. "02-2025")

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

    const savePromises: Promise<any>[] = [];
    const errorMessages: string[] = [];

    // Convertir mesSeleccionado en fecha de inicio y finalización
    const [mes, anio] = mesSeleccionado.split('-');
    const anioNum = parseInt(anio, 10);
    const fechaInicio = new Date(anioNum, parseInt(mes, 10) - 1, 1); // El mes es 0-indexado en JavaScript (enero es 0)
    const fechaFinalizacion = new Date(anioNum, parseInt(mes, 10), 0); // Usar el último día del mes

     // Convertir fechaInicio a formato string 'yyyy-MM-dd' para usar con el servicio
     const fechaInicioString = fechaInicio.toISOString().split('T')[0];

    // Paso 1: Eliminar distribuciones existentes
    const deletePromises: Promise<any>[] = [];

    // Eliminar distribuciones de Guardia
    this.distribucionGuardiaService.getDistribucionesByFechaInicio(fechaInicioString)
        .subscribe(distribucionesGuardia => {
            const distribucionesGuardiaFiltradas = distribucionesGuardia.filter(d => d.persona.id === this.idPersona);
            distribucionesGuardiaFiltradas.forEach(d => {
                deletePromises.push(this.distribucionGuardiaService.delete(d.id ?? 0).toPromise());
            });
        });

    // Eliminar distribuciones de Consultorio
    this.distribucionConsultorioService.getDistribucionesByFechaInicio(fechaInicioString)
        .subscribe(distribucionesConsultorio => {
            const distribucionesConsultorioFiltradas = distribucionesConsultorio.filter(d => d.persona.id === this.idPersona);
            distribucionesConsultorioFiltradas.forEach(d => {
                deletePromises.push(this.distribucionConsultorioService.delete(d.id ?? 0).toPromise());
            });
        });

    // Eliminar distribuciones de Gira
    this.distribucionGiraService.getDistribucionesByFechaInicio(fechaInicioString)
        .subscribe(distribucionesGira => {
            const distribucionesGiraFiltradas = distribucionesGira.filter(d => d.persona.id === this.idPersona);
            distribucionesGiraFiltradas.forEach(d => {
                deletePromises.push(this.distribucionGiraService.delete(d.id ?? 0).toPromise());
            });
        });

    // Eliminar distribuciones de Otro
    this.distribucionOtroService.getDistribucionesByFechaInicio(fechaInicioString)
        .subscribe(distribucionesOtro => {
            const distribucionesOtroFiltradas = distribucionesOtro.filter(d => d.persona.id === this.idPersona);
            distribucionesOtroFiltradas.forEach(d => {
                deletePromises.push(this.distribucionOtroService.delete(d.id ?? 0).toPromise());
            });
        });

    // Paso 2: Esperar a que todas las eliminaciones terminen
    Promise.all(deletePromises)
        .then(() => {
            // Una vez que todas las distribuciones anteriores sean eliminadas, guardamos las nuevas
            const guardiaMeses = [fechaInicio]; // Aquí puedes mantener la lógica que calculaba los meses para cada distribución
            const consultorioMeses = [fechaInicio];
            const giraMeses = [fechaInicio];
            const otroMeses = [fechaInicio];

            // Guardar guardias
            if (this.guardiaForm.valid) {
                const guardiaFormArray = this.guardiaForm.get('guardias') as FormArray;
                guardiaFormArray.controls.forEach((control) => {
                    guardiaMeses.forEach((mes) => {
                        const distribucionGuardiaDto = new DistribucionGuardiaDto(
                            control.value.dia,
                            control.value.cantidadHoras,
                            this.idPersona ?? null,
                            this.idEfector ?? 0,
                            fechaInicio, // Usar el inicio del mes
                            fechaFinalizacion, // Usar la fecha de finalización del mes
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
                });
            }

            // Guardar consultorios
            if (this.consultorioForm.valid) {
                const consultorioFormArray = this.consultorioForm.get('consultorios') as FormArray;
                consultorioFormArray.controls.forEach((control) => {
                    consultorioMeses.forEach((mes) => {
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
                });
            }

            // Guardar giras médicas
            if (this.giraForm.valid) {
                const giraFormArray = this.giraForm.get('giras') as FormArray;
                giraFormArray.controls.forEach((control) => {
                    giraMeses.forEach((mes) => {
                        const distribucionGiraDto = new DistribucionGiraDto(
                            control.value.dia,
                            control.value.cantidadHoras,
                            this.idPersona ?? null,
                            this.idEfector ?? 0,
                            fechaInicio,
                            fechaFinalizacion,
                            control.value.horaIngreso,
                            control.value.puestoSalud,
                            control.value.descripcion,
                            control.value.destino
                        );

                        savePromises.push(
                            this.distribucionGiraService.save(distribucionGiraDto).toPromise()
                                .catch(() => {
                                    errorMessages.push(`Gira en ${fechaInicio}: ${distribucionGiraDto.dia}`);
                                })
                        );
                    });
                });
            }

            // Guardar otras actividades
            if (this.otroForm.valid) {
                const otroFormArray = this.otroForm.get('otros') as FormArray;
                otroFormArray.controls.forEach((control) => {
                    otroMeses.forEach((mes) => {
                        const distribucionOtroDto = new DistribucionOtroDto(
                            control.value.dia,
                            control.value.cantidadHoras,
                            this.idPersona ?? null,
                            this.idEfector ?? 0,
                            fechaInicio,
                            fechaFinalizacion,
                            control.value.horaIngreso,
                            control.value.descripcion,
                            control.value.lugar
                        );

                        savePromises.push(
                            this.distribucionOtroService.save(distribucionOtroDto).toPromise()
                                .catch(() => {
                                    errorMessages.push(`Otro en ${fechaInicio}: ${distribucionOtroDto.dia}`);
                                })
                        );
                    });
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

                    this.router.navigate(['/personal']);
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

// Función para calcular los meses de un rango de fechas
calcularMeses(mesVigencia: string): Array<{ mes: string, fechaInicio: Date, fechaFinalizacion: Date }> {
  const meses: Array<{ mes: string, fechaInicio: Date, fechaFinalizacion: Date }> = [];
  const mesActual = moment(); // Fecha actual
  const mesVigente = moment(mesVigencia); // Mes de vigencia

  let inicio = mesActual.clone().add(1, 'month'); // Comienza desde el siguiente mes
  const fin = mesVigente; // Hasta el mes de vigencia

  while (inicio.isSameOrBefore(fin, 'month')) {
      const mesNombreCapitalizado = inicio.format('MMMM').charAt(0).toUpperCase() + inicio.format('MMMM').slice(1);
      
      // Asegurarse de que la fecha de finalización sea el último día del mes
      const fechaFinalizacion = inicio.endOf('month').startOf('day').toDate(); 

      meses.push({
          mes: mesNombreCapitalizado,
          fechaInicio: inicio.startOf('month').toDate(),
          fechaFinalizacion: fechaFinalizacion,
      });

      inicio.add(1, 'month'); // Mueve al siguiente mes
  }

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
  return s1 && s2 ? s1.id === s2 : s1 === s2;  // Compara el objeto con el id
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
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.router.navigate(['/personal']);
  }

}