import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  capsId: Caps | undefined;


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


  //útiles
  step = 0;
  maxDate!: Date;
  minFechaFinal!: Date;
  isAsistencial: boolean = false;
  isSituacionRevistaEnabled = false;
  asignadoAutoridad: boolean = false;
  noEspecialidadesMessage: string = '';
  idCargo?: number;
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
      hospitalEfectores: [''],
      tipoEfectorCargo: [''],
      hospitalEfectorCargo: [''],
      efectoresAutoridad: [[]],
      especialidades: [[]],
      matriculaNacional: ['', [Validators.pattern('^[0-9]{5,10}$')]],
      matriculaProvincial: ['', [Validators.required, Validators.pattern('^[0-9]{5,10}$')]],
      esAutoridad: [false, Validators.required],
      idCargo: [null],
      idRegion: [null],
      nroResolucion: [null],
      nroDecreto: [null],
      fechaResolucion: [null],
      fechaInicio: [this.initialData?.fechaInicio || '', [Validators.required, this.dateLimitePresente]],
      fechaFinal: [{ value: this.initialData?.fechaFinal || '', disabled: !this.initialData?.fechaInicio }],
      tipoGuardias: [[]],
      tipoHabilitacionesGuardias: [null, Validators.required],
      habilitacionesGuardias: [[]],
      hospitalHabilitacionesGuardias: ['', Validators.required],
      habilitacionesGenerales: [[]],
    }, { validator: this.validarFechas });

    // recupero el estado del router
const navigation = this.router.getCurrentNavigation();

if (navigation?.extras.state) {
  console.log('📦 Datos recibidos en navigation_EDIT.extras.state:', navigation.extras.state);

  this.isAsistencial = !!navigation.extras.state['asistencial'];
  this.initialData = navigation.extras.state['legajo'];
  this.fromLegajoPerson = !!navigation.extras.state['fromLegajoPerson'];
  this.fromLegajo = !!navigation.extras.state['fromLegajo'];

  this.asistencial = navigation.extras.state['asistencial'] || undefined;
  this.noAsistencial = navigation.extras.state['noAsistencial'] || undefined;

  // Logs individuales para verificar los valores
  console.log('✅ isAsistencial:', this.isAsistencial);
  console.log('📁 initialData (legajo):', this.initialData);
  console.log('👤 fromLegajoPerson:', this.fromLegajoPerson);
  console.log('📂 fromLegajo:', this.fromLegajo);
  console.log('🩺 asistencial:', this.asistencial);
  console.log('🚫 noAsistencial:', this.noAsistencial);
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
  validarFechas(formGroup: FormGroup) {
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


    this.loadCaps(); // Cargar los CAPS al iniciar

    const efectoresFiltrados = this.asistencial?.habilitacionesGuardias
    ?.filter((habilitacion: HabilitacionesGuardias) => habilitacion.activo) // Filtra solo las habilitaciones activas
    ?.flatMap((habilitacion: HabilitacionesGuardias) => habilitacion.efectores.map((efector: Efector) => efector.id)) || []; // Extraer efectores completos

    console.log('Efectores filtrados:', efectoresFiltrados);

    

    this.idContraFactura =4 // O el valor real que debe tener
  this.idExtra = 3;
  this.idPasiva = 5

  console.log('Valores iniciales:', {
    idContraFactura: this.idContraFactura,
    idExtra: this.idExtra,
    idPasiva: this.idPasiva
  });
    
    // Obtener los tipos de guardia cargados desde el backend
  const selectedGuardias = this.initialData?.tipoGuardias
  ? this.initialData.tipoGuardias.map((tipoGuardia: any) => tipoGuardia.id)
  : [];

  // Verificar si el tipo de guardia inicial o el seleccionado es Contrafactura
const esContrafactura = selectedGuardias.includes(this.idContraFactura) || 
this.legajoForm.get('tipoGuardias')?.value?.includes(this.idContraFactura);

console.log('Es Contrafactura:', esContrafactura);

  const efectoresIds = this.asistencial?.habilitacionesGuardias
        ? this.asistencial.habilitacionesGuardias
              .flatMap((habilitacion: any) =>
                  habilitacion.efectores ? habilitacion.efectores.map((efector: any) => efector.id) : []
              )
        : [];

console.log('IDs de Efectores de Habilitaciones Activas:', efectoresIds);

console.log('Tipo Guardias Inicial:', selectedGuardias);

const tieneHabilitaciones = (this.asistencial?.habilitacionesGuardias?.length ?? 0) > 0;


    if (this.initialData?.persona instanceof Asistencial) {
      this.asistencial = this.initialData.persona as Asistencial;

      
      // Asegúrate de que `habilitacionesGuardias` no esté vacío antes de acceder a la propiedad
      if (this.asistencial.habilitacionesGuardias && this.asistencial.habilitacionesGuardias.length > 0) {
          this.asistencial = this.initialData.persona as Asistencial; // Asegura que el tipo es Asistencial
      }
      
    }

    const tipoHabilitacionesGuardiasInicial = this.asistencial?.habilitacionesGuardias
  ?.filter(habilitacion => habilitacion.activo)
  ?.at(0)?.tipoEfectorEx ?? null;

    console.log('Tipo Habilitaciones Guardias inicial:', tipoHabilitacionesGuardiasInicial);
    
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
      hospitalEfectores: [''],
      tipoEfectorCargo: [''],
      hospitalEfectorCargo: [''],
      efectoresAutoridad: [[]],
      especialidades: [[]],
      matriculaNacional: ['', [Validators.pattern('^[0-9]{5,10}$')]],
      matriculaProvincial: ['', [Validators.required, Validators.pattern('^[0-9]{5,10}$')]],
      esAutoridad: [false, Validators.required],
      idCargo: [null],
      idRegion: [null],
      nroResolucion: [null],
      nroDecreto: [null],
      fechaResolucion: [null],
      fechaInicio: [this.initialData?.fechaInicio || '', [Validators.required, this.dateLimitePresente]],
  fechaFinal: [{ value: this.initialData?.fechaFinal || '', disabled: !this.initialData?.fechaInicio }],
      tipoGuardias: [[]], 
      tipoHabilitacionesGuardias: [tipoHabilitacionesGuardiasInicial, Validators.required],
      habilitacionesGuardias: [[]],
      hospitalHabilitacionesGuardias: [''],
      habilitacionesGenerales: [[]],
      tipoEfectorEx: [null],
    }, { validator: this.validarFechas });

    console.log('Tipo Habilitaciones Guardias inicial:', tipoHabilitacionesGuardiasInicial);

    if (tipoHabilitacionesGuardiasInicial) {
      if (tipoHabilitacionesGuardiasInicial === 'MINISTERIO') {
        this.habilitacionesGuardiasOptions = this.ministerios;
      } else if (tipoHabilitacionesGuardiasInicial === 'HOSPITAL') {
        this.habilitacionesGuardiasOptions = this.hospitales;
      } else if (tipoHabilitacionesGuardiasInicial === 'CAPS') {
        this.habilitacionesGuardiasOptions = this.caps;
      }
    }
  
    console.log('Opciones iniciales de Habilitaciones Guardias:', this.habilitacionesGuardiasOptions);
  console.log('hospital udo:', );

    console.log('Opciones de efector:', this.habilitacionesGuardiasOptions);

 // Inicializar udoOptions al principio del formulario
 this.habilitacionesGuardiasOptions = [];
 this.udoOptions = [];
 this.efectorOptions = [];
 this.loadInitialData(); // Inicialización básica para evitar errores


