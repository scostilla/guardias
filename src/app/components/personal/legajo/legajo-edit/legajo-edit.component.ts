import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

//Autenticación
import { TokenService } from 'src/app/services/login/token.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';

//Services
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { RevistaService } from 'src/app/services/Configuracion/revista.service';
import { TipoRevistaService } from 'src/app/services/Configuracion/tipo-revista.service';
import { ProfesionService } from 'src/app/services/Configuracion/profesion.service';
import { EspecialidadService } from 'src/app/services/Configuracion/especialidad.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { TipoGuardiaService } from 'src/app/services/Configuracion/tipoGuardia.service';
import { CategoriaService } from 'src/app/services/Configuracion/categoria.service';
import { AdicionalService } from 'src/app/services/Configuracion/adicional.service';
import { CargaHorariaService } from 'src/app/services/Configuracion/carga-horaria.service';
import { CargoService } from 'src/app/services/Configuracion/cargo.service';
import { RegionService } from 'src/app/services/Configuracion/region.service';
import { HabilitacionesGuardiasService } from 'src/app/services/Configuracion/habilitacionesGuardias.service';
import { HabilitacionesGeneralesService } from 'src/app/services/Configuracion/habilitacionesGenerales.service';
import { AutoridadService } from 'src/app/services/Configuracion/autoridad.service';

//Models y Dto
import { LegajoDto } from 'src/app/dto/Configuracion/LegajoDto';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { RevistaDto } from 'src/app/dto/Configuracion/RevistaDto';
import { TipoRevista } from 'src/app/models/Configuracion/TipoRevista';
import { Profesion } from 'src/app/models/Configuracion/Profesion';
import { Especialidad } from 'src/app/models/Configuracion/Especialidad';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { Ministerio } from 'src/app/models/Configuracion/Ministerio';
import { CapsDto } from 'src/app/dto/Configuracion/CapsDto';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { Categoria } from 'src/app/models/Configuracion/Categoria';
import { Adicional } from 'src/app/models/Configuracion/Adicional';
import { CargaHoraria } from 'src/app/models/Configuracion/CargaHoraria';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { Region } from 'src/app/models/Configuracion/Region';
import { HabilitacionesGuardiasDto } from 'src/app/dto/Configuracion/HabilitacionesGuardiasDto';
import { HabilitacionesGeneralesDto } from 'src/app/dto/Configuracion/HabilitacionesGeneralesDto';

