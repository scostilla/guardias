import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
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
import { TipoGuardiaService } from 'src/app/services/Configuracion/tipoGuardia.service';
import { CategoriaService } from 'src/app/services/Configuracion/categoria.service';
import { AdicionalService } from 'src/app/services/Configuracion/adicional.service';
import { CargaHorariaService } from 'src/app/services/Configuracion/carga-horaria.service';
import { CargoService } from 'src/app/services/Configuracion/cargo.service';
import { RegionService } from 'src/app/services/Configuracion/region.service';
import { HabilitacionesGuardiasService } from 'src/app/services/Configuracion/habilitacionesGuardias.service';
import { AutoridadService } from 'src/app/services/Configuracion/autoridad.service';

//Models y Dto
import { LegajoDto } from 'src/app/dto/Configuracion/LegajoDto';
import { RevistaDto } from 'src/app/dto/Configuracion/RevistaDto';
import { TipoRevista } from 'src/app/models/Configuracion/TipoRevista';
import { Profesion } from 'src/app/models/Configuracion/Profesion';
import { Especialidad } from 'src/app/models/Configuracion/Especialidad';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { Categoria } from 'src/app/models/Configuracion/Categoria';
import { Adicional } from 'src/app/models/Configuracion/Adicional';
import { CargaHoraria } from 'src/app/models/Configuracion/CargaHoraria';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { Region } from 'src/app/models/Configuracion/Region';
import { HabilitacionesGuardias } from 'src/app/models/Configuracion/HabilitacionesGuardias';
import { HabilitacionesGuardiasDto } from 'src/app/dto/Configuracion/HabilitacionesGuardiasDto';