// Si hay datos iniciales, configurar udoOptions
if (this.initialData) {
  const tipoHabilitacionesGuardiasInicial = this.asistencial?.habilitacionesGuardias
  ?.filter(habilitacion => habilitacion.activo)
  ?.at(0)?.tipoEfectorEx ?? null;
  const tipoUdoInicial = this.initialData.tipoUdo ??'';
  const tipoEfectorInicial = this.initialData.tipoEfector ?? '';
  console.log('Tipo UDO inicial:', tipoUdoInicial);
  console.log('Tipo Efector inicial:', tipoEfectorInicial);
  console.log('Tipo Habilitaciones Guardias inicial:', tipoHabilitacionesGuardiasInicial);

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

  if (tipoHabilitacionesGuardiasInicial === 'MINISTERIO') {
    this.habilitacionesGuardiasOptions = this.ministerios;
  } else if (tipoHabilitacionesGuardiasInicial === 'HOSPITAL') {
    this.habilitacionesGuardiasOptions = this.hospitales;
  } else if (tipoHabilitacionesGuardiasInicial === 'CAPS') {
    this.habilitacionesGuardiasOptions = this.caps;
  }

  console.log('opciones iniciales de habilitaciones Guartias', this.habilitacionesGuardiasOptions);
  console.log('Opciones iniciales de UDO:', this.udoOptions);
  console.log('Opciones iniciales de Efector:', this.efectorOptions);

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

console.log('udoOptions inicial:', this.udoOptions);
console.log('¿Incluye WENCESLAO GALLARDO?', this.udoOptions.some(udo => udo.nombre === 'WENCESLAO GALLARDO'));

  // Llamo al servicio para obtener todos los tipos de cargo
  this.cargoService.list().subscribe((cargos: Cargo[]) => {
    this.cargos = cargos;
    // Verifico si existe el cargo 'DIRECTOR REGIONAL' sin importar la capitalización
    this.idDirectorRegional = this.cargos.find(t => t.nombre.toLowerCase() === 'director regional'.toLowerCase())?.id;
  });
  
  // Llamo al servicio para obtener todos los tipos de guardia
  this.tipoGuardiaService.list().subscribe((guardias: TipoGuardia[]) => {
    this.tipoGuardias = guardias;
    console.log('Tipos de guardia disponibles:', this.tipoGuardias);

    // Verificamos si los tipos 'CONTRAFACTURA' y 'PASIVA' están en la lista
    this.idContraFactura = this.tipoGuardias.find(t => t.nombre === 'CONTRAFACTURA')?.id;
    this.idPasiva = this.tipoGuardias.find(t => t.nombre === 'PASIVA')?.id;
    this.idExtra = this.tipoGuardias.find(t => t.nombre === 'EXTRA')?.id;
    this.idCargo = this.tipoGuardias.find(t => t.nombre === 'CARGO')?.id;
    this.idAgrupacion = this.tipoGuardias.find(t => t.nombre === 'AGRUPACION')?.id;

    // Imprimir los ids para depuración
    console.log('ID ContraFactura:', this.idContraFactura);
    console.log('ID Pasiva:', this.idPasiva);
    console.log('ID Pasiva:', this.idExtra);
  });

      // Verifica si hay datos iniciales
      if (this.initialData) {

        this.onTipoUdoChange({ value: this.initialData.tipoUdo });
        this.idLegajo = this.initialData.id ?? 0;
        this.personId = this.initialData.persona!.id!;
        

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
        console.log('efectores selected:', efectoresIds)
        console.log('udo:', this.initialData.udo);
        console.log('udo cargado:', this.initialData?.udo?.id);

       
        const efectoresAsignados = esContrafactura
  ? efectoresIds // Si es Contrafactura, usar efectoresIds
  : (this.initialData?.efectores?.map((efector: any) => efector.id) || []); // Si no, usar los efectores de initialData

console.log('Efectores asignados:', efectoresAsignados);

        
        // Carga los datos del formulario
        this.legajoForm.patchValue({
          ...this.initialData,
         
         /*  efectoresSelected: this.initialData?.efectores 
          ? this.initialData.efectores.map((efector: any) => efector.id) 
          : [],  */
          efectoresSelected: esContrafactura ? efectoresAsignados :this.initialData?.efectores ? this.initialData.efectores[0].id : 0,
          profesion: this.initialData.profesion?.id,  // Asegúrate de que se asigne el ID de la profesión
          especialidades: this.initialData.especialidades ? this.initialData.especialidades.map((especialidad: any) => especialidad.id) : [],
          adicional: this.initialData.revista?.adicional?.id,  // Cargar adicional del objeto 'Revista'
          agrupacion: this.initialData.revista?.agrupacion,  // Aquí cargas el valor de 'agrupacion'
          cargaHoraria: this.initialData.revista?.cargaHoraria?.id,  // Cargar carga horaria del objeto 'Revista'
          categoria: this.initialData.revista?.categoria?.id ?? null,  // Cargar categoría del objeto 'Revista'
          tipoRevista: this.initialData.revista?.tipoRevista?.id,  // Cargar tipo de revista del objeto 'Revista'
      
          cargo: this.initialData.cargo?.id,
          region: this.initialData.region?.id,
          tipoUdo: this.initialData.tipoUdo,
          tipoEfector: this.initialData.tipoEfector,
          udoSelected: this.initialData.udo?.id,
          persona: this.initialData.persona?.id,
         tipoHabilitacionesGuardias: tipoHabilitacionesGuardiasInicial,
         habilitacionesGuardias: efectoresFiltrados,
          fechaInicio: this.initialData.fechaInicio ? new Date(this.initialData.fechaInicio + 'T00:00:00') : null,
          fechaFinal: this.initialData.fechaFinal ? new Date(this.initialData.fechaFinal + 'T00:00:00' ) : null,
       
        }); 

        this.habilitacionesGuardiasOptions = this.asistencial?.habilitacionesGuardias
  ?.filter((habilitacion: any) => habilitacion.activo) // Filtra solo habilitaciones activas
  ?.flatMap((habilitacion: any) => habilitacion.efectores.map((efector: any) => efector)) || [];

console.log("Opciones de habilitaciones guardias:", this.habilitacionesGuardiasOptions=efectoresFiltrados,);

        this.habilitacionesGuardiasOptions = efectoresFiltrados; // Guarda los efectores completos para mostrarlos en el select

console.log('Efectores filtrados con nombre:', )

        // Habilitar opciones si ya tiene guardia EXTRA o si hay habilitaciones guardias previas
  this.showHabilitacionesGuardias = selectedGuardias.includes(this.idExtra!) || tieneHabilitaciones;

        console.log('showHabilitacionesGuardias:', this.showHabilitacionesGuardias); 


  console.log('showHabilitacionesGuardias:', this.showHabilitacionesGuardias);
  
        console.log('tipo habilitaciones Guardias cargado: ', this.asistencial?.habilitacionesGuardias?.[0]?.tipoEfectorEx);
        console.log('tipo habilitaciones Guardias cargado: ', tipoHabilitacionesGuardiasInicial);
        console.log('Valores iniciales de tipoGuardias:', this.initialData.tipoGuardias);
        console.log('Formulario tipoGuardias:', this.legajoForm.get('tipoGuardias')?.value);
        console.log('Lista de tipoGuardias:', this.tipoGuardias);
        console.log('Tipo Guardias Inicial:', this.initialData?.tipoGuardias);
        console.log('Formulario Tipo Guardias:', this.legajoForm.get('tipoGuardias')?.value);




// Llamar al método para manejar cambios en tipoUdo
 this.onTipoUdoChange({ value: this.initialData.tipoUdo });
}

        //log para ver los datos cargados 
        console.log('Datos cargados:', this.initialData);
  console.log('habilitacionesGuardias:', this.asistencial?.habilitacionesGuardias);
        console.log('tipo guardias cargadas:', this.initialData.tipoGuardias);
        
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

 

}


