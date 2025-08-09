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
import { AutoridadService } from 'src/app/services/Configuracion/autoridad.service';
import { CapsService } from 'src/app/services/Configuracion/caps.service';
import { CargoService } from 'src/app/services/Configuracion/cargo.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { RegionService } from 'src/app/services/Configuracion/region.service';

//Models y Dto
import { CapsDto } from 'src/app/dto/Configuracion/CapsDto';
import { LegajoDto } from 'src/app/dto/Configuracion/LegajoDto';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { Ministerio } from 'src/app/models/Configuracion/Ministerio';
import { Region } from 'src/app/models/Configuracion/Region';


import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { HabilitacionesGeneralesService } from 'src/app/services/Configuracion/habilitacionesGenerales.service';

interface Agrup {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-legajo-create-noasistencial',
  templateUrl: './legajo-create-noasistencial.component.html',
  styleUrls: ['./legajo-create-noasistencial.component.css']
})

export class LegajoCreateNoasistencialComponent implements OnInit {

  fromAsistencial: boolean = false;
  fromNoAsistencial: boolean = false;
  inputValue: string = '';
  legajoForm: FormGroup;
  initialData: Asistencial | NoAsistencial | undefined;

  //Listas
  efectores: Efector[] = [];
  hospitales: Hospital[] = [];
  ministerios: Ministerio[] = [];
  caps: CapsDto[] = [];
  cargos: Cargo[] = [];
  regiones: Region[] = [];

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


  /* Form de revista */
  agrupaciones: Agrup[] = [
    { value: 'ADMINISTRATIVO', viewValue: 'Administrativo' },
    { value: 'PROFESIONALES', viewValue: 'Profesionales' },
    { value: 'SERVICIOS_GENERALES', viewValue: 'Servicios Generales' },
    { value: 'TECNICOS', viewValue: 'Técnicos' },
  ];


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
      idPersona: ['', Validators.required],
      tipoUdo: [null, Validators.required],
      udo: [null, Validators.required],
      hospitalUdo: [''],
      tipoEfector: [null, Validators.required],
      efectores: [null, Validators.required],
      hospitalEfectores: [''],
      tipoEfectorCargo: [null],
      efectoresAutoridad: [[]],
      hospitalEfectorCargo: [''],
      tipoHabilitacionesGenerales: [''],
      habilitacionesGenerales: [[]],
      habilitacionesGeneralesHospital: [[]],
      habilitacionesGeneralesCaps: [[]],
      hospitalHabilitacionesGenerales: [[]],
      esAutoridad: [false, Validators.required],
      idCargo: [null],
      idRegion: [null],
      nroResolucion: [null],
      nroDecreto: [null],
      fechaResolucion: [null],
      fechaInicio: ['', [Validators.required, this.dateLimitePresente]],
      fechaFinal: [{ value: '', disabled: true }],
      url: [''],
      matriculaNacional: ['', [Validators.pattern('^[0-9]{5,10}$')]],
      matriculaProvincial: ['', [Validators.pattern('^[0-9]{5,10}$')]],
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

    const navigation = this.router.getCurrentNavigation();

