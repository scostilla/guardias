import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

//Autenticación
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { AuthService } from 'src/app/services/login/auth.service';
import { TokenService } from 'src/app/services/login/token.service';

//Services
import { AdicionalService } from 'src/app/services/Configuracion/adicional.service';
import { AutoridadService } from 'src/app/services/Configuracion/autoridad.service';
import { CapsService } from 'src/app/services/Configuracion/caps.service';
import { CargaHorariaService } from 'src/app/services/Configuracion/carga-horaria.service';
import { CargoService } from 'src/app/services/Configuracion/cargo.service';
import { CategoriaService } from 'src/app/services/Configuracion/categoria.service';
import { EspecialidadService } from 'src/app/services/Configuracion/especialidad.service';
import { HabilitacionesGeneralesService } from 'src/app/services/Configuracion/habilitacionesGenerales.service';
import { HabilitacionesGuardiasService } from 'src/app/services/Configuracion/habilitacionesGuardias.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { ProfesionService } from 'src/app/services/Configuracion/profesion.service';
import { RegionService } from 'src/app/services/Configuracion/region.service';
import { RevistaService } from 'src/app/services/Configuracion/revista.service';
import { TipoRevistaService } from 'src/app/services/Configuracion/tipo-revista.service';
import { TipoGuardiaService } from 'src/app/services/Configuracion/tipoGuardia.service';
//Models y Dto
import { CapsDto } from 'src/app/dto/Configuracion/CapsDto';
import { LegajoDto } from 'src/app/dto/Configuracion/LegajoDto';
import { RevistaDto } from 'src/app/dto/Configuracion/RevistaDto';
import { Adicional } from 'src/app/models/Configuracion/Adicional';
import { CargaHoraria } from 'src/app/models/Configuracion/CargaHoraria';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { Categoria } from 'src/app/models/Configuracion/Categoria';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Especialidad } from 'src/app/models/Configuracion/Especialidad';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { Ministerio } from 'src/app/models/Configuracion/Ministerio';
import { Profesion } from 'src/app/models/Configuracion/Profesion';
import { Region } from 'src/app/models/Configuracion/Region';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { TipoRevista } from 'src/app/models/Configuracion/TipoRevista';

import { forkJoin } from 'rxjs';
import { HabilitacionesGeneralesDto } from 'src/app/dto/Configuracion/HabilitacionesGeneralesDto';
import { HabilitacionesGuardiasDto } from 'src/app/dto/Configuracion/HabilitacionesGuardiasDto';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Caps } from 'src/app/models/Configuracion/Caps';
import { HabilitacionesGenerales } from 'src/app/models/Configuracion/HabilitacionesGenerales';
import { HabilitacionesGuardias } from 'src/app/models/Configuracion/HabilitacionesGuardias';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';


interface Agrup {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-legajo-edit',
  templateUrl: './legajo-edit.component.html',
  styleUrls: ['./legajo-edit.component.css']
})
export class LegajoEditComponent implements OnInit {

  fromAsistencial: boolean = false;
  fromNoAsistencial: boolean = false;
  inputValue: string = '';
  legajoForm: FormGroup;
  //initialData: Asistencial | NoAsistencial | undefined;
  fromLegajoPerson: boolean = false;
  fromLegajo: boolean = false;
  initialData: Legajo | undefined;
  idLegajo: number = 0;
  personId!: number;
  asistencial: Asistencial | undefined;
  noAsistencial: NoAsistencial | undefined;



  //Listas
  profesiones: Profesion[] = [];
  efectores: Efector[] = [];
  hospitales: Hospital[] = [];
  ministerios: Ministerio[] = [];
  caps: CapsDto[] = [];
  especialidades: Especialidad[] = [];
  categorias: Categoria[] = [];
  adicionales: Adicional[] = [];
  cargasHorarias: CargaHoraria[] = [];
  filteredCargasHorarias: CargaHoraria[] = [];
  tiposRevistas: TipoRevista[] = [];
  tipoGuardias: TipoGuardia[] = [];
  cargos: Cargo[] = [];
  regiones: Region[] = [];
  capsList: Caps[] = [];
   selectedHospitals: number[] = [];
   selectedHospitalsGeneral: number[] = [];
   selectedHospitalsCaps: number[] = [];
   selectedHospitalsCapsGeneral: number[] = [];
  selectedCaps: number[] = [];
  hospitalesList: Hospital[] = [];
  selectedCapsGeneral: number[] = [];

 


  //Autenticación
  isLogged = false;
  roles: string[] =[];
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;
  isAutoridad: boolean = false;
  userId: number | null = null;
  nombreUsuario: string = '';
  apellidoUsuario: string = '';
  nombresEfectores: EfectorSummaryDto[] = [];
  usuarioPersona: number | null = null;
  currentRole: string | null = null;

  //mostrar/ocultar
  showGuardia: boolean = false;
  showRegion: boolean = false;
  showSiEsAutoridad: boolean = false;
  showEfectorAutoridad: boolean = false;
  showHabilitacionesGuardias: boolean = false;
  showHabilitacionesGenerales: boolean = false;
  formularioValidoParaDirectorRegional: boolean = false;

  //útiles
  step = 0;
  maxDate!: Date;
  minFechaFinal!: Date;
  isAsistencial: boolean = false;
  isSituacionRevistaEnabled = false;
  asignadoAutoridad: boolean = false;
  noEspecialidadesMessage: string = '';
  idCargo?: number;
  nroDecreto?: string;
  idAgrupacion?: number;
  idContraFactura?: number;
  idPasiva?: number;
  idExtra?: number;
  esAutoridadValor: boolean = false;
  idDirectorRegional?: number;
  udoOptions: any[] = [];
  efectorOptions: any[] = [];
  efectorCargoOptions: any[] = [];
  habilitacionesGuardiasOptions: any[] = [];
  habilitacionesGuardiasCaps: any[] = [];
  habilitacionesGeneralesCaps: any[] = [];
  habilitacionesGeneralesOptions: any[] = [];
  tipoUdo!: string;
  tipoEfector!: string;
  tipoHabilitacionesGuardias!: string;
  tipoEfectorCargo!: string;
  isUpdatingTipoGuardias: boolean = false;
  tipoHabilitacionesGenerales!: string;
  isSelectDisabled: boolean = true;
  previousHospitalUdo: any = null;
  previousHospitalEfector: any = null;
  previousCapsUdo: any = null;
  previousMinisterioUdo: any = null;
  initialHabilitacionesGuardias: any[] = [];
  initialHabilitacionesGenerales: any[] = [];
  selectedHospitalsGenerales: number[] = [];
  selectedHospitalsGuardias: number[] = [];
  

  /* Form de revista */
  agrupaciones: Agrup[] = [
    { value: 'ADMINISTRATIVO', viewValue: 'Administrativo' },
    { value: 'PROFESIONALES', viewValue: 'Profesionales' },
    { value: 'SERVICIOS_GENERALES', viewValue: 'Servicios Generales' },
    { value: 'TECNICOS', viewValue: 'Técnicos' },
  ];
  habilitacionExistente: any;
  legajoExistente: any;
  hospitalHabilitacionesGuardias!: number | null;
  hospitalHabilitacionesGenerales!: number | null;

