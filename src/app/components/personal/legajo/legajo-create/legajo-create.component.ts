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
import { HabilitacionesGeneralesDto } from 'src/app/dto/Configuracion/HabilitacionesGeneralesDto';
import { HabilitacionesGuardiasDto } from 'src/app/dto/Configuracion/HabilitacionesGuardiasDto';
import { LegajoDto } from 'src/app/dto/Configuracion/LegajoDto';
import { RevistaDto } from 'src/app/dto/Configuracion/RevistaDto';
import { Adicional } from 'src/app/models/Configuracion/Adicional';
import { CargaHoraria } from 'src/app/models/Configuracion/CargaHoraria';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { Categoria } from 'src/app/models/Configuracion/Categoria';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Especialidad } from 'src/app/models/Configuracion/Especialidad';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { Ministerio } from 'src/app/models/Configuracion/Ministerio';
import { Profesion } from 'src/app/models/Configuracion/Profesion';
import { Region } from 'src/app/models/Configuracion/Region';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { TipoRevista } from 'src/app/models/Configuracion/TipoRevista';

import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Caps } from 'src/app/models/Configuracion/Caps';
import { HabilitacionesGenerales } from 'src/app/models/Configuracion/HabilitacionesGenerales';
import { HabilitacionesGuardias } from 'src/app/models/Configuracion/HabilitacionesGuardias';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { environment } from 'src/environments/environment.prod';


interface Agrup {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-legajo-create',
  templateUrl: './legajo-create.component.html',
  styleUrls: ['./legajo-create.component.css']
})

export class LegajoCreateComponent implements OnInit {

  fromAsistencial: boolean = false;
  fromNoAsistencial: boolean = false;
  inputValue: string = '';
  legajoForm: FormGroup;
  initialData: Asistencial | NoAsistencial | undefined;

   asistencial: Asistencial | undefined;
    noAsistencial: NoAsistencial | undefined;

  //Listas
  profesiones: Profesion[] = [];
  profesionesFiltradas: Profesion[] = [];
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
  idGuardiaCargo?: number;
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
  tipoHabilitacionesGenerales!: string;
  tipoEfectorCargo!: string;
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

  hospitalHabilitacionesGuardias!: number | null;

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
    private autoridadService: AutoridadService
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
      udo: [null, Validators.required],
      hospitalUdo: [''],
      tipoEfector: [null, Validators.required],
      efectores: [null, Validators.required],
      hospitalEfectores: [''],
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
      nroDecreto: [null],
      fechaResolucion: [null],
      fechaInicio: ['', [Validators.required, this.dateLimitePresente]],
      fechaFinal: [{ value: '', disabled: true }],
      tipoGuardias: [[]],
      tipoHabilitacionesGuardias: [''],
      habilitacionesGuardias: [[]],
      habilitacionesGuardiasHospital: [[]],
      habilitacionesGeneralesHospital: [[]],
      habilitacionesGuardiasCaps: [[]],
      habilitacionesGeneralesCaps: [[]],
      hospitalHabilitacionesGuardias: [[]],
      tipoHabilitacionesGenerales: [''],
      hospitalHabilitacionesGenerales: [''],
      habilitacionesGenerales: [[]],
      selectedHospitalsGenerales: [[]],
      selectedHospitalsGuardias: [[]],
      url: [''],

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

    //-----Recibo el objeto para realizar posteriores verificaciones-----