    if (navigation?.extras.state) {
      // Verifica si los datos recibidos son de tipo NoAsistencial
      this.fromNoAsistencial = !!navigation.extras.state['fromNoAsistencial'];
  
      // Asigna los datos a initialData si es de tipo NoAsistencial
      if (this.fromNoAsistencial) {
        this.initialData = navigation.extras.state['noAsistencial'] as NoAsistencial;
      }
  
      // Si no se recibe NoAsistencial, redirige atrás con un mensaje
      if (!this.initialData) {
        this.toastr.error('No se recibió ningún NoAsistencial. Consulta con soporte.', 'Error', {
          timeOut: 9000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
  
        // Regresa a la vista anterior
        this.location.back();
      }
    } else {
      // Si no se pasó el estado, redirige atrás con un mensaje
      this.toastr.error('No se recibió ningún NoAsistencial. Consulta con soporte.', 'Error', {
        timeOut: 9000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
  
      // Regresa a la vista anterior
      this.location.back();
    }    
  }

  ngOnInit(): void {

     this.legajoForm.get('esAutoridad')?.valueChanges.subscribe(esAutoridad => {
      this.onAutoridadChange(esAutoridad);

      if (!esAutoridad) {
        this.selectedFile = null;
        this.fileUrl = null;
        this.uploadError = null;
        this.legajoForm.patchValue({ url: '' });
      }
    });

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

  this.legajoForm.get('matriculaNacional')?.valueChanges.subscribe(matricula => {
    console.log('🆔 Campo matriculaNacional cambiado a:', matricula);
  });

  // Listener para matrícula provincial
  this.legajoForm.get('matriculaProvincial')?.valueChanges.subscribe(matricula => {
    console.log('🆔 Campo matriculaProvincial cambiado a:', matricula);
  });

  // Función para evaluar si el formulario está completo para Director Regional
  this.evaluarFormularioDirectorRegional();

    // 🔥 OBTENER ID DEL DIRECTOR REGIONAL
    this.cargoService.list().subscribe((cargos: Cargo[]) => {
      this.cargos = cargos;
      this.idDirectorRegional = this.cargos.find(t => 
        t.nombre.toLowerCase() === 'director regional'.toLowerCase()
      )?.id;

      console.log('ID Director Regional:', this.idDirectorRegional);
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

// Traigo información inicial
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

      //----- Verificaciones desde tabla autoridades y sus posibles respuestas -----
      this.autoridadService.asignadoAutoridad(personaId).subscribe(response => {
        this.asignadoAutoridad = response;

        // Verificar si ya existe un legajo activo
        if (legajosActivos.length > 0) {
          this.toastr.warning('Debe finalizar un legajo existente para poder realizar una nueva carga', 'Limite de legajos alcanzado', {
            timeOut: 9000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.location.back();  // Redirigir a la página anterior
        } else {
          // Si no tiene legajos activos, verificamos si es autoridad
          if (this.asignadoAutoridad) {
            // Si es autoridad, solo se permite cargar un legajo con esAutoridad = true
            this.toastr.info('La persona es una autoridad, se cargará un legajo autoridad.', 'Información', {
              timeOut: 9000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            this.legajoForm.get('esAutoridad')?.setValue(true);  // Establecer esAutoridad a true
            this.legajoForm.get('esAutoridad')?.disable();  // Deshabilitar el campo porque solo debe ser verdadero
          } else {
            // Si no es autoridad, solo se permite cargar un legajo con esAutoridad = false
            this.toastr.info('La persona no es una autoridad, se cargará un legajo general.', 'Información', {
              timeOut: 9000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            this.legajoForm.get('esAutoridad')?.setValue(false);  // Establecer esAutoridad a false
            this.legajoForm.get('esAutoridad')?.disable();  // Deshabilitar el campo porque no debe cambiarse
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
    this.listUdos();
    this.listMinisterios();
    this.listHospitales();
    this.listCargo();
    this.listRegion();
  
//-----Manejo de validaciones en Profesion y especialidades-----
  
  /*// Cambiar especialidades cuando se cambia la profesión seleccionada
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
  this.onAutoridadChange(this.legajoForm.get('esAutoridad')?.value);*/

}

 onAutoridadChange(esAutoridad: boolean): void {
    console.log('🔄 onAutoridadChange ejecutado para No Asistencial:', esAutoridad);
    
    const idCargoControl = this.legajoForm.get('idCargo');
    const idNroResolucionControl = this.legajoForm.get('nroResolucion');
    const idNroDecretoControl = this.legajoForm.get('nroDecreto');
    const idFechaResolucionControl = this.legajoForm.get('fechaResolucion');
    const idRegionControl = this.legajoForm.get('idRegion');
    const efectoresAutoridadControl = this.legajoForm.get('efectoresAutoridad');
    const habilitacionesGeneralesControl = this.legajoForm.get('habilitacionesGenerales');
    const tipoEfectorControl = this.legajoForm.get('tipoEfector');
    const efectoresControl = this.legajoForm.get('efectores');
    const tipoUdoControl = this.legajoForm.get('tipoUdo');
    const udoControl = this.legajoForm.get('udo');

    // Resetear campos
    idCargoControl?.reset();
    idNroResolucionControl?.reset();
    idNroDecretoControl?.reset();
    idFechaResolucionControl?.reset();
    idRegionControl?.reset();
    efectoresAutoridadControl?.reset();
    habilitacionesGeneralesControl?.reset();
    
    if (esAutoridad) {
    console.log('✅ Habilitando campos de autoridad');

    
    // SOLO mostrar el campo de cargo, OCULTAR todo lo demás hasta que se seleccione cargo
    this.showSiEsAutoridad = true;
    this.showEfectorAutoridad = false;           // ❌ OCULTO
    this.showRegion = false;                     // ❌ OCULTO
    this.showHabilitacionesGenerales = false;    // ❌ OCULTO
    
    idCargoControl?.enable();
    this.legajoForm.get('idCargo')?.setValidators([Validators.required]);
    idNroResolucionControl?.enable();
    this.legajoForm.get('nroResolucion')?.setValidators([Validators.required, Validators.pattern('^[0-9]{1,5}$')]);
    idNroDecretoControl?.enable();
    this.legajoForm.get('nroDecreto')?.setValidators([Validators.required, Validators.pattern('^[0-9]{1,5}$')]);
    idFechaResolucionControl?.enable();
    this.legajoForm.get('fechaResolucion')?.setValidators([Validators.required]);
    
    this.isSituacionRevistaEnabled = false;
    this.disableSituacionRevistaFields();
    this.legajoForm.setValidators(this.alMenosUnoRequeridoValidator());
    
 
    
    } else {
      console.log('❌ Deshabilitando TODOS los campos de autoridad para legajo GENERAL');

    // 🎯 OCULTAR TODOS LOS CAMPOS DE AUTORIDAD PARA LEGAJO GENERAL
    this.showSiEsAutoridad = false;              // ❌ OCULTO
    this.showEfectorAutoridad = false;           // ❌ OCULTO  
    this.showRegion = false;                     // ❌ OCULTO
    this.showHabilitacionesGenerales = false;    // ❌ OCULTO
    
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
    }
    
    // Actualizar validez
    idCargoControl?.updateValueAndValidity();
    idNroResolucionControl?.updateValueAndValidity();
    idNroDecretoControl?.updateValueAndValidity();
    idFechaResolucionControl?.updateValueAndValidity();
    tipoEfectorControl?.updateValueAndValidity();
    efectoresControl?.updateValueAndValidity();
    tipoUdoControl?.updateValueAndValidity();
    udoControl?.updateValueAndValidity();
    
    this.evaluarEstadoDirectorRegional();
  }

  disableSituacionRevistaFields(): void {
  this.legajoForm.get('tipoUdo')?.disable();
  this.legajoForm.get('udo')?.disable();
  this.legajoForm.get('hospitalUdo')?.disable();
  this.legajoForm.get('tipoEfector')?.disable();
  this.legajoForm.get('efectores')?.disable();
  this.legajoForm.get('hospitalEfectores')?.disable();
}

enableSituacionRevistaFields(): void {
  this.legajoForm.get('tipoUdo')?.enable();
  this.legajoForm.get('udo')?.enable();
  this.legajoForm.get('hospitalUdo')?.enable();
  this.legajoForm.get('tipoEfector')?.enable();
  this.legajoForm.get('efectores')?.enable();
  this.legajoForm.get('hospitalEfectores')?.enable();
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

  listUdos(): void {
    /* aqui falta agregar metodo en back para que liste todos los efectores, de momento solo mostramos hospitales */
    this.hospitalService.list().subscribe(data => {
      this.efectores = data;
    }, error => {
      console.log(error);
    });
  }

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

  /*listCaps(): void {
    this.capsService.list().subscribe(data => {
      this.caps = data;
    }, error => {
      console.log(error);
    });
  }*/

/*  listProfesiones(): void {
    this.profesionService.list().subscribe(data => {
      this.profesiones = data;
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
  }*/

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

  /*listCargaHoraria(): void {
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
  }*/

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
      return this.efectores.filter(efector => idEfectorUser.includes(efector.id as number));  // Filtrar los efectores que tienen un id en idEfectorUser, asegurando que efector.id es un número
    }
  
    // Si no es administrativo, devuelve todos los efectores
    return this.efectores;
  }

   onHospitalesChange(event: any): void {
  this.selectedHospitals = event.value; // Obtener los hospitales seleccionados
  this.updateCombinedValues();
  
  // 🔥 FORZAR REVALIDACIÓN
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

  evaluarEstadoDirectorRegional(): void {
    const esAutoridad = this.legajoForm.get('esAutoridad')?.value;
    const cargoId = this.legajoForm.get('idCargo')?.value;
    
    if (esAutoridad && cargoId === this.idDirectorRegional) {
      console.log('🎯 EVALUANDO ESTADO DE DIRECTOR REGIONAL');

      const camposRequeridos = {
        esAutoridad: this.legajoForm.get('esAutoridad')?.value,
        idCargo: this.legajoForm.get('idCargo')?.value,
        nroResolucion: this.legajoForm.get('nroResolucion')?.value,
        nroDecreto: this.legajoForm.get('nroDecreto')?.value,
        fechaResolucion: this.legajoForm.get('fechaResolucion')?.value,
        fechaInicio: this.legajoForm.get('fechaInicio')?.value,
        idPersona: this.legajoForm.get('idPersona')?.value,
        idRegion: this.legajoForm.get('idRegion')?.value
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

onTipoEfectorCargoChange(event: any): void {
    const tipoEfectorCargo = event.value;
    this.tipoEfectorCargo = tipoEfectorCargo;

    if (tipoEfectorCargo === 'MINISTERIO') {
      this.efectorCargoOptions = this.ministerios;
    } else if (tipoEfectorCargo === 'HOSPITAL') {
      this.efectorCargoOptions = this.getEfectoresFiltrados();
    } else if (tipoEfectorCargo === 'CAPS') {
      this.efectorCargoOptions = this.caps;
    }

    const efectoresAutoridadControl = this.legajoForm.get('efectoresAutoridad');
    if (efectoresAutoridadControl) {
      efectoresAutoridadControl.enable();
    }

    this.legajoForm.get('efectoresAutoridad')?.reset();
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

 /*  onTipoHabilitacionesGeneralesChange(event: any): void {
    const tipo = event.value;
    this.tipoHabilitacionesGenerales = tipo;

    if (tipo === 'MINISTERIO') {
      this.habilitacionesGeneralesOptions = this.ministerios;
    } else if (tipo === 'HOSPITAL') {
      this.habilitacionesGeneralesOptions = this.getEfectoresFiltrados();
    } else if (tipo === 'CAPS') {
      this.habilitacionesGeneralesOptions = this.caps;
    }

    this.legajoForm.get('habilitacionesGenerales')?.reset();
  }
 */
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

  /*// Form Datos profesional: Manejo de la seleccion de profesiones y especialidades
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
  }*/

  //Uso tanto para cancelar form como para volver atrás
  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 9000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    if (this.fromAsistencial) {
      this.location.back();
    } else if (this.fromNoAsistencial) {
      this.location.back();
    } else {
      this.router.navigate(['/personal-legajo-select']);
    }
  }

   // 🔥 MANEJO DE IMÁGENES PARA AUTORIDADES
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
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    const target = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement;
    
    if (target && (!relatedTarget || !target.contains(relatedTarget))) {
      this.isDragOver = false;
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0]);
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

    if (this.selectedFile && this.isSameFile(this.selectedFile, file)) {
      this.toastr.info('Este archivo ya está seleccionado');
      return;
    }

    this.isDuplicateImage = false;
    this.uploadError = null;
    this.selectedFile = file;

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
          console.log('✅ Imagen subida exitosamente:', response);
          this.isUploading = false;
          this.fileUrl = `http://localhost:8080${response.url}`;
          
          const fileInput = document.getElementById('archivo') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
          this.selectedFile = null;
          
          this.toastr.success('Legajo e imagen guardados correctamente');
          resolve(response);
        },
        (error) => {
          console.error('❌ Error al subir imagen:', error);
          this.isUploading = false;
          this.selectedFile = null;
          reject(error);
        }
      );
    });
  }

  createLegajoDtoAndSave(): void {

    if (!this.formularioValidoCompleto) {
    this.toastr.error('Por favor complete todos los campos requeridos', 'Formulario incompleto');
    return;
  }

  // 🔥 OBTENER DATOS DEL FORMULARIO INTERNAMENTE
  const legajoData = this.legajoForm.value;

    // Verifica si el campo 'esAutoridad' está habilitado
  let esAutoridad : boolean;

   if (this.legajoForm.get('esAutoridad')?.enabled) {
    // Si está habilitado, usar el valor del formulario
    esAutoridad = this.legajoForm.get('esAutoridad')?.value;
  } else {
    // Si está deshabilitado, usar el valor de this.asignadoAutoridad
    esAutoridad = this.asignadoAutoridad;
  }

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
  
  // Determinar si esRegional basado en el cargo
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
        null, //id revista
        legajoData.udo?.id ?? null,
        efectoresData ?? null,
        null, //especualidades
        null, //profesion
        null, //tipoGuardias
        legajoData.idCargo ?? null,
        legajoData.idRegion ?? null,
        legajoData.nroResolucion ?? null,
        legajoData.nroDecreto ?? null,
        legajoData.fechaResolucion ?? null,
        legajoData.tipoEfector ?? null,
        legajoData.tipoEfectorCargo ?? null,
        legajoData.tipoUdo ?? null
      );

      console.log("DTO creado para guardar legajo no asistencial:", legajoDto);

  this.legajoService.save(legajoDto).subscribe(
    async (legajoCreado) => {
      console.log('✅ Legajo no asistencial creado exitosamente:', legajoCreado);
      
      // 🔥 SI ES AUTORIDAD Y HAY IMAGEN SELECCIONADA, SUBIRLA
      if (esAutoridad && this.selectedFile && legajoCreado.id) {
        console.log('📤 Subiendo imagen para legajo de autoridad no asistencial...');
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
      }

      // 🔥 CREAR HABILITACIONES SEGÚN EL TIPO DE AUTORIDAD (DIRECTO DESDE EL SERVICIO)
      if (esAutoridad) {
        if (legajoData.idCargo === this.idDirectorRegional) {
          console.log('🎯 Creando habilitaciones para Director Regional no asistencial');
          
          // 🔥 LLAMADA DIRECTA AL SERVICIO (COMO YA LO TIENES)
          this.habilitacionesGeneralesService.addHabilitacionesAutoridadRegional(
            legajoData.idPersona, 
            legajoData.idRegion
          ).subscribe(
            (response) => {
              console.log('✅ Habilitaciones regionales creadas para no asistencial:', response);
              this.toastr.success(
                'Habilitaciones regionales asignadas correctamente',
                'Habilitaciones creadas'
              );
            },
            (error) => {
              console.error('❌ Error al crear habilitaciones regionales para no asistencial:', error);
              this.toastr.warning(
                'Legajo creado pero hubo un error al asignar habilitaciones regionales',
                'Advertencia'
              );
            }
          );
        } else {
          console.log('🏢 Creando habilitaciones para autoridad general no asistencial');
          this.saveHabilitacionesGenerales(legajoData);
        }
        
        this.toastr.success(
          'Legajo de autoridad no asistencial creado con éxito. Habilitaciones en proceso.',
          'ÉXITO'
        );
      } else {
        this.toastr.success('Legajo no asistencial creado con éxito', 'ÉXITO');
      }

      // 🔥 NAVEGAR SEGÚN EL ORIGEN
      if (this.fromAsistencial) {
        this.router.navigate(['/personal']);
      } else if (this.fromNoAsistencial) {
        this.router.navigate(['/personal-no-asistencial']);
      } else {
        this.router.navigate(['/personal-legajo-select']);
      }
    },
    (error) => {
      console.error('❌ Error al crear legajo no asistencial:', error);
      const mensajeError = error.error?.mensaje || error.message || 'Error desconocido';
      this.toastr.error(`Error al crear el legajo no asistencial: ${mensajeError}`, 'ERROR');
    }
  );
}

    saveHabilitacionesGenerales(legajoData: any): void {
  if (!legajoData.idPersona || !legajoData.habilitacionesGenerales) {
    console.error('❌ Faltan datos para crear habilitaciones generales');
    return;
  }

  const habilitacionesGeneralesDto = {
    activo: true,
    idPersona: legajoData.idPersona,
    idEfectores: Array.isArray(legajoData.habilitacionesGenerales) 
      ? legajoData.habilitacionesGenerales 
      : [legajoData.habilitacionesGenerales]
  };

  this.habilitacionesGeneralesService.save(habilitacionesGeneralesDto).subscribe(
    (response) => {
      console.log('✅ Habilitaciones generales creadas para no asistencial:', response);
      this.toastr.success(
        'Habilitaciones generales asignadas correctamente',
        'Habilitaciones creadas'
      );
    },
    (error) => {
      console.error('❌ Error al crear habilitaciones generales para no asistencial:', error);
      this.toastr.warning(
        'Legajo creado pero hubo un error al asignar habilitaciones generales',
        'Advertencia'
      );
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