  // 🔥 NUEVAS PROPIEDADES PARA MANEJO DE IMÁGENES (SOLO AUTORIDADES)
  selectedFile: File | null = null;
  fileUrl: string | null = null;
  isUploading: boolean = false;
  isDragOver: boolean = false;
  uploadError: string | null = null;
  pendingFile: File | null = null;
  isDuplicateDialogOpen: boolean = false;
  isDuplicateImage: boolean = false;
  dragCounter: number = 0;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService,
    private location: Location,
    private legajoService: LegajoService,
    private profesionService: ProfesionService,
    private hospitalService: HospitalService,
    private ministerioService: MinisterioService,
    private especialidadService: EspecialidadService,
    private categoriaService: CategoriaService,
    private adicionalService: AdicionalService,
    private cargaHorariaService: CargaHorariaService,
    private tipoRevistaService: TipoRevistaService,
    private tipoGuardiaService: TipoGuardiaService,
    private revistaService: RevistaService,
    private cargoService: CargoService,
    private regionService: RegionService,
    private habilitacionesGuardiasService: HabilitacionesGuardiasService,
    private habilitacionesGeneralesService: HabilitacionesGeneralesService,
    private tokenService: TokenService,
    private authService: AuthService,
    private autoridadService: AutoridadService,
    private capsService: CapsService,
  ) {

    this.legajoForm = this.fb.group({
      agrupacion: ['', Validators.required],
      categoria: ['', Validators.required],
      adicional: ['', Validators.required],
      cargaHoraria: ['', Validators.required],
      tipoRevista: ['', Validators.required],
      idPersona: [this.asistencial?.id || this.noAsistencial?.id, Validators.required],
      profesion: ['', Validators.required],
      tipoUdo: [null, Validators.required],
      udoSelected: [null, Validators.required],
      hospitalUdo: [''],
      tipoEfector: [null, Validators.required],
      efectoresSelected: [[]],
      hospitalEfectores: [[]],
      tipoEfectorCargo: [null],
      hospitalEfectorCargo: [''],
      efectoresAutoridad: [[]],
      especialidades: [[]],
      matriculaNacional: ['', [Validators.pattern('^[0-9]{5,10}$')]],
      matriculaProvincial: ['', [Validators.required, Validators.pattern('^[0-9]{5,10}$')]],
      esAutoridad: [false, Validators.required],
      idCargo: [null],
      idRegion: [null],
      nroResolucion: [null],
      nroDecreto: [[]],
      fechaResolucion: [null],
      fechaInicio: [this.initialData?.fechaInicio || '', [Validators.required, this.dateLimitePresente]],
      fechaFinal: [{ value: this.initialData?.fechaFinal || '', disabled: !this.initialData?.fechaInicio }],
      tipoGuardias: [[]],
      tipoHabilitacionesGuardias: [null, Validators.required],
      habilitacionesGuardias: [[]],
      habilitacionesGuardiasHospital: [[]],
      habilitacionesGeneralesHospital: [[]],
      habilitacionesGuardiasCaps: [[]],
      habilitacionesGeneralesCaps: [[]],
      hospitalHabilitacionesGuardias: [[]],
      tipoHabilitacionesGenerales: [''],
      hospitalHabilitacionesGenerales: [[]],
      habilitacionesGenerales: [[]],
      selectedHospitalsGenerales: [[]],
      selectedHospitalsGuardias: [[]],
      url: ['']
    }, { validator: this.validarFechas });

    // recupero el estado del router
const navigation = this.router.getCurrentNavigation();

if (navigation?.extras.state) {
  

  this.isAsistencial = !!navigation.extras.state['asistencial'];
  this.initialData = navigation.extras.state['legajo'];
  this.fromLegajoPerson = !!navigation.extras.state['fromLegajoPerson'];
  this.fromLegajo = !!navigation.extras.state['fromLegajo'];

  this.asistencial = navigation.extras.state['asistencial'] || undefined;
  this.noAsistencial = navigation.extras.state['noAsistencial'] || undefined;
} else {
  console.warn('⚠️ No se recibió navigation.extras.state o es undefined');
}
  

    /*if (navigation?.extras.state) {
      // Verifica si los datos recibidos son de tipo Asistencial
      this.fromAsistencial = !!navigation.extras.state['fromAsistencial'];
  
      // Asigna los datos a initialData si es de tipo Asistencial
      if (this.fromAsistencial) {
        this.initialData = navigation.extras.state['asistencial'] as Asistencial;
      }
  
      // Si no se recibe Asistencial, redirige atrás con un mensaje
      if (!this.initialData) {
        this.toastr.error('No se recibió ningún Asistencial. Consulta con soporte.', 'Error', {
          timeOut: 5000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
  
        // Regresa a la vista anterior
        this.location.back();
      }
    } else {
      // Si no se pasó el estado, redirige atrás con un mensaje
      this.toastr.error('No se recibió ningún Asistencial. Consulta con soporte.', 'Error', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
  
      // Regresa a la vista anterior
      this.location.back();
    }    */
  }
  validarFechas(control: AbstractControl): ValidationErrors | null {
    const formGroup = control as FormGroup;
    const fechaInicio = formGroup.get('fechaInicio')?.value;
    const fechaFinal = formGroup.get('fechaFinal')?.value;

    if (fechaInicio && fechaFinal) {
        const inicio = new Date(fechaInicio);
        const final = new Date(fechaFinal);

        // Si la fecha final no es al menos un día después de la fecha de inicio, retorna un error
        if (final <= inicio) {
            return { fechaInvalida: true };
        }
    }

    return null;
}



  ngOnInit(): void {

    if (this.initialData?.url) {
      this.fileUrl = `http://localhost:8080${this.initialData.url}`;
    }

  // 🎯 VERIFICAR SI ES DIRECTOR REGIONAL
  const esDirectorRegional = this.initialData?.esRegional === true || 
                            (this.initialData?.cargo?.nombre?.toLowerCase() === 'director regional');

    this.loadCaps(); 
  

  
    const efectoresFiltrados = this.asistencial?.habilitacionesGuardias
    ?.filter((habilitacion: HabilitacionesGuardias) => habilitacion.activo) // Filtra solo las habilitaciones activas
    ?.flatMap((habilitacion: HabilitacionesGuardias) => habilitacion.efectores.map((efector: Efector) => efector.id)) || []; // Extraer efectores completos


  const idsHospitalesParaSeleccionar: number[] = [];
const idsCapsParaSeleccionar: number[] = [];

efectoresFiltrados.forEach((idEfector: number | undefined) => {
    if (typeof idEfector !== 'number') {
        return;
    }
    // Verificar si este ID corresponde a un Hospital
    // Usamos .some() para ver si alguno de los hospitales cargados tiene ese ID
    const esHospital = this.hospitales.some(h => h.id === idEfector);

    // Verificar si este ID corresponde a un CAPS
    const esCaps = this.capsList.some(c => c.id === idEfector);

    if (esHospital) {
        idsHospitalesParaSeleccionar.push(idEfector);
    } else if (esCaps) {
        idsCapsParaSeleccionar.push(idEfector);
    }
});

const efectoresFiltradosGeneral = this.asistencial?.habilitacionesGenerales
        ?.filter((habilitacion: HabilitacionesGenerales) => habilitacion.activo) // Filtra solo las habilitaciones activas
        ?.flatMap((habilitacion: HabilitacionesGenerales) => habilitacion.efectores.map((efector: Efector) => efector.id)) || []; // Extraer efectores completos

    const idsHospitalesParaSeleccionarGeneral: number[] = [];
    const idsCapsParaSeleccionarGeneral: number[] = [];

    efectoresFiltradosGeneral.forEach((idEfector: number | undefined) => {
    if (typeof idEfector !== 'number') {
        return;
    }
 
    const esHospitalGeneral = this.hospitales.some(h => h.id === idEfector);

    const esCapsGeneral = this.capsList.some(c => c.id === idEfector);

    if (esHospitalGeneral) {
        idsHospitalesParaSeleccionarGeneral.push(idEfector);
    } else if (esCapsGeneral) {
        idsCapsParaSeleccionarGeneral.push(idEfector);
    }
   });

this.selectedCaps = idsCapsParaSeleccionar;
this.selectedCapsGeneral = idsCapsParaSeleccionarGeneral;

this.initialHabilitacionesGuardias = efectoresFiltrados;
this.initialHabilitacionesGenerales =efectoresFiltradosGeneral;

// Asignar los IDs separados a las propiedades que controlan los mat-select
// Esto hará que los mat-select muestren las opciones pre-seleccionadas.
this.selectedHospitals = idsHospitalesParaSeleccionar;
this.selectedHospitalsCaps = idsHospitalesParaSeleccionar; // Asignar a la misma lista para ambos selectores
this.selectedCaps = idsCapsParaSeleccionar;

    this.idContraFactura =4 
  this.idExtra = 3;
  this.idPasiva = 5

    
    // Obtener los tipos de guardia cargados desde el backend
  const selectedGuardias = this.initialData?.tipoGuardias
  ? this.initialData.tipoGuardias.map((tipoGuardia: any) => tipoGuardia.id)
  : [];

  // Verificar si el tipo de guardia inicial o el seleccionado es Contrafactura
const esContrafactura = selectedGuardias.includes(this.idContraFactura) || 
  this.legajoForm.get('tipoGuardias')?.value?.includes(this.idContraFactura);

  const efectoresIds = this.asistencial?.habilitacionesGuardias
        ? this.asistencial.habilitacionesGuardias
              .flatMap((habilitacion: any) =>
                  habilitacion.efectores ? habilitacion.efectores.map((efector: any) => efector.id) : []
              )
        : [];


const tieneHabilitaciones = (this.asistencial?.habilitacionesGuardias?.length ?? 0) > 0;


    if (this.initialData?.persona instanceof Asistencial) {
      this.asistencial = this.initialData.persona as Asistencial;

      
      // Asegúrate de que `habilitacionesGuardias` no esté vacío antes de acceder a la propiedad
      if (this.asistencial.habilitacionesGuardias && this.asistencial.habilitacionesGuardias.length > 0) {
          this.asistencial = this.initialData.persona as Asistencial; // Asegura que el tipo es Asistencial
      }
      
    }

 /*    const tipoHabilitacionesGuardiasInicial = this.asistencial?.habilitacionesGuardias
  ?.filter(habilitacion => habilitacion.activo)
  ?.at(0)?.tipoEfectorEx ?? null;
 */

    if (this.initialData?.fechaInicio) {
      const fechaInicioDate = new Date(this.initialData.fechaInicio);
      fechaInicioDate.setDate(fechaInicioDate.getDate() + 1);
      this.minFechaFinal = fechaInicioDate;
    }
    
          this.maxDate = new Date();
        
          // Deshabilitar fechaFinal hasta que se seleccione fechaInicio
          this.legajoForm.get('fechaFinal')?.enable();
        
          // Habilitar fechaFinal cuando fechaInicio tiene un valor
          this.legajoForm.get('fechaInicio')?.valueChanges.subscribe(fechaInicio => {
            if (fechaInicio) {
                const fechaInicioDate = new Date(fechaInicio);
                fechaInicioDate.setDate(fechaInicioDate.getDate() + 1);
        
                // Establece la fecha mínima para fechaFinal
                this.minFechaFinal = fechaInicioDate;
        
                // Si la fecha final es inválida, la actualiza
                const fechaFinalControl = this.legajoForm.get('fechaFinal');
                const fechaFinalActual = fechaFinalControl?.value ? new Date(fechaFinalControl.value) : null;
        
                if (!fechaFinalActual || fechaFinalActual <= fechaInicioDate) {
                    fechaFinalControl?.setValue(fechaInicioDate);
                }
            } else {
                this.legajoForm.get('fechaFinal')?.setValue('');
            }
        });
          
  //Autentificación
  if (this.tokenService.getToken()) {
    this.isLogged = true;
    this.roles = this.tokenService.getAuthorities();

    // BehaviorSubject para obtener el rol seleccionado
    this.tokenService.currentRole$.subscribe(role => {
      this.currentRole = role;
      this.UserRoles();  // Llamar a la función que determina los roles
     
      // Si currentRole es false (null o vacío), redirige al login
      if (!this.currentRole) {
        this.router.navigateByUrl('');
      }
    });  
  
    const userIdFromToken = this.tokenService.getUserIdFromToken();
    this.userId = userIdFromToken !== null ? Number(userIdFromToken) : null;
    console.log('ID del usuario logeado:',this.userId);

    // Obtener detalles del usuario
    this.authService.detailPersonBasicPanel().subscribe(
      (response: PersonBasicPanelDto) => {
        this.usuarioPersona = response.id;
        this.nombreUsuario = response.nombre;
        this.apellidoUsuario = response.apellido;
        this.nombresEfectores = response.efectores; // Asignar efectores

        // Log para mostrar el usuario y los efectores
        console.log('Usuario logueado:', this.nombreUsuario, this.apellidoUsuario, this.usuarioPersona);
        console.log('Efectores asociados:', this.nombresEfectores);
      },
      error => {
        console.error('Error al obtener detalles del usuario:', error);
      }
    );
  } else {
    this.isLogged = false;
    console.log('El usuario no está logueado.');
    this.router.navigateByUrl('');
  }

  
    // Inicializar el formulario
    this.legajoForm = this.fb.group({
      tipoUdo: [this.initialData?.tipoUdo || '', Validators.required],
      udoSelected: ['', Validators.required],
      agrupacion: ['', Validators.required],
      categoria: ['', Validators.required],
      adicional: ['', Validators.required],
      cargaHoraria: ['', Validators.required],
      tipoRevista: ['', Validators.required],
      idPersona: [this.asistencial?.id || this.noAsistencial?.id, Validators.required],
      profesion: ['', Validators.required],
      hospitalUdo: [''],
      tipoEfector: [null, Validators.required],
      efectoresSelected: [[]],
      hospitalEfectores: [[]],
      tipoEfectorCargo: [null],
      hospitalEfectorCargo: [''],
      efectoresAutoridad: [[]],
      especialidades: [[]],
      matriculaNacional: ['', [Validators.pattern('^[0-9]{5,10}$')]],
      matriculaProvincial: ['', [Validators.required, Validators.pattern('^[0-9]{5,10}$')]],
      esAutoridad: [false, Validators.required],
      idCargo: [null],
      idRegion: [null],
      nroResolucion: [null],
      nroDecreto: [[]],
      fechaResolucion: [null],
      fechaInicio: [this.initialData?.fechaInicio || '', [Validators.required, this.dateLimitePresente]],
  fechaFinal: [{ value: this.initialData?.fechaFinal || '', disabled: !this.initialData?.fechaInicio }],
      tipoGuardias: [[]], 
     /*  tipoHabilitacionesGuardias: [tipoHabilitacionesGuardiasInicial, Validators.required],*/
      habilitacionesGuardias: [[]], 
      habilitacionesGuardiasHospital:[[]],
      habilitacionesGeneralesHospital: [[]],
      habilitacionesGuardiasCaps: [[]],
      habilitacionesGeneralesCaps: [[]],
      hospitalHabilitacionesGuardias: [''],
      hospitalHabilitacionesGenerales: [''],
      habilitacionesGenerales: [[]],
      tipoEfectorEx: [null],
    }, { validator: this.validarFechas });


 // Inicializar udoOptions al principio del formulario
 this.habilitacionesGeneralesOptions = [];
 this.habilitacionesGuardiasOptions = [];
 this.udoOptions = [];
 this.efectorOptions = [];
 this.loadInitialData(); // Inicialización básica para evitar errores

   this.evaluarFormularioDirectorRegional();

 setTimeout(() => {
    this.evaluarEstadoDirectorRegional();
   
  }, 500); 


// Si hay datos iniciales, configurar udoOptions
if (this.initialData) {
 
  const tipoUdoInicial = this.initialData.tipoUdo ??'';
  const tipoEfectorInicial = this.initialData.tipoEfector ?? '';
  const tipoEfectorCargoInicial = this.initialData.tipoEfectorCargo ?? '';

  if (tipoUdoInicial === 'MINISTERIO') {
    this.udoOptions = this.ministerios;
  } else if (tipoUdoInicial === 'HOSPITAL') {
    this.udoOptions = this.hospitales;
  } else if (tipoUdoInicial === 'CAPS') {
    this.udoOptions = this.caps;
  }

  if (tipoEfectorInicial === 'MINISTERIO') {
    this.efectorOptions = this.ministerios;
  } else if (tipoEfectorInicial === 'HOSPITAL') {
    this.efectorOptions = this.hospitales;
  } else if (tipoEfectorInicial === 'CAPS') {
    this.efectorOptions = this.caps;
  }

  if (tipoEfectorCargoInicial === 'MINISTERIO') {
    this.efectorCargoOptions = this.ministerios;
  } else if (tipoEfectorCargoInicial === 'HOSPITAL') {
    this.efectorCargoOptions = this.hospitales;
  } else if (tipoEfectorCargoInicial === 'CAPS') {
    this.efectorCargoOptions = this.caps;
  }

  const udoControl = this.legajoForm.get('udo');
if (udoControl) {
  if (this.udoOptions?.length > 0) {
    udoControl.enable();
    udoControl.setValue(this.initialData?.udo ?? null); // Establecer el valor inicial
  } else {
    udoControl.disable();
  }
}

const efectorControl = this.legajoForm.get('efectores');
if (efectorControl) {
  if (this.efectorOptions?.length > 0) {
    efectorControl.enable();
    efectorControl.setValue(this.initialData?.udo ?? null); // Establecer el valor inicial
  } else {
    efectorControl.disable();
  }
}

  // Llamo al servicio para obtener todos los tipos de cargo
  this.cargoService.list().subscribe((cargos: Cargo[]) => {
    this.cargos = cargos;
    // Verifico si existe el cargo 'DIRECTOR REGIONAL' sin importar la capitalización
    this.idDirectorRegional = this.cargos.find(t => t.nombre.toLowerCase() === 'director regional'.toLowerCase())?.id;
  });
  
  // Llamo al servicio para obtener todos los tipos de guardia
  this.tipoGuardiaService.list().subscribe((guardias: TipoGuardia[]) => {
    this.tipoGuardias = guardias;

    // Verificamos si los tipos 'CONTRAFACTURA' y 'PASIVA' están en la lista
    this.idContraFactura = this.tipoGuardias.find(t => t.nombre === 'CONTRAFACTURA')?.id;
    this.idPasiva = this.tipoGuardias.find(t => t.nombre === 'PASIVA')?.id;
    this.idExtra = this.tipoGuardias.find(t => t.nombre === 'EXTRA')?.id;
    this.idCargo = this.tipoGuardias.find(t => t.nombre === 'CARGO')?.id;
    this.idAgrupacion = this.tipoGuardias.find(t => t.nombre === 'AGRUPACION')?.id;

  });

      // Verifica si hay datos iniciales
      if (this.initialData) {

        this.onTipoUdoChange({ value: this.initialData.tipoUdo });
        this.idLegajo = this.initialData.id ?? 0;
        this.personId = this.initialData.persona!.id!;
        

        // Verifica si el ID de la persona es undefined
        if (this.initialData.persona?.id === undefined) {
          this.toastr.warning('ID de la persona no encontrado. Regresando a página de legajos.', 'Error', {
            timeOut: 9000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.router.navigate(['/personal-legajo']);
          return;
        }
    
        this.personId = this.initialData.persona.id;

        const efectoresAsignados = esContrafactura
  ? efectoresIds // Si es Contrafactura, usar efectoresIds
  : (this.initialData?.efectores?.map((efector: any) => efector.id) || []); // Si no, usar los efectores de initialData

        // Carga los datos del formulario
        this.legajoForm.patchValue({
          ...this.initialData,
         
         /*  efectoresSelected: this.initialData?.efectores 
          ? this.initialData.efectores.map((efector: any) => efector.id) 
          : [],  */
          efectoresSelected: esDirectorRegional ? null : 
        (esContrafactura ? efectoresAsignados : 
         (this.initialData?.efectores && this.initialData.efectores.length > 0 ? 
          this.initialData.efectores[0].id : null)),
          /* efectoresSelected: esContrafactura ? efectoresAsignados :this.initialData?.efectores ? this.initialData.efectores[0].id : 0, */
          profesion: this.initialData.profesion?.id,  // Asegúrate de que se asigne el ID de la profesión
          especialidades: this.initialData.especialidades ? this.initialData.especialidades.map((especialidad: any) => especialidad.id) : [],
          adicional: this.initialData.revista?.adicional?.id,  // Cargar adicional del objeto 'Revista'
          agrupacion: this.initialData.revista?.agrupacion,  // Aquí cargas el valor de 'agrupacion'
          cargaHoraria: this.initialData.revista?.cargaHoraria?.id,  // Cargar carga horaria del objeto 'Revista'
          categoria: this.initialData.revista?.categoria?.id ?? null,  // Cargar categoría del objeto 'Revista'
          tipoRevista: this.initialData.revista?.tipoRevista?.id,  // Cargar tipo de revista del objeto 'Revista'
      
          idCargo: this.initialData.cargo?.id,
          idRegion: this.initialData?.region?.id,
          tipoUdo: this.initialData.tipoUdo,
          tipoEfector: this.initialData.tipoEfector,
          tipoEfectorCargo: this.initialData.tipoEfectorCargo,
          udoSelected: this.initialData.udo?.id,
          persona: this.initialData.persona?.id,
       /*   tipoHabilitacionesGuardias: tipoHabilitacionesGuardiasInicial, */
         habilitacionesGuardias: efectoresFiltrados,
         habilitacionesGenerales: efectoresFiltradosGeneral,
          fechaInicio: this.initialData.fechaInicio ? new Date(this.initialData.fechaInicio + 'T00:00:00') : null,
          fechaFinal: this.initialData.fechaFinal ? new Date(this.initialData.fechaFinal + 'T00:00:00' ) : null,

        }); 

        this.habilitacionesGuardiasOptions = this.asistencial?.habilitacionesGuardias
  ?.filter((habilitacion: any) => habilitacion.activo) // Filtra solo habilitaciones activas
  ?.flatMap((habilitacion: any) => habilitacion.efectores.map((efector: any) => efector)) || [];

        this.habilitacionesGuardiasOptions = efectoresFiltrados; // Guarda los efectores completos para mostrarlos en el select
  
 this.habilitacionesGeneralesOptions = this.asistencial?.habilitacionesGenerales
  ?.filter((habilitacion: any) => habilitacion.activo) // Filtra solo habilitaciones activas
  ?.flatMap((habilitacion: any) => habilitacion.efectores.map((efector: any) => efector)) || [];

        this.habilitacionesGeneralesOptions = efectoresFiltradosGeneral;

        // Habilitar opciones si ya tiene guardia EXTRA o si hay habilitaciones guardias previas
  this.showHabilitacionesGuardias = selectedGuardias.includes(this.idExtra!) || tieneHabilitaciones;


// Llamar al método para manejar cambios en tipoUdo
 this.onTipoUdoChange({ value: this.initialData.tipoUdo });
 this.onCargoChange();
}
        
              // Si la profesión ya está seleccionada, filtrar las especialidades
      const profesionId = this.initialData.profesion?.id;
      if (profesionId) {
        this.filterEspecialidadesByProfesion(profesionId);
      }

  
    // Verifica si tipoGuardias contiene 4 o 5 al inicio y deshabilita los campos de "Situación de Revista"
    setTimeout(() => {
      const tipoGuardias = this.initialData?.tipoGuardias ? this.initialData.tipoGuardias.map((tipoGuardia: any) => tipoGuardia.id) : [];
      this.toggleSituacionRevista(tipoGuardias);  // Llamada a la función en un timeout
    }, 0);
  }

  // Suscribirse a cambios en la profesión seleccionada
  this.legajoForm.get('profesion')?.valueChanges.subscribe((profesionId) => {
    if (profesionId) {

      // Filtrar especialidades según la nueva profesión seleccionada
      this.filterEspecialidadesByProfesion(profesionId);
    } else {
      // Limpiar y deshabilitar el campo si no hay profesión seleccionada
      this.resetEspecialidades();
    }
  });
  
    
    // Suscribirse a cambios en la selección de tipo de guardia
    this.legajoForm.get('tipoGuardias')?.valueChanges.subscribe((selectedValues) => {

      if (selectedValues) { // Asegurarse de que no sea null
        this.toggleSituacionRevista(selectedValues);
      // Evitar que el valor de tipoGuardias se actualice automáticamente cuando se cambia el tipo 4 o 5
      if (!this.isUpdatingTipoGuardias) {
        this.isUpdatingTipoGuardias = true;
        // Llamar a toggleSituacionRevista cuando el usuario cambia el valor
        this.toggleSituacionRevista(selectedValues);
  
        // Si se selecciona el tipo 4 (CONTRAFACTURA), deseleccionar todas las demás opciones
        if (selectedValues.includes(this.idContraFactura)) {
          this.legajoForm.patchValue({
            tipoGuardias: [this.idContraFactura]  // Solo mantener el tipo 4
          }, { emitEvent: false });  // Esto previene que se dispare el evento valueChanges de nuevo
        } /* else if (selectedValues.includes(this.idPasiva)) {
          // Si se selecciona el tipo 5 (PASIVA), deseleccionar todas las demás opciones
          this.legajoForm.patchValue({
            tipoGuardias: [this.idPasiva]  // Solo mantener el tipo 5
          }, { emitEvent: false });  // Esto previene que se dispare el evento valueChanges de nuevo
        } else */ 
        /*  {
          // Si se seleccionan otras opciones (1, 2, 3), mantenerlas
          this.legajoForm.patchValue({
            tipoGuardias: selectedValues.filter((value: number) => value !== this.idContraFactura  && value !== this.idPasiva )
          }, { emitEvent: false });  // Esto previene que se dispare el evento valueChanges de nuevo
        } */
        this.isUpdatingTipoGuardias = false;
      }
    }
    });

        // Llamar al método para configurar cargaHoraria y adicional
        this.initializeCargaHorariaAndAdicional();
    
        // Suscribirse a los cambios en el campo categoria
        this.legajoForm.get('categoria')?.valueChanges.subscribe(() => {
          this.onCategoriaChange(); // Llama a la función para actualizar cargaHoraria cuando cambie la categoría
        });
      
        // Suscribirse a los cambios en cargaHoraria para habilitar/deshabilitar adicional
        this.legajoForm.get('cargaHoraria')?.valueChanges.subscribe((cargaHorariaId) => {
          this.updateAdicionalState(cargaHorariaId); // Llama a la función para habilitar/deshabilitar adicional
        });  
    
        this.legajoForm.get('esAutoridad')?.disable();    


  //-----Llamo métodos para cargar los datos iniciales-----
    this.listMinisterios();
    this.listHospitales();
    this.listCategorias();
    this.listAdicionales();
    this.listCargaHoraria();
    this.listTipoRevista();
    this.listTipoGuardia();
    this.listCargo();
    this.listRegion();


    this.tipoUdo = this.initialData?.tipoUdo ?? ''; // Asignar tipoUdo inicial
    this.onTipoUdoChange({ value: this.tipoUdo });
//-----Manejo de validaciones en Revista (categoria, cargaHoraria)-----

  this.legajoForm.get('categoria')?.valueChanges.subscribe(() => {
    this.onCategoriaChange(); // Llama a la función para actualizar cargaHoraria cuando cambie la categoría
  });

  this.legajoForm.get('cargaHoraria')?.valueChanges.subscribe(() => {
    this.onCargaHorariaChange(); // Llama a la función para actualizar la visibilidad del campo adicional cuando cambie cargaHoraria
  });

    this.legajoForm.get('especialidades')?.disable();
    this.listProfesiones();
  
//-----Manejo de validaciones en Profesion y especialidades-----
  
  // Cambiar especialidades cuando se cambia la profesión seleccionada
  this.legajoForm.get('profesion')?.valueChanges.subscribe((profesionId) => {
    if (profesionId) {
      this.filterEspecialidadesByProfesion(profesionId);
    } else {
      // Limpiar especialidades si no se ha seleccionado ninguna profesión
      this.especialidades = [];
      this.legajoForm.get('especialidades')?.disable(); // Deshabilitar especialidades si no hay profesión seleccionada
    }
  });
  
  // Borrar selección de especialidades si la profesión seleccionada no tiene especialidades
  this.legajoForm.get('profesion')?.valueChanges.subscribe((profesionId) => {
    const profesion = this.profesiones.find(p => p.id === profesionId);
  
  // Si la nueva profesión no tiene especialidades, limpiar la selección de especialidades
    if (profesion && !profesion.especialidades?.length) {
      this.legajoForm.get('especialidades')?.setValue([]);  // Limpiar la selección de especialidades
    }
  });
  
  // Suscribirse al valor de 'esAutoridad' y ejecutar el método para manejar la visibilidad
  this.legajoForm.get('esAutoridad')?.valueChanges.subscribe(value => {
    this.onAutoridadChange(value);
  });

  //-----Escuchar cambios en 'esAutoridad'-----
  this.legajoForm.get('esAutoridad')?.valueChanges.subscribe(asignadoAutoridad => {
    this.onAutoridadChange(asignadoAutoridad);
  });  

  // Inicializar el estado de los campos al cargar la página
  this.onAutoridadChange(this.legajoForm.get('esAutoridad')?.value);

this.initialHabilitacionesGuardias = efectoresFiltrados;

 setTimeout(() => {
    this.evaluarEstadoDirectorRegional();
  }, 100);

   this.legajoForm.setValidators([
    this.validarFechas,
    this.habilitacionesGuardiasValidatorEdit()
  ]);

}

// Agregar método para verificar si se puede modificar el legajo
get puedeModificarLegajo(): boolean {
  // 🔥 SI HAY IMAGEN DUPLICADA, NO PERMITIR MODIFICACIÓN
  if (this.isDuplicateImage) {
    return false;
  }
  
  // 🔥 VERIFICAR FORMULARIO VÁLIDO NORMAL
  return this.formularioValidoCompleto;
}

// 🔥 MÉTODOS PARA MANEJO DE IMÁGENES

onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.handleFileSelection(file);
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.types.includes('Files') && !this.isDragOver) {
      this.isDragOver = true;
      this.uploadError = null;
      console.log('🎯 Drag enter - Activado');
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.types.includes('Files')) {
      this.isDragOver = true;
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
      }
    } else {
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'none';
      }
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    const target = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement;
    
    if (target && (!relatedTarget || !target.contains(relatedTarget))) {
      this.isDragOver = false;
      console.log('🚪 Drag leave - Desactivado');
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.isDragOver = false;
    console.log('📂 Drop event triggered - Estado reseteado');
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      console.log('📁 Archivo detectado:', files[0].name);
      this.handleFileSelection(files[0]);
    } else {
      console.log('❌ No se detectaron archivos en el drop');
    }
  }

  resetDragState(): void {
    this.isDragOver = false;
    console.log('🔄 Estado de drag reseteado manualmente');
  }

  onMouseLeave(event: MouseEvent): void {
    if (!event.buttons) {
      this.resetDragState();
    }
  }

  handleFileSelection(file: File | null): void {
  if (!file) {
    this.uploadError = 'No se seleccionó ningún archivo';
    this.toastr.warning(this.uploadError);
    return;
  }

  // 🔥 VALIDACIONES BÁSICAS EN EL FRONTEND
  if (!file.type.startsWith('image/')) {
    this.uploadError = 'El archivo debe ser una imagen (JPG, PNG, GIF, etc.)';
    this.toastr.error(this.uploadError);
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    this.uploadError = 'El archivo no puede ser mayor a 5MB';
    this.toastr.error(this.uploadError);
    return;
  }

  // 🔥 VERIFICAR SI ES EL MISMO ARCHIVO QUE YA ESTÁ SELECCIONADO
  if (this.selectedFile && this.isSameFile(this.selectedFile, file)) {
    this.toastr.info('Este archivo ya está seleccionado');
    return;
  }

  // 🔥 VERIFICAR DUPLICADOS EN EL SERVIDOR SI HAY ID DE LEGAJO
  if (this.initialData?.id) {
    this.isUploading = true;
    this.uploadError = null;
    
    const formData = new FormData();
    formData.append('image', file);

    console.log('🔍 Verificando duplicados para legajo ID:', this.initialData.id);
    
    this.legajoService.checkImageDuplicate(this.initialData.id, formData).subscribe(
      (response: any) => {
        console.log('📸 Respuesta de verificación:', response);
        this.isUploading = false;
        
        if (response.isDuplicate) {
          // 🔥 IMAGEN DUPLICADA DETECTADA
          this.handleDuplicateImageOnSelection(response);
        } else {
          // 🔥 IMAGEN NUEVA, PROCEDER NORMALMENTE
          this.processNewImage(file);
        }
      },
      (error) => {
        console.error('❌ Error al verificar duplicados:', error);
        this.isUploading = false;
        
        // En caso de error, permitir continuar pero mostrar advertencia
        this.isDuplicateImage = false;
        this.uploadError = null;
        this.toastr.warning('No se pudo verificar la imagen. Se intentará subir al guardar.', 'Verificación fallida');
        this.processNewImage(file);
      }
    );
    
  } else {
    // 🔥 SI NO HAY ID (LEGAJO NUEVO), PROCEDER SIN VERIFICAR DUPLICADOS
    this.processNewImage(file);
  }
}

// 🔥 MÉTODO AUXILIAR PARA PROCESAR IMAGEN NUEVA
private processNewImage(file: File): void {
  console.log('✅ Imagen nueva, procesando...');
  
  // 🔥 RESETEAR ESTADO DE DUPLICADO
  this.isDuplicateImage = false; // 🔥 IMPORTANTE: RESETEAR ESTADO
  this.uploadError = null;
  this.selectedFile = file;
  this.pendingFile = null;

  // 🔥 MOSTRAR PREVIEW LOCAL INMEDIATAMENTE
  const reader = new FileReader();
  reader.onload = (e: any) => {
    this.fileUrl = e.target.result;
  };
  reader.readAsDataURL(file);

  // 🔥 FORZAR ACTUALIZACIÓN DEL FORMULARIO PARA HABILITAR BOTÓN
  this.legajoForm.updateValueAndValidity();

  this.toastr.success('Imagen seleccionada. Se subirá cuando se actualice el legajo.', 'Imagen nueva');
}

// 🔥 MÉTODO PARA MANEJAR IMAGEN DUPLICADA EN SELECCIÓN
private handleDuplicateImageOnSelection(response: any): void {
  console.log('⚠️ Imagen duplicada detectada en selección:', response);
  
  // 🔥 VERIFICAR SI ES LA MISMA IMAGEN DEL LEGAJO ACTUAL
  if (response.isSameImage) {
    this.isDuplicateImage = false; // No bloquear si es la misma imagen
    this.uploadError = null;
    this.selectedFile = null;
    
    this.toastr.info(
      `Esta imagen ya está asociada a este legajo.`,
      'Imagen actual',
      {
        timeOut: 3000,
        positionClass: 'toast-top-center',
        progressBar: true
      }
    );
    return;
  }
  
  // 🔥 VERIFICAR SI EXISTE EN OTRA CARPETA (REUTILIZABLE)
  if (response.isReused) {
    this.isDuplicateImage = false;
    this.uploadError = null;
    this.selectedFile = null;
    
    // 🔥 ACTUALIZAR AUTOMÁTICAMENTE LA URL SIN SUBIR ARCHIVO
    this.fileUrl = `http://localhost:8080${response.url}`;
    this.legajoForm.patchValue({ url: response.url });
    
    this.toastr.success(
      `Imagen reutilizada de carpeta existente. No se creará duplicado.`,
      'Imagen reutilizada',
      {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        progressBar: true
      }
    );
    return;
  }
  
  // 🔥 DUPLICADO NORMAL (MISMA CARPETA)
  this.isDuplicateImage = true;
  this.uploadError = `Esta imagen ya existe: ${response.existingFile}`;
  this.selectedFile = null;
  this.fileUrl = `http://localhost:8080${response.url}`;
  
  // 🔥 LIMPIAR INPUT FILE
  const fileInput = document.getElementById('archivo') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }

  this.legajoForm.updateValueAndValidity();

  this.toastr.warning(
    `Esta imagen ya existe en el legajo: ${response.filename}. El botón de modificar se ha deshabilitado.`,
    'Imagen duplicada',
    {
      timeOut: 8000,
      positionClass: 'toast-top-center',
      progressBar: true
    }
  );
}

  openFileSelector(): void {
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  removeSelectedFile(): void {
  this.selectedFile = null;
  this.uploadError = null;
  this.isDuplicateImage = false; // 🔥 RESETEAR ESTADO DE DUPLICADO
  
  // 🔥 SI HAY IMAGEN EXISTENTE, MOSTRARLA DE NUEVO
  if (this.initialData?.url) {
    this.fileUrl = `http://localhost:8080${this.initialData.url}`;
  } else {
    this.fileUrl = null;
  }
  
  const fileInput = document.getElementById('archivo') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
  
  // 🔥 FORZAR ACTUALIZACIÓN DEL FORMULARIO
  this.legajoForm.updateValueAndValidity();
  
  this.toastr.info('Archivo removido. Botón de modificar habilitado.');
}

  getFileInfo(): string {
    if (!this.selectedFile) return '';
    
    const size = this.selectedFile.size;
    const sizeInMB = (size / (1024 * 1024)).toFixed(2);
    return `${this.selectedFile.name} (${sizeInMB} MB)`;
  }

  getDropAreaClasses(): string {
    let classes = 'file-drop-area';
    
    if (this.isUploading) {
      classes += ' uploading';
    } else if (this.isDragOver) {
      classes += ' drag-over';
    } else if ((this.selectedFile || this.initialData?.url) && !this.uploadError) {
      classes += ' has-file';
    } else if (this.uploadError) {
      classes += ' error';
    }
    
    return classes;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }

  private isSameFile(file1: File, file2: File): boolean {
    return file1.name === file2.name && 
           file1.size === file2.size && 
           file1.lastModified === file2.lastModified;
  }

  private uploadImageAfterUpdate(legajoId: number): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!this.selectedFile) {
      resolve(null);
      return;
    }

    console.log('🔄 Iniciando subida de imagen para legajo actualizado ID:', legajoId);
    console.log('📁 Archivo seleccionado:', this.selectedFile.name);
    
    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.legajoService.uploadImage(legajoId, formData).subscribe(
      (response: any) => {
        console.log('✅ Respuesta de subida de imagen:', response);
        
        // 🔥 MANEJAR DIFERENTES TIPOS DE RESPUESTA
        if (response.isReused) {
          console.log('🔄 Imagen reutilizada de carpeta existente:', response.url);
          this.toastr.success('Legajo actualizado. Imagen reutilizada de carpeta existente.');
        } else if (response.isSameImage) {
          console.log('✅ Imagen idéntica a la actual mantenida:', response.url);
          this.toastr.success('Legajo actualizado. Imagen actual mantenida.');
        } else if (response.isNew) {
          console.log('📸 Nueva imagen subida exitosamente:', response.url);
          this.toastr.success('Legajo e imagen actualizados correctamente');
        } else {
          console.log('✅ Imagen procesada exitosamente:', response.url);
          this.toastr.success('Legajo e imagen actualizados correctamente');
        }
        
        this.fileUrl = `http://localhost:8080${response.url}`;
        
        // 🔥 LIMPIAR INPUT FILE
        const fileInput = document.getElementById('archivo') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        this.selectedFile = null;
        
        resolve(response);
      },
      (error) => {
        console.error('❌ Error al subir imagen después de actualizar legajo:', error);
        this.selectedFile = null;
        reject(error);
      }
    );
  });
}

 // Función para evaluar el estado del formulario para Director Regional
  evaluarFormularioDirectorRegional(): void {
  
  // Combinar todos los listeners en una evaluación general
  const todosLosCampos = [
    'esAutoridad', 'idCargo', 'idRegion', 'nroResolucion', 
    'nroDecreto', 'fechaResolucion', 'fechaInicio', 'profesion', 
    'matriculaProvincial', 'idPersona'
  ];

  todosLosCampos.forEach(campo => {
    this.legajoForm.get(campo)?.valueChanges.subscribe(() => {
      setTimeout(() => {
        this.evaluarEstadoDirectorRegional();
      }, 50);
    });
  });
}

  // Agregar método para verificar si el formulario es válido
