import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CapsDto } from 'src/app/dto/Configuracion/CapsDto';
import { LegajoDto } from 'src/app/dto/Configuracion/LegajoDto';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { Ministerio } from 'src/app/models/Configuracion/Ministerio';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { Region } from 'src/app/models/Configuracion/Region';
import { AutoridadService } from 'src/app/services/Configuracion/autoridad.service';
import { CapsService } from 'src/app/services/Configuracion/caps.service';
import { CargoService } from 'src/app/services/Configuracion/cargo.service';
import { HabilitacionesGeneralesService } from 'src/app/services/Configuracion/habilitacionesGenerales.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { RegionService } from 'src/app/services/Configuracion/region.service';
//Autenticación
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { AuthService } from 'src/app/services/login/auth.service';
import { TokenService } from 'src/app/services/login/token.service';

import { forkJoin } from 'rxjs';
import { Caps } from 'src/app/models/Configuracion/Caps';
import { HabilitacionesGenerales } from 'src/app/models/Configuracion/HabilitacionesGenerales';


interface Agrup {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-legajo-edit-noasistencial',
  templateUrl: './legajo-edit-noasistencial.component.html',
  styleUrls: ['./legajo-edit-noasistencial.component.css']
})
export class LegajoEditNoasistencialComponent implements OnInit {

  fromAsistencial: boolean = false;
  fromNoAsistencial: boolean = false;
  inputValue: string = '';
  legajoForm: FormGroup;
  fromLegajoPerson: boolean = false;
  fromLegajo: boolean = false;
  initialData: Legajo | undefined;
  idLegajo: number = 0;
  personId!: number;
  asistencial: Asistencial | undefined;
  noAsistencial: NoAsistencial | undefined;


  efectores: Efector[] = [];
  hospitales: Hospital[] = [];
  ministerios: Ministerio[] = [];
  caps: CapsDto[] = [];
  cargos: Cargo[] = [];
  regiones: Region[] = [];
  capsList: Caps[] = [];

  //Autenticación
    isLogged = false;
    roles: string[] =[];
    isAdministrativo: boolean = false;
    isAutoridad: boolean = false;
    isUsuario: boolean = false;
    isDph: boolean = false;
    isSuper: boolean = false;
    userId: number | null = null;
    nombreUsuario: string = '';
    apellidoUsuario: string = '';
    nombresEfectores: EfectorSummaryDto[] = [];
    usuarioPersona: number | null = null;
    currentRole: string | null = null;

  //útiles
  step = 0;
  maxDate!: Date;
  minFechaFinal!: Date;
  isAsistencial: boolean = false;
  isSituacionRevistaEnabled = false;
  asignadoAutoridad: boolean = false;
  noEspecialidadesMessage: string = '';
  showRegion: boolean = false;
  showEfectorAutoridad: boolean = false;
  showHabilitacionesGenerales: boolean = false;
  idCargo?: number;
  idAgrupacion?: number;
  idContraFactura?: number;
  idPasiva?: number;
  idExtra?: number;
  esAutoridadValor: boolean = false;
  udoOptions: any[] = [];
  efectorOptions: any[] = [];
  efectorCargoOptions: any[] = [];  // 🔥 AGREGAR
  habilitacionesGeneralesCaps: any[] = [];
  habilitacionesGeneralesOptions: any[] = [];
  tipoUdo!: string;
  tipoEfector!: string;
  tipoHabilitacionesGenerales!: string;  // 🔥 AGREGAR
  tipoEfectorCargo!: string;
  initialHabilitacionesGenerales: any[] = [];
  selectedHospitalsGenerales: number[] = [];

  showSiEsAutoridad: boolean = false;
  formularioValidoParaDirectorRegional: boolean = false;
  idDirectorRegional?: number;

  // Arrays para múltiples selecciones
  selectedHospitals: number[] = [];
  selectedHospitalsGeneral: number[] = [];
  selectedHospitalsCaps: number[] = [];
  selectedHospitalsCapsGeneral: number[] = [];
  selectedCaps: number[] = [];
  selectedCapsGeneral: number[] = [];