import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';


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

  //Listas
  profesiones: Profesion[] = [];
  efectores: Efector[] = [];
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
  userId: number | null = null;
  nombreUsuario: string = '';
  apellidoUsuario: string = '';
  nombresEfectores: EfectorSummaryDto[] = [];
  usuarioPersona: number | null = null;

  //útiles
  step = 0;
  maxDate!: Date;
  minFechaFinal!: Date;
  isAsistencial: boolean = false;
  isSituacionRevistaEnabled = false;
  asignadoAutoridad: boolean = false;
  noEspecialidadesMessage: string = '';
  showGuardia: boolean = false;
  showRegion: boolean = false;
  showEfectorAutoridad: boolean = false;
  showHabilitacionesGuardias: boolean = false;
  idContraFactura?: number;
  idPasiva?: number;
  idExtra?: number;
  esAutoridadValor: boolean | null = null;

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
      udo: ['', Validators.required],
      efectores: ['', Validators.required],
      efectoresAutoridad: [[]],
      especialidades: [[]],
      matriculaNacional: ['', [Validators.pattern('^[0-9]{5,10}$')]],
      matriculaProvincial: ['', [Validators.required, Validators.pattern('^[0-9]{5,10}$')]],
      esAutoridad: [false, Validators.required],
      idCargo: [null],
      idRegion: [null],
      fechaInicio: ['', [Validators.required, this.dateLimitePresente]],
      fechaFinal: [{ value: '', disabled: true }],
      tipoGuardias: [[]],
      habilitacionesGuardias: [[]],
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
    }    
  }

  ngOnInit(): void {
  //Autentificación
  if (this.tokenService.getToken()) {
    this.isLogged = true;
    this.roles = this.tokenService.getAuthorities();

    this.UserRoles();

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

  // Llamamos al servicio para obtener todos los tipos de guardia
  this.tipoGuardiaService.list().subscribe((guardias: TipoGuardia[]) => {
    this.tipoGuardias = guardias;

    // Verificamos si los tipos 'CONTRAFACTURA' y 'PASIVA' están en la lista
    this.idContraFactura = this.tipoGuardias.find(t => t.nombre === 'CONTRAFACTURA')?.id;
    this.idPasiva = this.tipoGuardias.find(t => t.nombre === 'PASIVA')?.id;
    this.idExtra = this.tipoGuardias.find(t => t.nombre === 'EXTRA')?.id;

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
            timeOut: 6000,
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
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
              
        } else {
          // Si no tiene legajos activos, podemos permitir elegir 'esAutoridad' como true o false
          this.legajoForm.get('esAutoridad')?.setValue(true);  // Establecer por defecto como true
          this.legajoForm.get('esAutoridad')?.enable();
          this.toastr.info('La persona está registrada como autoridad.', 'Información', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
        
        // Si la persona es autoridad, verificar los legajos activos
        const legajoConTipoGuardiaCargo = legajosActivos.find(legajo => 
          !legajo.esAutoridad && 
          legajo.tipoGuardias.some(tipo => tipo.id === 1 || tipo.id === 2)
        );
        
        if (legajoConTipoGuardiaCargo) {
          this.toastr.warning('Para poder cargar un legajo de autoridad, debes dar de baja el legajo existente con tipo guardia de cargo y agrupacion.', 'Acción Requerida', {
            timeOut: 6000,
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
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.location.back();  // Redirigir a la página anterior
        } else {
          // Si no tiene legajos activos, podemos proceder a cargar el formulario
          this.legajoForm.get('idPersona')?.setValidators([Validators.required]); // Vuelve a establecer la validación si es necesario
          this.legajoForm.get('idPersona')?.updateValueAndValidity(); // Asegúrate de que la validación sea evaluada
          this.toastr.info('La persona no está registrada como autoridad, solo puedes cargar un legajo general.', 'Información', {
            timeOut: 6000,
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
    this.listUdos();
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

  listUdos(): void {
    /* aqui falta agregar metodo en back para que liste todos los efectores, de momento solo mostramos hospitales */
    this.hospitalService.list().subscribe(data => {
      this.efectores = data;
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

  //Roles a usar
  UserRoles(): void {
    this.isAdministrativo = this.roles.includes('ROLE_ADMIN');
    this.isUsuario = this.roles.includes('ROLE_USER');
    this.isDph = this.roles.includes('ROLE_DPH');
    this.isSuper = this.roles.includes('ROLE_SUPERUSER');
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

  //Form Datos legajo: si es un legajo tipo autoridad (esAutoridad) impide cargar tipoGuardia y habilita cargo
  onAutoridadChange(esAutoridad: boolean): void {
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
    if (esAutoridad) {
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
    const efectoresAutoridadControl = this.legajoForm.get('efectoresAutoridad');
    const directorRegionalId = 2; 

    if (cargoSeleccionado === directorRegionalId) {
      // Si se selecciona "Director regional (id 2)", muestra el campo de región y lo hace obligatorio
      this.showRegion = true;
      this.legajoForm.get('idRegion')?.setValidators([Validators.required]);
      this.showEfectorAutoridad = false;
      this.legajoForm.get('efectoresAutoridad')?.clearValidators();
      efectoresAutoridadControl?.reset();
    } else {
      // Si se selecciona cualquier otro cargo, oculta el campo de región y lo hace inválido
      this.showRegion = false;
      idRegionControl?.reset();
      this.legajoForm.get('idRegion')?.clearValidators();
      this.showEfectorAutoridad = true;
      this.legajoForm.get('efectoresAutoridad')?.setValidators([Validators.required]);
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
  
    // Si el usuario es ADMIN, solo puede seleccionar los tipos CARGO, AGRUPACION Y EXTRA (sin CF ni PASIVA)
    if (this.isAdministrativo) {
      // Filtra los valores seleccionados, asegurando que no incluya CF ni PASIVA
      this.legajoForm.patchValue({
        tipoGuardias: selectedValues.filter((value: number) => value !== this.idContraFactura && value !== this.idPasiva)
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
      } else if (selectedValues.includes(this.idPasiva)) {
        this.legajoForm.patchValue({
          tipoGuardias: [this.idPasiva]  // Si el tipo PASIVA es seleccionado, solo mantener el tipo PASIVA
        });
      } else {
        // Mantener solo los tipos 1, 2, 3 si no se seleccionan CF ni PASIVA
        this.legajoForm.patchValue({
          tipoGuardias: selectedValues.filter((value: number) => value !== this.idContraFactura && value !== this.idPasiva)
        });
      }
    }
  
    // Si el usuario no es ni ADMIN ni DPH, se restringen los tipos de guardia a CARGO, AGRUPACION Y EXTRA
    else {
      // Restringir la selección solo a los tipos CARGO, AGRUPACION Y EXTRA
      this.legajoForm.patchValue({
        tipoGuardias: selectedValues.filter((value: number) => value !== this.idContraFactura && value !== this.idPasiva)
      });
    }
  
    // Comprobar si se seleccionaron tipos de guardia CF o PASIVA para deshabilitar el panel de Situación de Revista
    this.toggleSituacionRevista(selectedValues);
  }
  
  onGuardiaCF(selectedValues: number[]): void {
    const HabilitacionesGuardiasControl = this.legajoForm.get('habilitacionesGuardias');

    // Si se selecciona CONTRAFACTURA habilita HabilitacionesGuardias
    if (selectedValues.includes(this.idContraFactura!)) {
      this.showHabilitacionesGuardias = true;
      this.legajoForm.get('habilitacionesGuardias')?.setValidators([Validators.required]);
    } else {
      // Si no se selecciona CONTRAFACTURA ocultar HabilitacionesGuardias
      this.showHabilitacionesGuardias = false;
      HabilitacionesGuardiasControl?.reset();
      this.legajoForm.get('habilitacionesGuardias')?.clearValidators();
    }

    // Actualiza la validez de los campos
    this.legajoForm.get('habilitacionesGuardias')?.updateValueAndValidity();
  }

  onSelectionChange(event: any): void {
    this.onTipoGuardiaSelectionChange(event);
  
    this.onGuardiaCF(event.value);
  }

  //aqui oculto o muestro situacion de revista según la guardia seleccionada
  toggleSituacionRevista(selectedValues: number[]): void {
    // Si se selecciona el CONTRAFACTURA O PASIVA, deshabilitar "Situación de Revista"
    if (selectedValues.length === 0 || selectedValues.includes(this.idContraFactura!) || selectedValues.includes(this.idPasiva!)) {
      this.isSituacionRevistaEnabled = false;
      this.disableSituacionRevistaFields();
    } else {
      // Si no se selecciona CF o PASIVA, habilitar "Situación de Revista"
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
      if (this.legajoForm.valid) {
        const legajoData = this.legajoForm.value;
        
    // Asegura que tipoGuardias sea un array no vacío
    const tiposGuardiasSeleccionados = legajoData.tipoGuardias || []; // Si es null o undefined, asigna un array vacío
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
                // Usa la ID de la revista existente
                this.createLegajoDtoAndSave(legajoData, existingRevista.id);
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
      }
    }
    
  createLegajoDtoAndSave(legajoData: any, revistaId: number | null): void {
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
    const esRegional = legajoData.idCargo === 2 ? true : false;

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
      );

      console.log("DTO creado para guardar legajo:", legajoDto);

      // Verificar si tipoGuardias incluye CONTRAFACTURA
      if (legajoData.tipoGuardias && legajoData.tipoGuardias.includes(this.idContraFactura)) {
      // Llamar al método de guardar permisos de efectores
      this.saveHabilitacionesGuardias(legajoData);
      }
    
      // Guardar el legajo sin la parte de revista si no corresponde
      this.legajoService.save(legajoDto).subscribe(
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