get formularioValidoCompleto(): boolean {
  const esAutoridad = this.legajoForm.get('esAutoridad')?.value;
  const cargoId = this.legajoForm.get('idCargo')?.value;
  
  
  // Si es Director Regional, usar validación específica
  if (esAutoridad && cargoId === this.idDirectorRegional) {
    return this.formularioValidoParaDirectorRegional;
  }
  
  // Si no es Director Regional, usar validación normal del formulario

  return this.legajoForm.valid;
}

  // Función que evalúa si todos los campos requeridos para Director Regional están completos
evaluarEstadoDirectorRegional(): void {
  const esAutoridad = this.legajoForm.get('esAutoridad')?.value;
  const cargoId = this.legajoForm.get('idCargo')?.value;
  
  if (esAutoridad && cargoId === this.idDirectorRegional) {
    
    const camposRequeridos = {
      esAutoridad: this.legajoForm.get('esAutoridad')?.value,
      idCargo: this.legajoForm.get('idCargo')?.value,
      idRegion: this.legajoForm.get('idRegion')?.value,
      nroResolucion: this.legajoForm.get('nroResolucion')?.value,
      nroDecreto: this.legajoForm.get('nroDecreto')?.value,
      fechaResolucion: this.legajoForm.get('fechaResolucion')?.value,
      fechaInicio: this.legajoForm.get('fechaInicio')?.value,
      profesion: this.legajoForm.get('profesion')?.value,
      matriculaProvincial: this.legajoForm.get('matriculaProvincial')?.value,
      // 🎯 USAR EL CAMPO CORRECTO PARA PERSONA
      idPersona: this.personId || this.initialData?.persona?.id
    };

    Object.entries(camposRequeridos).forEach(([campo, valor]) => {
      const estado = valor ? '✅' : '❌';
    });

    // 🎯 VERIFICAR QUE TODOS LOS CAMPOS TENGAN VALORES VÁLIDOS
    const todosCamposCompletos = Object.entries(camposRequeridos).every(([campo, valor]) => {
      if (campo === 'idPersona') {
        // Para idPersona, verificar que sea un número válido
        return typeof valor === 'number' && valor > 0;
      }
      if (campo === 'esAutoridad') {
        // Para esAutoridad, verificar que sea true
        return valor === true;
      }
      // Para otros campos, verificar que no sean null, undefined o string vacío
      return valor !== null && valor !== undefined && valor !== '';
    });

    // Actualizar la propiedad que controla si el formulario es válido para Director Regional
    this.formularioValidoParaDirectorRegional = todosCamposCompletos;

    if (todosCamposCompletos) {
      console.log('🎉 TODOS LOS CAMPOS REQUERIDOS PARA DIRECTOR REGIONAL ESTÁN COMPLETOS EN EDIT');
    } else {
      const camposFaltantes = Object.entries(camposRequeridos)
        .filter(([campo, valor]) => {
          if (campo === 'idPersona') {
            return !(typeof valor === 'number' && valor > 0);
          }
          if (campo === 'esAutoridad') {
            return valor !== true;
          }
          return !valor;
        })
        .map(([campo, _]) => campo);
      
      console.log('⚠️ CAMPOS FALTANTES PARA DIRECTOR REGIONAL EN EDIT:', camposFaltantes);
    }
  } else {
    // Si no es Director Regional, usar validación normal
    console.log('ℹ️ No es Director Regional, usando validación normal del formulario');
    this.formularioValidoParaDirectorRegional = false;
  }
}

loadCaps(): Promise<void> {
  return new Promise((resolve, reject) => {
    this.capsService.list().subscribe({
      next: (caps: Caps[]) => {
        this.capsList = caps;
        resolve();
      },
      error: (error) => {
        console.error('Error al cargar los CAPS:', error);
        reject(error);
      },
    });
  });
}

filterCaps(): void {

  // 🎯 VERIFICAR SI ES DIRECTOR REGIONAL
  const esDirectorRegional = this.initialData?.esRegional === true || 
                            (this.initialData?.cargo?.nombre?.toLowerCase() === 'director regional');

  if (esDirectorRegional) {
    return; // Salir del método para Director Regional
  }

  const efectoresFiltrados = this.asistencial?.habilitacionesGuardias
    ?.filter((habilitacion: HabilitacionesGuardias) => habilitacion.activo) // Filtra solo las habilitaciones activas
    ?.flatMap((habilitacion: HabilitacionesGuardias) => habilitacion.efectores.map((efector: Efector) => efector.id)) || []; // Extraer efectores completos

  const udoSelected = this.initialData?.udo?.id || null;
  const efectoresSelected = this.initialData?.efectores && this.initialData.efectores.length > 0 
    ? this.initialData.efectores[0].id 
    : null;

  if (!efectoresSelected) {
    console.log('⚠️ No hay efectores seleccionados válidos');
    return;
  }


  if (efectoresFiltrados.length > 0) {
    const capsFiltrados = this.capsList.filter((caps: Caps) => efectoresFiltrados.includes(caps.id));
    const idsCabecera = [...new Set(capsFiltrados.map((caps: Caps) => caps.cabecera?.id).filter((id) => id !== null))]; // Filtrar null y eliminar duplicados

  this.selectedHospitalsGuardias = idsCabecera.filter((id): id is number => id !== undefined);
    
     this.legajoForm.patchValue({
   hospitalHabilitacionesGuardias: idsCabecera,
  });

const hospitalIds = idsCabecera; // Lista de IDs de hospitales

if (hospitalIds && hospitalIds.length > 0) {
  hospitalIds.forEach((hospitalId) => {
    if (hospitalId !== undefined) {
      this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(
  (data) => {
    const uniqueCaps = data.filter((cap) => !this.caps.some((existingCap) => existingCap.id === cap.id));
    this.caps = [...this.caps, ...uniqueCaps];
    this.habilitacionesGuardiasOptions = this.caps;
    this.habilitacionesGuardiasCaps = this.caps;
  },
  (error) => {
    console.error(error);
    this.toastr.error('Ocurrió un error al cargar los CAPS.', 'Error');
  }
);
    }
  });
} else {

}

    this.efectorOptions = idsCabecera;
  } else 
  
  if (efectoresSelected) {
    const capsFiltrado = this.capsList.find((caps: Caps) => caps.id === efectoresSelected);
    const idCabecera = capsFiltrado?.cabecera?.id || null;

    // Actualizar las opciones según los IDs encontrados
    if (idCabecera !== null) {
      this.efectorOptions = [idCabecera];
    }
  } 

  if (udoSelected) {
    const capsFiltrado = this.capsList.find((caps: Caps) => caps.id === udoSelected);
    const idCabecera = capsFiltrado?.cabecera?.id || null;

  }

}

filterCapsGeneral(): void {

  const esDirectorRegional = this.initialData?.esRegional === true || 
                            (this.initialData?.cargo?.nombre?.toLowerCase() === 'director regional');

  if (esDirectorRegional) {
   
    return;
  }

  const efectoresFiltrados = this.asistencial?.habilitacionesGenerales
    ?.filter((habilitacion: HabilitacionesGenerales) => habilitacion.activo) // Filtra solo las habilitaciones activas
    ?.flatMap((habilitacion: HabilitacionesGenerales) => habilitacion.efectores.map((efector: Efector) => efector.id)) || []; // Extraer efectores completos

  const udoSelected = this.initialData?.udo?.id || null;
  const efectoresSelected = this.initialData?.efectores && this.initialData.efectores.length > 0 
    ? this.initialData.efectores[0].id 
    : null;

  if (!efectoresSelected) {
    return;
  }

  if (efectoresFiltrados.length > 0) {
    const capsFiltrados = this.capsList.filter((caps: Caps) => efectoresFiltrados.includes(caps.id));
    const idsCabecera = [...new Set(capsFiltrados.map((caps: Caps) => caps.cabecera?.id).filter((id) => id !== null))]; // Filtrar null y eliminar duplicados
    
  this.selectedHospitalsGenerales = idsCabecera.filter((id): id is number => id !== undefined);
  
     this.legajoForm.patchValue({
   hospitalHabilitacionesGenerales: idsCabecera,
  });

const hospitalIds = idsCabecera; // Lista de IDs de hospitales

if (hospitalIds && hospitalIds.length > 0) {
  hospitalIds.forEach((hospitalId) => {
    if (hospitalId !== undefined) {
      this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(
  (data) => {
    const uniqueCaps = data.filter((cap) => !this.caps.some((existingCap) => existingCap.id === cap.id));
    this.caps = [...this.caps, ...uniqueCaps];
    this.habilitacionesGeneralesOptions = this.caps;
    this.habilitacionesGeneralesCaps = this.caps;
  },
  (error) => {
    console.error(error);
    this.toastr.error('Ocurrió un error al cargar los CAPS.', 'Error');
  }
);
    }
  });
} 

    this.efectorOptions = idsCabecera;
  } 
  
  if (efectoresSelected) {
    const capsFiltrado = this.capsList.find((caps: Caps) => caps.id === efectoresSelected);
    const idCabecera = capsFiltrado?.cabecera?.id || null;

    // Actualizar las opciones según los IDs encontrados
    if (idCabecera !== null) {
      this.efectorOptions = [idCabecera];
    }
  } 

  if (udoSelected) {
    const capsFiltrado = this.capsList.find((caps: Caps) => caps.id === udoSelected);
    const idCabecera = capsFiltrado?.cabecera?.id || null;
  }  

}


filterCapsHabilitaciones(): void {
  if (!this.capsList || this.capsList.length === 0) {
    return;
  }

  // Obtener los IDs de los efectores filtrados
  const efectoresFiltrados = this.asistencial?.habilitacionesGuardias
    ?.filter((habilitacion: HabilitacionesGuardias) => habilitacion.activo)
    ?.flatMap((habilitacion: HabilitacionesGuardias) => habilitacion.efectores.map((efector: Efector) => efector.id)) || [];


  // Obtener solo los IDs de los CAPS filtrados
  const capsFiltradosIds = this.capsList
    .filter((caps: Caps) => efectoresFiltrados.includes(caps.id))
    .map((caps: Caps) => caps.id);

  if (capsFiltradosIds.length === 0) {
    console.warn('No se encontraron CAPS coincidentes con los efectores filtrados.');
    return;
  }

  // Asignar los IDs de los CAPS filtrados al formulario
  this.legajoForm.patchValue({
    habilitacionesGuardiasCaps: capsFiltradosIds, // Asignar solo los IDs
  });

  // Actualizar otras propiedades si es necesario
  this.hospitalHabilitacionesGuardias = capsFiltradosIds[0] ?? null; // Asigna el primer ID o null si no hay elementos
}

filterCapsHabilitacionesGenerales(): void {
  if (!this.capsList || this.capsList.length === 0) {
    console.error('La lista de CAPS no está cargada.');
    return;
  }

  // Obtener los IDs de los efectores filtrados
  const efectoresFiltrados = this.asistencial?.habilitacionesGenerales
    ?.filter((habilitacion: HabilitacionesGenerales) => habilitacion.activo)
    ?.flatMap((habilitacion: HabilitacionesGenerales) => habilitacion.efectores.map((efector: Efector) => efector.id)) || [];


  // Obtener solo los IDs de los CAPS filtrados
  const capsFiltradosIds = this.capsList
    .filter((caps: Caps) => efectoresFiltrados.includes(caps.id))
    .map((caps: Caps) => caps.id);

  if (capsFiltradosIds.length === 0) {
    console.warn('No se encontraron CAPS coincidentes con los efectores filtrados.');
    return;
  }


  // Asignar los IDs de los CAPS filtrados al formulario
  this.legajoForm.patchValue({
    habilitacionesGeneralesCaps: capsFiltradosIds, // Asignar solo los IDs
  });

  // Actualizar otras propiedades si es necesario
  this.hospitalHabilitacionesGenerales = capsFiltradosIds[0] ?? null; // Asigna el primer ID o null si no hay elementos
}

filterHospitalHabilitaciones(): void {
  if (!this.hospitales || this.hospitales.length === 0) {
    console.error('La lista de hospitales no está cargada.');
    return;
  }
  // Obtener los IDs de los efectores filtrados
  const efectoresFiltrados = this.asistencial?.habilitacionesGuardias
    ?.filter((habilitacion: HabilitacionesGuardias) => habilitacion.activo)
    ?.flatMap((habilitacion: HabilitacionesGuardias) => habilitacion.efectores.map((efector: Efector) => efector.id)) || [];
  // Obtener solo los IDs de los hospitales filtrados
  const hospitalesFiltradosIds = this.hospitales
    .filter((hospital: Hospital) => efectoresFiltrados.includes(hospital.id))
    .map((hospital: Hospital) => hospital.id);
  if (hospitalesFiltradosIds.length === 0) {
    console.warn('No se encontraron hospitales coincidentes con los efectores filtrados.');
    return;
  }
  // Asignar los IDs de los hospitales filtrados al formulario
  this.legajoForm.patchValue({
    habilitacionesGuardiasHospital: hospitalesFiltradosIds, // Asignar solo los IDs
  });
  // Actualizar otras propiedades si es necesario
  this.hospitalHabilitacionesGuardias = hospitalesFiltradosIds[0] ?? null; // Asigna el primer ID o null si no hay elementos
 }

filterHospitalHabilitacionesGenerales(): void {
  if (!this.hospitales || this.hospitales.length === 0) {
    console.error('La lista de hospitales no está cargada.');
    return;
  }
  // Obtener los IDs de los efectores filtrados
  const efectoresFiltrados = this.asistencial?.habilitacionesGenerales
    ?.filter((habilitacion: HabilitacionesGenerales) => habilitacion.activo)
    ?.flatMap((habilitacion: HabilitacionesGenerales) => habilitacion.efectores.map((efector: Efector) => efector.id)) || [];
  // Obtener solo los IDs de los hospitales filtrados
  const hospitalesFiltradosIds = this.hospitales
    .filter((hospital: Hospital) => efectoresFiltrados.includes(hospital.id))
    .map((hospital: Hospital) => hospital.id);
  if (hospitalesFiltradosIds.length === 0) {
    console.warn('No se encontraron hospitales coincidentes con los efectores filtrados.');
    return;
  }
  // Asignar los IDs de los hospitales filtrados al formulario
  this.legajoForm.patchValue({
    habilitacionesGeneralesHospital: hospitalesFiltradosIds, // Asignar solo los IDs
  });
  // Actualizar otras propiedades si es necesario // Asigna el primer ID o null si no hay elementos
  this.hospitalHabilitacionesGenerales = hospitalesFiltradosIds[0] ?? null; // Asigna el primer ID o null si no hay elementos
}

// Cargar datos iniciales
private loadInitialData(): void {
  const esDirectorRegional = this.initialData?.esRegional === true || 
                            (this.initialData?.cargo?.nombre?.toLowerCase() === 'director regional');

  this.listMinisterios();
  this.listHospitales();

  // Un solo forkJoin para cargar todos los datos necesarios
  forkJoin({
    ministerios: this.ministerioService.list(),
    hospitales: this.hospitalService.list(),
    tipoGuardias: this.tipoGuardiaService.list(),
    cargaHorarias: this.cargaHorariaService.list(),
    adicionales: this.adicionalService.list(),
  }).subscribe(
    ({ ministerios, hospitales, tipoGuardias, cargaHorarias, adicionales }) => {
      this.ministerios = ministerios;
      this.hospitales = hospitales;
      this.tipoGuardias = tipoGuardias;
      this.cargasHorarias = cargaHorarias;
      this.adicionales = adicionales;

      // Solo ejecutar filtros si NO es Director Regional
      if (!esDirectorRegional) {
        this.filterCaps();
        this.filterCapsGeneral();
        this.filterCapsHabilitaciones();
        this.filterCapsHabilitacionesGenerales();
        this.filterHospitalHabilitaciones();
        this.filterHospitalHabilitacionesGenerales();
      }

    const efectoresFiltrados = !esDirectorRegional ? (this.asistencial?.habilitacionesGuardias
        ?.filter((habilitacion: HabilitacionesGuardias) => habilitacion.activo)
        ?.flatMap((habilitacion: HabilitacionesGuardias) => habilitacion.efectores.map((efector: Efector) => efector.id)) || []) : [];

      const efectoresFiltradosGeneral = !esDirectorRegional ? (this.asistencial?.habilitacionesGenerales
        ?.filter((habilitacion: HabilitacionesGenerales) => habilitacion.activo)
        ?.flatMap((habilitacion: HabilitacionesGenerales) => habilitacion.efectores.map((efector: Efector) => efector.id)) || []) : [];

      this.idContraFactura = 4;
      this.idExtra = 3;
      this.idPasiva = 5;

    // Obtener los tipos de guardia ya cargados en initialData
      const selectedGuardia = this.initialData?.tipoGuardias
        ? this.initialData.tipoGuardias.map((tipoGuardia: any) => tipoGuardia.id)
        : [];

// 🎯 MANEJO SEGURO PARA DIRECTOR REGIONAL
      const capsCabecera = !esDirectorRegional && this.capsList.length > 0 
        ? (this.capsList.find((caps: Caps) => caps.id === this.initialData?.udo?.id)?.cabecera?.id || null)
        : null;

      // 🎯 VERIFICACIÓN SEGURA DE EFECTORES PARA DIRECTOR REGIONAL - UNA SOLA DECLARACIÓN
      const efectoresSelected = esDirectorRegional 
        ? null 
        : (this.initialData?.efectores && this.initialData.efectores.length > 0 
           ? this.initialData.efectores[0].id 
           : null);

    if (!esDirectorRegional && efectoresSelected) {
        const capsFiltrado = this.capsList.find((caps: Caps) => caps.id === efectoresSelected);
        const idCabecera = capsFiltrado?.cabecera?.id || null;

// Verificar si el tipo de guardia inicial o el seleccionado es Contrafactura
const esContrafactura = selectedGuardia.includes(this.idContraFactura);

        // Procesar efectores para contrafactura solo si NO es Director Regional
        const efectoresIds = this.asistencial?.habilitacionesGuardias
          ? this.asistencial.habilitacionesGuardias
              .flatMap((habilitacion: any) =>
                  habilitacion.efectores ? habilitacion.efectores.map((efector: any) => efector.id) : []
              )
          : [];

        const efectoresElegidos = esContrafactura
          ? efectoresIds
          : (this.initialData?.efectores?.map((efector: any) => efector.id) || []);
    
      this.legajoForm.patchValue({
       
        efectoresSelected: efectoresSelected,
        tipoGuardias: this.initialData?.tipoGuardias?.map((tipo: any) => tipo.id) || [],
        cargaHoraria: this.initialData?.revista?.cargaHoraria?.id || null,
        adicional: this.initialData?.revista?.adicional?.id || null,
        udoSelected: this.initialData?.udo?.id || null,
        persona: this.initialData?.persona?.id,
        habilitacionesGuardias: efectoresFiltrados,
        habilitacionesGenerales: efectoresFiltradosGeneral,
        hospitalUdo: capsCabecera ? Number(capsCabecera) : null,
        hospitalEfectores: idCabecera,
        efectoresAutoridad: efectoresSelected,
        idCargo: this.initialData?.cargo?.id,
        idRegion: this.initialData?.region?.id,
        nroDecreto: this.initialData?.nrodecreto,
        nroResolucion: this.initialData?.nroresolucion,
        fechaResolucion: this.initialData?.fechaResolucion ? new Date(this.initialData.fechaResolucion + 'T00:00:00') : null,
     
       
     
      });
    }else {
        // Para Director Regional, cargar solo los datos básicos
        this.legajoForm.patchValue({
           efectoresSelected: null,
        tipoGuardias: this.initialData?.tipoGuardias?.map((tipo: any) => tipo.id) || [],
        cargaHoraria: this.initialData?.revista?.cargaHoraria?.id || null,
        adicional: this.initialData?.revista?.adicional?.id || null,
        udoSelected: this.initialData?.udo?.id || null,
        persona: this.initialData?.persona?.id,
        habilitacionesGuardias: [],
        habilitacionesGenerales: [],
        hospitalUdo: null,
        hospitalEfectores: null,
        efectoresAutoridad: null,
        idCargo: this.initialData?.cargo?.id,
        idRegion: this.initialData?.region?.id,
        nroDecreto: this.initialData?.nrodecreto,
        nroResolucion: this.initialData?.nroresolucion,
        fechaResolucion: this.initialData?.fechaResolucion ? new Date(this.initialData.fechaResolucion + 'T00:00:00') : null,
      });
    }


      this.onCargoChange();
      this.habilitacionesGuardiasOptions = efectoresFiltrados; // Guarda los efectores completos para mostrarlos en el select

      const udoSelected = this.initialData?.udo?.id || null;

  this.legajoForm.get('tipoGuardias')?.valueChanges.subscribe((tipoGuardias: number[]) => {
        this.showHabilitacionesGuardias = (this.idExtra !== undefined && tipoGuardias.includes(this.idExtra)) && (this.idCargo !== undefined && !tipoGuardias.includes(this.idCargo));
      });
    
  // Llamar a la función para manejar la lógica de habilitación
  const selectedGuardias = this.initialData?.tipoGuardias
        ? this.initialData.tipoGuardias.map((tipoGuardia: any) => tipoGuardia.id)
        : [];
      this.onGuardiaCfExtra(selectedGuardias);

      const tipoUdoInicial = this.initialData?.tipoUdo || '';
      const tipoEfectorInicial = this.initialData?.tipoEfector || '';
      const tipoEfectorCargoInicial = this.initialData?.tipoEfectorCargo || '';
      this.onTipoUdoChange({ value: tipoUdoInicial });
      this.onTipoEfectorChange({ value: tipoEfectorInicial });
      this.onTipoEfectorCargoChange({ value: tipoEfectorCargoInicial });
    },
    (error) => {
      console.error('Error al cargar los datos iniciales:', error);
    }
  );
}

alMenosUnoRequeridoValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const habilitacionesHospital = group.get('habilitacionesGeneralesHospital')?.value;
    const habilitacionesCaps = group.get('habilitacionesGeneralesCaps')?.value;
    const hospitalParaCaps = group.get('hospitalHabilitacionesGenerales')?.value;

    const tieneHospital = Array.isArray(habilitacionesHospital) && habilitacionesHospital.length > 0;
    const tieneCaps = Array.isArray(habilitacionesCaps) && habilitacionesCaps.length > 0;
    const tieneHospitalParaCaps = Array.isArray(hospitalParaCaps) && hospitalParaCaps.length > 0;

    // Si hay hospital para listar caps, entonces caps es obligatorio
    if (tieneHospitalParaCaps && !tieneCaps) {
      return { capsRequeridoCuandoHayHospital: true };
    }

    // Si no hay ni hospitales ni caps seleccionados
    if (!tieneHospital && !tieneCaps) {
      return { alMenosUnoRequerido: true };
    }

    return null;
  };
}