loadCaps(): void {
  this.capsService.list().subscribe({
    next: (caps: Caps[]) => {
      this.capsList = caps;
      console.log('Lista de CAPS cargada:', this.capsList);
      this.filterCaps();
      this.filterCapsHabilitaciones();
    },
    error: (error) => {
      console.error('Error al cargar los CAPS:', error);
    }
  });
}

filterCaps(): void {
  const udoSelected = this.initialData?.udo?.id || null;
  const efectoresSelected = this.initialData?.efectores ? this.initialData.efectores[0].id : 0;
  console.log('Efectores seleccionados:', efectoresSelected);
  console.log('UDO seleccionado:', udoSelected);

  if (efectoresSelected) {
    const capsFiltrado = this.capsList.find((caps: Caps) => caps.id === efectoresSelected);
    const idCabecera = capsFiltrado?.cabecera?.id || null;

    console.log('Caps encontrado:', capsFiltrado);
    console.log('ID Cabecera encontrado:', idCabecera);

    // Actualizar las opciones según los IDs encontrados
    if (idCabecera !== null) {
      this.efectorOptions = [idCabecera];
    }
  } else {
    console.log('Efectores seleccionados no válidos.');
  }

  if (udoSelected) {
    const capsFiltrado = this.capsList.find((caps: Caps) => caps.id === udoSelected);
    const idCabecera = capsFiltrado?.cabecera?.id || null;

    console.log('Caps encontrado:', capsFiltrado);
    console.log('ID Cabecera encontrado:', idCabecera);

    // Actualizar las opciones según los IDs encontrados
    if (idCabecera !== null) {
      this.habilitacionesGuardiasOptions = [idCabecera];
    }
  } else {
    console.log('UDO seleccionado no válido.');
  }
}