  tipoHabilitacionesGuardias!: string;
  isUpdatingTipoGuardias: boolean = false;
  isSelectDisabled: boolean = true;
  previousHospitalUdo: any = null;
  previousHospitalEfector: any = null;
  previousCapsUdo: any = null;
  previousMinisterioUdo: any = null;
  initialHabilitacionesGuardias: any[] = [];
  selectedHospitalsGuardias: number[] = [];
  

  // 🔥 NUEVAS PROPIEDADES PARA MANEJO DE IMÁGENES
  selectedFile: File | null = null;
  fileUrl: string | null = null;
  isUploading: boolean = false;
  isDragOver: boolean = false;
  uploadError: string | null = null;
  pendingFile: File | null = null;
  isDuplicateDialogOpen: boolean = false;
  isDuplicateImage: boolean = false;
  dragCounter: number = 0;


  agrupaciones: Agrup[] = [
    { value: 'ADMINISTRATIVO', viewValue: 'Administrativo' },
    { value: 'MANTENIMIENTO_Y_PRODUCCION', viewValue: 'Mantenimiento y Producción' },
    { value: 'PROFESIONALES', viewValue: 'Profesionales' },
    { value: 'SERVICIOS_GENERALES', viewValue: 'Servicios Generales' },
    { value: 'TECNICOS', viewValue: 'Técnicos' },
  ];

  habilitacionExistente: any;
  legajoExistente: any;
  hospitalHabilitacionesGuardias!: number | null;
  hospitalHabilitacionesGenerales!: number | null;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService,
    private location: Location,
    private legajoService: LegajoService,
    private hospitalService: HospitalService,
    private ministerioService: MinisterioService,
    private capsService: CapsService,
    private cargoService: CargoService,
    private regionService: RegionService,
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
  
  this.selectedCapsGeneral = idsCapsParaSeleccionarGeneral;
  
  this.initialHabilitacionesGenerales =efectoresFiltradosGeneral;
  
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

          const efectoresAsignados = this.initialData?.efectores?.map((efector: any) => efector.id) || []; // Si no, usar los efectores de initialData

          // Carga los datos del formulario
          this.legajoForm.patchValue({
            ...this.initialData,
           
           /*  efectoresSelected: this.initialData?.efectores 
            ? this.initialData.efectores.map((efector: any) => efector.id) 
            : [],  */
            efectoresSelected: esDirectorRegional ? null : 
          (efectoresAsignados ? efectoresAsignados : 
           (this.initialData?.efectores && this.initialData.efectores.length > 0 ? 
            this.initialData.efectores[0].id : null)),

            idCargo: this.initialData.cargo?.id,
            idRegion: this.initialData?.region?.id,
            tipoUdo: this.initialData.tipoUdo,
            tipoEfector: this.initialData.tipoEfector,
            tipoEfectorCargo: this.initialData.tipoEfectorCargo,
            udoSelected: this.initialData.udo?.id,
            persona: this.initialData.persona?.id,
         /*   tipoHabilitacionesGuardias: tipoHabilitacionesGuardiasInicial, */
           habilitacionesGenerales: efectoresFiltradosGeneral,
            fechaInicio: this.initialData.fechaInicio ? new Date(this.initialData.fechaInicio + 'T00:00:00') : null,
            fechaFinal: this.initialData.fechaFinal ? new Date(this.initialData.fechaFinal + 'T00:00:00' ) : null,
  
          }); 
    
   this.habilitacionesGeneralesOptions = this.asistencial?.habilitacionesGenerales
    ?.filter((habilitacion: any) => habilitacion.activo) // Filtra solo habilitaciones activas
    ?.flatMap((habilitacion: any) => habilitacion.efectores.map((efector: any) => efector)) || [];
  
          this.habilitacionesGeneralesOptions = efectoresFiltradosGeneral;
  