habilitacionesGuardiasValidatorEdit(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const habilitacionesHospital = group.get('habilitacionesGuardiasHospital')?.value;
    const habilitacionesCaps = group.get('habilitacionesGuardiasCaps')?.value;
    const tipoGuardias = group.get('tipoGuardias')?.value || [];
    const esAutoridad = group.get('esAutoridad')?.value;

    // 🎯 SOLO APLICAR VALIDACIÓN SI NO ES AUTORIDAD Y SE MUESTRAN HABILITACIONES DE GUARDIAS
    if (!esAutoridad && this.showHabilitacionesGuardias) {

      // Verificar si hay tipos de guardia que requieren habilitaciones
      const requiereHabilitaciones = tipoGuardias.some((tipo: number) => 
        tipo === this.idContraFactura || tipo === this.idExtra || tipo === this.idPasiva
      );

      if (requiereHabilitaciones) {
        const tieneHospital = Array.isArray(habilitacionesHospital) && habilitacionesHospital.length > 0;
        const tieneCaps = Array.isArray(habilitacionesCaps) && habilitacionesCaps.length > 0;

        // Si no hay ni hospitales ni caps seleccionados
        if (!tieneHospital && !tieneCaps) {
  
          return { habilitacionesGuardiasRequeridas: true };
        }
      }
    }

    return null;
  };
}

//------LISTAS--------

listMinisterios(): void {
  // Asegúrate de que este servicio retorne los ministerios correctamente
  this.ministerioService.list().subscribe((ministerios) => {
    this.ministerios = ministerios;
  });
  
}

  listHospitales(): void {
    this.hospitalService.list().subscribe(data => {
      this.hospitales = data;
    }, error => {
      console.log(error);
    });

    
  }
  


  listProfesiones(): void {
    this.profesionService.list().subscribe(data => {
      this.profesiones = data;
    }, error => {
      console.log(error);
    });
  }

  listTipoGuardia(): void {
    this.tipoGuardiaService.list().subscribe(data => {
      this.tipoGuardias = data;
    }, error => {
      console.log(error);
    });
  }

  listCategorias(): void {
    this.categoriaService.list().subscribe(data => {
      this.categorias = data;
    }, error => {
      console.log(error);
    });
  }

  listCargo(): void {
    this.cargoService.list().subscribe(data => {
      this.cargos = data;
    }, error => {
      console.log(error);
    });
  }

  listRegion(): void {
    this.regionService.list().subscribe(data => {
      this.regiones = data;
    }, error => {
      console.log(error);
    });
  }

  listCargaHoraria(): void {
    this.cargaHorariaService.list().subscribe(data => {
      this.cargasHorarias = data;
      this.filteredCargasHorarias = data; // Inicialmente mostramos todas las opciones
    }, error => {
      console.log(error);
    });
  }

  listAdicionales(): void {
    this.adicionalService.list().subscribe(data => {
      this.adicionales = data;
    }, error => {
      console.log(error);
    });
  }

  listTipoRevista(): void {
    this.tipoRevistaService.list().subscribe(data => {
      this.tiposRevistas = data;
    }, error => {
      console.log(error);
    });
  }

//-----Metodos y funciones-----

  // Roles a usar
  UserRoles(): void {
    if (this.currentRole) {
      this.isUsuario = this.currentRole === 'ROLE_USER';
      this.isAdministrativo = this.currentRole === 'ROLE_ADMIN';
      this.isAutoridad = this.currentRole === 'ROLE_AUTORIDAD';
      this.isDph = this.currentRole === 'ROLE_DPH';
      this.isSuper = this.currentRole === 'ROLE_SUPERUSER';
    } else {
      // Si no hay rol seleccionado, todos como false
      this.isAdministrativo = false;
      this.isUsuario = false;
      this.isDph = false;
      this.isSuper = false;
    }
  }

  // Form Datos profesional: No permite seleccionar una fecha futura en fechaInicio
  dateLimitePresente(control: any) {
    if (!control.value) {
      return null; // No validar si no hay valor
    }
    const startDate = new Date(control.value);
    const currentDate = new Date();

    if (startDate > currentDate) {
      return { 'matDatepickerMin': true };
    }
    return null;
  }

  //Form Datos profesional: Habilita la fecha minima para fechaFinalizacion
  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    const nuevaFechaInicio = event.value;
  
    // Puedes agregar más lógica si es necesario, por ejemplo:
    if (nuevaFechaInicio) {
      const fechaInicioDate = new Date(nuevaFechaInicio);
      fechaInicioDate.setDate(fechaInicioDate.getDate() + 1);
  
      // Establecer la fecha mínima para la fecha final
      this.minFechaFinal = fechaInicioDate;
  
      // Si la fecha final es inválida, actualizarla
      const fechaFinalControl = this.legajoForm.get('fechaFinal');
      const fechaFinalActual = fechaFinalControl?.value ? new Date(fechaFinalControl.value) : null;
  
      if (!fechaFinalActual || fechaFinalActual <= fechaInicioDate) {
        fechaFinalControl?.setValue(fechaInicioDate);
      }
    }
  }

  resetEspecialidades(): void {
    this.legajoForm.get('especialidades')?.setValue([]);
    this.especialidades = [];
    this.legajoForm.get('especialidades')?.disable();
    this.noEspecialidadesMessage = '';
  }

  //en caso sea rol administrativo solo deja cargar su efector
  getEfectoresFiltrados(): any[] {
    // Si el usuario es administrativo, solo mostrar los efectores cuyo id esté en idEfectorUser
    if (this.isAdministrativo) {
      const idEfectorUser = this.nombresEfectores.map(efector => efector.id);  // Obtener los id de los efectores disponibles para el administrativo
      return this.hospitales.filter(efector => idEfectorUser.includes(efector.id as number));  // Filtrar los efectores que tienen un id en idEfectorUser, asegurando que efector.id es un número
    }
  
    // Si no es administrativo, devuelve todos los efectores
    return this.hospitales;
  }

  updateAdicionalState(cargaHorariaId: number | null): void {
    const cargaHorariaSeleccionada = this.cargasHorarias.find(ch => ch.id === cargaHorariaId);
  
    if (cargaHorariaSeleccionada?.cantidad === 40) {
      // Si la carga horaria es 40, habilitar adicional y hacerlo obligatorio
      this.legajoForm.get('adicional')?.enable();
      this.legajoForm.get('adicional')?.setValidators([Validators.required]);
    } else {
      // Si la carga horaria no es 40, deshabilitar adicional y limpiarlo
      this.legajoForm.get('adicional')?.disable();
      this.legajoForm.get('adicional')?.setValue(null);
      this.legajoForm.get('adicional')?.clearValidators(); // Limpiar validaciones
    }
  
    // Actualizar la validez de 'adicional' después de modificar los validadores
    this.legajoForm.get('adicional')?.updateValueAndValidity();
  }

  initializeCargaHorariaAndAdicional(): void {
    const categoriaNombre = this.initialData?.revista?.categoria?.nombre; 
    const cargaHorariaId = this.initialData?.revista?.cargaHoraria?.id;
    const adicionalId = this.initialData?.revista?.adicional?.id;
  
    // Asignar los valores iniciales al formulario
    this.legajoForm.patchValue({
      cargaHoraria: cargaHorariaId,
      adicional: adicionalId
    });
  
    // Filtrar las opciones de cargaHoraria según la categoría seleccionada
    if (categoriaNombre === "24 HS") {
      // Si la categoría es "24 HS", solo mostrar la opción con cantidad 24
      this.filteredCargasHorarias = this.cargasHorarias.filter(ch => ch.cantidad === 24);
    } else {
      // Si no es "24 HS", mostrar todas las opciones excepto la de cantidad 24
      this.filteredCargasHorarias = this.cargasHorarias.filter(ch => ch.cantidad !== 24);
    }
  
    // Asegurarse de que cargaHoraria esté habilitado
    this.legajoForm.get('cargaHoraria')?.enable();
  
    // Habilitar/deshabilitar el campo adicional según cargaHoraria
    this.legajoForm.get('cargaHoraria')?.valueChanges.subscribe((cargaHorariaId: number | null) => {
      // Si el valor de cargaHoraria es undefined, lo tratamos como null
      this.updateAdicionalState(cargaHorariaId ?? null);
    });
  }

  onHospitalesChange(event: any): void {
  this.selectedHospitals = event.value; // Obtener los hospitales seleccionados
  this.updateCombinedValues();
  
  // 🔥 FORZAR REVALIDACIÓN EN EDIT
  this.legajoForm.get('habilitacionesGuardiasHospital')?.updateValueAndValidity();
  this.legajoForm.get('habilitacionesGuardiasCaps')?.updateValueAndValidity();
  this.legajoForm.updateValueAndValidity();
}

   onHospitalesChangeGeneral(event: any): void {
    this.selectedHospitalsGeneral = event.value; // Obtener los hospitales seleccionados
    this.updateCombinedValuesGeneral();
  }

onHospitalesCapsChange(event: any): void {
    this.selectedHospitalsCaps = event.value; // Obtener los hospitales seleccionados para CAPS
    this.updateCapsBySelectedHospitals();
    this.updateCombinedValues();
  }

onHospitalesCapsChangeGeneral(event: any): void {
    this.selectedHospitalsCapsGeneral = event.value; // Obtener los hospitales seleccionados para CAPS
    this.updateCapsBySelectedHospitalsGeneral();
    this.updateCombinedValuesGeneral();
  }

private updateCapsBySelectedHospitals(): void {
  // Reiniciar la lista de CAPS al cambiar los hospitales seleccionados
  this.caps = [];

  if (this.selectedHospitalsCaps && this.selectedHospitalsCaps.length > 0) {
    this.selectedHospitalsCaps.forEach((hospitalId: number) => {
      if (hospitalId !== undefined) {
        this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(
          (data) => {
            // Filtrar CAPS únicos para evitar duplicados
            const nuevosCaps = data.filter(
              (cap) => !this.caps.some((existingCap) => existingCap.id === cap.id)
            );
            this.caps = [...this.caps, ...nuevosCaps];

            // Actualizar la lista de CAPS seleccionados si ya no están disponibles
            this.selectedCaps = this.selectedCaps.filter((cap) =>
              this.caps.some((existingCap) => existingCap.id === cap)
            );

            // Notificar si un hospital no tiene CAPS
            if (data.length === 0) {
              this.toastr.warning(
                `El hospital con ID ${hospitalId} no posee CAPS registrados.`,
                'Sin datos'
              );
            }

            // Actualizar el formulario reactivo con la nueva lista de CAPS seleccionados
            this.legajoForm.patchValue({
              habilitacionesGuardiasCaps: this.selectedCaps,
            });
          },
          (error) => {
            console.error(error);
            this.toastr.error(
              `Error al cargar los CAPS del hospital con ID ${hospitalId}.`,
              'Error'
            );
          }
        );
      }
    });
  }
}

private updateCapsBySelectedHospitalsGeneral(): void {
  // Reiniciar la lista de CAPS al cambiar los hospitales seleccionados
  this.caps = [];

  if (this.selectedHospitalsCapsGeneral && this.selectedHospitalsCapsGeneral.length > 0) {
    this.selectedHospitalsCapsGeneral.forEach((hospitalId: number) => {
      if (hospitalId !== undefined) {
        this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(
          (data) => {
            // Filtrar CAPS únicos para evitar duplicados
            const nuevosCaps = data.filter(
              (cap) => !this.caps.some((existingCap) => existingCap.id === cap.id)
            );
            this.caps = [...this.caps, ...nuevosCaps];

            // Actualizar la lista de CAPS seleccionados si ya no están disponibles
            this.selectedCapsGeneral = this.selectedCapsGeneral.filter((cap) =>
              this.caps.some((existingCap) => existingCap.id === cap)
            );

            // Notificar si un hospital no tiene CAPS
            if (data.length === 0) {
              this.toastr.warning(
                `El hospital con ID ${hospitalId} no posee CAPS registrados.`,
                'Sin datos'
              );
            }

            // Actualizar el formulario reactivo con la nueva lista de CAPS seleccionados
            this.legajoForm.patchValue({
              habilitacionesGeneralesCaps: this.selectedCapsGeneral
            });
          },
          (error) => {
            console.error(error);
            this.toastr.error(
              `Error al cargar los CAPS del hospital con ID ${hospitalId}.`,
              'Error'
            );
          }
        );
      }
    });
  }
}

  onCapsChange(event: any): void {
  // Actualiza la selección de CAPS en el formulario
  this.selectedCaps = event.value;

  // Eliminar CAPS que no estén disponibles en la lista actual de CAPS
  this.selectedCaps = this.selectedCaps.filter((cap) =>
    this.caps.some((existingCap) => existingCap.id === cap)
  );

  this.updateCombinedValues();
  this.legajoForm.updateValueAndValidity();
  
  // 🔥 FORZAR REVALIDACIÓN EN EDIT
  this.legajoForm.get('habilitacionesGuardiasHospital')?.updateValueAndValidity();
  this.legajoForm.get('habilitacionesGuardiasCaps')?.updateValueAndValidity();
}

  onCapsChangeGeneral(event: any): void {
  // Actualiza la selección de CAPS en el formulario
   this.selectedCapsGeneral = event.value;

  // Eliminar CAPS que no estén disponibles en la lista actual de CAPS
   this.selectedCapsGeneral = this.selectedCapsGeneral.filter((cap) =>
    this.caps.some((existingCap) => existingCap.id === cap)
  );

  this.updateCombinedValuesGeneral();
   this.legajoForm.updateValueAndValidity();
}



private updateCombinedValues(): void {
  // Crear un conjunto para almacenar los valores combinados actualizados
  const updatedCombinedValues = new Set();

 
    // Obtener hospitales seleccionados
 
  const selectedHospitalsGuardias = this.legajoForm.get('habilitacionesGuardiasHospital')?.value || [];
  this.selectedHospitals = [ ...selectedHospitalsGuardias];
  this.selectedHospitals.forEach((hospital: any) => updatedCombinedValues.add(hospital));

  // Obtener CAPS seleccionados
  
  const selectedCapsGuardias = this.legajoForm.get('habilitacionesGuardiasCaps')?.value || [];
  this.selectedCaps = [ ...selectedCapsGuardias];
  this.selectedCaps.forEach((cap: any) => updatedCombinedValues.add(cap));

  // Agregar valores iniciales (solo si están seleccionados en hospitales o CAPS)
  this.initialHabilitacionesGuardias.forEach((efector: any) => {
    if (
      this.selectedHospitals.includes(efector) ||
      this.selectedCaps.includes(efector)
    ) {
      updatedCombinedValues.add(efector);
    }
  });

  // Eliminar valores actuales que no están en hospitales, CAPS o iniciales
  const currentValues = this.legajoForm.get('habilitacionesGuardias')?.value || [];
  currentValues.forEach((efector: any) => {
    if (
      !this.selectedHospitals.includes(efector) &&
      !this.selectedCaps.includes(efector) &&
      !this.initialHabilitacionesGuardias.includes(efector) 
    ) {
      updatedCombinedValues.delete(efector);
    }
  });

  // Establecer el nuevo valor combinado en el formulario
  this.legajoForm.patchValue({
    habilitacionesGuardias: Array.from(updatedCombinedValues),
  });

}

private updateCombinedValuesGeneral(): void {
  // Crear un conjunto para almacenar los valores combinados actualizados
  const updatedCombinedValuesGeneral = new Set();

 
    // Obtener hospitales seleccionados
  const selectedHospitalsGenerales = this.legajoForm.get('habilitacionesGeneralesHospital')?.value || [];
  this.selectedHospitalsGeneral = [...selectedHospitalsGenerales];
  this.selectedHospitalsGeneral.forEach((hospital: any) => updatedCombinedValuesGeneral.add(hospital));

  // Obtener CAPS seleccionados
 const selectedCapsGenerales = this.legajoForm.get('habilitacionesGeneralesCaps')?.value || [];
  this.selectedCapsGeneral = [...selectedCapsGenerales];
  this.selectedCapsGeneral.forEach((cap: any) => updatedCombinedValuesGeneral.add(cap));

  // Agregar valores iniciales (solo si están seleccionados en hospitales o CAPS)
  this.initialHabilitacionesGenerales.forEach((efector: any) => {
    if (
      this.selectedHospitalsGeneral.includes(efector) ||
      this.selectedCapsGeneral.includes(efector)
    ) {
      updatedCombinedValuesGeneral.add(efector);
    }
  });
  
  // Eliminar valores actuales que no están en hospitales, CAPS o iniciales
  const currentValuesGeneral = this.legajoForm.get('habilitacionesGenerales')?.value || [];
  currentValuesGeneral.forEach((efector: any) => {
    if (
      !this.selectedHospitalsGeneral.includes(efector) &&
      !this.selectedCapsGeneral.includes(efector) &&
      !this.initialHabilitacionesGenerales.includes(efector) 
    ) {
      updatedCombinedValuesGeneral.delete(efector);
    }
  });

  // Establecer el nuevo valor combinado en el formulario
  this.legajoForm.patchValue({
    habilitacionesGenerales: Array.from(updatedCombinedValuesGeneral)
  });

}