    // recupera el estado del router
    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras.state) {
      // Verifica si los datos recibidos son de tipo Asistencial
      this.fromAsistencial = !!navigation.extras.state['fromAsistencial'];
  
      // Asigna los datos a initialData si es de tipo Asistencial
      if (this.fromAsistencial) {
        this.initialData = navigation.extras.state['asistencial'] as Asistencial;
      }
  
      // Si no se recibe Asistencial, redirige atrás con un mensaje
      if (!this.initialData) {
        this.toastr.error('No se recibió ningún Asistencial. Consulta con soporte.', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
  
        // Regresa a la vista anterior
        this.location.back();
      }
    } else {
      // Si no se pasó el estado, redirige atrás con un mensaje
      this.toastr.error('No se recibió ningún Asistencial. Consulta con soporte.', 'Error', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
  
      // Regresa a la vista anterior
      this.location.back();
    }    
  }

  

  ngOnInit(): void {

  // Listener para el campo esAutoridad
  this.legajoForm.get('esAutoridad')?.valueChanges.subscribe(esAutoridad => {
    this.onAutoridadChange(esAutoridad);

    if (!esAutoridad) {
        this.selectedFile = null;
        this.fileUrl = null;
        this.uploadError = null;
        this.legajoForm.patchValue({ url: '' });
      }

  });

  // Listener para el campo cargo
  this.legajoForm.get('idCargo')?.valueChanges.subscribe(cargoId => {
  const cargoNombre = this.cargos.find(c => c.id === cargoId)?.nombre;
  const esAutoridad = this.legajoForm.get('esAutoridad')?.value;
  
  if (cargoId === this.idDirectorRegional && esAutoridad) {
  }
  
  // Solo llamar onCargoChange si es autoridad
  if (esAutoridad) {
    this.onCargoChange();
  }
});

  // Listener para el campo región
  this.legajoForm.get('idRegion')?.valueChanges.subscribe(regionId => {
    const regionNombre = this.regiones.find(r => r.id === regionId)?.nombre;
    
    if (regionId && this.legajoForm.get('idCargo')?.value === this.idDirectorRegional) {
    }
  });

  // Listener para número de resolución
  this.legajoForm.get('nroResolucion')?.valueChanges.subscribe(nroResolucion => {
    console.log('📋 Campo nroResolucion cambiado a:', nroResolucion);
    if (nroResolucion && this.legajoForm.get('idCargo')?.value === this.idDirectorRegional) {
      console.log('✅ Número de resolución establecido para Director Regional');
    }
  });

  // Listener para número de decreto
  this.legajoForm.get('nroDecreto')?.valueChanges.subscribe(nroDecreto => {
    console.log('📋 Campo nroDecreto cambiado a:', nroDecreto);
    if (nroDecreto && this.legajoForm.get('idCargo')?.value === this.idDirectorRegional) {
      console.log('✅ Número de decreto establecido para Director Regional');
    }
  });

  // Listener para fecha de resolución
  this.legajoForm.get('fechaResolucion')?.valueChanges.subscribe(fechaResolucion => {
    console.log('📅 Campo fechaResolucion cambiado a:', fechaResolucion);
    if (fechaResolucion && this.legajoForm.get('idCargo')?.value === this.idDirectorRegional) {
      console.log('✅ Fecha de resolución establecida para Director Regional');
    }
  });

  // Listener para fecha de inicio
  this.legajoForm.get('fechaInicio')?.valueChanges.subscribe(fechaInicio => {
    console.log('📅 Campo fechaInicio cambiado a:', fechaInicio);
    if (fechaInicio && this.legajoForm.get('idCargo')?.value === this.idDirectorRegional) {
      console.log('✅ Fecha de inicio establecida para Director Regional');
    }
  });

  // Listener para fecha final
  this.legajoForm.get('fechaFinal')?.valueChanges.subscribe(fechaFinal => {
    console.log('📅 Campo fechaFinal cambiado a:', fechaFinal);
  });

  // Listener para profesión
  this.legajoForm.get('profesion')?.valueChanges.subscribe(profesionId => {
    const profesionNombre = this.profesiones.find(p => p.id === profesionId)?.nombre;
    console.log('👨‍⚕️ Campo profesion cambiado - ID:', profesionId);
    console.log('👨‍⚕️ Campo profesion cambiado - Nombre:', profesionNombre);
  });

  // Listener para especialidades
  this.legajoForm.get('especialidades')?.valueChanges.subscribe(especialidades => {
    console.log('🎓 Campo especialidades cambiado:', especialidades);
  });

  // Listener para matrícula nacional
  this.legajoForm.get('matriculaNacional')?.valueChanges.subscribe(matricula => {
    console.log('🆔 Campo matriculaNacional cambiado a:', matricula);
  });

  // Listener para matrícula provincial
  this.legajoForm.get('matriculaProvincial')?.valueChanges.subscribe(matricula => {
    console.log('🆔 Campo matriculaProvincial cambiado a:', matricula);
  });

  // Función para evaluar si el formulario está completo para Director Regional
  this.evaluarFormularioDirectorRegional();




    const efectoresFiltrados = this.asistencial?.habilitacionesGuardias
        ?.filter((habilitacion: HabilitacionesGuardias) => habilitacion.activo) // Filtra solo las habilitaciones activas
        ?.flatMap((habilitacion: HabilitacionesGuardias) => habilitacion.efectores.map((efector: Efector) => efector.id)) || []; // Extraer efectores completos

    const idsHospitalesParaSeleccionar: number[] = [];
    const idsCapsParaSeleccionar: number[] = [];

    efectoresFiltrados.forEach((idEfector: number | undefined) => {
    if (typeof idEfector !== 'number') {
        return;
    }
 
    const esHospital = this.hospitales.some(h => h.id === idEfector);

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
    this.idGuardiaCargo = this.tipoGuardias.find(t => t.nombre === 'CARGO')?.id;
    this.idAgrupacion = this.tipoGuardias.find(t => t.nombre === 'AGRUPACION')?.id;

    // Imprimir los ids para depuración
    console.log('ID ContraFactura:', this.idContraFactura);
    console.log('ID Pasiva:', this.idPasiva);
    console.log('ID Pasiva:', this.idExtra);
  });

  //traigo info inicial
  if (this.initialData) {
    const personaId = this.initialData.id;
    this.inputValue = `${this.initialData.nombre} ${this.initialData.apellido}`;

    // Establece el valor de idPersona en el formulario
    this.legajoForm.get('idPersona')?.setValue(personaId);

    // Realizar las validaciones necesarias
    this.legajoForm.get('idPersona')?.updateValueAndValidity();
    
    console.log('ID de persona inicial:', personaId);

    // Verificar si idPersona está disponible y es un número válido
    if (personaId !== undefined && personaId !== null) {
      
    // Obtener todos los legajos y filtrar los activos
    this.legajoService.list().subscribe(legajos => {
      const legajosActivos = legajos.filter(legajo => 
      legajo.persona?.id === personaId && legajo.activo
    );

  //-----Verificaciones desde tabla autoridades y sus posibles respuestas-----

  this.autoridadService.asignadoAutoridad(personaId).subscribe(response => {

    this.asignadoAutoridad = response;
            
      if (this.asignadoAutoridad) {
        // Si la persona es autoridad, verifica si tiene 2 legajos activos
        if (legajosActivos.length >= 2) {
          this.toastr.warning('Debe finalizar un legajo existente para poder realizar una nueva carga.', 'Limite de legajos alcanzado', {
            timeOut: 9000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.location.back();

        } else if (legajosActivos.length === 1) {
          // Si tiene un solo legajo activo, verifica el valor de 'esAutoridad' en legajo para saber si es un legajo General o de autoridad
          const legajoActivo = legajosActivos[0];
          const asignadoAutoridadActivo = legajoActivo.esAutoridad;
        
          // Aqui se establece el valor contrario de esAutoridad para el nuevo legajo
          if (asignadoAutoridadActivo) {
            // Si el legajo activo tiene esAutoridad = true, solo se permite esAutoridad = false en el nuevo legajo
            this.legajoForm.get('esAutoridad')?.setValue(false);
            this.esAutoridadValor = false;
          } else {
            // Si el legajo activo tiene esAutoridad = false, solo se permite esAutoridad = true en el nuevo legajo
            this.legajoForm.get('esAutoridad')?.setValue(true);
            this.esAutoridadValor = true;
          }
        
          this.legajoForm.get('esAutoridad')?.disable();  // Deshabilitar campo porque ya tiene un legajo activo
              
          this.toastr.info('La persona posee un legajo activo. Podrás cargar un tipo de legajo no existente.', 'Información', {
            timeOut: 9000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
              
        } else {
          // Si no tiene legajos activos, podemos permitir elegir 'esAutoridad' como true o false
          this.legajoForm.get('esAutoridad')?.setValue(true);  // Establecer por defecto como true
          this.legajoForm.get('esAutoridad')?.enable();
          this.toastr.info('La persona está registrada como autoridad.', 'Información', {
            timeOut: 9000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
        
        // Si la persona es autoridad, verificar los legajos activos
        const legajoConTipoGuardiaCargo = legajosActivos.find(legajo => 
          !legajo.esAutoridad && 
          legajo.tipoGuardias.some(tipo => tipo.id === this.idGuardiaCargo || tipo.id === this.idAgrupacion)
        );
        
        if (legajoConTipoGuardiaCargo) {
          this.toastr.warning('Para poder cargar un legajo de autoridad, debes dar de baja el legajo existente con tipo guardia de cargo y agrupacion.', 'Acción Requerida', {
            timeOut: 9000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.location.back();  // Redirigir a la página anterior
        }
      } else {
        // Si no es autoridad, verificar si tiene 1 legajo activo
        if (legajosActivos.length >= 1) {
          // Si ya tiene un legajo activo, mostramos un mensaje y redirigimos
          this.toastr.warning('Debe finalizar un legajo existente para poder realizar una nueva carga', 'Limite de legajos alcanzado', {
            timeOut: 9000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.location.back();  // Redirigir a la página anterior
        } else {
          // Si no tiene legajos activos, podemos proceder a cargar el formulario
          this.legajoForm.get('idPersona')?.setValidators([Validators.required]); // Vuelve a establecer la validación si es necesario
          this.legajoForm.get('idPersona')?.updateValueAndValidity(); // Asegúrate de que la validación sea evaluada
          this.toastr.info('La persona no está registrada como autoridad, solo puedes cargar un legajo general.', 'Información', {
            timeOut: 9000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.legajoForm.get('esAutoridad')?.setValue(false);  // Asegurar que esté en false
          this.legajoForm.get('esAutoridad')?.disable();  // Deshabilitar el campo esAutoridad
        }
      }
    }, error => {
      console.error('Error al verificar si la persona es autoridad:', error);
    });

    }, error => {
    console.error('Error al obtener los legajos:', error);
    });
    } else {
      console.error('ID de persona no disponible o no es válido');
    }

  }

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

   this.legajoForm.setValidators([
    this.alMenosUnoRequeridoValidator(),
    this.habilitacionesGuardiasValidator()
  ]);

}

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

    // 🔥 VALIDAR SOLO JPG Y PNG
  const validTypes = ['image/jpeg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    this.uploadError = 'Solo se permiten imágenes JPG o PNG';
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

    // 🔥 RESETEAR ESTADO DE DUPLICADO
    this.isDuplicateImage = false;
    this.uploadError = null;
    this.selectedFile = file;

    // 🔥 MOSTRAR PREVIEW LOCAL INMEDIATAMENTE
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.fileUrl = e.target.result;
    };
    reader.readAsDataURL(file);

    this.toastr.info('Imagen seleccionada. Se subirá cuando se cree el legajo.');
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
    this.fileUrl = null;
    
    const fileInput = document.getElementById('archivo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    
    this.toastr.info('Archivo removido');
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
    } else if (this.selectedFile && !this.uploadError) {
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

  private uploadImageAfterCreation(legajoId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve(null);
        return;
      }

      console.log('🔄 Iniciando subida de imagen para legajo ID:', legajoId);
      this.isUploading = true;
      const formData = new FormData();
      formData.append('image', this.selectedFile);

      this.legajoService.uploadImage(legajoId, formData).subscribe(
        (response: any) => {
          console.log('✅ Imagen subida exitosamente después de crear legajo:', response);
          console.log('📝 URL de la imagen:', response.url);
          
          this.isUploading = false;
          this.fileUrl = `${environment.apiUrl}${response.url}`;
          
          const fileInput = document.getElementById('archivo') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
          this.selectedFile = null;
          
          this.toastr.success('Legajo e imagen guardados correctamente');
          resolve(response);
        },
        (error) => {
          console.error('❌ Error al subir imagen después de crear legajo:', error);
          this.isUploading = false;
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
      this.evaluarEstadoDirectorRegional();
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
    console.log('🎯 EVALUANDO ESTADO DE DIRECTOR REGIONAL');
    
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
      idPersona: this.legajoForm.get('idPersona')?.value
    };

    console.log('📊 ESTADO DE CAMPOS PARA DIRECTOR REGIONAL:');
    Object.entries(camposRequeridos).forEach(([campo, valor]) => {
      const estado = valor ? '✅' : '❌';
      console.log(`${estado} ${campo}:`, valor);
    });

    const todosCamposCompletos = Object.values(camposRequeridos).every(valor => 
      valor !== null && valor !== undefined && valor !== ''
    );

    // Actualizar la propiedad que controla si el formulario es válido para Director Regional
    this.formularioValidoParaDirectorRegional = todosCamposCompletos;

    if (todosCamposCompletos) {
      console.log('🎉 TODOS LOS CAMPOS REQUERIDOS PARA DIRECTOR REGIONAL ESTÁN COMPLETOS');
      this.toastr.success('Todos los campos para Director Regional están completos', 'Formulario Listo', {
        timeOut: 3000,
        positionClass: 'toast-top-right',
        progressBar: true
      });
    } else {
      const camposFaltantes = Object.entries(camposRequeridos)
        .filter(([_, valor]) => !valor)
        .map(([campo, _]) => campo);
      
      console.log('⚠️ CAMPOS FALTANTES PARA DIRECTOR REGIONAL:', camposFaltantes);
    }
  } else {
    // Si no es Director Regional, usar validación normal
    this.formularioValidoParaDirectorRegional = false;
  }
}

habilitacionesGuardiasValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const habilitacionesHospital = group.get('habilitacionesGuardiasHospital')?.value;
    const habilitacionesCaps = group.get('habilitacionesGuardiasCaps')?.value;
    const tipoGuardias = group.get('tipoGuardias')?.value || [];
    const esAutoridad = group.get('esAutoridad')?.value;

    // 🎯 SOLO APLICAR VALIDACIÓN SI NO ES AUTORIDAD Y SE MUESTRAN HABILITACIONES DE GUARDIAS
    if (!esAutoridad && this.showHabilitacionesGuardias) {
      console.log('🔍 VALIDANDO HABILITACIONES DE GUARDIAS');
      console.log('- habilitacionesHospital:', habilitacionesHospital);
      console.log('- habilitacionesCaps:', habilitacionesCaps);
      console.log('- tipoGuardias:', tipoGuardias);

      // Verificar si hay tipos de guardia que requieren habilitaciones
      const requiereHabilitaciones = tipoGuardias.some((tipo: number) => 
        tipo === this.idContraFactura || tipo === this.idExtra || tipo === this.idPasiva
      );

      if (requiereHabilitaciones) {
        const tieneHospital = Array.isArray(habilitacionesHospital) && habilitacionesHospital.length > 0;
        const tieneCaps = Array.isArray(habilitacionesCaps) && habilitacionesCaps.length > 0;

        console.log('- tieneHospital:', tieneHospital);
        console.log('- tieneCaps:', tieneCaps);

        // Si no hay ni hospitales ni caps seleccionados
        if (!tieneHospital && !tieneCaps) {
          console.log('❌ Error: Debe seleccionar al menos un efector para guardias');
          return { habilitacionesGuardiasRequeridas: true };
        }
      }
    }

    return null;
  };
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


//------LISTAS--------

  listMinisterios(): void {
    this.ministerioService.list().subscribe(data => {
      this.ministerios = data;
    }, error => {
      console.log(error);
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

      this.profesionesFiltradas = this.profesiones.filter(p => {
        const nombre = p.nombre
          .toLowerCase()
          .normalize("NFD") // separa letras y acentos
          .replace(/[\u0300-\u036f]/g, ""); // elimina los acentos

        return nombre === 'medico' || nombre === 'bioquimico';
      });
    }, error => {
      console.error(error);
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

  onHospitalesChange(event: any): void {
  this.selectedHospitals = event.value; // Obtener los hospitales seleccionados
  this.updateCombinedValues();
  
  // 🔥 FORZAR REVALIDACIÓN
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
  
  // 🔥 FORZAR REVALIDACIÓN
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
  this.selectedHospitals = [...selectedHospitalsGuardias];
  this.selectedHospitals.forEach((hospital: any) => updatedCombinedValues.add(hospital));

  // Obtener CAPS seleccionados
  const selectedCapsGuardias = this.legajoForm.get('habilitacionesGuardiasCaps')?.value || [];
  this.selectedCaps = [...selectedCapsGuardias];
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
    habilitacionesGuardias: Array.from(updatedCombinedValues)
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

  // Método para cambiar las opciones de la selección de UDO
  onTipoUdoChange(event: any): void {
    const tipoUdo = event.value;
    this.tipoUdo = tipoUdo;

    // Dependiendo del valor seleccionado, asignamos los datos adecuados al segundo select
    if (tipoUdo === 'MINISTERIO') { // Ministerio
      this.udoOptions = this.ministerios;
    } else if (tipoUdo === 'HOSPITAL') { // Hospital
      this.udoOptions = this.hospitales;
    } else if (tipoUdo === 'CAPS') { // CAPS
      this.udoOptions = this.caps;
    }

    // Habilitar el select de UDO después de haber elegido un tipo de efector
    const udoControl = this.legajoForm.get('udo');
    if (udoControl) {
      udoControl.enable(); // Habilitar el select de UDO
    }

    // Restablecer el valor de 'udo' para evitar errores si la selección actual no es válida
    this.legajoForm.get('hospitalUdo')?.reset();
    this.legajoForm.get('udo')?.reset();
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

    // Dependiendo del valor seleccionado, asignamos los datos adecuados al segundo select
    if (tipoEfector === 'MINISTERIO') { // Ministerio
      this.efectorOptions = this.ministerios;
    } else if (tipoEfector === 'HOSPITAL') { // Hospital
      this.efectorOptions = this.getEfectoresFiltrados(); // Usamos el filtrado para obtener solo los efectores disponibles
    } else if (tipoEfector === 'CAPS') { // CAPS
      this.efectorOptions = this.caps;  // Opciones específicas para CAPS
    }

    // Habilitar el select de efector después de haber elegido un tipo de efector
    const efectorControl = this.legajoForm.get('efectores');
    if (efectorControl) {
      efectorControl.enable(); // Habilitar el select de efector
    }

    // Restablecer el valor de 'efector' para evitar errores si la selección actual no es válida
    this.legajoForm.get('hospitalEfectores')?.reset();
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

  /* // Método para cambiar las opciones de la seleccion de efector
  onTipoHabilitacionesGuardiasChange(event: any): void {
    const tipoHabilitacionesGuardias = event.value;
    this.tipoHabilitacionesGuardias = tipoHabilitacionesGuardias;

    // Dependiendo del valor seleccionado, asignamos los datos adecuados al segundo select
    if (tipoHabilitacionesGuardias === 'HOSPITAL') { // Hospital
      this.habilitacionesGuardiasOptions = this.getEfectoresFiltrados(); // Usamos el filtrado para obtener solo los efectores disponibles
    } else if (tipoHabilitacionesGuardias === 'CAPS') { // CAPS
      this.habilitacionesGuardiasOptions = this.caps;  // Opciones específicas para CAPS
    }

    // Habilitar el select de efector después de haber elegido un tipo de efector
    const efectorControl = this.legajoForm.get('habilitacionesGuardias');
    if (efectorControl) {
      efectorControl.enable(); // Habilitar el select de efector
    }

    // Restablecer el valor de 'efector' para evitar errores si la selección actual no es válida
    this.legajoForm.get('habilitacionesGuardias')?.reset();
    this.legajoForm.get('hospitalHabilitacionesGuardias')?.reset();
  } */

  // Método para cargar los CAPS correspondientes al hospital seleccionado
 onHospitalHabilitacionesGuardiasChange(event: any): void {
  const selectedHospitalIds: number[] = event.value || [];
  this.legajoForm.patchValue({ hospitalHabilitacionesGuardias: selectedHospitalIds });

  console.log('🏥 HOSPITALES SELECCIONADOS PARA CAPS (GUARDIAS):', selectedHospitalIds);

  const previousHospitalIds = this.selectedHospitalsGuardias || [];
  const removedHospitalIds = previousHospitalIds.filter((id: number) => !selectedHospitalIds.includes(id));
  const addedHospitalIds = selectedHospitalIds.filter((id: number) => !previousHospitalIds.includes(id));
  
  console.log('🔄 HOSPITALES REMOVIDOS:', removedHospitalIds);
  console.log('✅ HOSPITALES AGREGADOS:', addedHospitalIds);
  
  this.selectedHospitalsGuardias = selectedHospitalIds;

  // 🔥 SI NO HAY HOSPITALES SELECCIONADOS, LIMPIAR TODO
  if (selectedHospitalIds.length === 0) {
    console.log('🧹 LIMPIANDO TODAS LAS LISTAS - No hay hospitales seleccionados');
    this.caps = [];
    this.habilitacionesGuardiasCaps = [];
    this.legajoForm.get('habilitacionesGuardiasCaps')?.reset();
    this.selectedCaps = [];
    this.toastr.warning('Debe seleccionar al menos un hospital para listar CAPS.', 'Advertencia');
    return;
  }

  const currentCaps = this.legajoForm.get('habilitacionesGuardiasCaps')?.value || [];

  // 🔥 ELIMINAR CAPS DE HOSPITALES DESELECCIONADOS
  if (removedHospitalIds.length > 0) {
    console.log('🗑️ PROCESANDO ELIMINACIÓN DE CAPS DE HOSPITALES DESELECCIONADOS');
    
    const promesasEliminacion = removedHospitalIds.map((hospitalId: number) => {
      return this.hospitalService.listActiveCapsByHospitalId(hospitalId).toPromise()
        .then((capsToRemove) => {
          console.log(`📋 CAPS a eliminar del hospital ${hospitalId}:`, capsToRemove);
          
          // Filtrar CAPS actuales para eliminar los que pertenecen al hospital deseleccionado
          const filteredCaps = currentCaps.filter(
            (capId: number) => !(capsToRemove ?? []).some((cap: any) => cap.id === capId)
          );
          
          // Actualizar listas internas
          this.habilitacionesGuardiasCaps = this.habilitacionesGuardiasCaps.filter(
            (cap: any) => !(capsToRemove ?? []).some((toRemove: any) => toRemove.id === cap.id)
          );
          
          this.caps = this.caps.filter(
            (cap: any) => !(capsToRemove ?? []).some((toRemove: any) => toRemove.id === cap.id)
          );
          
          return filteredCaps;
        })
        .catch((error) => {
          console.error(`❌ Error al obtener CAPS del hospital ${hospitalId}:`, error);
          return currentCaps; // Retornar CAPS actuales si hay error
        });
    });

    Promise.all(promesasEliminacion).then((resultados) => {
      // Tomar el último resultado filtrado
      const capsFinales = resultados[resultados.length - 1] || [];
      this.legajoForm.patchValue({ habilitacionesGuardiasCaps: capsFinales });
      this.selectedCaps = capsFinales;
      this.updateCombinedValues();
      console.log('✅ CAPS actualizados después de eliminaciones:', capsFinales);
    });
  }

  // 🔥 AGREGAR CAPS DE HOSPITALES NUEVAMENTE SELECCIONADOS
  if (addedHospitalIds.length > 0) {
    console.log('➕ PROCESANDO ADICIÓN DE CAPS DE HOSPITALES SELECCIONADOS');
    
    const promesasAdicion = addedHospitalIds.map((hospitalId: number) => {
      console.log(`🔍 Cargando CAPS para hospital ID: ${hospitalId}`);
      
      return this.hospitalService.listActiveCapsByHospitalId(hospitalId).toPromise()
        .then((data) => {
          console.log(`📋 CAPS encontrados para hospital ${hospitalId}:`, data);
          
          if (data && data.length === 0) {
            this.toastr.warning(
              `El hospital con ID ${hospitalId} no posee CAPS registrados.`,
              'Sin datos'
            );
            return [];
          }

          // 🔥 FILTRAR CAPS ÚNICOS PARA EVITAR DUPLICADOS
          const capsArray = Array.isArray(data) ? data : [];
          const nuevoCaps = capsArray.filter(
            (cap) => !this.caps.some((existingCap) => existingCap.id === cap.id)
          );
          
          // Agregar a las listas internas
          this.caps = [...this.caps, ...nuevoCaps];
          this.habilitacionesGuardiasCaps = [...this.habilitacionesGuardiasCaps, ...capsArray];
          
          console.log(`✅ CAPS agregados para hospital ${hospitalId}:`, capsArray);
          console.log('📊 Lista completa de CAPS disponibles:', this.caps);
          console.log('📊 Lista completa de habilitacionesGuardiasCaps:', this.habilitacionesGuardiasCaps);
          
          return capsArray;
        })
        .catch((error) => {
          console.error(`❌ Error al cargar CAPS del hospital ${hospitalId}:`, error);
          this.toastr.error(`Error al cargar los CAPS del hospital con ID ${hospitalId}.`, 'Error');
          return [];
        });
    });

    Promise.all(promesasAdicion).then((resultados) => {
      console.log('🎉 TODAS LAS PROMESAS DE ADICIÓN COMPLETADAS');
      console.log('📊 Resultados de adición:', resultados);
      
      // Forzar actualización de la vista
      this.legajoForm.updateValueAndValidity();
      
      // Verificar que las listas estén actualizadas
      console.log('📊 Estado final de listas:');
      console.log('- this.caps:', this.caps);
      console.log('- this.habilitacionesGuardiasCaps:', this.habilitacionesGuardiasCaps);
      console.log('- this.selectedCaps:', this.selectedCaps);
    });
  }

  // 🔥 FORZAR ACTUALIZACIÓN FINAL
  setTimeout(() => {
    this.legajoForm.updateValueAndValidity();
    console.log('🔄 ACTUALIZACIÓN FORZADA COMPLETADA');
  }, 100);
}

 /*  onTipoHabilitacionesGeneralesChange(event: any): void {
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
  } */
  
  // Método para cargar los CAPS correspondientes al hospital seleccionado
 onHospitalHabilitacionesGeneralesChange(event: any): void {

  const selectedHospitalIdsGeneral: number[] = event.value || [];
  this.legajoForm.patchValue({ hospitalHabilitacionesGenerales: selectedHospitalIdsGeneral });
//revisar esta linea 
// //const previousHospitalIds = this.selectedHospitalsGenerales || [];
  const previousHospitalIds = this.selectedHospitalsGenerales || [];
  const removedHospitalIds = previousHospitalIds.filter((id: number) => !selectedHospitalIdsGeneral.includes(id));
  const addedHospitalIds = selectedHospitalIdsGeneral.filter((id: number) => !previousHospitalIds.includes(id));
  this.selectedHospitalsGenerales = selectedHospitalIdsGeneral;

  // Si no hay hospitales seleccionados, limpiar los CAPS
  if (selectedHospitalIdsGeneral.length === 0) {
    this.caps = [];
    this.habilitacionesGeneralesCaps = [];
    this.legajoForm.get('habilitacionesGeneralesCaps')?.reset();
    this.toastr.warning('Debe seleccionar al menos un hospital para listar CAPS.', 'Advertencia');
    return;
  }

  // CAPS seleccionados actuales
  const currentCaps = this.legajoForm.get('habilitacionesGeneralesCaps')?.value || [];

  // Eliminar los CAPS asociados a hospitales deseleccionados
  if (removedHospitalIds.length > 0) {
    removedHospitalIds.forEach((hospitalId: number) => {
      this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(
        (capsToRemove) => {
          const filteredCaps = currentCaps.filter(
            (capId: number) => !capsToRemove.some((cap: any) => cap.id === capId)
          );
          this.legajoForm.patchValue({ habilitacionesGeneralesCaps: filteredCaps });
          this.updateCombinedValuesGeneral();

          // Actualizar listas internas
          this.habilitacionesGeneralesCaps = this.habilitacionesGeneralesCaps.filter(
            (cap: any) => !capsToRemove.some((toRemove: any) => toRemove.id === cap.id)
          );
          this.caps = this.caps.filter(
            (cap: any) => !capsToRemove.some((toRemove: any) => toRemove.id === cap.id)
          );
        },
        (error) => {
          console.error(error);
          this.toastr.error('Error al limpiar los CAPS de hospitales deseleccionados.', 'Error');
        }
      );
    });
  }

  // Solo cargar CAPS de hospitales recientemente seleccionados
  addedHospitalIds.forEach((hospitalId: number) => {
    this.hospitalService.listActiveCapsByHospitalId(hospitalId).subscribe(
      (data) => {
        this.caps = [...this.caps, ...data];
        this.habilitacionesGeneralesCaps = [...this.habilitacionesGeneralesCaps, ...data];

        if (data.length === 0) {
          this.toastr.warning(
            `El hospital con ID ${hospitalId} no posee CAPS registrados.`,
            'Sin datos'
          );
        }
      },
      (error) => {
        console.error(error);
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
  console.log('🔄 MÉTODO onAutoridadChange ejecutado');
  console.log('👤 Campo esAutoridad cambiado a:', esAutoridad);
  
  const idCargoControl = this.legajoForm.get('idCargo');
  const idNroResolucionControl = this.legajoForm.get('nroResolucion');
  const idNroDecretoControl = this.legajoForm.get('nroDecreto');
  const idFechaResolucionControl = this.legajoForm.get('fechaResolucion');
  const idRegionControl = this.legajoForm.get('idRegion');
  const tipoGuardiasControl = this.legajoForm.get('tipoGuardias');
  const efectoresAutoridadControl = this.legajoForm.get('efectoresAutoridad');
  const habilitacionesGeneralesControl = this.legajoForm.get('habilitacionesGenerales');
  const habilitacionesGuardiasControl = this.legajoForm.get('habilitacionesGuardias');
  
  // Resetear TODOS los campos
  idCargoControl?.reset();
  idNroResolucionControl?.reset();
  idNroDecretoControl?.reset();
  idFechaResolucionControl?.reset();
  tipoGuardiasControl?.reset();
  idRegionControl?.reset();
  efectoresAutoridadControl?.reset();
  habilitacionesGeneralesControl?.reset();
  habilitacionesGuardiasControl?.reset();
  
  // 🎯 RESETEAR TODOS LOS CAMPOS DE HABILITACIONES GUARDIAS
  this.legajoForm.get('habilitacionesGuardiasHospital')?.reset();
  this.legajoForm.get('hospitalHabilitacionesGuardias')?.reset();
  this.legajoForm.get('habilitacionesGuardiasCaps')?.reset();
  
  // Resetear campos específicos de autoridad
  this.legajoForm.get('tipoEfectorCargo')?.reset();
  this.legajoForm.get('hospitalEfectorCargo')?.reset();
  this.legajoForm.get('habilitacionesGeneralesHospital')?.reset();
  this.legajoForm.get('hospitalHabilitacionesGenerales')?.reset();
  this.legajoForm.get('habilitacionesGeneralesCaps')?.reset();
  
  // 🎯 RESETEAR VARIABLES DE SELECCIÓN
  this.selectedHospitals = [];
  this.selectedCaps = [];
  this.selectedHospitalsGeneral = [];
  this.selectedCapsGeneral = [];
  this.selectedHospitalsGuardias = [];
  this.habilitacionesGuardiasCaps = [];
  this.habilitacionesGeneralesCaps = [];
  
  if (esAutoridad) {
    console.log('✅ Habilitando campos de autoridad');
    console.log('🔒 OCULTANDO campos de guardias para AUTORIDAD');
    
    // SOLO mostrar el campo de cargo, OCULTAR todo lo demás hasta que se seleccione cargo
    this.showSiEsAutoridad = true;
    this.showEfectorAutoridad = false;           // ❌ OCULTO
    this.showRegion = false;                     // ❌ OCULTO
    this.showHabilitacionesGenerales = false;    // ❌ OCULTO
    this.showHabilitacionesGuardias = false;     // ❌ OCULTO - CLAVE PARA OCULTAR GUARDIAS
    
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
    
    // 🎯 LIMPIAR VALIDADORES DE CAMPOS DE GUARDIAS
    this.legajoForm.get('habilitacionesGuardiasHospital')?.clearValidators();
    this.legajoForm.get('hospitalHabilitacionesGuardias')?.clearValidators();
    this.legajoForm.get('habilitacionesGuardiasCaps')?.clearValidators();
    
  } else {
    console.log('❌ Deshabilitando TODOS los campos de autoridad para legajo GENERAL');
    console.log('✅ HABILITANDO campos de guardias para GENERAL');
    
    // 🎯 OCULTAR TODOS LOS CAMPOS DE AUTORIDAD PARA LEGAJO GENERAL
    this.showSiEsAutoridad = false;              // ❌ OCULTO
    this.showEfectorAutoridad = false;           // ❌ OCULTO  
    this.showRegion = false;                     // ❌ OCULTO
    this.showHabilitacionesGenerales = false;    // ❌ OCULTO
    this.showHabilitacionesGuardias = false;     // ❌ OCULTO inicialmente (se mostrará según tipo guardia)
    
    // Deshabilitar campos de autoridad
    idCargoControl?.disable();
    idCargoControl?.clearValidators();
    idNroResolucionControl?.disable();
    idNroResolucionControl?.clearValidators();
    idNroDecretoControl?.disable();
    idNroDecretoControl?.clearValidators();
    idFechaResolucionControl?.disable();
    idFechaResolucionControl?.clearValidators();
    
    // Limpiar validadores de campos de autoridad
    this.legajoForm.get('efectoresAutoridad')?.clearValidators();
    this.legajoForm.get('idRegion')?.clearValidators();
    this.legajoForm.get('habilitacionesGenerales')?.clearValidators();
    this.legajoForm.get('tipoEfectorCargo')?.clearValidators();
    this.legajoForm.get('hospitalEfectorCargo')?.clearValidators();
    this.legajoForm.get('habilitacionesGeneralesHospital')?.clearValidators();
    this.legajoForm.get('hospitalHabilitacionesGenerales')?.clearValidators();
    this.legajoForm.get('habilitacionesGeneralesCaps')?.clearValidators();
    
    // 🎯 LIMPIAR VALIDADORES DE CAMPOS DE GUARDIAS (se establecerán según tipo guardia)
    this.legajoForm.get('habilitacionesGuardiasHospital')?.clearValidators();
    this.legajoForm.get('hospitalHabilitacionesGuardias')?.clearValidators();
    this.legajoForm.get('habilitacionesGuardiasCaps')?.clearValidators();
    
    // Mostrar campos de legajo general
    this.showGuardia = true;
    this.legajoForm.get('tipoGuardias')?.setValidators([Validators.required]);     
    this.legajoForm.clearValidators(); 
  }

  // Debug logs para verificar el estado
  console.log('📊 ESTADO DE CAMPOS DESPUÉS DE onAutoridadChange:');
  console.log('- showSiEsAutoridad:', this.showSiEsAutoridad);
  console.log('- showEfectorAutoridad:', this.showEfectorAutoridad);
  console.log('- showRegion:', this.showRegion);
  console.log('- showHabilitacionesGenerales:', this.showHabilitacionesGenerales);
  console.log('- showHabilitacionesGuardias:', this.showHabilitacionesGuardias);
  console.log('- showGuardia:', this.showGuardia);

  this.legajoForm.updateValueAndValidity();
  
  // Actualizar validez de todos los campos reseteados
  idCargoControl?.updateValueAndValidity();
  idNroResolucionControl?.updateValueAndValidity();
  idNroDecretoControl?.updateValueAndValidity();
  idFechaResolucionControl?.updateValueAndValidity();
  tipoGuardiasControl?.updateValueAndValidity();
  habilitacionesGuardiasControl?.updateValueAndValidity();
  this.legajoForm.get('habilitacionesGuardiasHospital')?.updateValueAndValidity();
  this.legajoForm.get('hospitalHabilitacionesGuardias')?.updateValueAndValidity();
  this.legajoForm.get('habilitacionesGuardiasCaps')?.updateValueAndValidity();

  this.evaluarEstadoDirectorRegional();
}
  
  onCargoChange(): void {
  const cargoSeleccionado = this.legajoForm.get('idCargo')?.value;
  const cargoNombre = this.cargos.find(c => c.id === cargoSeleccionado)?.nombre;
  const esAutoridad = this.legajoForm.get('esAutoridad')?.value;
  
  console.log('🔄 MÉTODO onCargoChange ejecutado');
  console.log('🏢 Cargo seleccionado - ID:', cargoSeleccionado);
  console.log('🏢 Cargo seleccionado - Nombre:', cargoNombre);
  console.log('👤 esAutoridad actual:', esAutoridad);
  
  // 🎯 SOLO EJECUTAR SI ES AUTORIDAD
  if (!esAutoridad) {
    console.log('⚠️ No es autoridad - onCargoChange no debe ejecutarse');
    return; // Salir del método si no es autoridad
  }
  
  const idRegionControl = this.legajoForm.get('idRegion');
  const efectoresAutoridadControl = this.legajoForm.get('efectoresAutoridad');
  const habilitacionesGeneralesControl = this.legajoForm.get('habilitacionesGenerales');

  if (cargoSeleccionado === this.idDirectorRegional) {
    console.log('🎯 DIRECTOR REGIONAL SELECCIONADO');
    console.log('🔓 Habilitando campo idRegion');
    console.log('🔒 Deshabilitando efectoresAutoridad y habilitacionesGenerales');

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
    console.log('🏢 Otro cargo de autoridad seleccionado');
    console.log('🔒 Deshabilitando campo idRegion');
    console.log('🔓 Habilitando efectoresAutoridad y habilitacionesGenerales');
    
    // Si se selecciona cualquier otro cargo DE AUTORIDAD, oculta el campo de región
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
  this.evaluarEstadoDirectorRegional();
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
  const esAutoridad = this.legajoForm.get('esAutoridad')?.value;
  
  // 🎯 SOLO EJECUTAR SI NO ES AUTORIDAD
  if (esAutoridad) {
    console.log('⚠️ Es autoridad - onTipoGuardiaSelectionChange no debe ejecutarse');
    return; // Salir del método si es autoridad
  }
  
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
    console.log('⚠️ Es autoridad - onGuardiaCfExtra no debe ejecutarse');
    return; // Salir del método si es autoridad
  }
  
  const HabilitacionesGuardiasControl = this.legajoForm.get('habilitacionesGuardias');

  // Si se selecciona CONTRAFACTURA, EXTRA O PASIVA habilita HabilitacionesGuardias
  if (selectedValues.includes(this.idContraFactura!) || selectedValues.includes(this.idExtra!) || selectedValues.includes(this.idPasiva!)) {
    console.log('✅ Mostrando campos de habilitaciones guardias para CF/EXTRA/PASIVA');
    this.showHabilitacionesGuardias = true;
    
    // 🔥 ESTABLECER VALIDADORES ESPECÍFICOS PARA HABILITACIONES DE GUARDIAS
    this.legajoForm.get('habilitacionesGuardias')?.setValidators([Validators.required]);
    this.legajoForm.get('habilitacionesGuardiasHospital')?.setValidators([this.alMenosUnoHabilitacionesGuardiasValidator()]);
    this.legajoForm.get('habilitacionesGuardiasCaps')?.setValidators([this.alMenosUnoHabilitacionesGuardiasValidator()]);
    
  } else {
    console.log('❌ Ocultando campos de habilitaciones guardias');
    // Si no se selecciona CONTRAFACTURA, EXTRA O PASIVA ocultar HabilitacionesGuardias
    this.showHabilitacionesGuardias = false;
    HabilitacionesGuardiasControl?.reset();
    this.legajoForm.get('habilitacionesGuardias')?.clearValidators();
    
    // 🔥 LIMPIAR VALIDADORES ESPECÍFICOS
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

  // 🔥 ACTUALIZAR VALIDADORES DEL FORMULARIO COMPLETO
  this.legajoForm.updateValueAndValidity();
  this.legajoForm.get('habilitacionesGuardias')?.updateValueAndValidity();
  this.legajoForm.get('habilitacionesGuardiasHospital')?.updateValueAndValidity();
  this.legajoForm.get('habilitacionesGuardiasCaps')?.updateValueAndValidity();
}

alMenosUnoHabilitacionesGuardiasValidator(): ValidatorFn {
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
    // Si se selecciona el CONTRAFACTURA, deshabilitar "Situación de Revista"
    if (selectedValues.length === 0 || selectedValues.includes(this.idContraFactura!)) {
      this.isSituacionRevistaEnabled = false;
      this.disableSituacionRevistaFields();
    } else {
      // Si no se selecciona CF, habilitar "Situación de Revista"
      this.isSituacionRevistaEnabled = true;
      this.enableSituacionRevistaFields();
    }
  }
      
  disableSituacionRevistaFields(): void {
    this.legajoForm.get('agrupacion')?.disable();
    this.legajoForm.get('categoria')?.disable();
    this.legajoForm.get('adicional')?.disable();
    this.legajoForm.get('cargaHoraria')?.disable();
    this.legajoForm.get('tipoRevista')?.disable();
    this.legajoForm.get('tipoUdo')?.disable();
    this.legajoForm.get('udo')?.disable();
    this.legajoForm.get('hospitalUdo')?.disable();
    this.legajoForm.get('tipoEfector')?.disable();
    this.legajoForm.get('efectores')?.disable();
    this.legajoForm.get('hospitalEfectores')?.disable();
   /*  this.legajoForm.get('tipoEfectorCargo')?.disable(); */
  }
  
  enableSituacionRevistaFields(): void {
    this.legajoForm.get('agrupacion')?.enable();
    this.legajoForm.get('categoria')?.enable();
    this.legajoForm.get('adicional')?.enable();
    this.legajoForm.get('cargaHoraria')?.enable();
    this.legajoForm.get('tipoRevista')?.enable();
    this.legajoForm.get('tipoUdo')?.enable();
    this.legajoForm.get('udo')?.enable();
    this.legajoForm.get('hospitalUdo')?.enable();
    this.legajoForm.get('tipoEfector')?.enable();
    this.legajoForm.get('efectores')?.enable();
    this.legajoForm.get('hospitalEfectores')?.enable();
    this.legajoForm.get('tipoEfectorCargo')?.enable();

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
    
    saveLegajo(): void {

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
      return; // Detener el guardado
    }

    console.log('✅ VALIDACIÓN DE HABILITACIONES DE GUARDIAS PASADA');
    console.log('- Hospitales seleccionados:', habilitacionesHospital);
    console.log('- CAPS seleccionados:', habilitacionesCaps);
  }

  if (this.formularioValidoCompleto) {
    console.log('✅ FORMULARIO VÁLIDO - PROCEDIENDO A GUARDAR');
    const legajoData = this.legajoForm.value;
    
    // Asegura que tipoGuardias sea un array no vacío
    const tiposGuardiasSeleccionados = legajoData.tipoGuardias || [];
    const tiposGuardiaExcluidos = [this.idContraFactura, this.idPasiva];

    // Verifica si tipoGuardias está vacío o si incluye CONTRAFACTURA o PASIVA
    if (tiposGuardiasSeleccionados.length === 0 || tiposGuardiasSeleccionados.some((id: number) => tiposGuardiaExcluidos.includes(id))) {
      // Crear legajo directamente sin pasar por la creación de la revista
      this.createLegajoDtoAndSave(legajoData, null);
    } else {
      // Si los tipos de guardia son válidos, procede con la creación de la revista
      const revistaDto = new RevistaDto(
        legajoData.tipoRevista,
        legajoData.categoria,
        legajoData.adicional,
        legajoData.cargaHoraria,
        legajoData.agrupacion
      );
      
      // Verifica si existe una revista con los atributos especificados
      this.revistaService.checkRevista(revistaDto).subscribe(
        (existingRevista) => {
          if (existingRevista && existingRevista.id !== undefined) {
            console.log("Revista encontrada:", existingRevista);
            this.createLegajoDtoAndSave(legajoData, existingRevista.id);
          } else {
            console.error('La revista existente no tiene un ID.');
          }
        },
        (error) => {
          console.log('Revista no encontrada, creando una nueva.');
          
          this.revistaService.save(revistaDto).subscribe(
            () => {
              this.revistaService.checkRevista(revistaDto).subscribe(
                (newRevista) => {
                  if (newRevista && newRevista.id !== undefined) {
                    console.log('Nueva revista creada:', newRevista);
                    this.createLegajoDtoAndSave(legajoData, newRevista.id);
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
    console.log('❌ FORMULARIO NO VÁLIDO');
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
      this.toastr.warning('Complete todos los campos obligatorios antes de guardar.', 'Formulario Incompleto', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
    }
  }
}
    
  createLegajoDtoAndSave(legajoData: any, revistaId: number | null): void {

    
  // Verifica si el campo 'esAutoridad' está habilitado
  let esAutoridad : boolean;

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
  console.log('=== EVALUACIÓN FINAL ANTES DE GUARDAR ===');
  console.log('🎯 Evaluando si es Director Regional...');
  console.log('legajoData.idCargo:', legajoData.idCargo);
  console.log('this.idDirectorRegional:', this.idDirectorRegional);
  console.log('¿Son iguales?:', legajoData.idCargo === this.idDirectorRegional);
  
  const esRegional = legajoData.idCargo === this.idDirectorRegional ? true : false;
  console.log('🌍 Es Regional:', esRegional);

  if (esRegional) {
    console.log('🎉 CREANDO LEGAJO DE DIRECTOR REGIONAL');
    console.log('📋 Datos finales del Director Regional:');
    console.log('- esAutoridad:', esAutoridad);
    console.log('- esRegional:', esRegional);
    console.log('- idCargo:', legajoData.idCargo);
    console.log('- idRegion:', legajoData.idRegion);
    console.log('- nroResolucion:', legajoData.nroResolucion);
    console.log('- nroDecreto:', legajoData.nroDecreto);
    console.log('- fechaResolucion:', legajoData.fechaResolucion);
    console.log('- fechaInicio:', legajoData.fechaInicio);
    console.log('- idPersona:', legajoData.idPersona);
  }
  
      const legajoDto = new LegajoDto(
        legajoData.fechaInicio,
        esAutoridad,
        true, //activo
        '',
        legajoData.idPersona,
        legajoData.fechaFinal,
        esRegional,
        legajoData.matriculaNacional ?? null,
        legajoData.matriculaProvincial ?? null,
        null, // idSuspencion
        null, //motivoBaja
        revistaId,
        legajoData.udo?.id ?? null,
        efectoresData ?? null,
        legajoData.especialidades ??  null,
        legajoData.profesion,
        legajoData.tipoGuardias ??  null,
        legajoData.idCargo ?? null,
        legajoData.idRegion ?? null,
        legajoData.nroResolucion ?? null,
        legajoData.nroDecreto ?? null,
        legajoData.fechaResolucion ?? null,
        legajoData.tipoEfector ?? null,
        legajoData.tipoEfectorCargo ?? null,
        legajoData.tipoUdo ?? null
      );

      console.log("DTO creado para guardar legajo:", legajoDto);

// Verificar si tipoGuardias incluye idContraFactura, idExtra o idPasiva
if (legajoData.tipoGuardias &&
  (legajoData.tipoGuardias.includes(this.idContraFactura) ||
   legajoData.tipoGuardias.includes(this.idExtra) ||
   legajoData.tipoGuardias.includes(this.idPasiva))) {
    
    // Llamar al método de guardar permisos de efectores
      this.saveHabilitacionesGuardias(legajoData);
      }
    
      // Verificar si el cargo es Director Regional
      if (esAutoridad) {
        // Si esAutoridad es true, verificar si el cargo es Director Regional
        if (legajoData.idCargo === this.idDirectorRegional) {

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
          // Si no es Director Regional, guardar habilitaciones generales
          this.saveHabilitacionesGenerales(legajoData);
        }
      }
    
      // Guardar el legajo sin la parte de revista si no corresponde
      this.legajoService.save(legajoDto).subscribe(
    async (legajoCreado) => {
      console.log('✅ Legajo creado exitosamente:', legajoCreado);
      
      // 🔥 SI ES AUTORIDAD Y HAY IMAGEN SELECCIONADA, SUBIRLA
      if (esAutoridad && this.selectedFile && legajoCreado.id) {
        console.log('📤 Subiendo imagen para legajo de autoridad...');
        try {
          const uploadResponse = await this.uploadImageAfterCreation(legajoCreado.id);
          
          if (uploadResponse && uploadResponse.url) {
            console.log('✅ Imagen subida correctamente:', uploadResponse.url);
            legajoCreado.url = uploadResponse.url;
          }
          
        } catch (uploadError) {
          console.error('❌ Error al subir imagen:', uploadError);
          this.toastr.warning('Legajo creado pero hubo un error al subir la imagen');
        }
      } else if (esAutoridad && !this.selectedFile) {
        console.log('ℹ️ Legajo de autoridad creado sin imagen');
        this.toastr.success('Legajo de autoridad creado correctamente');
      } else {
        console.log('ℹ️ Legajo general creado (sin imagen)');
        this.toastr.success('Legajo creado con éxito');
      }

      // 🔥 NAVEGAR SEGÚN EL TIPO DE LEGAJO
      if (this.fromAsistencial) {
        this.router.navigate(['/personal']);
      } else if (this.fromNoAsistencial) {
        this.router.navigate(['/personal-no-asistencial']);
      } else {
        this.location.back();
      }
    },
    (error) => {
      console.error('❌ Error al crear el Legajo:', error);
      this.toastr.error('Ocurrió un error al crear el Legajo', 'Error', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
    }
  );
    }

    saveHabilitacionesGuardias(legajoData: any): void {
      // Crear el objeto HabilitacionesGuardiasDto
      const habilitacionesGuardiasDto = new HabilitacionesGuardiasDto(
        true, // activo
        legajoData.idPersona,
        legajoData.habilitacionesGuardias || null,
      /*   legajoData.tipoHabilitacionesGuardias */
      );
    
      // Llamar al servicio para guardar los permisos de efectores
      this.habilitacionesGuardiasService.save(habilitacionesGuardiasDto).subscribe(
        (response) => {
          console.log("Permisos de efectores guardados correctamente", response);
        },
        (error) => {
          console.error("Error al guardar los permisos de efectores", error);
        }
      );
    }

    saveHabilitacionesGenerales(legajoData: any): void {
      // Crear el objeto HabilitacionesGeneralesDto
      const habilitacionesGeneralesDto = new HabilitacionesGeneralesDto(
        true, // activo
        legajoData.idPersona,
        legajoData.habilitacionesGenerales || null,
        /* legajoData.tipoHabilitacionesGenerales */
      );
    
      // Llamar al servicio para guardar los permisos de efectores
      this.habilitacionesGeneralesService.save(habilitacionesGeneralesDto).subscribe(
        (response) => {
          console.log("Permisos de efectores guardados correctamente", response);
        },
        (error) => {
          console.error("Error al guardar los permisos de efectores", error);
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
      const panel3Controls = ['agrupacion', 'categoria', /*'adicional', */'cargaHoraria', 'tipoRevista', 'udo', 'efectores'];
      return panel3Controls.every(control => this.legajoForm.get(control)?.valid);
    }

    setStep(index: number) {
      this.step = index;
    }

    cerrarPanel() {
      this.step = -1;
    }

}