          // Habilitar opciones si ya tiene guardia EXTRA o si hay habilitaciones guardias previas
    
  
  // Llamar al método para manejar cambios en tipoUdo
   this.onTipoUdoChange({ value: this.initialData.tipoUdo });
   this.onCargoChange();
  }

    }
      
          this.legajoForm.get('esAutoridad')?.disable();    
  
  
    //-----Llamo métodos para cargar los datos iniciales-----
      this.listMinisterios();
      this.listHospitales();
      this.listCargo();
      this.listRegion();
  
  
      this.tipoUdo = this.initialData?.tipoUdo ?? ''; // Asignar tipoUdo inicial
      this.onTipoUdoChange({ value: this.tipoUdo });
  
  
    
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
  
   setTimeout(() => {
      this.evaluarEstadoDirectorRegional();
    }, 100);
  
     this.legajoForm.setValidators([
      this.validarFechas
    ]);
  
  }

  // Método para verificar si se puede modificar el legajo
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
  }).subscribe(
    ({ ministerios, hospitales }) => {
      this.ministerios = ministerios;
      this.hospitales = hospitales;

      // Solo ejecutar filtros si NO es Director Regional
      if (!esDirectorRegional) {
        this.filterCapsGeneral();
        this.filterCapsHabilitacionesGenerales();
        this.filterHospitalHabilitacionesGenerales();
      }

      const efectoresFiltradosGeneral = !esDirectorRegional ? (this.asistencial?.habilitacionesGenerales
        ?.filter((habilitacion: HabilitacionesGenerales) => habilitacion.activo)
        ?.flatMap((habilitacion: HabilitacionesGenerales) => habilitacion.efectores.map((efector: Efector) => efector.id)) || []) : [];

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

      this.legajoForm.patchValue({
       
        efectoresSelected: efectoresSelected,
        tipoGuardias: this.initialData?.tipoGuardias?.map((tipo: any) => tipo.id) || [],
        cargaHoraria: this.initialData?.revista?.cargaHoraria?.id || null,
        adicional: this.initialData?.revista?.adicional?.id || null,
        udoSelected: this.initialData?.udo?.id || null,
        persona: this.initialData?.persona?.id,
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

      const udoSelected = this.initialData?.udo?.id || null;

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

  onHospitalesChangeGeneral(event: any): void {
    this.selectedHospitalsGeneral = event.value; // Obtener los hospitales seleccionados
    this.updateCombinedValuesGeneral();
  }

  onHospitalesCapsChangeGeneral(event: any): void {
    this.selectedHospitalsCapsGeneral = event.value; // Obtener los hospitales seleccionados para CAPS
    this.updateCapsBySelectedHospitalsGeneral();
    this.updateCombinedValuesGeneral();
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
    const efectoresAutoridadControl = this.legajoForm.get('efectoresAutoridad');
    const habilitacionesGeneralesControl = this.legajoForm.get('habilitacionesGenerales');
  
    // Cuando cambia idAutoridad reseteo el valor de idCargo, tipoGuardia e idRegion; tambien oculto y hago no obligatorio idRegional
    idCargoControl?.reset();
    idNroResolucionControl?.reset();
    idNroDecretoControl?.reset();
    idFechaResolucionControl?.reset();
    idRegionControl?.reset();
    efectoresAutoridadControl?.reset();
    habilitacionesGeneralesControl?.reset();

   
    this.showEfectorAutoridad = false;
    this.legajoForm.get('efectoresAutoridad')?.clearValidators();
    this.showEfectorAutoridad = false;
    this.showRegion = false;
    this.legajoForm.get('idRegion')?.clearValidators();
    this.showHabilitacionesGenerales = false;
    this.legajoForm.get('habilitacionesGenerales')?.clearValidators();
  
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

  listUdos(): void {
    /* aqui falta agregar metodo en back para que liste todos los efectores, de momento solo mostramos hospitales */
    this.hospitalService.list().subscribe(data => {
      this.efectores = data;
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
  

  updateLegajo(): void {
    // Obtener los valores del formulario
    const legajoData = this.legajoForm.value;
    
    legajoData.esAutoridad = this.legajoForm.get('esAutoridad')?.value;
    const esRegional = legajoData.idCargo === 'Director Regional' ? true : false;

    const legajoDto = new LegajoDto(
      legajoData.fechaInicio,
      legajoData.esAutoridad,
      true,
      legajoData.url,
      this.personId,
      legajoData.fechaFinal,
      esRegional,
      null, //matricula nacional
      null, //matricula provincial                          
      null, // idSuspencion
      null, //motivoBaja
      null, //id revista
      legajoData.udo?.id ?? null,
      legajoData.efectores ?? null,
      null, //especialidad
      null, //profesion
      null, //tipo guardia
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