private isHospital(id: number): boolean {
  // Verifica si el ID pertenece a un hospital basado en los efectores filtrados
  return this.getEfectoresFiltrados().some((hospital: any) => hospital.id === id);
}


  // Manejar cambios en tipoUdo
 onTipoUdoChange(event: any): void {
  const tipoUdo = event.value;
  this.tipoUdo = tipoUdo;


  if (tipoUdo === 'MINISTERIO') {
    // Ministerio: asignar lista ministerios
    this.udoOptions = this.ministerios || [];
  } else if (tipoUdo === 'HOSPITAL') {
    // Hospital: obtener UDOs filtrados
    const hospitalesFiltrados = this.getEfectoresFiltrados();
    if (hospitalesFiltrados.length > 0) {
      this.udoOptions = hospitalesFiltrados;
    } 
  } else if (tipoUdo === 'CAPS') {
    // CAPS: validar si los CAPS están cargados
    if (this.caps?.length > 0) {
      this.udoOptions = this.caps;
    } else {
      // Intentar cargar los CAPS desde el hospital seleccionado
      const hospitalId = this.legajoForm.get('hospitalUdo')?.value;
      if (hospitalId) {
        this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(
          (data) => {
            this.caps = data;
            this.udoOptions = this.caps;

            if (this.caps.length === 0) {
              this.toastr.warning('El hospital seleccionado no tiene CAPS registrados.', 'Sin datos');
            }
          },
          (error) => {
            console.error(error);
            this.toastr.error('Ocurrió un error al cargar los CAPS.', 'Error');
          }
        );
      } 
    }
  }

  // Evitar errores reseteando el control UDO
  this.legajoForm.get('udo')?.reset();

  // Guardar el valor actual de 'hospitalUdo' antes de reiniciarlo
  if (tipoUdo !== 'CAPS') {
    this.previousHospitalUdo = this.legajoForm.get('hospitalUdo')?.value;
    this.legajoForm.get('hospitalUdo')?.reset();
  }

  // Restaurar el valor de 'hospitalUdo' si el tipo vuelve a ser CAPS
  if (tipoUdo === 'CAPS' && this.previousHospitalUdo) {
    this.legajoForm.get('hospitalUdo')?.setValue(this.previousHospitalUdo);
    this.legajoForm.get('udo')?.reset();
  }

  // Verificar si hospitalUdo tiene un valor inicial cargado desde el backend
  const hospitalUdoValue = this.legajoForm.get('hospitalUdo')?.value;
  if (hospitalUdoValue) {

    this.onHospitalUdoChange({ value: hospitalUdoValue });
  }

}

  // Cargar CAPS correspondientes al hospital seleccionado
  onHospitalUdoChange(event: any): void {
    const hospitalId = event.value;

    this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(data => {
      this.caps = data; // Guardamos la lista de CAPS para mostrar en el select de UDO
      this.udoOptions = this.caps; // Asignamos los CAPS al select de UDO
      this.legajoForm.get('udo')?.reset(); // Limpiar la selección actual de UDO
      // Si no se encuentran CAPS, mostrar un mensaje de Toastr
      if (this.caps.length === 0) {
        this.toastr.error('El hospital seleccionado no posee ningún CAPS registrado.', 'Sin datos', {
          timeOut: 9000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }

    }, error => {
      console.log(error);
      this.toastr.error('Ocurrió un error al cargar los CAPS.', 'Error');  // Mostrar mensaje de error en caso de fallo
    });
  }

  // Método para cambiar las opciones de la seleccion de efector
 onTipoEfectorChange(event: any): void {
  const tipoEfector = event.value;
  this.tipoEfector = tipoEfector;

  if (tipoEfector === 'MINISTERIO') {
    // Ministerio: asignar lista ministerios
    this.efectorOptions = this.ministerios || [];
  } else if (tipoEfector === 'HOSPITAL') {
    // Hospital: obtener efectores filtrados
    const efectoresFiltrados = this.getEfectoresFiltrados();
    if (efectoresFiltrados.length > 0) {
      this.efectorOptions = efectoresFiltrados;
    } else {
      this.toastr.warning('No hay efectores disponibles para hospitales.', 'Advertencia');
      this.efectorOptions = [];
    }
  } else if (tipoEfector === 'CAPS') {
    // CAPS: validar si los CAPS están cargados
    if (this.caps?.length > 0) {
      this.efectorOptions = this.caps;
    } else {
      // Intentar cargar los CAPS desde el hospital seleccionado
      const hospitalId = this.legajoForm.get('hospitalEfectores')?.value;
      if (hospitalId) {
        this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(
          (data) => {
            this.caps = data;
            this.efectorOptions = this.caps;

            if (this.caps.length === 0) {
              this.toastr.warning('El hospital seleccionado no tiene CAPS registrados.', 'Sin datos');
            }
          },
          (error) => {
            console.error(error);
            this.toastr.error('Ocurrió un error al cargar los CAPS.', 'Error');
          }
        );
      } else {
        this.toastr.warning('Seleccione un hospital para cargar los CAPS.', 'Advertencia');
        this.efectorOptions = [];
      }
    }
  } 

  // Evitar errores reseteando el control efectores
  this.legajoForm.get('efectores')?.reset();

}
  // Método para cargar los CAPS correspondientes al hospital seleccionado
  onHospitalEfectorChange(event: any): void {
    const hospitalId = event.value;
    
    this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(data => {
      this.caps = data; // Guardamos la lista de CAPS para mostrar en el select de UDO
      this.efectorOptions = this.caps; // Asignamos los CAPS al select de UDO
      this.legajoForm.get('efectores')?.reset(); // Limpiar la selección actual de UDO

      // Si no se encuentran CAPS, mostrar un mensaje de Toastr
      if (this.caps.length === 0) {
        this.toastr.error('El hospital seleccionado no posee ningún CAPS registrado.', 'Sin datos', {
          timeOut: 9000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }

    }, error => {
      console.log(error);
      this.toastr.error('Ocurrió un error al cargar los CAPS.', 'Error');  // Mostrar mensaje de error en caso de fallo
    });
  }

  // Método para cargar los CAPS correspondientes al hospital seleccionado
 onHospitalHabilitacionesGuardiasChange(event: any): void {
  const previousHospitalIds = [...(this.selectedHospitalsGuardias || [])];
  const selectedHospitalIds = event.value || [];
  
  this.selectedHospitalsGuardias = selectedHospitalIds;
  this.legajoForm.patchValue({ hospitalHabilitacionesGuardias: selectedHospitalIds });

  // 🔥 SI NO HAY HOSPITALES SELECCIONADOS, LIMPIAR TODO
  if (selectedHospitalIds.length === 0) {
    this.caps = [];
    this.habilitacionesGuardiasCaps = [];
    this.legajoForm.get('habilitacionesGuardiasCaps')?.reset();
    this.selectedCaps = [];
    this.toastr.warning('Debe seleccionar al menos un hospital para listar CAPS.', 'Advertencia');
    return;
  }

  const removedHospitalIds = previousHospitalIds.filter(id => !selectedHospitalIds.includes(id));
  const addedHospitalIds = selectedHospitalIds.filter((id: number) => !previousHospitalIds.includes(id));
  
  const currentCaps = this.legajoForm.get('habilitacionesGuardiasCaps')?.value || [];

  // 🔥 ELIMINAR CAPS DE HOSPITALES DESELECCIONADOS
  if (removedHospitalIds.length > 0) {
    
    const promesasEliminacion = removedHospitalIds.map((hospitalId: number) => {
      return this.hospitalService.listActiveCapsByHospitalId(hospitalId).toPromise()
        .then((capsToRemove) => {
          // 🔥 VERIFICACIÓN DE UNDEFINED - AQUÍ ESTÁ LA CORRECCIÓN
          if (!capsToRemove || !Array.isArray(capsToRemove)) {
            console.warn(`⚠️ No se encontraron CAPS para el hospital ${hospitalId} o la respuesta es inválida`);
            return currentCaps; // Retornar CAPS actuales si no hay datos válidos
          }
          
          const capsToRemoveIds = capsToRemove.map((cap: any) => cap.id);
          
          // Filtrar CAPS actuales para eliminar los que pertenecen al hospital deseleccionado
          const filteredCaps = currentCaps.filter((capId: number) => !capsToRemoveIds.includes(capId));
          
          // Actualizar listas internas
          this.habilitacionesGuardiasCaps = this.habilitacionesGuardiasCaps.filter(
            (cap: any) => !capsToRemoveIds.includes(cap.id)
          );
          
          this.caps = this.caps.filter(
            (cap: any) => !capsToRemoveIds.includes(cap.id)
          );
          
          return filteredCaps;
        })
        .catch((error) => {
          console.error(`❌ Error al obtener CAPS del hospital ${hospitalId}:`, error);
          return currentCaps; // Retornar CAPS actuales si hay error
        });
    });

    Promise.all(promesasEliminacion).then((resultados) => {
      const capsFinales = resultados[resultados.length - 1] || [];
      this.legajoForm.patchValue({ habilitacionesGuardiasCaps: capsFinales });
      this.selectedCaps = capsFinales;
      this.updateCombinedValues();
    });
  }

  // 🔥 AGREGAR CAPS DE HOSPITALES NUEVAMENTE SELECCIONADOS
  if (addedHospitalIds.length > 0) {
    
    const promesasAdicion = addedHospitalIds.map((hospitalId: number) => {
      
      return this.hospitalService.listActiveCapsByHospitalId(hospitalId).toPromise()
        .then((data) => {
          // 🔥 VERIFICACIÓN DE UNDEFINED TAMBIÉN AQUÍ
          if (!data || !Array.isArray(data)) {
            console.warn(`⚠️ No se encontraron CAPS para el hospital ${hospitalId} o la respuesta es inválida`);
            this.toastr.warning(
              `El hospital con ID ${hospitalId} no retornó datos válidos de CAPS.`,
              'Sin datos válidos'
            );
            return [];
          }
          
          if (data.length === 0) {
            this.toastr.warning(
              `El hospital con ID ${hospitalId} no posee CAPS registrados.`,
              'Sin datos'
            );
            return [];
          }

          // 🔥 FILTRAR CAPS ÚNICOS PARA EVITAR DUPLICADOS
          const nuevoCaps = data.filter(
            (cap: any) => !this.caps.some((existingCap: any) => existingCap.id === cap.id)
          );
          
          // Agregar a las listas internas
          this.caps = [...this.caps, ...nuevoCaps];
          this.habilitacionesGuardiasCaps = [...this.habilitacionesGuardiasCaps, ...data];
          
          return data;
        })
        .catch((error) => {
          console.error(`❌ Error al cargar CAPS del hospital ${hospitalId}:`, error);
          this.toastr.error(`Error al cargar los CAPS del hospital con ID ${hospitalId}.`, 'Error');
          return [];
        });
    });

    Promise.all(promesasAdicion).then((resultados) => {
    
      // Forzar actualización de la vista
      this.legajoForm.updateValueAndValidity();
    });
  }

  // 🔥 FORZAR ACTUALIZACIÓN FINAL
  setTimeout(() => {
    this.legajoForm.updateValueAndValidity();
  }, 100);
}

  // Método para cargar los CAPS correspondientes al hospital seleccionado
  onHospitalHabilitacionesGeneralesChange(event: any): void {
  const previousHospitalIds = [...(this.selectedHospitalsGenerales || [])];
  const selectedHospitalIds = event.value || [];

  this.selectedHospitalsGenerales = selectedHospitalIds;
  this.legajoForm.patchValue({ hospitalHabilitacionesGenerales: selectedHospitalIds });

  // Si no hay hospitales seleccionados, limpiar todo
  if (selectedHospitalIds.length === 0) {
    this.caps = [];
    this.habilitacionesGeneralesCaps = [];
    this.legajoForm.get('habilitacionesGeneralesCaps')?.reset();
    this.toastr.warning('Debe seleccionar al menos un hospital para listar CAPS.', 'Advertencia');
    return;
  }

  const removedHospitalIds = previousHospitalIds.filter(id => !selectedHospitalIds.includes(id));
  const addedHospitalIds = selectedHospitalIds.filter((id: number) => !previousHospitalIds.includes(id));

  const currentCaps = this.legajoForm.get('habilitacionesGeneralesCaps')?.value || [];

  // 🔴 Eliminar CAPS de hospitales deseleccionados
  removedHospitalIds.forEach((hospitalId: number) => {
    this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(
      (capsToRemove) => {
        // 🔥 VERIFICACIÓN DE UNDEFINED
        if (!capsToRemove || !Array.isArray(capsToRemove)) {
          console.warn(`⚠️ No se encontraron CAPS para el hospital ${hospitalId} o la respuesta es inválida`);
          return;
        }

        const capsToRemoveIds = capsToRemove.map((cap: any) => cap.id);

        // Actualizar valor del formulario
        const filteredCaps = currentCaps.filter((capId: number) => !capsToRemoveIds.includes(capId));
        this.legajoForm.patchValue({ habilitacionesGeneralesCaps: filteredCaps });

        // Eliminar de listas internas
        this.caps = this.caps.filter(cap => !capsToRemoveIds.includes(cap.id));
        this.habilitacionesGeneralesCaps = this.habilitacionesGeneralesCaps.filter(cap => !capsToRemoveIds.includes(cap.id));

        this.updateCombinedValuesGeneral();
      },
      (error) => {
        console.error(`❌ Error al obtener CAPS del hospital ${hospitalId}:`, error);
        this.toastr.error('Error al limpiar los CAPS de hospitales deseleccionados.', 'Error');
      }
    );
  });

  // 🟢 Agregar CAPS de hospitales recién seleccionados
  addedHospitalIds.forEach((hospitalId: number) => {
    this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(
      (caps) => {
        // 🔥 VERIFICACIÓN DE UNDEFINED
        if (!caps || !Array.isArray(caps)) {
          console.warn(`⚠️ No se encontraron CAPS para el hospital ${hospitalId} o la respuesta es inválida`);
          this.toastr.warning(`El hospital con ID ${hospitalId} no retornó datos válidos de CAPS.`, 'Sin datos válidos');
          return;
        }

        if (caps.length === 0) {
          this.toastr.warning(`El hospital con ID ${hospitalId} no posee CAPS registrados.`, 'Sin datos');
          return;
        }

        // Evitar duplicados por ID
        const nuevosCaps = caps.filter(
          (cap: any) => !this.caps.some((existing: any) => existing.id === cap.id)
        );

        this.caps = [...this.caps, ...nuevosCaps];
        this.habilitacionesGeneralesCaps = [...this.habilitacionesGeneralesCaps, ...nuevosCaps];
      },
      (error) => {
        console.error(`❌ Error al cargar CAPS del hospital ${hospitalId}:`, error);
        this.toastr.error('Ocurrió un error al cargar los CAPS.', 'Error');
      }
    );
  });

  this.legajoForm.updateValueAndValidity();
}



  // Método para cambiar las opciones de la selección de efector
  onTipoEfectorCargoChange(event: any): void {
    const tipoEfectorCargo = event.value;
    this.tipoEfectorCargo = tipoEfectorCargo;

    // Dependiendo del valor seleccionado, asignamos los datos adecuados al segundo select
    if (tipoEfectorCargo === 'MINISTERIO') { // Ministerio
      this.efectorCargoOptions = this.ministerios || [];
    } else if (tipoEfectorCargo === 'HOSPITAL') { // Hospital
      const efectoresFiltrados = this.getEfectoresFiltrados();
      if (efectoresFiltrados.length > 0) {
        this.efectorCargoOptions = efectoresFiltrados;
      }else {
        this.toastr.warning('No hay efectores disponibles para hospitales.', 'Advertencia');
        this.efectorCargoOptions = []; // Vaciar opciones
      }
    } else if (tipoEfectorCargo === 'CAPS') { // CAPS
      if (this.caps?.length > 0) {
        this.efectorCargoOptions = this.caps;
      } else {
        // Intentar cargar los CAPS desde el hospital seleccionado
        const hospitalId = this.legajoForm.get('hospitalEfectorCargo')?.value;
        if (hospitalId) {
          this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(
            (data) => {
              this.caps = data;
              this.efectorCargoOptions = this.caps;

              if (this.caps.length === 0) {
                this.toastr.warning('El hospital seleccionado no tiene CAPS registrados.', 'Sin datos');
              }
            },
            (error) => {
              console.error(error);
              this.toastr.error('Ocurrió un error al cargar los CAPS.', 'Error');
            }
          );
        } else {
          this.toastr.warning('Seleccione un hospital para cargar los CAPS.', 'Advertencia');
          this.efectorCargoOptions = [];
        }
      }

    // Habilitar el select de "efectoresAutoridad" después de haber elegido un tipo de efector
    const efectorControl = this.legajoForm.get('efectoresAutoridad');
    if (efectorControl) {
      efectorControl.enable(); // Habilitar el select de efector
    }

    // Restablecer el valor de 'efectoresAutoridad' para evitar errores si la selección actual no es válida
    this.legajoForm.get('efectoresAutoridad')?.reset();
    this.legajoForm.get('hospitalesEfectoresCargo')?.reset();
  }
}

  // Método para cargar los CAPS correspondientes al hospital seleccionado
  onHospitalEfectorCargoChange(event: any): void {
    const hospitalId = event.value;
    
    this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(data => {
      this.caps = data; // Guardamos la lista de CAPS para mostrar en el select de UDO
      this.efectorCargoOptions = this.caps; // Asignamos los CAPS al select de UDO
      this.legajoForm.get('efectoresAutoridad')?.reset(); // Limpiar la selección actual de UDO

      // Si no se encuentran CAPS, mostrar un mensaje de Toastr
      if (this.caps.length === 0) {
        this.toastr.error('El hospital seleccionado no posee ningún CAPS registrado.', 'Sin datos', {
          timeOut: 9000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }

    }, error => {
      console.log(error);
      this.toastr.error('Ocurrió un error al cargar los CAPS.', 'Error');  // Mostrar mensaje de error en caso de fallo
    });
  }

  //Form Datos legajo: si es un legajo tipo autoridad (esAutoridad) impide cargar tipoGuardia y habilita cargo
  onAutoridadChange(esAutoridad: boolean): void {
    const idCargoControl = this.legajoForm.get('idCargo');
    const idNroResolucionControl = this.legajoForm.get('nroResolucion');
    const idNroDecretoControl = this.legajoForm.get('nroDecreto');
    const idFechaResolucionControl = this.legajoForm.get('fechaResolucion');
    const idRegionControl = this.legajoForm.get('idRegion');
    const tipoGuardiasControl = this.legajoForm.get('tipoGuardias');
    const efectoresAutoridadControl = this.legajoForm.get('efectoresAutoridad');
    const habilitacionesGeneralesControl = this.legajoForm.get('habilitacionesGenerales');
    const habilitacionesGuardiasControl = this.legajoForm.get('habilitacionesGuardias');
  
    
    // Cuando cambia idAutoridad reseteo el valor de idCargo, tipoGuardia e idRegion; tambien oculto y hago no obligatorio idRegional
    idCargoControl?.reset();
    idNroResolucionControl?.reset();
    idNroDecretoControl?.reset();
    idFechaResolucionControl?.reset();
    tipoGuardiasControl?.reset();
    idRegionControl?.reset();
    efectoresAutoridadControl?.reset();
    habilitacionesGeneralesControl?.reset();
    habilitacionesGuardiasControl?.reset();
   
    this.showEfectorAutoridad = false;
    this.legajoForm.get('efectoresAutoridad')?.clearValidators();
    this.showEfectorAutoridad = false;
    this.showRegion = false;
    this.legajoForm.get('idRegion')?.clearValidators();
    this.showHabilitacionesGenerales = false;
    this.legajoForm.get('habilitacionesGenerales')?.clearValidators();
    this.showHabilitacionesGuardias = false;
    this.legajoForm.get('habilitacionesGuardias')?.clearValidators();
    this.showHabilitacionesGuardias = false;
    this.legajoForm.get('habilitacionesGuardias')?.clearValidators();

    
    // Mostrar/ocultar el campo 'idCargo' y tipoGuardia basado en 'esAutoridad'
    if (esAutoridad) {
      // Si es autoridad muestro idCargo y oculto tipoGuardia y situacion de revista
      this.showSiEsAutoridad = true;
      idCargoControl?.enable();
      this.legajoForm.get('idCargo')?.setValidators([Validators.required]);
      idNroResolucionControl?.enable();
      this.legajoForm.get('nroResolucion')?.setValidators([Validators.required, Validators.pattern('^[0-9]{1,5}$')]);
      idNroDecretoControl?.enable();
      this.legajoForm.get('nroDecreto')?.setValidators([Validators.required, Validators.pattern('^[0-9]{1,5}$')]);
      idFechaResolucionControl?.enable();
      this.legajoForm.get('fechaResolucion')?.setValidators([Validators.required]);
      this.showGuardia = false;
      this.legajoForm.get('tipoGuardias')?.clearValidators();
      this.isSituacionRevistaEnabled = false;
      this.disableSituacionRevistaFields();
      this.legajoForm.setValidators(this.alMenosUnoRequeridoValidator());
    } else {
      // Si no es autoridad oculto idCargo y muestro tipoGuardia haciendola obligatoria
      this.showSiEsAutoridad = false;
      idCargoControl?.disable();
      idCargoControl?.clearValidators(); // Remuevo validadores si no es autoridad
      idNroResolucionControl?.disable();
      idNroResolucionControl?.clearValidators(); // Remuevo validadores si no es autoridad
      idNroDecretoControl?.disable();
      idNroDecretoControl?.clearValidators(); // Remuevo validadores si no es autoridad
      idFechaResolucionControl?.disable();
      idFechaResolucionControl?.clearValidators(); // Remuevo validadores si no es autoridad
   
      this.showGuardia = true;
      this.legajoForm.get('tipoGuardias')?.setValidators([Validators.required]);      
    }
  
    // Actualizo la validez de los campos después de modificar los validadores y visibilidad
    idCargoControl?.updateValueAndValidity();
    idNroResolucionControl?.updateValueAndValidity();
    idNroDecretoControl?.updateValueAndValidity();
    idFechaResolucionControl?.updateValueAndValidity();
  }
  
  onCargoChange(): void {
  const esAutoridad = this.legajoForm.get('esAutoridad')?.value; 
  if (!esAutoridad) {
    return;
  }
  
  const cargoSeleccionado = this.legajoForm.get('idCargo')?.value;
  const idRegionControl = this.legajoForm.get('idRegion');
  const efectoresAutoridadControl = this.legajoForm.get('efectoresAutoridad');
  const habilitacionesGeneralesControl = this.legajoForm.get('habilitacionesGenerales');

  if (cargoSeleccionado === this.idDirectorRegional) {

    this.showRegion = true;
    this.legajoForm.get('idRegion')?.setValidators([Validators.required]);
    this.showEfectorAutoridad = false;
    this.legajoForm.get('efectoresAutoridad')?.clearValidators();
    efectoresAutoridadControl?.reset();
    this.showHabilitacionesGenerales = false;
    this.legajoForm.get('habilitacionesGenerales')?.clearValidators();
    habilitacionesGeneralesControl?.reset();
  } else {

    this.showRegion = false;
    idRegionControl?.reset();
    this.legajoForm.get('idRegion')?.clearValidators();
    this.showEfectorAutoridad = true;
    this.legajoForm.get('efectoresAutoridad')?.setValidators([Validators.required]);
    this.showHabilitacionesGenerales = true;
    this.legajoForm.get('habilitacionesGenerales')?.setValidators([Validators.required]);
  }

  this.legajoForm.get('idRegion')?.updateValueAndValidity();
  
  // 🎯 EVALUAR ESTADO DE DIRECTOR REGIONAL DESPUÉS DE CAMBIOS
  setTimeout(() => {
    this.evaluarEstadoDirectorRegional();
  }, 100);
}

  // Form Datos profesional: Manejo de la seleccion de profesiones y especialidades
  filterEspecialidadesByProfesion(profesionId: number): void {
    this.especialidadService.list().subscribe(data => {
      this.especialidades = data.filter(especialidad => especialidad.profesion.id === profesionId);
  
      if (this.especialidades.length > 0) {
        this.legajoForm.get('especialidades')?.enable();
        this.noEspecialidadesMessage = '';
      } else {
        this.legajoForm.get('especialidades')?.disable();
        this.noEspecialidadesMessage = 'La profesión seleccionada no posee especialidades.';
      }
    }, error => {

      this.legajoForm.get('especialidades')?.disable();
      this.noEspecialidadesMessage = 'Error al cargar las especialidades. Intente nuevamente.';
    });
  }

  onTipoGuardiaSelectionChange(event: any): void {
  
    const selectedValues = this.legajoForm.get('tipoGuardias')!.value;
  
    // Si el usuario es ADMIN, solo puede seleccionar los tipos CARGO, AGRUPACION Y EXTRA (sin CF)
    if (this.isAdministrativo) {
      // Filtra los valores seleccionados, asegurando que no incluya CF ni PASIVA
      this.legajoForm.patchValue({
        tipoGuardias: selectedValues.filter((value: number) => value !== this.idContraFactura)
      });
    }
  
    // Si el usuario es DPH, puede seleccionar todos los tipos de guardia
    else if (this.isDph || this.isSuper) {
      // No hay restricción, los valores seleccionados se mantienen como están
      // Esto permite seleccionar cualquier combinación de tipos de guardia
      if (selectedValues.includes(this.idContraFactura)) {
        this.legajoForm.patchValue({
          tipoGuardias: [this.idContraFactura]  // Si el tipo CF es seleccionado, solo mantener el tipo CF
        });
      } else {
        // Mantener solo los tipos 1, 2, 3 y 4 si no se seleccionan CF
        this.legajoForm.patchValue({
          tipoGuardias: selectedValues.filter((value: number) => value !== this.idContraFactura)
        });
      }
    }
  
    // Si el usuario no es ni ADMIN ni DPH, se restringen los tipos de guardia a CARGO, AGRUPACION, EXTRA y PASIVA
    else {
      // Restringir la selección solo a los tipos CARGO, AGRUPACION, EXTRA y PASIVA
      this.legajoForm.patchValue({
        tipoGuardias: selectedValues.filter((value: number) => value !== this.idContraFactura)
      });
    }
  
    // Comprobar si se seleccionó tipo de guardia CF para deshabilitar el panel de Situación de Revista
    this.toggleSituacionRevista(selectedValues);
  }
  
  onGuardiaCfExtra(selectedValues: number[]): void {
  const esAutoridad = this.legajoForm.get('esAutoridad')?.value;
  
  // 🎯 SOLO EJECUTAR SI NO ES AUTORIDAD
  if (esAutoridad) {
    return; // Salir del método si es autoridad
  }
  
  const HabilitacionesGuardiasControl = this.legajoForm.get('habilitacionesGuardias');

  // Comprobamos si ya estaba habilitado antes de cambiarlo
  const estabaHabilitado = this.showHabilitacionesGuardias;

  // Si se selecciona CONTRAFACTURA, EXTRA O PASIVA habilita HabilitacionesGuardias
  if (selectedValues.includes(this.idContraFactura!) || selectedValues.includes(this.idExtra!) || selectedValues.includes(this.idPasiva!)) {
  
    this.showHabilitacionesGuardias = true;
    
    // 🔥 ESTABLECER VALIDADORES ESPECÍFICOS PARA HABILITACIONES DE GUARDIAS EN EDIT
    this.legajoForm.get('habilitacionesGuardias')?.setValidators([Validators.required]);
    this.legajoForm.get('habilitacionesGuardiasHospital')?.setValidators([this.alMenosUnoHabilitacionesGuardiasValidatorEdit()]);
    this.legajoForm.get('habilitacionesGuardiasCaps')?.setValidators([this.alMenosUnoHabilitacionesGuardiasValidatorEdit()]);
    
  } else if (!estabaHabilitado) { 
    // Solo lo deshabilitamos si antes no estaba habilitado
    this.showHabilitacionesGuardias = false;
    HabilitacionesGuardiasControl?.reset();
    this.legajoForm.get('habilitacionesGuardias')?.clearValidators();
    
    // 🔥 LIMPIAR VALIDADORES ESPECÍFICOS EN EDIT
    this.legajoForm.get('habilitacionesGuardiasHospital')?.clearValidators();
    this.legajoForm.get('habilitacionesGuardiasCaps')?.clearValidators();
    
    // 🎯 RESETEAR TAMBIÉN CAMPOS RELACIONADOS
    this.legajoForm.get('habilitacionesGuardiasHospital')?.reset();
    this.legajoForm.get('hospitalHabilitacionesGuardias')?.reset();
    this.legajoForm.get('habilitacionesGuardiasCaps')?.reset();
    this.selectedHospitals = [];
    this.selectedCaps = [];
    this.habilitacionesGuardiasCaps = [];
  }

  // 🔥 ACTUALIZAR VALIDADORES DEL FORMULARIO COMPLETO EN EDIT
  this.legajoForm.updateValueAndValidity();
  this.legajoForm.get('habilitacionesGuardias')?.updateValueAndValidity();
  this.legajoForm.get('habilitacionesGuardiasHospital')?.updateValueAndValidity();
  this.legajoForm.get('habilitacionesGuardiasCaps')?.updateValueAndValidity();

}

alMenosUnoHabilitacionesGuardiasValidatorEdit(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!this.showHabilitacionesGuardias) {
      return null; // No validar si no se muestran las habilitaciones
    }

    const habilitacionesHospital = this.legajoForm?.get('habilitacionesGuardiasHospital')?.value;
    const habilitacionesCaps = this.legajoForm?.get('habilitacionesGuardiasCaps')?.value;

    const tieneHospital = Array.isArray(habilitacionesHospital) && habilitacionesHospital.length > 0;
    const tieneCaps = Array.isArray(habilitacionesCaps) && habilitacionesCaps.length > 0;

    // Si no hay ni hospitales ni caps seleccionados
    if (!tieneHospital && !tieneCaps) {
      return { alMenosUnoHabilitacionesGuardiasRequerido: true };
    }

    return null;
  };
}



  onSelectionChange(event: any): void {
    this.onTipoGuardiaSelectionChange(event);
  
    this.onGuardiaCfExtra(event.value);
  }

  //aqui oculto o muestro situacion de revista según la guardia seleccionada
  toggleSituacionRevista(selectedValues: number[]): void {
    // Si se selecciona el tipo 4 o 5, deshabilitar "Situación de Revista"
    if (selectedValues.length === 0 || selectedValues.includes(this.idContraFactura!) /* || selectedValues.includes(this.idPasiva!) */) {
      this.isSituacionRevistaEnabled = false;
      this.disableSituacionRevistaFields();
      this.resetSituacionRevistaFields();
    } else {
      this.isSituacionRevistaEnabled = true;
      this.enableSituacionRevistaFields();
    }
  }

  resetSituacionRevistaFields(): void {
    this.legajoForm.get('agrupacion')?.setValue(null);
    this.legajoForm.get('categoria')?.setValue(null);
    this.legajoForm.get('adicional')?.setValue(null);
    this.legajoForm.get('cargaHoraria')?.setValue(null);
    this.legajoForm.get('tipoRevista')?.setValue(null);
    this.legajoForm.get('udoSelected')?.setValue(null);
    this.legajoForm.get('efectores')?.setValue(null);
  }
      
  disableSituacionRevistaFields(): void {
    this.legajoForm.get('agrupacion')?.disable();
    this.legajoForm.get('categoria')?.disable();
    this.legajoForm.get('adicional')?.disable();
    this.legajoForm.get('cargaHoraria')?.disable();
    this.legajoForm.get('tipoRevista')?.disable();
    this.legajoForm.get('tipoUdo')?.disable();
    this.legajoForm.get('udoSelected')?.disable();
    this.legajoForm.get('hospitalUdo')?.disable();
    this.legajoForm.get('tipoEfector')?.disable();
    this.legajoForm.get('efectores')?.disable();
    this.legajoForm.get('hospitalEfectores')?.disable();
  
  }
  
  enableSituacionRevistaFields(): void {
    this.legajoForm.get('agrupacion')?.enable();
    this.legajoForm.get('categoria')?.enable();
    this.legajoForm.get('adicional')?.enable();
    this.legajoForm.get('cargaHoraria')?.enable();
    this.legajoForm.get('tipoRevista')?.enable();
    this.legajoForm.get('tipoUdo')?.enable();
    this.legajoForm.get('udoSelected')?.enable();
    this.legajoForm.get('hospitalUdo')?.enable();
    this.legajoForm.get('tipoEfector')?.enable();
    this.legajoForm.get('efectores')?.enable();
    this.legajoForm.get('hospitalEfectores')?.enable();

  }
    
  // Form Revista: Función llamada cuando cambia la categoría seleccionada
  onCategoriaChange(): void {
    const categoriaId = this.legajoForm.get('categoria')?.value;
    const categoriaSeleccionada = this.categorias.find(categoria => categoria.id === categoriaId);

    // Si no se selecciona ninguna categoría, deshabilitamos cargaHoraria
    if (!categoriaSeleccionada) {
      this.legajoForm.get('cargaHoraria')?.disable();
      this.legajoForm.get('cargaHoraria')?.setValue(null); // Limpiar el valor de cargaHoraria
      this.filteredCargasHorarias = []; // Limpiamos las opciones de cargaHoraria

      // Deshabilitar adicional y limpiarlo
      this.legajoForm.get('adicional')?.disable();
      this.legajoForm.get('adicional')?.setValue(null);

      // Limpiar validación en adicional
      this.legajoForm.get('adicional')?.clearValidators();
      this.legajoForm.get('adicional')?.updateValueAndValidity();
    } else {
      this.legajoForm.get('cargaHoraria')?.enable(); // Habilitar cargaHoraria
      this.updateCargaHorarias(categoriaSeleccionada.nombre); // Actualizar las opciones de cargaHoraria

      // Llamar a onCargaHorariaChange para verificar el estado de adicional
      this.onCargaHorariaChange();
    }

      // Aseguramos que el formulario se revalide al cambiar la categoría
      this.legajoForm.updateValueAndValidity(); 
    }

  // Form Revista: Función llamada cuando cambia la carga horaria seleccionada
  onCargaHorariaChange(): void {
    const cargaHorariaId = this.legajoForm.get('cargaHoraria')?.value;

    // Buscar la carga horaria seleccionada en el array de cargasHorarias
    const cargaHorariaSeleccionada = this.cargasHorarias.find(ch => ch.id === cargaHorariaId);

    // Verificar si la cantidad de horas es 40
    if (cargaHorariaSeleccionada?.cantidad === 40) {
      // Habilitar el campo 'adicional' si la carga horaria es 40
      this.legajoForm.get('adicional')?.enable();

      // Hacer obligatorio el campo adicional
      this.legajoForm.get('adicional')?.setValidators([Validators.required]);
    } else {
      // Deshabilitar el campo 'adicional' si la carga horaria no es 40
      this.legajoForm.get('adicional')?.disable();
      
      // Resetear el valor de 'adicional' a null si se deshabilita
      this.legajoForm.get('adicional')?.setValue(null);

      // Eliminar validación obligatoria
      this.legajoForm.get('adicional')?.clearValidators();
    }

    // Actualizar la validez de 'adicional' después de modificar los validadores
    this.legajoForm.get('adicional')?.updateValueAndValidity();

      // Aseguro que el formulario se revalide al cambiar la carga horaria
    this.legajoForm.updateValueAndValidity(); 
  }

  // Form Revista: Función para actualizar las opciones de cargaHoraria según la categoría seleccionada
  updateCargaHorarias(categoriaNombre: string): void {
    if (categoriaNombre === "24 HS") {
      this.filteredCargasHorarias = this.cargasHorarias.filter(ch => ch.cantidad === 24);
    } else {
      this.filteredCargasHorarias = this.cargasHorarias.filter(ch => ch.cantidad !== 24);
    }
  }

  //Uso tanto para cancelar form como para volver atrás
  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.location.back();
  }

  //-----Save-----
    
  async updateLegajo(): Promise<void> {

  // 🎯 VALIDACIÓN ESPECÍFICA PARA HABILITACIONES DE GUARDIAS EN EDIT
  if (this.showHabilitacionesGuardias) {
    const habilitacionesHospital = this.legajoForm.get('habilitacionesGuardiasHospital')?.value;
    const habilitacionesCaps = this.legajoForm.get('habilitacionesGuardiasCaps')?.value;
    
    const tieneHospital = Array.isArray(habilitacionesHospital) && habilitacionesHospital.length > 0;
    const tieneCaps = Array.isArray(habilitacionesCaps) && habilitacionesCaps.length > 0;

    if (!tieneHospital && !tieneCaps) {
      this.toastr.warning(
        'Debe seleccionar al menos un efector (Hospital o CAPS) para las guardias Extra/Contrafactura/Pasiva.',
        'Habilitaciones Requeridas',
        {
          timeOut: 8000,
          positionClass: 'toast-top-center',
          progressBar: true
        }
      );
      return; // Detener la actualización
    }

  }

  if (!this.formularioValidoCompleto) {
    
    // 🔥 MENSAJE ESPECÍFICO SI FALTAN HABILITACIONES DE GUARDIAS EN EDIT
    if (this.legajoForm.hasError('habilitacionesGuardiasRequeridas')) {
      this.toastr.warning(
        'Debe seleccionar al menos un efector para las guardias Extra/Contrafactura/Pasiva.',
        'Habilitaciones Requeridas',
        {
          timeOut: 8000,
          positionClass: 'toast-top-center',
          progressBar: true
        }
      );
    } else {
      this.toastr.warning('Complete todos los campos obligatorios antes de actualizar.', 'Formulario Incompleto', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
    }

    // Mostrar qué campos específicos faltan
    Object.keys(this.legajoForm.controls).forEach((controlName) => {
      const control = this.legajoForm.get(controlName);
      if (control?.invalid) {
      }
    });
    return;
  }

    const legajoData = this.legajoForm.value;
   
    // Asegura que tipoGuardias sea un array no vacío
    const tiposGuardiasSeleccionados = legajoData.tipoGuardias || [];
    const tiposGuardiaExcluidos = [this.idContraFactura];
    const estaDesactivado = !!legajoData.fechaFinal;
    const legajoAutoridad = legajoData.esAutoridad;
        
    if (tiposGuardiasSeleccionados.length === 0 || tiposGuardiasSeleccionados.some((id: number) => tiposGuardiaExcluidos.includes(id))) {
      // Crear legajo directamente sin pasar por la creación de la revista
      this.updateLegajoDtoAndSave(legajoData, null);
    } else {
      const adicional = legajoData.adicional ? legajoData.adicional : null;

          // Si los tipos de guardia son válidos, procede con la creación de la revista
          const revistaDto = new RevistaDto(
            legajoData.tipoRevista,
            legajoData.categoria,
            adicional,
            legajoData.cargaHoraria,
            legajoData.agrupacion
          );
          
  const legajoExistente = await this.legajoService.detail(this.idLegajo).toPromise();
      const sinCambios = this.sonLegajosIguales(legajoExistente, legajoData);

      // Si no hay cambios en el legajo, no hacemos nada
      if (sinCambios) {
       
        return;
      }

       // Verifica si existe una revista con los atributos especificados
      this.revistaService.checkRevista(revistaDto).subscribe(
        (existingRevista) => {
          if (existingRevista && existingRevista.id !== undefined) {

            // Usa la ID de la revista existente
            this.updateLegajoDtoAndSave(legajoData, existingRevista.id);
          } else {
            console.error('La revista existente no tiene un ID.');
          }
        },
        (error) => {

          
          // Si no existe, crear una nueva revista
          this.revistaService.save(revistaDto).subscribe(
            () => {
              // Después de crearla, buscamos la revista
              this.revistaService.checkRevista(revistaDto).subscribe(
                (newRevista) => {
                  if (newRevista && newRevista.id !== undefined) {

                    this.updateLegajoDtoAndSave(legajoData, newRevista.id);
                  } else {
                    console.error('Error: No se pudo encontrar la nueva revista después de crearla.');
                  }
                },
                (error) => {
                  console.error('Error al buscar la revista después de crearla', error);
                }
              );
            },
            (error) => {
              console.error('Error al crear la revista', error);
            }
          );
        }
      );
    }
  }
    
    private arraysSonIguales(arr1: any[], arr2: any[]): boolean {
      if (!arr1 || !arr2) return arr1 === arr2;
      if (arr1.length !== arr2.length) return false;
      return arr1.every(item => arr2.includes(item)) && arr2.every(item => arr1.includes(item));
    }
    
    private fechasSonIguales(fecha1: any, fecha2: any): boolean {
      if (!fecha1 || !fecha2) return fecha1 === fecha2;
    
      // Normalizar ambas fechas a YYYY-MM-DD
      const f1Str = new Date(fecha1).toISOString().split('T')[0];
      const f2Str = new Date(fecha2).toISOString().split('T')[0];
    
      return f1Str === f2Str;
    }

    private async cambiosHabilitacion(legajoActual: any, legajoNuevo: any, legajoCambio: boolean): Promise<boolean> {
      try {
        const habilitacionExistente = await this.habilitacionesGuardiasService.getPermisoByPersona(legajoNuevo.idPersona).toPromise();
    
        if (!habilitacionExistente || (Array.isArray(habilitacionExistente) && habilitacionExistente.length === 0)) {

          return true;
        }
    
        const efectoresExistentes = habilitacionExistente.efectores.map((ef: any) => ef.id).sort();
        const efectoresNuevos = (legajoNuevo.habilitacionesGuardias || []).sort();
    
        const mismosEfectores = JSON.stringify(efectoresExistentes) === JSON.stringify(efectoresNuevos);
        /* const mismoTipoEfector = habilitacionExistente.tipoEfectorEx === legajoNuevo.tipoHabilitacionesGuardias; */
    
        if (!mismosEfectores /* || !mismoTipoEfector */ || legajoCambio) {
          return true;
        }
    
        return false;
      } catch (error) {
        if ((error as any).status === 404) {
         
          return true;
        }
        console.error("❌ Error al verificar habilitación existente", error);
        return false; // o true, según cómo quieras manejar errores
      }
    }

    private async cambiosHabilitacionGeneral(legajoActual: any, legajoNuevo: any, legajoCambio: boolean): Promise<boolean> {
      try {
        const habilitacionExistente = await this.habilitacionesGeneralesService.getPermisoByPersona(legajoNuevo.idPersona).toPromise();
    
        if (!habilitacionExistente || (Array.isArray(habilitacionExistente) && habilitacionExistente.length === 0)) {
          
          return true;
        }
    
        const efectoresExistentes = habilitacionExistente.efectores.map((ef: any) => ef.id).sort();
        const efectoresNuevos = (legajoNuevo.habilitacionesGenerales || []).sort();
    
        const mismosEfectores = JSON.stringify(efectoresExistentes) === JSON.stringify(efectoresNuevos);
        /* const mismoTipoEfector = habilitacionExistente.tipoEfectorEx === legajoNuevo.tipoHabilitacionesGuardias; */
    
        if (!mismosEfectores /* || !mismoTipoEfector */ || legajoCambio) {
          
          return true;
        }
    
        return false;
      } catch (error) {
        if ((error as any).status === 404) {
          return true;
        }
        console.error("❌ Error al verificar habilitación existente", error);
        return false; // o true, según cómo quieras manejar errores
      }
    }

    private sonLegajosIguales(legajoActual: any, legajoNuevo: any): boolean {
      let sonIguales = true;

      const idRevistaActual = typeof legajoActual?.revista === 'object' ? legajoActual?.revista?.id : legajoActual?.revista;
const idRevistaNueva = typeof legajoNuevo?.revista === 'object' ? legajoNuevo?.revista?.id : legajoNuevo?.revista;

if (idRevistaActual !== idRevistaNueva) {
 
  sonIguales = false;
} 
    
      if ((legajoActual?.profesion?.id ?? legajoActual?.profesion) !== legajoNuevo?.profesion) {
       
        sonIguales = false;
        
    } 
    //  Extraer IDs de especialidades del legajo actual
  const especialidadesActualIds = legajoActual?.especialidades?.map((e: any) => e.id) ?? [];
  const especialidadesNuevoIds = legajoNuevo?.especialidades ?? [];

  //  Comparar arreglos de IDs
  if (!this.arraysSonIguales(especialidadesActualIds, especialidadesNuevoIds)) {
   
    sonIguales = false;
  } 
    
      if (legajoActual?.matriculaNacional !== legajoNuevo?.matriculaNacional) {
      
        sonIguales = false;
      }
    
      if (legajoActual?.matriculaProvincial !== legajoNuevo?.matriculaProvincial) {
       
        sonIguales = false;
      }
    
      if (!this.fechasSonIguales(legajoActual?.fechaInicio, legajoNuevo?.fechaInicio)) {
       
        sonIguales = false;
      }
    
      if (!this.fechasSonIguales(legajoActual?.fechaFinal, legajoNuevo?.fechaFinal)) {
       
        sonIguales = false;
      }

      const tipoGuardiasActualIds = legajoActual?.tipoGuardias?.map((tg: any) => tg.id) ?? [];
      const tipoGuardiasNuevoIds = legajoNuevo?.tipoGuardias ?? [];
    
      if (!this.arraysSonIguales(tipoGuardiasActualIds, tipoGuardiasNuevoIds)) {
      
        sonIguales = false;
      } 

      const efectorActualId = legajoActual?.efectores?.[0]?.id ?? 0;
      if (Number(efectorActualId) !== Number(legajoNuevo?.efectoresSelected ?? 0)) {
       
        sonIguales = false;
      } 
    
      if ((legajoActual?.udo?.id ??  legajoNuevo?.udoSelected ) !== legajoNuevo?.udoSelected) {
       
        sonIguales = false;
      }
    
      if (legajoActual?.tipoEfector !== legajoNuevo?.tipoEfector) {
       
        sonIguales = false;
      } 

      if (legajoActual?.tipoEfectorCargo !== legajoNuevo?.tipoEfectorCargo) {
       
        sonIguales = false;
      } 
    
      if (legajoActual?.tipoUdo !== legajoNuevo?.tipoUdo) {
      
        sonIguales = false;
      }
    
      return sonIguales;
    }

  async updateLegajoDtoAndSave(legajoData: any, revistaId: number | null): Promise<void> {
  // Verifica si el campo 'esAutoridad' está habilitado
  let esAutoridad: boolean;

  // Si el campo 'esAutoridad' está habilitado, toma el valor del formulario
  if (this.legajoForm.get('idCargo')?.enabled) {
    esAutoridad = this.legajoForm.get('esAutoridad')?.value ?? false;
  } else {
    // Si el campo está deshabilitado, usa el valor guardado antes de deshabilitarlo
    esAutoridad = this.esAutoridadValor ?? false;
  }

  // 🎯 DETERMINAR SI ES REGIONAL BASADO EN EL CARGO ACTUAL
  const esRegionalActual = legajoData.idCargo === this.idDirectorRegional;

  // 🎯 MANEJO DIFERENCIADO DE EFECTORES SEGÚN EL TIPO DE CARGO
  let efectoresData: any[] = [];

  if (esRegionalActual) {
    // Si es Director Regional, no hay efectores específicos
    efectoresData = [];

  } else {
    // Si NO es Director Regional, manejar efectores según el tipo
    if (esAutoridad) {
      // Para autoridades no regionales, usar efectoresAutoridad
      const efectoresAutoridad = legajoData.efectoresAutoridad;
      if (efectoresAutoridad) {
        efectoresData = Array.isArray(efectoresAutoridad) ? efectoresAutoridad : [efectoresAutoridad];
      }
     
    } else {
      // Para legajos generales, usar efectoresSelected
      const efectoresSelected = legajoData.efectoresSelected;
      if (efectoresSelected) {
        efectoresData = Array.isArray(efectoresSelected) ? efectoresSelected : [efectoresSelected];
      }
    }
  }

  const legajoExistente = await this.legajoService.detail(this.idLegajo).toPromise();

  if (!legajoExistente || !legajoExistente.id) {

    return;
  }

  if (revistaId) {
    legajoData.revista = { id: revistaId };
  }

  const sonDatosLegajoIguales = this.sonLegajosIguales(legajoExistente, legajoData);
  
  // 🎯 SOLO VERIFICAR CAMBIOS EN HABILITACIONES SI NO ES DIRECTOR REGIONAL
  let huboCambiosEnHabilitacion = false;
  if (!esRegionalActual && !esAutoridad) {

    huboCambiosEnHabilitacion = await this.cambiosHabilitacion(legajoExistente, legajoData, !sonDatosLegajoIguales);
  } else {
   
    huboCambiosEnHabilitacion = false; // Director Regional no tiene habilitaciones de guardia
  }

  let huboCambiosHabilitacionGeneral =false;
  if (esAutoridad && !esRegionalActual) {
    
  } else {
   
    huboCambiosHabilitacionGeneral = false;
  }


  if (!sonDatosLegajoIguales || huboCambiosEnHabilitacion ||huboCambiosHabilitacionGeneral ) {

     // 🔥 DETERMINAR QUÉ URL USAR PARA EL NUEVO LEGAJO
    let urlParaNuevoLegajo: string | null = null;
    
    if (this.selectedFile) {
      // 🔥 SI HAY IMAGEN NUEVA SELECCIONADA, SE SUBIRÁ DESPUÉS
      console.log('📸 Nueva imagen detectada, se subirá al crear el legajo');
      urlParaNuevoLegajo = null; // Se establecerá después de subir
    } else {
      // 🔥 SI NO HAY IMAGEN NUEVA, MANTENER LA URL DEL LEGAJO ANTERIOR
      urlParaNuevoLegajo = legajoExistente.url || null;
      console.log('🔄 Manteniendo URL de imagen existente:', urlParaNuevoLegajo);
    }

    // 🎯 CONSTRUIR DTO DE DESACTIVACIÓN MANTENIENDO TODOS LOS DATOS ORIGINALES
    const legajoDesactivado = new LegajoDto(
      legajoExistente.fechaInicio,
      legajoExistente.esAutoridad,
      false, // ❌ Desactivar
      legajoExistente.url,
      legajoExistente.persona?.id ?? legajoData.idPersona,
      new Date(),
      legajoExistente.esRegional || false,
      legajoExistente.matriculaNacional ?? null,
      legajoExistente.matriculaProvincial ?? null,
      null, // idSuspencion
      null, // motivoBaja
      legajoExistente.revista?.id ?? null,
      legajoExistente.udo?.id ?? null,
      legajoExistente.efectores?.map((e: any) => e.id).filter((id: any): id is number => id !== undefined) ?? [],
      legajoExistente.especialidades?.map((e: any) => e.id).filter((id: any): id is number => id !== undefined) ?? null,
      legajoExistente.profesion?.id ?? null,
      legajoExistente.tipoGuardias?.map((tg: any) => tg.id).filter((id: any): id is number => id !== undefined) ?? null,
      legajoExistente.cargo?.id ?? null,
      legajoExistente.region?.id ?? null,
      legajoExistente.nroresolucion ?? undefined,
      legajoExistente.nrodecreto ?? undefined,
      legajoExistente.fechaResolucion ?? undefined,
      legajoExistente.tipoEfector ?? undefined,
      legajoExistente.tipoEfectorCargo ?? undefined,
      legajoExistente.tipoUdo ?? undefined
    );

    // 🎯 VERIFICAR HABILITACIONES ANTES DE CREAR EL NUEVO LEGAJO
    if (esAutoridad) {
      if (legajoData.idCargo === this.idDirectorRegional) {
        // Habilitaciones para Director Regional
       
        this.habilitacionesGeneralesService.addHabilitacionesAutoridadRegional(legajoData.idPersona, legajoData.idRegion).subscribe(
          () => {
          
          },
          (error) => {
            console.error("❌ Error al guardar habilitaciones para autoridad regional", error);
          }
        );
      } else {
        // Habilitaciones para otras autoridades
        this.saveHabilitacionesGenerales(legajoData);
      }
    }

    // Guardar el legajo desactivado
    this.legajoService.update(this.idLegajo, legajoDesactivado).subscribe(
      () => {

        // 🎯 CONSTRUIR DTO DEL NUEVO LEGAJO CON CAMPOS ESPECÍFICOS PARA DIRECTOR REGIONAL
        const legajoNuevo = new LegajoDto(
          legajoData.fechaInicio,
          esAutoridad,
          true, // ✅ Activo
          urlParaNuevoLegajo ?? '',
          legajoData.idPersona,
          legajoData.fechaFinal,
          esRegionalActual, // 🎯 Usar la determinación actual
          legajoData.matriculaNacional ?? null,
          legajoData.matriculaProvincial ?? null,
          null, // idSuspencion
          null, // motivoBaja
          revistaId,
          // 🎯 CAMPOS ESPECÍFICOS SEGÚN EL TIPO DE CARGO
          esRegionalActual ? null : (legajoData.udoSelected ?? null), // UDO solo para no regionales
          efectoresData, // 🎯 Efectores procesados
          legajoData.especialidades ?? null,
          legajoData.profesion,
          legajoData.tipoGuardias ?? null,
          legajoData.idCargo ?? null,
          legajoData.idRegion ?? null,
          legajoData.nroResolucion ?? undefined,
          legajoData.nroDecreto ?? undefined,
          legajoData.fechaResolucion ?? undefined,
          // 🎯 CAMPOS TIPO EFECTOR - LIMPIOS PARA DIRECTOR REGIONAL
          esRegionalActual ? null : (legajoData.tipoEfector ?? null), // NULL si es Director Regional
          esRegionalActual ? null : (legajoData.tipoEfectorCargo ?? null), // 🔥 NULL si es Director Regional (CAMPO PRINCIPAL)
          esRegionalActual ? null : (legajoData.tipoUdo ?? null) // NULL si es Director Regional
        );

        // 🎯 PROCESAR HABILITACIONES DE GUARDIA SOLO SI NO ES DIRECTOR REGIONAL
        let debeGuardarHabilitacion = false;

        if (!esRegionalActual && legajoData.tipoGuardias &&
          (legajoData.tipoGuardias.includes(this.idCargo) ||
           legajoData.tipoGuardias.includes(this.idAgrupacion) ||
           legajoData.tipoGuardias.includes(this.idContraFactura) ||
           legajoData.tipoGuardias.includes(this.idExtra) ||
           legajoData.tipoGuardias.includes(this.idPasiva))) {
          
          debeGuardarHabilitacion = true;
        }

        if (debeGuardarHabilitacion) {
          this.habilitacionesGuardiasService.getPermisoByPersona(legajoData.idPersona).subscribe(
            (habilitacionExistente) => {
              if (!habilitacionExistente || (Array.isArray(habilitacionExistente) && habilitacionExistente.length === 0)) {
                this.crearNuevaHabilitacion(legajoData);
              } else {
               
                this.saveHabilitacionesGuardias(legajoData, !sonDatosLegajoIguales);
              }
            },
            (error) => {
              if (error.status === 404) {
              
                this.crearNuevaHabilitacion(legajoData);
              } else {
                console.error("❌ Error al verificar habilitación existente", error);
              }
            }
          );
        }

        // Crear el nuevo legajo
        this.legajoService.save(legajoNuevo).subscribe(
          async (result) => {
            console.log('✅ Nuevo legajo creado exitosamente:', result);
            
            // 🔥 MANEJAR IMAGEN SEGÚN EL CASO
            if (esAutoridad && this.selectedFile && result.id) {
              // 🔥 CASO 1: HAY IMAGEN NUEVA PARA SUBIR
              console.log('📤 Subiendo nueva imagen para legajo de autoridad...');
              try {
                const uploadResponse = await this.uploadImageAfterUpdate(result.id);
                
                if (uploadResponse && uploadResponse.url) {
                  console.log('✅ Nueva imagen subida correctamente:', uploadResponse.url);
                  
                  // 🔥 ACTUALIZAR LA URL EN EL LEGAJO RECIÉN CREADO
                  const legajoActualizado = { ...result, url: uploadResponse.url };
                  
                  this.toastr.success('Legajo actualizado con nueva imagen correctamente', 'ÉXITO');
                } else {
                  this.toastr.success('Legajo actualizado. Error al subir nueva imagen.', 'Parcialmente exitoso');
                }
                
              } catch (uploadError) {
                console.error('❌ Error al subir imagen:', uploadError);
                this.toastr.warning('Legajo actualizado pero hubo un error al subir la nueva imagen');
              }
              
            } else if (esAutoridad && urlParaNuevoLegajo) {
              // 🔥 CASO 2: SE MANTIENE LA IMAGEN EXISTENTE
              console.log('🔄 Imagen existente mantenida:', urlParaNuevoLegajo);
              this.toastr.success('Legajo actualizado manteniendo la imagen existente', 'ÉXITO');
              
            } else if (esAutoridad && !urlParaNuevoLegajo && !this.selectedFile) {
              // 🔥 CASO 3: LEGAJO SIN IMAGEN
              console.log('📝 Legajo actualizado sin imagen');
              this.toastr.success('Legajo actualizado sin imagen', 'ÉXITO');
              
            } else {
              // 🔥 CASO 4: LEGAJO NO ES AUTORIDAD
              this.toastr.success('Legajo actualizado con éxito', 'ÉXITO');
            }

            // 🔥 NAVEGACIÓN
            this.navigateAfterUpdate();
          },
          (error) => {
            console.error("❌ Error al crear el nuevo legajo", error);
            this.toastr.error('Ocurrió un error al actualizar el Legajo', error.error?.mensaje || error.message);
          }
        );
      },
      (error) => {
        console.error("❌ Error al desactivar el legajo", error);
        this.toastr.error('Error al desactivar el legajo existente', error.message);
      }
    );
  } else {
    // 🔥 NO HAY CAMBIOS, SOLO NAVEGAR
    console.log('ℹ️ No hay cambios en el legajo, navegando sin modificar');
    this.toastr.info('No se detectaron cambios en el legajo', 'Sin cambios');
    this.navigateAfterUpdate();
    return;
  }
}

private navigateAfterUpdate(): void {
  if (this.fromAsistencial) {
    this.router.navigate(['/personal']);
  } else if (this.fromNoAsistencial) {
    this.router.navigate(['/personal-no-asistencial']);
  } else {
    this.location.back();
  }
}

    
    saveHabilitacionesGuardias(legajoData: any, forzarActualizacion: boolean = false): void {
      this.habilitacionesGuardiasService.getPermisoByPersona(legajoData.idPersona).subscribe(
        (habilitacionExistente) => {
          
          if (!habilitacionExistente ) {
           
            this.crearNuevaHabilitacion(legajoData);
            return;
          }
    
          // Extraer los IDs de efectores de la habilitación existente y la nueva
          const efectoresExistentes = habilitacionExistente.efectores.map((efector: any) => efector.id).sort();
          const efectoresNuevos = (legajoData.habilitacionesGuardias || []).sort();
    
          // Comparar efectores y tipo de efector
          const mismosEfectores = JSON.stringify(efectoresExistentes) === JSON.stringify(efectoresNuevos);
          /* const mismoTipoEfector = habilitacionExistente.tipoEfectorEx === legajoData.tipoHabilitacionesGuardias; */
    
          // Si la habilitación existente y la nueva son iguales, no hacer nada
          if (mismosEfectores /* && mismoTipoEfector */ && !forzarActualizacion) {
           
            return;
          }
    
          //Si el tipo de guardia es CARGO o AGRUPACIÓN, se desactiva la habilitación previa
          const habilitacionesActivas = Array.isArray(habilitacionExistente) 
          ? habilitacionExistente.filter(hab => hab.activo) 
          : (habilitacionExistente.activo ? [habilitacionExistente] : []);

            if (habilitacionesActivas.length === 0) {
               
                this.crearNuevaHabilitacion(legajoData);
                return;
            }

                // 🔹 **Desactivar todas las habilitaciones activas**
                const desactivaciones = habilitacionesActivas.map((habilitacion) => {
          // Desactivar la habilitación anterior
          const habilitacionDesactivada = new HabilitacionesGuardiasDto(
            false, // Desactivar
            legajoData.idPersona,
            efectoresExistentes, 
           /*  legajoData.tipoHabilitacionesGuardias?.tipoEfectorEx */
          );

                    return this.habilitacionesGuardiasService.update(habilitacion.id!, habilitacionDesactivada).toPromise();
                });

                // 🔹 **Esperar a que todas las desactivaciones se completen antes de continuar**
                Promise.all(desactivaciones)
                    .then(() => {
                       
                        this.crearNuevaHabilitacion(legajoData);
        })
          .catch((error) => {
              console.error("Error al desactivar las habilitaciones previas", error);
          });
},
(error) => {
  if (error.status === 404) {
      this.crearNuevaHabilitacion(legajoData);
    } else {
      console.error("Error al verificar habilitación existente", error);
  }
}
);
}

private crearNuevaHabilitacion(legajoData: any): void {
  const efectoresNuevos = legajoData.habilitacionesGuardias || [];

  if (efectoresNuevos.length === 0) {
  
      return;
  }

  const nuevaHabilitacion = new HabilitacionesGuardiasDto(
      true, // Activo
      legajoData.idPersona,
      efectoresNuevos, 
 /*      legajoData.tipoHabilitacionesGuardias */
  );



  this.habilitacionesGuardiasService.save(nuevaHabilitacion).subscribe(
      (response) => {

      },
      (error) => {
          console.error("Error al crear la nueva habilitación", error);
      }
  );
}

saveHabilitacionesGenerales(legajoData: any, forzarActualizacion: boolean = false): void {
    this.habilitacionesGeneralesService.getPermisoByPersona(legajoData.idPersona).subscribe(
        (habilitacionExistente) => {
            if (!habilitacionExistente) {
               
                this.crearNuevaHabilitacionGeneral(legajoData);
                return;
            }

           

            // Extraer los IDs de efectores de la habilitación existente y la nueva
            const efectoresExistentes = habilitacionExistente.efectores.map((efector: any) => efector.id).sort();
            const efectoresNuevos = (legajoData.habilitacionesGenerales || []).sort();

            // Comparar efectores y tipo de efector
            const mismosEfectores = JSON.stringify(efectoresExistentes) === JSON.stringify(efectoresNuevos);
            /* const mismoTipoEfector = habilitacionExistente.tipoEfectorEx === legajoData.tipoEfectorEx; */

            if (mismosEfectores /* && mismoTipoEfector  */&& !forzarActualizacion) {
               
                return;
            }

            // Obtener habilitaciones activas
            const habilitacionesActivas = Array.isArray(habilitacionExistente) 
                ? habilitacionExistente.filter(hab => hab.activo) 
                : (habilitacionExistente.activo ? [habilitacionExistente] : []);

            if (habilitacionesActivas.length === 0) {
               
                this.crearNuevaHabilitacionGeneral(legajoData);
                return;
            }

            // Desactivar habilitaciones activas
            const desactivaciones = habilitacionesActivas.map((habilitacion) => {
                const habilitacionDesactivada = new HabilitacionesGeneralesDto(
                    false, // Desactivar
                    legajoData.idPersona,
                    efectoresExistentes,
                   /*  legajoData.tipoHabilitacionesGenerales?.tipoEfectorEx */
                );

                return this.habilitacionesGeneralesService.update(habilitacion.id!, habilitacionDesactivada).toPromise();
            });

            Promise.all(desactivaciones)
                .then(() => {
                    
                    this.crearNuevaHabilitacionGeneral(legajoData);
                })
                .catch((error) => {
                    console.error("Error al desactivar las habilitaciones generales previas", error);
                });
        },
        (error) => {
            if (error.status === 404) {
                this.crearNuevaHabilitacionGeneral(legajoData);
            } else {
                console.error("Error al verificar habilitación general existente", error);
            }
        }
    );
}

private crearNuevaHabilitacionGeneral(legajoData: any): void {
    const efectoresNuevos = legajoData.habilitacionesGenerales || [];

    if (efectoresNuevos.length === 0) {
       
        return;
    }

    const nuevaHabilitacionGeneral = new HabilitacionesGeneralesDto(
        true, // Activo
        legajoData.idPersona,
        efectoresNuevos,
        /* legajoData.tipoHabilitacionesGenerales */
    );

    this.habilitacionesGeneralesService.save(nuevaHabilitacionGeneral).subscribe(
        (response) => {
        },
        (error) => {
            console.error("Error al crear la nueva habilitación general", error);
        }
    );
}

  //-----Manejo de paneles-----

    nextStep(): void {
      if (this.step === 0 && !this.isPanel1Valid()) {
        this.toastr.warning('Complete todos los campos obligatorios en datos personal.', 'Campos Incompletos', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
        return;
      }

      if (this.step === 1 && !this.isPanel2Valid()) {
        this.toastr.warning('Complete todos los campos obligatorios en datos del legajo.', 'Campos Incompletos', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
        return;
      }

      if (this.step === 2 && !this.isPanel3Valid()) {
        this.toastr.warning('Complete todos los campos obligatorios en situación de revista.', 'Campos Incompletos', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
        return;
      }

      this.step = (this.step + 1) % 3;
    }

    prevStep(): void {
      this.step = (this.step - 1 + 3) % 3;
    }

    isPanel1Valid(): boolean {
      const panel1Controls = ['idPersona', 'profesion', 'matriculaProvincial'];
      return panel1Controls.every(control => this.legajoForm.get(control)?.valid);
    }

    isPanel2Valid(): boolean {
      const panel2Controls = [/*'esAutoridad', 'tipoGuardias', */'fechaInicio'];
      return panel2Controls.every(control => this.legajoForm.get(control)?.valid);
    }

    isPanel3Valid(): boolean {
      const panel3Controls = ['agrupacion', 'categoria', /*'adicional', */'cargaHoraria', 'tipoRevista', 'udoSelected', 'efectores'];
      return panel3Controls.every(control => this.legajoForm.get(control)?.valid);
    }

    setStep(index: number) {
      this.step = index;
    }

    cerrarPanel() {
      this.step = -1;
    }
  

}







/*
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { LegajoDto } from 'src/app/dto/Configuracion/LegajoDto';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { ProfesionService } from 'src/app/services/Configuracion/profesion.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { EspecialidadService } from 'src/app/services/Configuracion/especialidad.service';
import { CategoriaService } from 'src/app/services/Configuracion/categoria.service';
import { AdicionalService } from 'src/app/services/Configuracion/adicional.service';
import { CargaHorariaService } from 'src/app/services/Configuracion/carga-horaria.service';
import { TipoRevistaService } from 'src/app/services/Configuracion/tipo-revista.service';
import { RevistaService } from 'src/app/services/Configuracion/revista.service';
import { Profesion } from 'src/app/models/Configuracion/Profesion';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Especialidad } from 'src/app/models/Configuracion/Especialidad';
import { Categoria } from 'src/app/models/Configuracion/Categoria';
import { Adicional } from 'src/app/models/Configuracion/Adicional';
import { CargaHoraria } from 'src/app/models/Configuracion/CargaHoraria';
import { TipoRevista } from 'src/app/models/Configuracion/TipoRevista';
import { Revista } from 'src/app/models/Configuracion/Revista';
import { ToastrService } from 'ngx-toastr';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { AsistencialListForLegajosDto } from 'src/app/dto/Configuracion/asistencial/AsistencialListForLegajosDto';
import { RevistaDto } from 'src/app/dto/Configuracion/RevistaDto';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { TipoGuardiaService } from 'src/app/services/Configuracion/tipoGuardia.service';
import { CargoService } from 'src/app/services/Configuracion/cargo.service';
import { RegionService } from 'src/app/services/Configuracion/region.service';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { Region } from 'src/app/models/Configuracion/Region';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';




interface Agrup {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-legajo-edit',
  templateUrl: './legajo-edit.component.html',
  styleUrls: ['./legajo-edit.component.css']
})
export class LegajoEditComponent implements OnInit {

  fromLegajoPerson: boolean = false;
  fromLegajo: boolean = false;
  legajoForm: FormGroup;
  initialData: Legajo | undefined;
  idLegajo: number = 0;
  profesiones: Profesion[] = [];
  efectores: Efector[] = [];
  especialidadesList: Especialidad[] = [];
  categorias: Categoria[] = [];
  adicionales: Adicional[] = [];
  cargasHorarias: CargaHoraria[] = [];
  tiposRevistas: TipoRevista[] = [];
  revistas: Revista[] = [];
  tipoGuardias: TipoGuardia[] = [];
  cargos: Cargo[] = [];
  regiones: Region[] = [];

  step = 0;
  maxDate!: Date;
  minFechaFinal!: Date;
  showGuardia: boolean = false;
  showRegion: boolean = false;


  personId!: number;
  asistencial: Asistencial | undefined;
  noAsistencial: NoAsistencial | undefined;
  isAsistencial: boolean = false;
  noEspecialidadesMessage: string = '';
  isSituacionRevistaEnabled = false;
  isUpdatingTipoGuardias: boolean = false;
  filteredCargasHorarias: CargaHoraria[] = [];


  agrupaciones: Agrup[] = [
    { value: 'ADMINISTRATIVO', viewValue: 'Administrativo' },
    { value: 'MANTENIMIENTO_Y_PRODUCCION', viewValue: 'Mantenimiento y Producción' },
    { value: 'PROFESIONALES', viewValue: 'Profesionales' },
    { value: 'SERVICIOS_GENERALES', viewValue: 'Servicios Generales' },
    { value: 'TECNICOS', viewValue: 'Técnicos' },
  ];

  constructor(
    private fb: FormBuilder,
    private legajoService: LegajoService,
    private router: Router,
    private asistencialService: AsistencialService,
    private profesionService: ProfesionService,
    private hospitalService: HospitalService,
    private cargoService: CargoService,
    private regionService: CargoService,
    private especialidadService: EspecialidadService,
    private categoriaService: CategoriaService,
    private adicionalService: AdicionalService,
    private cargaHorariaService: CargaHorariaService,
    private tipoRevistaService: TipoRevistaService,
    private revistaService: RevistaService,
    private tipoGuardiaService: TipoGuardiaService,
    private toastr: ToastrService
  ) {
    this.legajoForm = this.fb.group({
      agrupacion: ['', Validators.required],
      categoria: ['', Validators.required],
      adicional: ['', Validators.required],
      cargaHoraria: ['', Validators.required],
      tipoRevista: ['', Validators.required],
      persona: ['', Validators.required],
      profesion: ['', Validators.required],
      udo: ['', Validators.required],
      efectores: ['', Validators.required],
      especialidades: [[]],
      matriculaNacional: ['', [Validators.pattern('^[0-9]{5,10}$')]],
      matriculaProvincial: ['', [Validators.required, Validators.pattern('^[0-9]{5,10}$')]],
      esAutoridad: ['', Validators.required],
      idCargo: [null],
      idRegion: [null],
      fechaInicio: ['', [Validators.required, this.dateLimitePresente]],
      fechaFinal: [{ value: '', disabled: true }],
      tipoGuardias: ['', Validators.required],
    });

        //-----Manejo de fechas-----

        this.maxDate = new Date();
    
        // Deshabilitar fechaFinal hasta que se seleccione fechaInicio
        this.legajoForm.get('fechaFinal')?.disable();
      
        // Habilitar fechaFinal cuando fechaInicio tiene un valor
        this.legajoForm.get('fechaInicio')?.valueChanges.subscribe(fechaInicio => {
          if (fechaInicio) {
            this.legajoForm.get('fechaFinal')?.enable();
        
            // valor mínimo de fechaFinal, día siguiente a fechaInicio
            const fechaInicioDate = new Date(fechaInicio);
            fechaInicioDate.setDate(fechaInicioDate.getDate() + 1);
            this.minFechaFinal = fechaInicioDate;
        
            // Reseteo fechaFinal en caso se modifique fechaInicio
            this.legajoForm.get('fechaFinal')?.setValue('');
          } else {
            this.legajoForm.get('fechaFinal')?.disable();
            this.legajoForm.get('fechaFinal')?.setValue('');
          }
        });
  

    this.listProfesiones();
    this.listUdos();
    this.listCategorias();
    this.listAdicionales();
    this.listCargaHoraria();
    this.listTipoRevista();
    this.listTipoGuardia();
    this.listCargo();
    this.listRegion();


  // recupero el estado del router
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.isAsistencial = !!navigation.extras.state['asistencial'];
      
      this.initialData = navigation.extras.state['legajo'];
      this.fromLegajoPerson = !!navigation.extras.state['fromLegajoPerson'];
      this.fromLegajo = !!navigation.extras.state['fromLegajo'];
  
      // Determina si es asistencial o no asistencial
      this.asistencial = navigation.extras.state['asistencial'] || undefined;
      this.noAsistencial = navigation.extras.state['noAsistencial'] || undefined;
  
    }
  }

  ngOnInit(): void {
    // Verifica si hay datos iniciales
    if (this.initialData) {
      this.idLegajo = this.initialData.id ?? 0;
  
      // Verifica si el ID de la persona es undefined
      if (this.initialData.persona?.id === undefined) {
        this.toastr.warning('ID de la persona no encontrado. Regresando a página de legajos.', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.router.navigate(['/personal-legajo']);
        return;
      }
  
      this.personId = this.initialData.persona.id;
  
      // Carga los datos del formulario
      this.legajoForm.patchValue({
        ...this.initialData,
        efectores: this.initialData.efectores ? this.initialData.efectores.map((efector: any) => efector.id) : [],
        profesion: this.initialData.profesion?.id,  // Asegúrate de que se asigne el ID de la profesión
        especialidades: this.initialData.especialidades ? this.initialData.especialidades.map((especialidad: any) => especialidad.id) : [],
        adicional: this.initialData.revista?.adicional?.id,  // Cargar adicional del objeto 'Revista'
        agrupacion: this.initialData.revista?.agrupacion,  // Aquí cargas el valor de 'agrupacion'
        cargaHoraria: this.initialData.revista?.cargaHoraria?.id,  // Cargar carga horaria del objeto 'Revista'
        categoria: this.initialData.revista?.categoria?.id ?? null,  // Cargar categoría del objeto 'Revista'
        tipoRevista: this.initialData.revista?.tipoRevista?.id,  // Cargar tipo de revista del objeto 'Revista'
        tipoGuardias: this.initialData.tipoGuardias ? this.initialData.tipoGuardias.map((tipoGuardias: any) => tipoGuardias.id) : [],
        cargo: this.initialData.cargo?.id,
        region: this.initialData.region?.id,
      });

  
      // Si la profesión ya está seleccionada, filtrar las especialidades
      const profesionId = this.initialData.profesion?.id;
      if (profesionId) {
        this.filterEspecialidadesByProfesion(profesionId);
      }
  
    // Verifica si tipoGuardias contiene 4 o 5 al inicio y deshabilita los campos de "Situación de Revista"
    setTimeout(() => {
      const tipoGuardias = this.initialData?.tipoGuardias ? this.initialData.tipoGuardias.map((tipoGuardia: any) => tipoGuardia.id) : [];
      this.toggleSituacionRevista(tipoGuardias);  // Llamada a la función en un timeout
    }, 0);
  }

  // Suscribirse a cambios en la profesión seleccionada
  this.legajoForm.get('profesion')?.valueChanges.subscribe((profesionId) => {
    if (profesionId) {

      // Filtrar especialidades según la nueva profesión seleccionada
      this.filterEspecialidadesByProfesion(profesionId);
    } else {
      // Limpiar y deshabilitar el campo si no hay profesión seleccionada
      this.resetEspecialidades();
    }
  });
    
    // Suscribirse a cambios en la selección de tipo de guardia
    this.legajoForm.get('tipoGuardias')?.valueChanges.subscribe((selectedValues) => {
      // Evitar que el valor de tipoGuardias se actualice automáticamente cuando se cambia el tipo 4 o 5
      if (!this.isUpdatingTipoGuardias) {
        this.isUpdatingTipoGuardias = true;
        // Llamar a toggleSituacionRevista cuando el usuario cambia el valor
        this.toggleSituacionRevista(selectedValues);
  
        // Si se selecciona el tipo 4 (CONTRAFACTURA), deseleccionar todas las demás opciones
        if (selectedValues.includes(4)) {
          this.legajoForm.patchValue({
            tipoGuardias: [4]  // Solo mantener el tipo 4
          }, { emitEvent: false });  // Esto previene que se dispare el evento valueChanges de nuevo
        } else if (selectedValues.includes(5)) {
          // Si se selecciona el tipo 5 (PASIVA), deseleccionar todas las demás opciones
          this.legajoForm.patchValue({
            tipoGuardias: [5]  // Solo mantener el tipo 5
          }, { emitEvent: false });  // Esto previene que se dispare el evento valueChanges de nuevo
        } else {
          // Si se seleccionan otras opciones (1, 2, 3), mantenerlas
          this.legajoForm.patchValue({
            tipoGuardias: selectedValues.filter((value: number) => value !== 4 && value !== 5)
          }, { emitEvent: false });  // Esto previene que se dispare el evento valueChanges de nuevo
        }
        this.isUpdatingTipoGuardias = false;
      }
    });

    // Llamar al método para configurar cargaHoraria y adicional
    this.initializeCargaHorariaAndAdicional();
    
    // Suscribirse a los cambios en el campo categoria
    this.legajoForm.get('categoria')?.valueChanges.subscribe(() => {
      this.onCategoriaChange(); // Llama a la función para actualizar cargaHoraria cuando cambie la categoría
    });
  
    // Suscribirse a los cambios en cargaHoraria para habilitar/deshabilitar adicional
    this.legajoForm.get('cargaHoraria')?.valueChanges.subscribe((cargaHorariaId) => {
      this.updateAdicionalState(cargaHorariaId); // Llama a la función para habilitar/deshabilitar adicional
    });  

    this.legajoForm.get('esAutoridad')?.disable();
  }

  //-----Metodos y funciones-----

  // Form Datos profesional: No permite seleccionar una fecha futura en fechaInicio
  dateLimitePresente(control: any) {
    const currentDate = new Date();
    if (control.value && new Date(control.value) > currentDate) {
      return { 'matDatepickerMin': true };
    }
    return null;
  }

  //Form Datos profesional: Habilita la fecha minima para fechaFinalizacion
  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
  }

    //Form Datos legajo: si es un legajo tipo autoridad (esAutoridad) impide cargar tipoGuardia y habilita cargo
    onAutoridadChange(isAutoridad: boolean): void {
      const idCargoControl = this.legajoForm.get('idCargo');
      const idRegionControl = this.legajoForm.get('idRegion');
      const tipoGuardiasControl = this.legajoForm.get('tipoGuardias');
      
      // Cuando cambia idAutoridad reseteo el valor de idCargo, tipoGuardia e idRegion; tambien oculto y hago no obligatorio idRegional
      idCargoControl?.reset();
      tipoGuardiasControl?.reset();
      idRegionControl?.reset();
      this.showRegion = false;
      this.legajoForm.get('idRegion')?.clearValidators();
      
      // Mostrar/ocultar el campo 'idCargo' y tipoGuardia basado en 'esAutoridad'
      if (isAutoridad) {
        // Si es autoridad muestro idCargo y oculto tipoGuardia y situacion de revista
        idCargoControl?.enable();
        this.legajoForm.get('idCargo')?.setValidators([Validators.required]);
        this.showGuardia = false;
        this.legajoForm.get('tipoGuardias')?.clearValidators();
        this.isSituacionRevistaEnabled = false;
        this.disableSituacionRevistaFields();
      } else {
        // Si no es autoridad oculto idCargo y muestro tipoGuardia haciendola obligatoria
        idCargoControl?.disable();
        idCargoControl?.clearValidators(); // Remuevo validadores si no es autoridad
        this.showGuardia = true;
        this.legajoForm.get('tipoGuardias')?.setValidators([Validators.required]);      
      }
    
      // Actualizo la validez de los campos después de modificar los validadores y visibilidad
      idCargoControl?.updateValueAndValidity();
    }
    
    onCargoChange(): void {
      const cargoSeleccionado = this.legajoForm.get('idCargo')?.value;
      const idRegionControl = this.legajoForm.get('idRegion');
      const directorRegionalNombre = 'Director Regional'; 
  
      if (cargoSeleccionado === directorRegionalNombre) {
        // Si se selecciona "Director regional", muestra el campo de región y lo hace obligatorio
        this.showRegion = true;
        this.legajoForm.get('idRegion')?.setValidators([Validators.required]);
      } else {
        // Si se selecciona cualquier otro cargo, oculta el campo de región y lo hace inválido
        this.showRegion = false;
        idRegionControl?.reset();
        this.legajoForm.get('idRegion')?.clearValidators();
      }
  
      // Actualiza la validez de los campos
      this.legajoForm.get('idRegion')?.updateValueAndValidity();
    }  


  updateAdicionalState(cargaHorariaId: number | null): void {
    const cargaHorariaSeleccionada = this.cargasHorarias.find(ch => ch.id === cargaHorariaId);
  
    if (cargaHorariaSeleccionada?.cantidad === 40) {
      // Si la carga horaria es 40, habilitar adicional y hacerlo obligatorio
      this.legajoForm.get('adicional')?.enable();
      this.legajoForm.get('adicional')?.setValidators([Validators.required]);
    } else {
      // Si la carga horaria no es 40, deshabilitar adicional y limpiarlo
      this.legajoForm.get('adicional')?.disable();
      this.legajoForm.get('adicional')?.setValue(null);
      this.legajoForm.get('adicional')?.clearValidators(); // Limpiar validaciones
    }
  
    // Actualizar la validez de 'adicional' después de modificar los validadores
    this.legajoForm.get('adicional')?.updateValueAndValidity();
  }

  initializeCargaHorariaAndAdicional(): void {
    const categoriaNombre = this.initialData?.revista?.categoria?.nombre; 
    const cargaHorariaId = this.initialData?.revista?.cargaHoraria?.id;
    const adicionalId = this.initialData?.revista?.adicional?.id;
  
    // Asignar los valores iniciales al formulario
    this.legajoForm.patchValue({
      cargaHoraria: cargaHorariaId,
      adicional: adicionalId
    });
  
    // Filtrar las opciones de cargaHoraria según la categoría seleccionada
    if (categoriaNombre === "24 HS") {
      // Si la categoría es "24 HS", solo mostrar la opción con cantidad 24
      this.filteredCargasHorarias = this.cargasHorarias.filter(ch => ch.cantidad === 24);
    } else {
      // Si no es "24 HS", mostrar todas las opciones excepto la de cantidad 24
      this.filteredCargasHorarias = this.cargasHorarias.filter(ch => ch.cantidad !== 24);
    }
  
    // Asegurarse de que cargaHoraria esté habilitado
    this.legajoForm.get('cargaHoraria')?.enable();
  
    // Habilitar/deshabilitar el campo adicional según cargaHoraria
    this.legajoForm.get('cargaHoraria')?.valueChanges.subscribe((cargaHorariaId: number | null) => {
      // Si el valor de cargaHoraria es undefined, lo tratamos como null
      this.updateAdicionalState(cargaHorariaId ?? null);
    });
  }

// Función llamada cuando cambia la categoría seleccionada
onCategoriaChange(categoriaId?: number): void {
  if (!categoriaId) {
    categoriaId = this.legajoForm.get('categoria')?.value;
  }

  const categoriaSeleccionada = this.categorias.find(categoria => categoria.id === categoriaId);

  if (!categoriaSeleccionada) {
    this.legajoForm.get('cargaHoraria')?.disable();
    //this.legajoForm.get('cargaHoraria')?.setValue(null);
    //this.filteredCargasHorarias = [];

    this.legajoForm.get('adicional')?.disable();
    //this.legajoForm.get('adicional')?.setValue(null);

    this.legajoForm.get('adicional')?.clearValidators();
    this.legajoForm.get('adicional')?.updateValueAndValidity();
  } else {
    this.legajoForm.get('cargaHoraria')?.enable();
    this.updateCargaHorarias(categoriaSeleccionada.nombre);

    if (categoriaSeleccionada.nombre === "24 HS") {
      const cargaHoraria24 = this.cargasHorarias.find(ch => ch.cantidad === 24);
      if (cargaHoraria24) {
        this.legajoForm.get('cargaHoraria')?.setValue(cargaHoraria24.id);
      }
    } else {
      if (this.filteredCargasHorarias.length > 0) {
        const primeraCargaHoraria = this.filteredCargasHorarias[0];
        this.legajoForm.get('cargaHoraria')?.setValue(primeraCargaHoraria.id);
      }
    }

    this.onCargaHorariaChange();
  }
}

// Función llamada cuando cambia la carga horaria seleccionada
onCargaHorariaChange(): void {
  const cargaHorariaId = this.legajoForm.get('cargaHoraria')?.value;

  // Buscar la carga horaria seleccionada en el array de cargasHorarias
  const cargaHorariaSeleccionada = this.cargasHorarias.find(ch => ch.id === cargaHorariaId);

  // Verificar si la cantidad de horas es 40
  if (cargaHorariaSeleccionada?.cantidad === 40) {
    // Habilitar el campo 'adicional' si la carga horaria es 40
    this.legajoForm.get('adicional')?.enable();

    // Hacer obligatorio el campo adicional
    this.legajoForm.get('adicional')?.setValidators([Validators.required]);
  } else {
    // Deshabilitar el campo 'adicional' si la carga horaria no es 40
    this.legajoForm.get('adicional')?.disable();

    // Resetear el valor de 'adicional' a null si se deshabilita
    this.legajoForm.get('adicional')?.setValue(null);

    // Eliminar validación obligatoria
    this.legajoForm.get('adicional')?.clearValidators();
  }

  // Actualizar la validez de 'adicional' después de modificar los validadores
  this.legajoForm.get('adicional')?.updateValueAndValidity();

  // Aseguramos que el formulario se revalide al cambiar la carga horaria
  this.legajoForm.updateValueAndValidity();
}

// Función para actualizar las opciones de cargaHoraria según la categoría seleccionada
updateCargaHorarias(categoriaNombre: string): void {
  if (categoriaNombre === "24 HS") {
    // Si la categoría es "24 HS", solo mostramos la opción de carga horaria 24
    this.filteredCargasHorarias = this.cargasHorarias.filter(ch => ch.cantidad === 24);
  } else {
    // Si se selecciona cualquier otra categoría, mostramos todas las opciones menos 24
    this.filteredCargasHorarias = this.cargasHorarias.filter(ch => ch.cantidad !== 24);
  }
}

  listProfesiones(): void {
    this.profesionService.list().subscribe(data => {
      this.profesiones = data;
    }, error => {
      console.log(error);
    });
  }

  resetEspecialidades(): void {
    this.legajoForm.get('especialidades')?.setValue([]);
    this.especialidadesList = [];
    this.legajoForm.get('especialidades')?.disable();
    this.noEspecialidadesMessage = '';
  }
  
  filterEspecialidadesByProfesion(profesionId: number): void {
    this.especialidadService.list().subscribe(data => {
      this.especialidadesList = data.filter(especialidad => especialidad.profesion.id === profesionId);
  
      if (this.especialidadesList.length > 0) {
        this.legajoForm.get('especialidades')?.enable();
        this.noEspecialidadesMessage = '';
      } else {
        this.legajoForm.get('especialidades')?.disable();
        this.noEspecialidadesMessage = 'La profesión seleccionada no posee especialidades.';
      }
    }, error => {
      console.log('Error al cargar las especialidades:', error);
      this.legajoForm.get('especialidades')?.disable();
      this.noEspecialidadesMessage = 'Error al cargar las especialidades. Intente nuevamente.';
    });
  }

  listUdos(): void {
    this.hospitalService.list().subscribe(data => {
      this.efectores = data;
    }, error => {
      console.log(error);
    });
  }

  listTipoGuardia(): void {
    this.tipoGuardiaService.list().subscribe(data => {
      this.tipoGuardias = data;
    }, error => {
      console.log(error);
    });
  }

  listCargo(): void {
    this.cargoService.list().subscribe(data => {
      this.cargos = data;
    }, error => {
      console.log(error);
    });
  }

  listRegion(): void {
    this.regionService.list().subscribe(data => {
      this.regiones = data;
    }, error => {
      console.log(error);
    });
  }

  onTipoGuardiaSelectionChange(event: any): void {
    const selectedValues = this.legajoForm.get('tipoGuardias')!.value;
  
    // Si se selecciona el tipo 4 (CONTRAFACTURA), deseleccionar todas las demás opciones
    if (selectedValues.includes(4)) {
      this.legajoForm.patchValue({
        tipoGuardias: [4]  // Solo mantener el tipo 4
      });
    } else if (selectedValues.includes(5)) {
      // Si se selecciona el tipo 5 (PASIVA), deseleccionar todas las demás opciones
      this.legajoForm.patchValue({
        tipoGuardias: [5]  // Solo mantener el tipo 5
      });
    } else {
      // Si se seleccionan otras opciones (1, 2, 3), mantenerlas
      this.legajoForm.patchValue({
        tipoGuardias: selectedValues.filter((value: number) => value !== 4 && value !== 5)
      });
    }
  
    // Comprobar si se seleccionaron tipos de guardia 4 o 5 para deshabilitar el panel de Situación de Revista
    this.toggleSituacionRevista(selectedValues);
  }
  
  toggleSituacionRevista(selectedValues: number[]): void {
    // Si se selecciona el tipo 4 o 5, deshabilitar "Situación de Revista"
    if (selectedValues.length === 0 || selectedValues.includes(4) || selectedValues.includes(5)) {
      this.isSituacionRevistaEnabled = false;
      this.disableSituacionRevistaFields();
      this.resetSituacionRevistaFields();
    } else {
      this.isSituacionRevistaEnabled = true;
      this.enableSituacionRevistaFields();
    }
  }

  resetSituacionRevistaFields(): void {
    this.legajoForm.get('agrupacion')?.setValue(null);
    this.legajoForm.get('categoria')?.setValue(null);
    this.legajoForm.get('adicional')?.setValue(null);
    this.legajoForm.get('cargaHoraria')?.setValue(null);
    this.legajoForm.get('tipoRevista')?.setValue(null);
    this.legajoForm.get('udo')?.setValue(null);
    this.legajoForm.get('efectores')?.setValue(null);
  }
  
  disableSituacionRevistaFields(): void {
    this.legajoForm.get('agrupacion')?.disable();
    this.legajoForm.get('categoria')?.disable();
    this.legajoForm.get('adicional')?.disable();
    this.legajoForm.get('cargaHoraria')?.disable();
    this.legajoForm.get('tipoRevista')?.disable();
    this.legajoForm.get('udo')?.disable();
    this.legajoForm.get('efectores')?.disable();
  }
  
  enableSituacionRevistaFields(): void {
    this.legajoForm.get('agrupacion')?.enable();
    this.legajoForm.get('categoria')?.enable();
    this.legajoForm.get('adicional')?.enable();
    this.legajoForm.get('cargaHoraria')?.enable();
    this.legajoForm.get('tipoRevista')?.enable();
    this.legajoForm.get('udo')?.enable();
    this.legajoForm.get('efectores')?.enable();
  }
  
  listCategorias(): void {
    this.categoriaService.list().subscribe(data => {
      this.categorias = data;
    }, error => {
      console.log(error);
    });
  }

  listAdicionales(): void {
    this.adicionalService.list().subscribe(data => {
      this.adicionales = data;
    }, error => {
      console.log(error);
    });
  }

listCargaHoraria(): void {
  this.cargaHorariaService.list().subscribe(data => {
    this.cargasHorarias = data;
    this.filteredCargasHorarias = data; // Inicialmente mostramos todas las opciones

    this.ngOnInit(); // Volver a llamar ngOnInit para aplicar la lógica de filtrado
  }, error => {
    console.log(error);
  });
}

  listTipoRevista(): void {
    this.tipoRevistaService.list().subscribe(data => {
      this.tiposRevistas = data;
    }, error => {
      console.log(error);
    });
  }

  updateLegajo(): void {
    if (this.legajoForm.valid) {
      const legajoData = this.legajoForm.value;
      
      // Verifica si el tipo de guardia incluye 4 (CONTRAFACTURA) o 5 (PASIVA)
      const tiposGuardiasSeleccionados = legajoData.tipoGuardias;
      const tiposGuardiaExcluidos = [4, 5];
      
      // Si los tipos 4 o 5 están seleccionados, no se guarda la revista
      if (tiposGuardiasSeleccionados.some((id: number) => tiposGuardiaExcluidos.includes(id))) {
        // Si se seleccionan 4 o 5, deshabilita el panel de revista (ya no necesita crearla)
        console.log('No se crea revista debido a tipos de guardia seleccionados: ', tiposGuardiasSeleccionados);
        
        // Crear legajo directamente sin pasar por la creación de la revista
        this.createLegajoDtoAndUpdate(legajoData, null);  // Aquí pasas `null`
      } else {
        // Si los tipos de guardia son válidos, proceder con la creación de la revista

      const adicional = legajoData.adicional ? legajoData.adicional : null;

      const revistaDto = new RevistaDto(
        legajoData.tipoRevista,
        legajoData.categoria,
        adicional,
        legajoData.cargaHoraria,
        legajoData.agrupacion
      );

      // Verifica si existe una revista con los atributos especificados
      this.revistaService.checkRevista(revistaDto).subscribe(
        (existingRevista) => {
          // Si existe, usa su ID
          if (existingRevista && existingRevista.id !== undefined) {
            console.log("carga horaria de la nueva revista ", existingRevista.cargaHoraria)
            this.createLegajoDtoAndUpdate(legajoData, existingRevista.id);
          } else {
            console.error('La revista existente no tiene un ID.');
          }
        },
        (error) => {
          // Si no existe, crea una nueva revista
          console.log('##### Revista no encontrada, creando una nueva.');
          this.revistaService.save(revistaDto).subscribe(
            () => {
              // Una vez creada, busca la revista nuevamente
              this.revistaService.checkRevista(revistaDto).subscribe(
                (newRevista) => {
                  if (newRevista && newRevista.id !== undefined) {
                    console.log('%%%Nueva revista creada y encontrada:', newRevista);
                    this.createLegajoDtoAndUpdate(legajoData, newRevista.id);
                  } else {
                    console.error('Error: No se pudo encontrar la nueva revista después de crearla.');
                  }
                },
                (error) => {
                  console.error('Error al buscar la revista después de crearla', error);
                }
              );
            },
            (error) => {
              console.error('%%%%%%%Error al crear la revista', error);
            }
          );
        }
      );
    }
  }
}

  createLegajoDtoAndUpdate(legajoData: any, revistaId: number | null): void {

    legajoData.esAutoridad = this.legajoForm.get('esAutoridad')?.value;
    const esRegional = legajoData.idCargo === 'Director Regional' ? true : false;

    const legajoDto = new LegajoDto(
      legajoData.fechaInicio,
      legajoData.esAutoridad,
      true,
      this.personId,
      legajoData.fechaFinal,
      esRegional,
      legajoData.matriculaNacional ?? null,
      legajoData.matriculaProvincial ?? null,            
      null, // idSuspencion
      null, //motivoBaja
      revistaId,
      legajoData.udo?.id ?? null,
      legajoData.efectores ?? null,
      legajoData.especialidades ?? null,
      legajoData.profesion ?? null,
      legajoData.tipoGuardias,
      legajoData.idCargo ?? null,
      legajoData.idRegion ?? null,
    );

    console.log("legajo a guardar ", legajoDto);
    console.log("id a modificar  ", this.idLegajo);

    this.legajoService.update(this.idLegajo, legajoDto).subscribe(
      (result) => {
        this.toastr.success('Legajo modificado con éxito', 'EXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

      if (this.asistencial) {
        this.router.navigate(['/personal-legajo-select'], {
          state: { asistencial: this.asistencial, fromAsistencial: true }
        });
      } else if (this.noAsistencial) {
        this.router.navigate(['/personal-legajo-select'], {
          state: { noAsistencial: this.noAsistencial, fromNoAsistencial: true }
        });
      } else {
        this.router.navigate(['/personal-legajo-select']);
      }
    },
    (error) => {
      this.toastr.error('Ocurrió un error al editar el Legajo', error, {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      console.error('Error al editar el legajo', error);
    }
  );
}

  nextStep(): void {
    if (this.step === 0 && !this.isPanel1Valid()) {
      this.toastr.warning('Complete todos los campos obligatorios en datos personal.', 'Campos Incompletos', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
      return;
    }

    if (this.step === 1 && !this.isPanel2Valid()) {
      this.toastr.warning('Complete todos los campos obligatorios en datos del legajo.', 'Campos Incompletos', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
      return;
    }

    if (this.step === 2 && !this.isPanel3Valid()) {
      this.toastr.warning('Complete todos los campos obligatorios en situacion de revista.', 'Campos Incompletos', { timeOut: 6000, positionClass: 'toast-top-center', progressBar: true });
      return;
    }

    this.step = (this.step + 1) % 3;  // 3 seria el numero total de paneles 0 a 2 en este caso
  }

  prevStep(): void {
    this.step = (this.step - 1 + 3) % 3;
  }

  isPanel1Valid(): boolean {
    const panel1Controls = ['persona', 'profesion', 'matriculaProvincial'];
    return panel1Controls.every(control => this.legajoForm.get(control)?.valid);
  }
*/
/*
  isPanel2Valid(): boolean {
    const panel2Controls = ['esAutoridad', 'fechaInicio', 'tipoGuardias'];
    return panel2Controls.every(control => this.legajoForm.get(control)?.valid);
  }

  isPanel3Valid(): boolean {
    const panel3Controls = ['agrupacion', 'categoria', 'adicional', 'cargaHoraria', 'tipoRevista', 'udo', 'efectores'];
    return panel3Controls.every(control => this.legajoForm.get(control)?.valid);
  }

  setStep(index: number) {
    this.step = index;
  }

  cerrarPanel() {
    this.step = -1;
  }

  cancel(): void { 
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    
    console.log('Cancelando. NoAsistencial:', this.noAsistencial);
  
    if (this.asistencial) {
      this.router.navigate(['/personal-legajo-select'], {
        state: { asistencial: this.asistencial, fromAsistencial: true }
      });
    } else if (this.noAsistencial) {
      this.router.navigate(['/personal-legajo-select'], {
        state: { noAsistencial: this.noAsistencial, fromNoAsistencial: true }
      });
    } else {
      console.error('No se encontró el objeto asistencial ni el objeto no asistencial.');
    }
  }
          
  compareFn(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  compareFn_id(o1: any, o2: any): boolean {
    return o1 && o2 ? o1 === o2 : o1 === o2;
  }
}
*/