filterCapsHabilitaciones(): void {
  const efectoresFiltrados = this.asistencial?.habilitacionesGuardias
    ?.filter((habilitacion: HabilitacionesGuardias) => habilitacion.activo) // Filtra solo las habilitaciones activas
    ?.flatMap((habilitacion: HabilitacionesGuardias) => habilitacion.efectores.map((efector: Efector) => efector.id)) || []; // Extraer efectores completos
  console.log('Efectores filtrados:', efectoresFiltrados);

  if (efectoresFiltrados) {
    const capsFiltrado = this.capsList.find((caps: Caps) => caps.id === efectoresFiltrados[0]);
    const idCabecera = capsFiltrado?.cabecera?.id || null;

    console.log('Caps encontrado:', capsFiltrado);
    console.log('ID Cabecera encontrado:', idCabecera);

    // Actualizar las opciones según los IDs encontrados
    if (idCabecera !== null) {
      this.habilitacionesGuardiasOptions = [idCabecera];
    }

    // Asignar hospitalHabilitacionesGuardias aquí
    this.hospitalHabilitacionesGuardias = idCabecera;

  } else {
    console.log('No se encontraron CAPS para los efectores seleccionados.');
  }
}
// Cargar datos iniciales
private loadInitialData(): void {
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
    ({ ministerios, hospitales, tipoGuardias, cargaHorarias, adicionales }: {
      ministerios: Ministerio[],
      hospitales: Hospital[],
      tipoGuardias: TipoGuardia[],
      cargaHorarias: CargaHoraria[],
      adicionales: Adicional[]
      
    }) => {
      // Asignar listas cargadas
      this.ministerios = ministerios;
      this.hospitales = hospitales;
      this.tipoGuardias = tipoGuardias;
      this.cargasHorarias = cargaHorarias;
      this.adicionales = adicionales;
     

      console.log('Listas cargadas:');
      console.log('Ministerios:', this.ministerios);
      console.log('Hospitales:', this.hospitales);
      console.log('Tipo de guardias:', this.tipoGuardias);
      console.log('Carga horaria:', this.cargasHorarias);
      console.log('Adicionales:', this.adicionales);

      this.filterCaps();
      this.filterCapsHabilitaciones();

      const efectoresFiltrados = this.asistencial?.habilitacionesGuardias
    ?.filter((habilitacion: HabilitacionesGuardias) => habilitacion.activo) // Filtra solo las habilitaciones activas
    ?.flatMap((habilitacion: HabilitacionesGuardias) => habilitacion.efectores.map((efector: Efector) => efector.id)) || []; // Extraer efectores completos


    this.idContraFactura =4 // O el valor real que debe tener
  this.idExtra = 3;
  this.idPasiva = 5

  console.log('Valores iniciales:', {
    idContraFactura: this.idContraFactura,
    idExtra: this.idExtra,
    idPasiva: this.idPasiva
  });

      // Obtener los tipos de guardia ya cargados en initialData
const selectedGuardia = this.initialData?.tipoGuardias
? this.initialData.tipoGuardias.map((tipoGuardia: any) => tipoGuardia.id)
: [];

console.log('Tipo Guardias Inicial:', selectedGuardia);

const capsCabecera = this.capsList.find((caps: Caps) => caps.id === this.initialData?.udo?.id)?.cabecera?.id || null;
console.log('Caps Cabecera:', capsCabecera);

const efectoresSelected = this.initialData?.efectores ? this.initialData.efectores[0].id : 0;
  console.log('Efectores seleccionados:', efectoresSelected);
   if (efectoresSelected) {
    const capsFiltrado = this.capsList.find((caps: Caps) => caps.id === efectoresSelected);
    const idCabecera = capsFiltrado?.cabecera?.id || null;

    console.log('Caps encontrado:', capsFiltrado);
    console.log('ID Cabecera encontrado:', idCabecera);
   

// Verificar si el tipo de guardia inicial o el seleccionado es Contrafactura
const esContrafactura = selectedGuardia.includes(this.idContraFactura);

console.log('Es Contrafactura:', esContrafactura);


      const efectoresIds = this.asistencial?.habilitacionesGuardias
      ? this.asistencial.habilitacionesGuardias
            .flatMap((habilitacion: any) =>
                habilitacion.efectores ? habilitacion.efectores.map((efector: any) => efector.id) : []
            )
      : [];
      // Cargar valores iniciales del formulario
      console.log('efectores selected:', efectoresIds)
      console.log('Udo cargada:? ', this.initialData?.udo?.id);
      
      const efectoresElegidos = esContrafactura
      ? efectoresIds // Si es Contrafactura, usar efectoresIds
      : (this.initialData?.efectores?.map((efector: any) => efector.id) || []); // Si no, usar los efectores de initialData
    
    console.log('Efectores asignados:', efectoresElegidos);
    
      this.legajoForm.patchValue({
        /* efectoresSelected: this.initialData?.efectores 
        ? this.initialData.efectores.map((efector: any) => efector.id) 
        : [], */
        efectoresSelected: esContrafactura ? efectoresElegidos : this.initialData?.efectores ? this.initialData.efectores[0].id : 0,
        tipoGuardias: this.initialData?.tipoGuardias?.map((tipo: any) => tipo.id) || [],
        cargaHoraria: this.initialData?.revista?.cargaHoraria?.id || null,
        adicional: this.initialData?.revista?.adicional?.id || null,
        udoSelected: this.initialData?.udo?.id || null,
        persona: this.initialData?.persona?.id,
        habilitacionesGuardias: efectoresFiltrados,
        hospitalUdo: capsCabecera ? Number(capsCabecera) : null,
        hospitalEfectores: idCabecera,
        hospitalHabilitacionesGuardias: this.hospitalHabilitacionesGuardias
       
     
      });

      console.log("hospitalhabilitacionesguardia", this.hospitalHabilitacionesGuardias);
     
      console.log('Valor inicial de hospitalUdo en el formulario:', this.legajoForm.get('hospitalUdo')?.value);
      console.log('datos de habilitaciones guardias',efectoresElegidos);
      console.log('datos de habilitaciones guardias',efectoresFiltrados);
      console.log("Habilitaciones activas:", this.asistencial?.habilitacionesGuardias?.filter((h: any) => h.activo));
      console.log("Efectores de habilitaciones activas:", this.asistencial?.habilitacionesGuardias);
      console.log("IDs de efectores en el formulario:", this.legajoForm.get('habilitacionesGuardias')?.value);
      console.log('Valor inicial de hospitalUdo en el formulario:', capsCabecera);
      console.log('udoSelected cargado:', this.initialData?.udo?.id);
 
      console.log('udo selected', this.initialData?.udo?.id || null);
      this.habilitacionesGuardiasOptions = efectoresFiltrados; // Guarda los efectores completos para mostrarlos en el select
      console.log('Efectores filtrados con nombre:', efectoresFiltrados);



      const udoSelected = this.initialData?.udo?.id || null;
console.log('UDO seleccionado:', udoSelected);

//lista los caps 
      


      this.legajoForm.get('tipoGuardias')?.valueChanges.subscribe((tipoGuardias: number[]) => {
        // Mostrar habilitaciones guardias solo si se selecciona "Extra" y no "Cargo"
        this.showHabilitacionesGuardias = (this.idExtra !== undefined && tipoGuardias.includes(this.idExtra)) && (this.idCargo !== undefined && !tipoGuardias.includes(this.idCargo));
    });
    
  // Llamar a la función para manejar la lógica de habilitación
  const selectedGuardias = this.initialData?.tipoGuardias
    ? this.initialData.tipoGuardias.map((tipoGuardia: any) => tipoGuardia.id)
    : [];
  this.onGuardiaCfExtra(selectedGuardias);

  console.log('tipo de guardia cargado en el formulario:', this.legajoForm.get('tipoGuardias')?.value);
  console.log('efector cargado en habilitacion guardia formulario:', this.legajoForm.get('habilitacionesGuardias')?.value);
  console.log('tipo guardia cargado', this.initialData?.tipoGuardias);
      console.log('udo cargado:', this.initialData?.udo?.id);

      // Configuración adicional basada en tipoUdo y tipoEfector
      const tipoHabilitacionesGuardias = this.asistencial?.habilitacionesGuardias
  ?.filter(habilitacion => habilitacion.activo)
  ?.at(0)?.tipoEfectorEx ?? null;

      const tipoUdoInicial = this.initialData?.tipoUdo || '';
      const tipoEfectorInicial = this.initialData?.tipoEfector || '';
      this.onTipoUdoChange({ value: tipoUdoInicial });
      this.onTipoEfectorChange({ value: tipoEfectorInicial });
      this.onTipoHabilitacionesGuardiasChange({ value: tipoHabilitacionesGuardias });
    }},
    (error) => {
      console.error('Error al cargar los datos iniciales:', error);
    }
  );

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

  // Manejar cambios en tipoUdo
 onTipoUdoChange(event: any): void {
  const tipoUdo = event.value;
  this.tipoUdo = tipoUdo;
  console.log('Tipo UDO seleccionado:', tipoUdo);

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
    console.log('Hospital UDO inicial:', hospitalUdoValue);
    this.onHospitalUdoChange({ value: hospitalUdoValue });
  }

  console.log('Opciones UDO:', this.udoOptions);
}

  // Cargar CAPS correspondientes al hospital seleccionado
  onHospitalUdoChange(event: any): void {
    const hospitalId = event.value;
    console.log('Hospital seleccionado para cargar CAPS:', hospitalId);

    this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(data => {
      this.caps = data; // Guardamos la lista de CAPS para mostrar en el select de UDO
      this.udoOptions = this.caps; // Asignamos los CAPS al select de UDO
      this.legajoForm.get('udo')?.reset(); // Limpiar la selección actual de UDO
      // Si no se encuentran CAPS, mostrar un mensaje de Toastr
      if (this.caps.length === 0) {
        this.toastr.error('El hospital seleccionado no posee ningún CAPS registrado.', 'Sin datos', {
          timeOut: 6000,
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
  console.log('Tipo efector seleccionado:', tipoEfector);

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

  console.log('Opciones de efector:', this.efectorOptions);
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
          timeOut: 6000,
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
  onTipoHabilitacionesGuardiasChange(event: any): void {
  const tipoHabilitacionesGuardias = event.value;
  this.tipoHabilitacionesGuardias = tipoHabilitacionesGuardias;

  console.log('Tipo de habilitaciones de guardias seleccionado:', tipoHabilitacionesGuardias);

  if (tipoHabilitacionesGuardias === 'HOSPITAL') {
    // Hospital: Obtener los efectores filtrados
    const efectoresFiltrados = this.getEfectoresFiltrados();
    if (efectoresFiltrados.length > 0) {
      this.habilitacionesGuardiasOptions = efectoresFiltrados;
    } else {
      this.toastr.warning('No hay habilitaciones de guardias disponibles para hospitales.', 'Advertencia');
      this.habilitacionesGuardiasOptions = []; // Vaciar opciones
    }
  } else if (tipoHabilitacionesGuardias === 'CAPS') {
    // CAPS: Validar si los CAPS están cargados
    if (this.caps?.length > 0) {
      this.habilitacionesGuardiasOptions = this.caps;
    } else {
      // Intentar cargar los CAPS si están vacíos
      const hospitalId = this.legajoForm.get('hospitalHabilitacionesGuardias')?.value;
      if (hospitalId) {
        this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(
          (data) => {
            this.caps = data;
            this.habilitacionesGuardiasOptions = this.caps;

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
      }
    }
  }

  // Habilitar el select de habilitaciones guardias
  const efectorControl = this.legajoForm.get('habilitacionesGuardias');
  if (efectorControl) {
    efectorControl.enable();
  }

  // Verificar y limpiar valores anteriores si corresponde
  if (!this.legajoForm.get('habilitacionesGuardias')?.value?.length) {
    this.legajoForm.get('habilitacionesGuardias')?.reset();
  }

  console.log('Opciones de habilitaciones de guardias:', this.habilitacionesGuardiasOptions);
}

  // Método para cargar los CAPS correspondientes al hospital seleccionado
  onHospitalHabilitacionesGuardiasChange(event: any): void {
    const hospitalId = event.value;
    
    this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(data => {
      this.caps = data; // Guardamos la lista de CAPS para mostrar en el select de UDO
      this.habilitacionesGuardiasOptions = this.caps; // Asignamos los CAPS al select de UDO
      this.legajoForm.get('habilitacionesGuardias')?.reset(); // Limpiar la selección actual de UDO

      // Si no se encuentran CAPS, mostrar un mensaje de Toastr
      if (this.caps.length === 0) {
        this.toastr.error('El hospital seleccionado no posee ningún CAPS registrado.', 'Sin datos', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }

    }, error => {
      console.log(error);
      this.toastr.error('Ocurrió un error al cargar los CAPS.', 'Error');  // Mostrar mensaje de error en caso de fallo
    });
  }
  
  onTipoHabilitacionesGeneralesChange(event: any): void {
    const tipoHabilitacionesGenerales = event.value;
    this.tipoHabilitacionesGenerales = tipoHabilitacionesGenerales;

    // Dependiendo del valor seleccionado, asignamos los datos adecuados al segundo select
    if (tipoHabilitacionesGenerales === 'HOSPITAL') { // HOSPITAL
      this.habilitacionesGeneralesOptions = this.getEfectoresFiltrados(); // Usamos el filtrado para obtener solo los efectores disponibles
    } else if (tipoHabilitacionesGenerales === 'CAPS') { // CAPS
      this.habilitacionesGeneralesOptions = this.caps;  // Opciones específicas para CAPS
    }

    // Habilitar el select de efector después de haber elegido un tipo de efector
    const efectorControl = this.legajoForm.get('habilitacionesGenerales');
    if (efectorControl) {
      efectorControl.enable(); // Habilitar el select de efector
    }

    // Restablecer el valor de 'efector' para evitar errores si la selección actual no es válida
    this.legajoForm.get('habilitacionesGenerales')?.reset();
    this.legajoForm.get('hospitalHabilitacionesGenerales')?.reset();
  }
  
  // Método para cargar los CAPS correspondientes al hospital seleccionado
  onHospitalHabilitacionesGeneralesChange(event: any): void {
    const hospitalId = event.value;
    
    this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(data => {
      this.caps = data; // Guardamos la lista de CAPS para mostrar en el select de UDO
      this.habilitacionesGuardiasOptions = this.caps; // Asignamos los CAPS al select de UDO
      this.legajoForm.get('habilitacionesGenerales')?.reset(); // Limpiar la selección actual de UDO

      // Si no se encuentran CAPS, mostrar un mensaje de Toastr
      if (this.caps.length === 0) {
        this.toastr.error('El hospital seleccionado no posee ningún CAPS registrado.', 'Sin datos', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }

    }, error => {
      console.log(error);
      this.toastr.error('Ocurrió un error al cargar los CAPS.', 'Error');  // Mostrar mensaje de error en caso de fallo
    });
  }

  // Método para cambiar las opciones de la selección de efector
  onTipoEfectorCargoChange(event: any): void {
    const tipoEfectorCargo = event.value;
    this.tipoEfectorCargo = tipoEfectorCargo;

    // Dependiendo del valor seleccionado, asignamos los datos adecuados al segundo select
    if (tipoEfectorCargo === 'MINISTERIO') { // Ministerio
      this.efectorCargoOptions = this.ministerios;
    } else if (tipoEfectorCargo === 'HOSPITAL') { // Hospital
      this.efectorCargoOptions = this.getEfectoresFiltrados(); // Usamos el filtrado para obtener solo los efectores disponibles
    } else if (tipoEfectorCargo === 'CAPS') { // CAPS
      this.efectorCargoOptions = this.caps;  // Opciones específicas para CAPS
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
          timeOut: 6000,
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
    const cargoSeleccionado = this.legajoForm.get('idCargo')?.value;
    const idRegionControl = this.legajoForm.get('idRegion');
    const efectoresAutoridadControl = this.legajoForm.get('efectoresAutoridad');
    const habilitacionesGeneralesControl = this.legajoForm.get('habilitacionesGenerales');

    if (cargoSeleccionado === this.idDirectorRegional) {
      // Si se selecciona "DIRECTOR REGIONAL", muestra el campo de región y lo hace obligatorio
      this.showRegion = true;
      this.legajoForm.get('idRegion')?.setValidators([Validators.required]);
      this.showEfectorAutoridad = false;
      this.legajoForm.get('efectoresAutoridad')?.clearValidators();
      efectoresAutoridadControl?.reset();
      this.showHabilitacionesGenerales = false;
      this.legajoForm.get('habilitacionesGenerales')?.clearValidators();
      habilitacionesGeneralesControl?.reset();
    } else {
      // Si se selecciona cualquier otro cargo, oculta el campo de región y lo hace inválido
      this.showRegion = false;
      idRegionControl?.reset();
      this.legajoForm.get('idRegion')?.clearValidators();
      this.showEfectorAutoridad = true;
      this.legajoForm.get('efectoresAutoridad')?.setValidators([Validators.required]);
      this.showHabilitacionesGenerales = true;
      this.legajoForm.get('habilitacionesGenerales')?.setValidators([Validators.required]);
    }

    // Actualiza la validez de los campos
    this.legajoForm.get('idRegion')?.updateValueAndValidity();
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
      console.log('Error al cargar las especialidades:', error);
      this.legajoForm.get('especialidades')?.disable();
      this.noEspecialidadesMessage = 'Error al cargar las especialidades. Intente nuevamente.';
    });
  }

  onTipoGuardiaSelectionChange(event: any): void {
  
    const selectedValues = this.legajoForm.get('tipoGuardias')!.value;

    console.log('Tipos de guardia seleccionados:', selectedValues);
  
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
  
    const HabilitacionesGuardiasControl = this.legajoForm.get('habilitacionesGuardias');

    // Comprobamos si ya estaba habilitado antes de cambiarlo
  const estabaHabilitado = this.showHabilitacionesGuardias;


  console.log('Valores esperados:', {
    idContraFactura: this.idContraFactura,
    idExtra: this.idExtra,
    idPasiva: this.idPasiva
  });
    // Si se selecciona CONTRAFACTURA, EXTRA O PASIVA habilita HabilitacionesGuardias
    if (selectedValues.includes(this.idContraFactura!) || selectedValues.includes(this.idExtra!) || selectedValues.includes(this.idPasiva!)) {
      this.showHabilitacionesGuardias = true;
      this.legajoForm.get('habilitacionesGuardias')?.setValidators([Validators.required]);
    } else if (!estabaHabilitado) { 
    // Solo lo deshabilitamos si antes no estaba habilitado
    this.showHabilitacionesGuardias = false;
    HabilitacionesGuardiasControl?.reset();
    this.legajoForm.get('habilitacionesGuardias')?.clearValidators();
  }

    // Actualiza la validez de los campos
    this.legajoForm.get('habilitacionesGuardias')?.updateValueAndValidity();

    console.log('showHabilitacionesGuardias después de onGuardiaCfExtra:', this.showHabilitacionesGuardias);

    console.log('Tipos de guardia seleccionados:', selectedValues);
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
    console.log('datos enviados a guardar:', this.legajoForm.value);
  }

  //-----Save-----
    
  async updateLegajo(): Promise<void> {

    
    console.log('Formulario enviado:', this.legajoForm.value);
  console.log('Estado del formulario:', this.legajoForm.valid);

  if (this.legajoForm.invalid) {
    console.log('Formulario inválido. Errores detectados:');
    Object.keys(this.legajoForm.controls).forEach((controlName) => {
      const control = this.legajoForm.get(controlName);
      if (control?.invalid) {
        console.log(`Control "${controlName}" es inválido. Errores:`, control.errors);
      }
    });
    return; // Sal de la función si el formulario es inválido
  }

    if (this.legajoForm.valid) {
        const legajoData = this.legajoForm.value;
       
    // Asegura que tipoGuardias sea un array no vacío
    const tiposGuardiasSeleccionados = legajoData.tipoGuardias || []; // Si es null o undefined, asigna un array vacío
    const tiposGuardiaExcluidos = [this.idContraFactura];

    // Verifica si tipoGuardias está vacío o si incluye CONTRAFACTURA 
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
  console.log("No hay cambios detectados en el legajo. No se realizarán modificaciones.");
  return;
}

          // Verifica si existe una revista con los atributos especificados
          this.revistaService.checkRevista(revistaDto).subscribe(
            (existingRevista) => {
              if (existingRevista && existingRevista.id !== undefined) {
                console.log("Revista encontrada:", existingRevista);
                // Usa la ID de la revista existente
                this.updateLegajoDtoAndSave(legajoData, existingRevista.id);
              } else {
                console.error('La revista existente no tiene un ID.');
              }
            },
            (error) => {
              console.log('Revista no encontrada, creando una nueva.');
              
              // Si no existe, crear una nueva revista
              this.revistaService.save(revistaDto).subscribe(
                () => {
                  // Después de crearla, buscamos la revista
                  this.revistaService.checkRevista(revistaDto).subscribe(
                    (newRevista) => {
                      if (newRevista && newRevista.id !== undefined) {
                        console.log('Nueva revista creada:', newRevista);
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
      } else {
        console.warn('Formulario inválido, no se puede proceder.');
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
          console.log("✅ No hay habilitación previa, se tomarán como cambios.");
          return true;
        }
    
        const efectoresExistentes = habilitacionExistente.efectores.map((ef: any) => ef.id).sort();
        const efectoresNuevos = (legajoNuevo.habilitacionesGuardias || []).sort();
    
        const mismosEfectores = JSON.stringify(efectoresExistentes) === JSON.stringify(efectoresNuevos);
        const mismoTipoEfector = habilitacionExistente.tipoEfectorEx === legajoNuevo.tipoHabilitacionesGuardias;
    
        if (!mismosEfectores || !mismoTipoEfector || legajoCambio) {
          console.log("🔄 Cambios detectados en habilitaciones (efectores/tipo o legajo cambió).");
          return true;
        }
    
        return false;
      } catch (error) {
        if ((error as any).status === 404) {
          console.log("✅ No hay habilitación previa (404), se tomarán como cambios.");
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
  console.log("Diferencia en 'revista':", legajoActual?.revista, legajoNuevo?.revista);
  sonIguales = false;
} else {
  console.log("Las revistas son iguales.");
}
    
      if ((legajoActual?.profesion?.id ?? legajoActual?.profesion) !== legajoNuevo?.profesion) {
        console.log("Diferencia detectada en 'profesion':", legajoActual?.profesion, legajoNuevo?.profesion);
        sonIguales = false;
        
    } else {
      console.log("Las profesiones son iguales.");
  }
    //  Extraer IDs de especialidades del legajo actual
  const especialidadesActualIds = legajoActual?.especialidades?.map((e: any) => e.id) ?? [];
  const especialidadesNuevoIds = legajoNuevo?.especialidades ?? [];

  //  Comparar arreglos de IDs
  if (!this.arraysSonIguales(especialidadesActualIds, especialidadesNuevoIds)) {
    console.log("Diferencia detectada en 'especialidades':", especialidadesActualIds, especialidadesNuevoIds);
    sonIguales = false;
  } else {
    console.log("Las especialidades son iguales.");
  }
    
      if (legajoActual?.matriculaNacional !== legajoNuevo?.matriculaNacional) {
        console.log("Diferencia en 'matriculaNacional':", legajoActual?.matriculaNacional, legajoNuevo?.matriculaNacional);
        sonIguales = false;
      }
    
      if (legajoActual?.matriculaProvincial !== legajoNuevo?.matriculaProvincial) {
        console.log("Diferencia en 'matriculaProvincial':", legajoActual?.matriculaProvincial, legajoNuevo?.matriculaProvincial);
        sonIguales = false;
      }
    
      if (!this.fechasSonIguales(legajoActual?.fechaInicio, legajoNuevo?.fechaInicio)) {
        console.log("Diferencia en 'fechaInicio':", legajoActual?.fechaInicio, legajoNuevo?.fechaInicio);
        console.log('Comparando fechas:');
console.log('legajoActual.fechaInicio:', legajoActual?.fechaInicio, typeof legajoActual?.fechaInicio);
console.log('legajoNuevo.fechaInicio:', legajoNuevo?.fechaInicio, typeof legajoNuevo?.fechaInicio);
        sonIguales = false;
      }
    
      if (!this.fechasSonIguales(legajoActual?.fechaFinal, legajoNuevo?.fechaFinal)) {
        console.log("Diferencia en 'fechaFinal':", legajoActual?.fechaFinal, legajoNuevo?.fechaFinal);
        sonIguales = false;
      }

      const tipoGuardiasActualIds = legajoActual?.tipoGuardias?.map((tg: any) => tg.id) ?? [];
      const tipoGuardiasNuevoIds = legajoNuevo?.tipoGuardias ?? [];
    
      if (!this.arraysSonIguales(tipoGuardiasActualIds, tipoGuardiasNuevoIds)) {
        console.log("Diferencia detectada en 'tipoGuardias':", tipoGuardiasActualIds, tipoGuardiasNuevoIds);
        sonIguales = false;
      } else {
        console.log("Los tipos de guardia son iguales.");
      }
      const efectorActualId = legajoActual?.efectores?.[0]?.id ?? 0;
      if (Number(efectorActualId) !== Number(legajoNuevo?.efectoresSelected ?? 0)) {
        console.log("Diferencia en 'efector':", efectorActualId, legajoNuevo?.efectoresSelected);
        console.log("Diferencia en 'efectoresSelected':", legajoActual?.efectores, legajoNuevo?.efectoresSelected);
        console.log("Comparando efectores:");
        console.log("legajoActual?.efectores[0]?.id:", efectorActualId);
        console.log("legajoNuevo?.efectoresSelected:", legajoNuevo?.efectoresSelected);
        sonIguales = false;
      } else {
        console.log("Los efectores son iguales.");
        console.log("Comparando efectores:");
        console.log("legajoActual?.efectores[0]?.id:", efectorActualId);
        console.log("legajoNuevo?.efectoresSelected:", legajoNuevo?.efectoresSelected);
      }
    
      if ((legajoActual?.udo?.id ??  legajoNuevo?.udoSelected ) !== legajoNuevo?.udoSelected) {
        console.log("Diferencia en 'udo':", legajoActual?.udo, legajoNuevo?.udoSelected);
        console.log("Diferencia en 'udoSelected':", legajoActual?.udoSelected, legajoNuevo?.udoSelected);
        sonIguales = false;
      } else {
        console.log("Los UDOs son iguales.");
      }
    
      if (legajoActual?.tipoEfector !== legajoNuevo?.tipoEfector) {
        console.log("Diferencia en 'tipoEfector':", legajoActual?.tipoEfector, legajoNuevo?.tipoEfector);
        sonIguales = false;
      } else {
        console.log("Los tipos de efector son iguales."),legajoActual?.tipoEfector, legajoNuevo?.tipoEfector;
      }
    
      if (legajoActual?.tipoUdo !== legajoNuevo?.tipoUdo) {
        console.log("Diferencia en 'tipoUdo':", legajoActual?.tipoUdo, legajoNuevo?.tipoUdo);
        sonIguales = false;
      }
    
      return sonIguales;
    }
    async updateLegajoDtoAndSave(legajoData: any, revistaId: number | null): Promise<void> {
    // Verifica si el campo 'esAutoridad' está habilitado
    let esAutoridad: boolean ;
  
    // Si el campo 'esAutoridad' está habilitado, toma el valor del formulario
    if (this.legajoForm.get('esAutoridad')?.enabled) {
      esAutoridad = this.legajoForm.get('esAutoridad')?.value ?? false; // ✅ Se asegura que tenga un valor booleano
    } else {
      // Si el campo está deshabilitado, usa el valor guardado antes de deshabilitarlo
      esAutoridad = this.esAutoridadValor ?? false;  // ✅ Se previene un posible `undefined`
    }

  // Aquí se agrega el log para ver el valor que se asignará a esAutoridad
  console.log('Valor asignado a esAutoridad:', esAutoridad);
    
  let efectoresData = esAutoridad ? legajoData.efectoresAutoridad : legajoData.efectores;

  // Si 'efectores' o 'efectoresAutoridad' no es un array, lo convierto en uno
  if (efectoresData && !Array.isArray(efectoresData)) {
    efectoresData = [efectoresData];
  }

  // Si no hay efectores, asignar un arreglo vacío en lugar de null
  if (!efectoresData) {
    efectoresData = null;
  }
  
  // Determinar si esRegional basado en el cargo
    const esRegional = legajoData.idCargo === this.idDirectorRegional ? true : false;
console.log('legajo data', legajoData);

const efectoresSelected = Array.isArray(legajoData.efectoresSelected)
  ? legajoData.efectoresSelected
  : legajoData.efectoresSelected ? [legajoData.efectoresSelected] : [];
  console.log('efectoresSelected', efectoresSelected);


    const legajoExistente = await this.legajoService.detail(this.idLegajo).toPromise();

  if (!legajoExistente || !legajoExistente.id) {
    console.log("No existe un legajo previo, creando uno nuevo...");
    return;
  }
  
    console.log("Legajo existente encontrado:", legajoExistente);

    if (revistaId) {
      legajoData.revista = { id: revistaId };
    }
  
    
    const sonDatosLegajoIguales = this.sonLegajosIguales(legajoExistente, legajoData);
  const huboCambiosEnHabilitacion = await this.cambiosHabilitacion(legajoExistente, legajoData, !sonDatosLegajoIguales);

  // ⚠️ Esta condición debe revisarse:
  if (!sonDatosLegajoIguales || huboCambiosEnHabilitacion) {
    // Desactivar legajo + habilitación y crear nuevos
  } else {
    
    console.log("No hay cambios en el legajo ni en las habilitaciones, no se realizarán modificaciones.");

  if (this.fromAsistencial) {
    this.router.navigate(['/personal']);
  } else if (this.fromNoAsistencial) {
    this.router.navigate(['/personal-no-asistencial']);
  } else {
    this.location.back();
  }

  return;
}

      const legajoDesactivado = new LegajoDto(
        legajoData.fechaInicio,
        esAutoridad,
        false,
        legajoData.idPersona,
        legajoData.fechaFinal,
        esRegional,
        legajoData.matriculaNacional ?? null,
        legajoData.matriculaProvincial ?? null,                            
        null, // idSuspencion
        null, //motivoBaja
        revistaId,
        legajoData.udoSelected ?? null,
        efectoresSelected,
        legajoData.especialidades ??  null,
        legajoData.profesion,
        legajoData.tipoGuardias ??  null,
        legajoData.idCargo ?? null,
        legajoData.idRegion ?? null,
        legajoData.nroResolucion ?? null,
        legajoData.nroDecreto ?? null,
        legajoData.fechaResolucion ?? null,
        legajoData.tipoEfector ?? null,
        legajoData.tipoUdo ?? null,
      );

     
  
      /* const legajoDto = new LegajoDto(
        legajoData.fechaInicio,
        esAutoridad,
        true, //activo
        legajoData.idPersona,
        legajoData.fechaFinal,
        esRegional,
        legajoData.matriculaNacional ?? null,
        legajoData.matriculaProvincial ?? null,                            
        null, // idSuspencion
        null, //motivoBaja
        revistaId,
        legajoData.udoSelected ?? null,
        efectoresSelected,
        legajoData.especialidades ??  null,
        legajoData.profesion,
        legajoData.tipoGuardias ??  null,
        legajoData.idCargo ?? null,
        legajoData.idRegion ?? null,
        legajoData.nroResolucion ?? null,
        legajoData.nroDecreto ?? null,
        legajoData.fechaResolucion ?? null,
        legajoData.tipoEfector ?? null,
        legajoData.tipoUdo ?? null,
      ); */

      console.log("DTO de legajo a desactivar:", legajoDesactivado);

/* // Verificar si tipoGuardias incluye idContraFactura, idExtra o idPasiva
if (legajoData.tipoGuardias &&
  (legajoData.tipoGuardias.includes(this.idContraFactura) ||
   legajoData.tipoGuardias.includes(this.idExtra) ||
   legajoData.tipoGuardias.includes(this.idPasiva))) {
    
    // Llamar al método de guardar permisos de efectores
        this.saveHabilitacionesGuardias(legajoData);  
      } */

      
    // Verificar si el cargo es Director Regional
    if (esAutoridad){
      //si esAutoridad es true, verificar si el cargo es director regional
    if (legajoData.idCargo === this.idDirectorRegional) {
      
      //datos cargados en habilitacionesgenerales
      console.log('datos cargados en habilitacionesgenerales', legajoData);

      // Llamar al servicio para guardar habilitaciones para Director Regional
      this.habilitacionesGeneralesService.addHabilitacionesAutoridadRegional(legajoData.idPersona, legajoData.idRegion).subscribe(
        () => {
          console.log("Habilitaciones para autoridad regional guardadas con éxito.");
        },
        (error) => {
          console.error("Error al guardar habilitaciones para autoridad regional", error);
        }
      );
    } else {
      // Para otros casos, llamar al método de habilitaciones generales
      this.saveHabilitacionesGenerales(legajoData); 
    }
  }

    
      // Guardar el legajo sin la parte de revista si no corresponde
      this.legajoService.update(this.idLegajo, legajoDesactivado).subscribe(
        () => {
          console.log("Legajo desactivado correctamente.");

          console.log("Guardando legajo con tipoGuardias:", legajoData.tipoGuardias);
  // Verifica si el campo 'esAutoridad' está habilitado
  let esAutoridad;

  // Si el campo 'esAutoridad' está habilitado, toma el valor del formulario
  if (this.legajoForm.get('esAutoridad')?.enabled) {
    esAutoridad = this.legajoForm.get('esAutoridad')?.value;
  } else {
    // Si el campo está deshabilitado, usa el valor guardado antes de deshabilitarlo
    esAutoridad = this.esAutoridadValor; // Usa el valor almacenado en la variable
  }

  // Aquí se agrega el log para ver el valor que se asignará a esAutoridad
  console.log('Valor asignado a esAutoridad:', esAutoridad);
    
  let efectoresData = esAutoridad ? legajoData.efectoresAutoridad : legajoData.efectores;

  // Si 'efectores' o 'efectoresAutoridad' no es un array, lo convierto en uno
  if (efectoresData && !Array.isArray(efectoresData)) {
    efectoresData = [efectoresData];
  }

  // Si no hay efectores, asignar un arreglo vacío en lugar de null
  if (!efectoresData) {
    efectoresData = null;
  }
  
  // Determinar si esRegional basado en el cargo
    const esRegional = legajoData.idCargo === this.idDirectorRegional ? true : false;


        const legajoNuevo = new LegajoDto(
          legajoData.fechaInicio,
        esAutoridad,
        true, //activo
        legajoData.idPersona,
        legajoData.fechaFinal,
        esRegional,
        legajoData.matriculaNacional ?? null,
        legajoData.matriculaProvincial ?? null,
        null, // idSuspencion
        null, //motivoBaja
        revistaId,
        legajoData.udoSelected ?? null,
        efectoresSelected,
        legajoData.especialidades ??  null,
        legajoData.profesion,
        legajoData.tipoGuardias ??  null,
        legajoData.idCargo ?? null,
        legajoData.idRegion ?? null,
        legajoData.nroResolucion ?? null,
        legajoData.nroDecreto ?? null,
        legajoData.fechaResolucion ?? null,
        legajoData.tipoEfector ?? null,
        legajoData.tipoUdo ?? null,
      );

      let debeGuardarHabilitacion = false;

// Verificar si tipoGuardias contiene alguna de las opciones
if (legajoData.tipoGuardias &&
  (legajoData.tipoGuardias.includes(this.idCargo) ||
   legajoData.tipoGuardias.includes(this.idAgrupacion) ||
   legajoData.tipoGuardias.includes(this.idContraFactura) ||
   legajoData.tipoGuardias.includes(this.idExtra) ||
   legajoData.tipoGuardias.includes(this.idPasiva))) {
    
    debeGuardarHabilitacion = true;
}

// Llamar a la función solo si es necesario
if (debeGuardarHabilitacion) {
    console.log("Se debe guardar habilitación de guardia.");
    this.habilitacionesGuardiasService.getPermisoByPersona(legajoData.idPersona).subscribe(
        (habilitacionExistente) => {
            if (!habilitacionExistente || (Array.isArray(habilitacionExistente) && habilitacionExistente.length === 0)) {
                console.log("✅ No hay habilitación previa, guardando nueva habilitación.");
                this.crearNuevaHabilitacion(legajoData);
            } else {
                console.log("🔹 Habilitación previa encontrada, deshabilitando antes de crear nueva...");
                this.saveHabilitacionesGuardias( legajoData, !sonDatosLegajoIguales);
            }
        },
        (error) => {
            if (error.status === 404) {
                console.log("✅ No hay habilitación previa (error 404), guardando nueva habilitación.");
                this.crearNuevaHabilitacion(legajoData);
            } else {
                console.error("❌ Error al verificar habilitación existente", error);
            }
        }
    );
}

      this.legajoService.save(legajoNuevo).subscribe(
        (result) => {
          this.toastr.success('Legajo creado con éxito', 'EXITO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
    
          if (this.fromAsistencial) {
            this.router.navigate(['/personal']);
          } else if (this.fromNoAsistencial) {
            this.router.navigate(['/personal-no-asistencial']);
          } else {
            this.location.back();
          }
          
        },
        (error) => {
          this.toastr.error('Ocurrió un error al crear el Legajo', error, {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
      );
    },
    (error) => {
      console.error("Error al desactivar el legajo", error);
    }
  );
} 



    
    saveHabilitacionesGuardias(legajoData: any, forzarActualizacion: boolean = false): void {
      this.habilitacionesGuardiasService.getPermisoByPersona(legajoData.idPersona).subscribe(
        (habilitacionExistente) => {
          
          if (!habilitacionExistente ) {
            console.log("No se encontró una habilitación existente, no se realizarán cambios.");
            this.crearNuevaHabilitacion(legajoData);
            return;
          }
          console.log("Habilitación existente encontrada:", habilitacionExistente);
    
          // Extraer los IDs de efectores de la habilitación existente y la nueva
          const efectoresExistentes = habilitacionExistente.efectores.map((efector: any) => efector.id).sort();
          const efectoresNuevos = (legajoData.habilitacionesGuardias || []).sort();
    
          // Comparar efectores y tipo de efector
          const mismosEfectores = JSON.stringify(efectoresExistentes) === JSON.stringify(efectoresNuevos);
          const mismoTipoEfector = habilitacionExistente.tipoEfectorEx === legajoData.tipoHabilitacionesGuardias;
    
          // Si la habilitación existente y la nueva son iguales, no hacer nada
          if (mismosEfectores && mismoTipoEfector && !forzarActualizacion) {
            console.log("La habilitación existente es igual a la nueva, no se realizan cambios.");
            return;
          }
    
          console.log("Se detectaron cambios en la habilitación, actualizando...");
    

          //Si el tipo de guardia es CARGO o AGRUPACIÓN, se desactiva la habilitación previa
          const habilitacionesActivas = Array.isArray(habilitacionExistente) 
          ? habilitacionExistente.filter(hab => hab.activo) 
          : (habilitacionExistente.activo ? [habilitacionExistente] : []);

            if (habilitacionesActivas.length === 0) {
                console.log("No hay habilitaciones activas, no se realizará ninguna acción.");
                this.crearNuevaHabilitacion(legajoData);
                return;
            }

            console.log("Habilitaciones activas encontradas:", habilitacionesActivas);

                // 🔹 **Desactivar todas las habilitaciones activas**
                const desactivaciones = habilitacionesActivas.map((habilitacion) => {
          // Desactivar la habilitación anterior
          const habilitacionDesactivada = new HabilitacionesGuardiasDto(
            false, // Desactivar
            legajoData.idPersona,
            efectoresExistentes, 
            legajoData.tipoHabilitacionesGuardias?.tipoEfectorEx
          );

          console.log("habilitacionExistente",  legajoData.tipoHabilitacionesGuardias?.tipoEfectorEx);
          console.log("efectoresExistentes", efectoresExistentes);
          console.log("Dto de habilitación a desactivar:", habilitacionDesactivada);

                    return this.habilitacionesGuardiasService.update(habilitacion.id!, habilitacionDesactivada).toPromise();
                });

                // 🔹 **Esperar a que todas las desactivaciones se completen antes de continuar**
                Promise.all(desactivaciones)
                    .then(() => {
                        console.log("Todas las habilitaciones previas han sido desactivadas.");
                        this.crearNuevaHabilitacion(legajoData);
                        /* if (efectoresNuevos.length > 0) {

              // Crear nueva habilitación con los nuevos datos
              const nuevaHabilitacion = new HabilitacionesGuardiasDto(
                true, // Activo
                legajoData.idPersona,
                efectoresNuevos, 
                legajoData.tipoHabilitacionesGuardias
              );
    
              console.log("Dto de habilitación a crear:", nuevaHabilitacion);

              this.habilitacionesGuardiasService.save(nuevaHabilitacion).subscribe(
                  (response) => {
                      console.log("Nueva habilitación creada correctamente", response);
                  },
                  (error) => {
                      console.error("Error al crear la nueva habilitación", error);
                  }
              );
          }
          else {
            console.log("No se encontraron nuevos efectores, no se creará una nueva habilitación.");
          } */
        })
          .catch((error) => {
              console.error("Error al desactivar las habilitaciones previas", error);
          });
},
(error) => {
  if (error.status === 404) {
      console.log("No existe ninguna habilitación, no se realizará ninguna acción.");
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
      console.log("No se encontraron nuevos efectores, no se creará una nueva habilitación.");
      return;
  }

  const nuevaHabilitacion = new HabilitacionesGuardiasDto(
      true, // Activo
      legajoData.idPersona,
      efectoresNuevos, 
      legajoData.tipoHabilitacionesGuardias
  );

  console.log("Dto de habilitación a crear:", nuevaHabilitacion);

  this.habilitacionesGuardiasService.save(nuevaHabilitacion).subscribe(
      (response) => {
          console.log("Nueva habilitación creada correctamente", response);
      },
      (error) => {
          console.error("Error al crear la nueva habilitación", error);
      }
  );
}

    saveHabilitacionesGenerales(legajoData: any): void {
      this.habilitacionesGeneralesService.getPermisoByPersona(legajoData.idPersona).subscribe(
        (habilitacionExistente) => {
          // Si ya existe una habilitación, simplemente la usamos y no hacemos nada
          console.log("Habilitación existente encontrada, no se creará una nueva:", habilitacionExistente);
        },
        (error) => {
          if (error.status === 404) {
            // Si no existe una habilitación, se crea una nueva
            console.log("No se encontró una habilitación existente, creando nueva.");
            console.log('legajoData.habilitacionesGenerales:', legajoData.habilitacionesGenerales);
            const habilitacionesGeneralesDto = new HabilitacionesGeneralesDto(
              true, // activo
              legajoData.idPersona,
              legajoData.habilitacionesGenerales,
              legajoData.tipoEfectorEx
            );
            console.log('legajoData.habilitacionesGenerales:', legajoData.habilitacionesGenerales);
            console.log("enviando Dto a /habilitacionesGenerales/create:", habilitacionesGeneralesDto);
    
            this.habilitacionesGeneralesService.save(habilitacionesGeneralesDto).subscribe(
              (response) => {
                console.log("Habilitación creada correctamente", response);
              },
              (error) => {
                console.error("Error al crear la habilitación", error);
              }
            );
          } else {
            console.error("Error al verificar habilitación existente", error);
          }
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
      console.log('Tipo Udo:', this.legajoForm.get('tipoUdo')?.value);
      console.log('Tipo Efector:', this.legajoForm.get('tipoEfector')?.value);
      console.log('Udo:', this.legajoForm.get('udoSelected')?.value);
      console.log('datos en legajo data:', this.legajoForm.value);
      
    }
  

}