import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
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
  tipoUdo!: number;
  tipoEfector!: number;
  tipoHabilitacionesGuardias!: number;
  tipoEfectorCargo!: number;
  isUpdatingTipoGuardias: boolean = false;


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
      idPersona: ['', Validators.required],
      profesion: ['', Validators.required],
      tipoUdo: [null, Validators.required],
      udo: [null, Validators.required],
      hospitalUdo: ['', Validators.required],
      tipoEfector: [null, Validators.required],
      efectores: [null, Validators.required],
      hospitalEfectores: ['', Validators.required],
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
      fechaInicio: ['', [Validators.required, this.dateLimitePresente]],
      fechaFinal: [{ value: '', disabled: true }],
      tipoGuardias: [[]],
      tipoHabilitacionesGuardias: [''],
      habilitacionesGuardias: [[]],
      hospitalHabilitacionesGuardias: ['', Validators.required],
      habilitacionesGenerales: [[]],
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

  ngOnInit(): void {
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
    this.idCargo = this.tipoGuardias.find(t => t.nombre === 'CARGO')?.id;
    this.idAgrupacion = this.tipoGuardias.find(t => t.nombre === 'AGRUPACION')?.id;

    // Imprimir los ids para depuración
    console.log('ID ContraFactura:', this.idContraFactura);
    console.log('ID Pasiva:', this.idPasiva);
    console.log('ID Pasiva:', this.idExtra);
  });

      // Verifica si hay datos iniciales
      if (this.initialData) {
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
          tipoGuardias: this.initialData.tipoGuardias ? this.initialData.tipoGuardias.map((tipoGuardia: any) => tipoGuardia.id) : [],
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
        if (selectedValues.includes(this.idContraFactura)) {
          this.legajoForm.patchValue({
            tipoGuardias: [this.idContraFactura]  // Solo mantener el tipo 4
          }, { emitEvent: false });  // Esto previene que se dispare el evento valueChanges de nuevo
        } else if (selectedValues.includes(this.idPasiva)) {
          // Si se selecciona el tipo 5 (PASIVA), deseleccionar todas las demás opciones
          this.legajoForm.patchValue({
            tipoGuardias: [this.idPasiva]  // Solo mantener el tipo 5
          }, { emitEvent: false });  // Esto previene que se dispare el evento valueChanges de nuevo
        } else {
          // Si se seleccionan otras opciones (1, 2, 3), mantenerlas
          this.legajoForm.patchValue({
            tipoGuardias: selectedValues.filter((value: number) => value !== this.idContraFactura && value !== this.idPasiva)
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

  // Método para cambiar las opciones de la selección de UDO
  onTipoUdoChange(event: any): void {
    const tipoUdo = event.value;
    this.tipoUdo = tipoUdo;

    // Dependiendo del valor seleccionado, asignamos los datos adecuados al segundo select
    if (tipoUdo === 1) { // Ministerio
      this.udoOptions = this.ministerios;
    } else if (tipoUdo === 2) { // Hospital
      this.udoOptions = this.hospitales;
    } else if (tipoUdo === 3) { // CAPS
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

    // Dependiendo del valor seleccionado, asignamos los datos adecuados al segundo select
    if (tipoEfector === 1) { // Ministerio
      this.efectorOptions = this.ministerios;
    } else if (tipoEfector === 2) { // Hospital
      this.efectorOptions = this.getEfectoresFiltrados(); // Usamos el filtrado para obtener solo los efectores disponibles
    } else if (tipoEfector === 3) { // CAPS
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

    // Dependiendo del valor seleccionado, asignamos los datos adecuados al segundo select
    if (tipoHabilitacionesGuardias === 2) { // Ministerio
      this.habilitacionesGuardiasOptions = this.getEfectoresFiltrados(); // Usamos el filtrado para obtener solo los efectores disponibles
    } else if (tipoHabilitacionesGuardias === 3) { // CAPS
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
  
  // Método para cambiar las opciones de la selección de efector
  onTipoEfectorCargoChange(event: any): void {
    const tipoEfectorCargo = event.value;
    this.tipoEfectorCargo = tipoEfectorCargo;

    // Dependiendo del valor seleccionado, asignamos los datos adecuados al segundo select
    if (tipoEfectorCargo === 1) { // Ministerio
      this.efectorCargoOptions = this.ministerios;
    } else if (tipoEfectorCargo === 2) { // Hospital
      this.efectorCargoOptions = this.getEfectoresFiltrados(); // Usamos el filtrado para obtener solo los efectores disponibles
    } else if (tipoEfectorCargo === 3) { // CAPS
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

    // Si se selecciona CONTRAFACTURA, EXTRA O PASIVA habilita HabilitacionesGuardias
    if (selectedValues.includes(this.idContraFactura!) || selectedValues.includes(this.idExtra!) || selectedValues.includes(this.idPasiva!)) {
      this.showHabilitacionesGuardias = true;
      this.legajoForm.get('habilitacionesGuardias')?.setValidators([Validators.required]);
    } else {
      // Si no se selecciona CONTRAFACTURA, EXTRA O PASIVA ocultar HabilitacionesGuardias
      this.showHabilitacionesGuardias = false;
      HabilitacionesGuardiasControl?.reset();
      this.legajoForm.get('habilitacionesGuardias')?.clearValidators();
    }

    // Actualiza la validez de los campos
    this.legajoForm.get('habilitacionesGuardias')?.updateValueAndValidity();
  }

  onSelectionChange(event: any): void {
    this.onTipoGuardiaSelectionChange(event);
  
    this.onGuardiaCfExtra(event.value);
  }

  //aqui oculto o muestro situacion de revista según la guardia seleccionada
  toggleSituacionRevista(selectedValues: number[]): void {
    // Si se selecciona el tipo 4 o 5, deshabilitar "Situación de Revista"
    if (selectedValues.length === 0 || selectedValues.includes(this.idContraFactura!) || selectedValues.includes(this.idPasiva!)) {
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
    this.legajoForm.get('tipoUdo')?.disable();
    this.legajoForm.get('udo')?.disable();
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
    this.legajoForm.get('udo')?.enable();
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
    
  updateLegajo(): void {
    if (this.legajoForm.valid) {
        const legajoData = this.legajoForm.value;
        
    // Asegura que tipoGuardias sea un array no vacío
    const tiposGuardiasSeleccionados = legajoData.tipoGuardias || []; // Si es null o undefined, asigna un array vacío
    const tiposGuardiaExcluidos = [this.idContraFactura, this.idPasiva];

    // Verifica si tipoGuardias está vacío o si incluye CONTRAFACTURA o PASIVA
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
      }
    }
    
  updateLegajoDtoAndSave(legajoData: any, revistaId: number | null): void {
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

      const legajoDto = new LegajoDto(
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
        legajoData.udo?.id ?? null,
        efectoresData ?? null,
        legajoData.especialidades ??  null,
        legajoData.profesion,
        legajoData.tipoGuardias ??  null,
        legajoData.idCargo ?? null,
        legajoData.idRegion ?? null,
        legajoData.nroResolucion ?? null,
        legajoData.nroDecreto ?? null,
        legajoData.fechaResolucion ?? null
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
      // Para otros casos, llamar al método de habilitaciones generales
      this.saveHabilitacionesGenerales(legajoData);
    }
    
      // Guardar el legajo sin la parte de revista si no corresponde
      this.legajoService.update(this.idLegajo, legajoDto).subscribe(
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
    }

    saveHabilitacionesGuardias(legajoData: any): void {
      // Crear el objeto HabilitacionesGuardiasDto
      const habilitacionesGuardiasDto = new HabilitacionesGuardiasDto(
        true, // activo
        legajoData.idPersona,
        legajoData.habilitacionesGuardias || null
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
      // Crear el objeto HabilitacionesGuardiasDto
      const habilitacionesGeneralesDto = new HabilitacionesGeneralesDto(
        true, // activo
        legajoData.idPersona,
        legajoData.habilitacionesGenerales || null
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