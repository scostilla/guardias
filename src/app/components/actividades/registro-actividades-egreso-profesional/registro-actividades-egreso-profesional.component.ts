import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/login/token.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistroActividad } from 'src/app/models/RegistroActividad'; // Puedes eliminar esto si no lo necesitas
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { TipoGuardiaService } from 'src/app/services/tipoGuardia.service';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { RegistroActividadDto } from 'src/app/dto/RegistroActividadDto';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AsistencialFiltradoSelectorComponent } from '../../personal/personal-contenido/asistencial-selector/asistencial-filtrado-selector/asistencial-filtrado-selector.component';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { RegistrosPendientes } from 'src/app/models/RegistrosPendientes';
import { RegActivRegIngresoDto } from 'src/app/dto/RegistroActividad/RegActivRegIngresoDto';
import { AsistencialMode } from 'src/app/enums/asistencial-mode';
import { RegActivRegSalidaDto } from 'src/app/dto/RegistroActividad/RegActivRegSalidaDto';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import * as moment from 'moment';

@Component({
  selector: 'app-registro-actividades-egreso-profesional',
  templateUrl: './registro-actividades-egreso-profesional.component.html',
  styleUrls: ['./registro-actividades-egreso-profesional.component.css']
})

export class RegistroActividadesEgresoProfesionalComponent implements OnInit {
  registroForm: FormGroup;
  tiposGuardias: TipoGuardia[] = [];
  asistenciales: Asistencial[] = [];
  efectorId: number | null = null;
  efectorNombre: string | null = null; // Propiedad para almacenar el nombre del efector
  timeControl: FormControl = new FormControl();
  currentDate: Date = new Date();
  initialData: any;
  inputValue: string = '';


  //Autenticación
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;
  isAutoridad: boolean = false;
  userId: number | null = null;
  idPersona: number | null = null;
  nombrePersona: string | null = null;
  apellidoPersona: string | null = null;
  currentRole: string | null = null;

  registrosPendientes: RegistrosPendientes[] = [];
  registroSeleccionado: RegistroActividad | null = null;
  idRegistroActividad: number | null = null;
  /* mesActual: number;
  anioActual: number; */

  constructor(
    private fb: FormBuilder,
    private registroActividadService: RegistroActividadService,
    private cronogramaTentativoService: CronogramaTentativoService,
    private tipoGuardiaService: TipoGuardiaService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private tokenService: TokenService,
    private authService: AuthService,
    private efectorService: EfectorService,
  ) {
    //const fechaActual = new Date();
    //this.mesActual = 4;
    /* this.mesActual = fechaActual.getMonth() + 1; */
    //this.anioActual = fechaActual.getFullYear();

    this.currentDate = new Date();
      const now = new Date();
      const fechaFormateada = now.toLocaleDateString('es-AR'); // esto da DD/MM/AAAA
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const horaFormateada = `${hours}:${minutes}`;

      // Inicializar formulario
    this.registroForm = this.fb.group({
      idTipoGuardia: ['', Validators.required],
      idAsistencial: [null, Validators.required],
      idEfector: [''],
      fechaIngreso: ['', Validators.required],
      eventStartTime: ['', Validators.required],
      idRegistroActividad: [''],
      fechaEgreso: [fechaFormateada, Validators.required],
      //fechaEgreso: [fechaActual, Validators.required],
      eventEndTime: [horaFormateada, Validators.required],
      idServicio: [''],
      idUsuarioIngreso: [''],},
      { validators: this.validarFechaEgresoMayorOIgual() });
    
  }

  ngOnInit(): void {
    // Obtener el ID del efector actual
    this.efectorId = this.efectorService.getCurrentEfectorId();
    if (this.efectorId) {
      this.registroForm.patchValue({ idEfector: this.efectorId });
      this.loadEfectorName();
      this.listTiposGuardias();
    } else {
      this.toastr.warning('No seleccionaste un efector', 'Advertencia', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      this.router.navigateByUrl('/home-page');
      return; // detener ejecución
    }

    // Obtener el rol actual y establecer flags
    this.tokenService.currentRole$.subscribe(role => {
      this.currentRole = role;
      this.UserRoles();
    });

    // Obtener los datos de la persona
this.authService.detailPersonBasicPanel().subscribe((personDto: PersonBasicPanelDto) => {
  this.idPersona = personDto.id;
  this.nombrePersona = personDto.nombre;
  this.apellidoPersona = personDto.apellido;

  // Mostrar en el input readonly
  this.inputValue = `${this.apellidoPersona} ${this.nombrePersona}`;

  // Guardar el ID en el formulario
  this.registroForm.patchValue({
    idAsistencial: this.idPersona
  });

      // Si querés cargar registros pendientes, hacelo después de tener el ID
      this.cargarRegistrosPendientes(this.idPersona!);
    });

    const userIdFromToken = this.tokenService.getUserIdFromToken();
    this.userId = userIdFromToken !== null ? Number(userIdFromToken) : null;
  }

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
      this.isAutoridad = false;
      this.isUsuario = false;
      this.isDph = false;
      this.isSuper = false;
    }
  }

  //trae el nombre del efector esta en sesion
  loadEfectorName(): void {
    if (this.efectorId) {
      this.efectorService.getEfectorNombre(this.efectorId).subscribe(
        (efector: EfectorSummaryDto) => {
          // traigo nombre del efector
          this.efectorNombre = efector.nombre;
        },
        (error) => {
          console.error('Error al obtener el efector:', error);
          this.efectorNombre = null;
        }
      );
    }
  }

validarFechaEgresoMayorOIgual() {
  return (formGroup: AbstractControl): { [key: string]: any } | null => {
    const ingreso = formGroup.get('fechaIngreso')?.value;
    const egreso = formGroup.get('fechaEgreso')?.value;

    if (!ingreso || !egreso) return null;

    const ingresoDate = new Date(ingreso);
    const egresoDate = new Date(egreso);

    if (egresoDate < ingresoDate) {
      formGroup.get('fechaEgreso')?.setErrors({ fechaEgresoInvalida: true });
      return { fechaEgresoInvalida: true };
    } else {
      const errors = formGroup.get('fechaEgreso')?.errors;
      if (errors) {
        delete errors['fechaEgresoInvalida'];
        if (Object.keys(errors).length === 0) {
          formGroup.get('fechaEgreso')?.setErrors(null);
        } else {
          formGroup.get('fechaEgreso')?.setErrors(errors);
        }
      }
      return null;
    }
  };
}

  listTiposGuardias(): void {
    this.tipoGuardiaService.list().subscribe(data => {
      console.log('Lista de Tipos de Guardias:', data);
      this.tiposGuardias = data;
    }, error => {
      console.log(error);
    });
  }

  /*listAsistenciales(): void {
    this.asistencialService.list().subscribe(data => {
      console.log('Lista de asistenciales de cargo:', data);
      this.asistenciales = data;
    }, error => {
      console.log(error);
    });
  }*/

  /*onTipoGuardiaChange(event: any): void {
    console.log("Tipo de guardia seleccionado:", event.value);
    const nuevoTipoGuardia = event.value;
    // Cambiar el tipo de guardia y borrar solo los campos relacionados
    this.cambiarTipoGuardia(nuevoTipoGuardia);
  }

  // Método para cambiar el tipo de guardia y borrar solo los campos relacionados
  cambiarTipoGuardia(nuevoTipoGuardia: any): void {
    // Borrar solo los campos relacionados con el tipo de guardia
    this.registroForm.get('idAsistencial')?.reset();

    // Actualizar el tipo de guardia en el formulario
    this.registroForm.get('idTipoGuardia')?.setValue(nuevoTipoGuardia);

  }*/

  /*openAsistencialDialog(): void {
    console.log("Datos enviados al diálogo:", {
      idEfector: this.efectorId,
      tipoGuardia: this.registroForm.get('idTipoGuardia')?.value.nombre,
      mode: AsistencialMode.SALIDA
    });

    const dialogRef = this.dialog.open(AsistencialFiltradoSelectorComponent, {
      width: '800px',
      disableClose: true,
      data: {
        idEfector: this.efectorId,
        tipoGuardia: this.registroForm.get('idTipoGuardia')?.value.nombre,
        mode: AsistencialMode.SALIDA
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizo el valor legible para mostrarlo y el id para el formulario
        this.inputValue = `${result.apellido} ${result.nombre}`;
        this.registroForm.patchValue({ idAsistencial: result.id });

        // Cargar registros pendientes del profesional seleccionado
        this.cargarRegistrosPendientes(result.id);

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

  cargarRegistrosPendientes(idPersona: number): void {

    this.registroActividadService.getRegActivPendiente(idPersona, this.efectorId!).subscribe({
      next: (registro) => {
        if (registro != null) {

          this.cargarDatosRegistro(registro);
        } else {
          this.toastr.info('No hay registros pendientes para este profesional');
        }
      },
      error: (err) => {
        this.toastr.error('Error al cargar registros pendientes');
        console.error(err);
      }
    });
  }

  cargarDatosRegistro(registro: RegActivRegSalidaDto): void {

    console.log('Datos recibidos del backend:', registro);

    // Guardar el ID del registro para usarlo luego
    this.idRegistroActividad = registro.id;

    const fechaIngreso = new Date(registro.fechaIngreso);
    const fechaFormateada = moment.utc(fechaIngreso).startOf('day').format('DD/MM/YYYY');
    

    // Obtener el tipo de guardia seleccionado actualmente
    //const tipoGuardiaActual = this.registroForm.get('idTipoGuardia')?.value;

      this.registroForm.patchValue({
        idRegistroActividad: registro.id,
        fechaIngreso: fechaFormateada,
        eventStartTime: registro.horaIngreso,
        idEfector: registro.idEfector,
        idServicio: registro.idServicio,
        idUsuarioIngreso: registro.idUsuarioIngreso,
        idTipoGuardia: registro.idTipoGuardia,
        idAsistencial: registro.idAsistencial,
      });
    console.log('Formulario después de patch:', this.registroForm.value);

    // Paso 1: Crear el DTO
    const dto = new RegActivRegIngresoDto(
      registro.idAsistencial,
      registro.idEfector,
      registro.idTipoGuardia,
      registro.idServicio,
      new Date(registro.fechaIngreso),
      new Date(`1970-01-01T${registro.horaIngreso}`) // convertir hora string a Date
    );

    // Paso 2: Llamar al servicio
    this.cronogramaTentativoService.calcularHoraMaximaSalida(dto).subscribe({
      next: (respuesta: string) => {
        const horaMaxima = new Date(respuesta); // viene como ISO string, parseo a Date
        const ahora = new Date();

        console.log('Hora máxima permitida:', horaMaxima);
        console.log('Hora actual:', ahora);

        if (ahora > horaMaxima) {
          this.toastr.warning(
            'Excediste el total de tus horas de guardia. Contacta al administrativo del hospital para cargar tu egreso del día',
            'Límite superado',
            {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            }
          );
          this.router.navigateByUrl('/registro-diario');
        }
      },
      error: (err) => {
        console.error('Error al calcular hora máxima de salida:', err);
        this.toastr.error('No se pudo verificar el límite de hora de salida');
      }
  });
    /*  // Deshabilitar campos de ingreso (ya que son datos históricos)
     this.registroForm.get('fechaIngreso')?.disable();
     this.registroForm.get('eventStartTime')?.disable();
     this.registroForm.get('idTipoGuardia')?.disable();
     this.registroForm.get('idAsistencial')?.disable(); */
  }

  /*  // Modificar el formulario para el registro de salida
   private crearFormulario() {
     this.registroForm = this.fb.group({
       idTipoGuardia: ['', Validators.required],
       idAsistencial: ['', Validators.required],
       idRegistroActividad: ['', Validators.required], // Para guardar el ID del registro seleccionado
       fechaEgreso: [new Date(), Validators.required],
       eventEndTime: ['', Validators.required]
     });
   }
 
   // Modificar el onProfesionalSelected para cargar registros pendientes
   onProfesionalSelected(): void {
     const profesionalId = this.registroForm.get('idAsistencial')?.value;
     if (profesionalId && this.efectorId) {
       this.cargarRegistrosPendientes(profesionalId);
     } else {
       this.registrosPendientes = [];
       this.registroSeleccionado = null;
     }
   }
 
   cargarRegistrosPendientes(profesionalId: number): void {
     console.log("efector" , this.efectorId );
     console.log("mes" , this.mesActual );
     console.log("anio" , this.anioActual);
     console.log("profesional" , profesionalId );
     this.registroPendienteService.detailByEfectorAndFechaAndAsistencial(
       this.efectorId!,
       this.mesActual,
       this.anioActual,
       profesionalId
     ).subscribe({
       next: (registros: RegistrosPendientes[]) => {
         console.log("Registros recibidos del backend:", registros); // <- Debug
         this.registrosPendientes = registros;
         
         if (registros.length === 1 && registros[0].registrosActividades?.length > 0) {
           this.seleccionarRegistro(registros[0].registrosActividades[0]);
         } else if (registros.length === 0) {
           this.toastr.info('No hay registros pendientes para este profesional');
         }
       },
       error: (err) => {
         this.toastr.error('Error al cargar registros pendientes');
         console.error(err);
       }
     });
   }
 
   seleccionarRegistro(registro: RegistroActividad): void {
     this.registroSeleccionado = registro;
     this.registroForm.patchValue({
       idRegistroActividad: registro.id,
       // No necesitamos cargar más datos ya que son solo para referencia visual
     });
   }
  */

  getNombreTipoGuardia(): string {
    const idTipoGuardia = this.registroForm.get('idTipoGuardia')?.value;
    const tipo = this.tiposGuardias.find(t => t.id === idTipoGuardia);
    return tipo ? tipo.nombre : '';
  }

saveRegistro(): void {
  console.log('Estado del formulario:', this.registroForm.status);
  const formValue = this.registroForm.getRawValue(); // Incluye campos deshabilitados
  console.log('Valores del formulario (raw):', formValue);

  if (this.registroForm.valid && this.idRegistroActividad) {

    // Validación extra de tipo de guardia
    if (!formValue.idTipoGuardia) {
      this.toastr.error('Debe seleccionar un tipo de guardia válido');
      return;
    }
    // 🟢 Convertir fechaIngreso (DD/MM/AAAA) a ISO (YYYY-MM-DD)
    const [dia, mes, anio] = formValue.fechaIngreso.split('/');
    const fechaIngresoDate = new Date(+anio, +mes - 1, +dia);

    const [diaEg, mesEg, anioEg] = formValue.fechaEgreso.split('/');
    const fechaEgresoDate = new Date(+anioEg, +mesEg - 1, +diaEg);

    // Crear DTO
    const registroSalidaDto = new RegistroActividadDto(
      fechaIngresoDate,
      fechaEgresoDate,
      formValue.eventStartTime,
      formValue.eventEndTime,
      formValue.idTipoGuardia,
      true,
      formValue.idAsistencial,
      formValue.idServicio,
      formValue.idEfector,
      formValue.idUsuarioIngreso,
      this.userId!
    );

    console.log('Enviando a registrarSalida:', {
      id: this.idRegistroActividad,
      dto: registroSalidaDto
    });

    this.registroActividadService.registrarSalida(
      this.idRegistroActividad,
      registroSalidaDto
    ).subscribe({
      next: () => {
        this.toastr.success('Salida registrada correctamente', 'Éxito', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.router.navigate(['/registro-diario']);
      },
      error: (err) => {
        console.error('Error en la petición:', err);
        this.toastr.error('Error al registrar salida');
      }
    });

  } else {
    this.toastr.warning('Complete todos los campos obligatorios');
  }
}


  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.registroForm.value);
  }

  compareTipoGuardia(p1: TipoGuardia, p2: TipoGuardia): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  /*compareAsistencial(p1: Asistencial, p2: Asistencial): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }*/

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.router.navigate(['/registro-diario']);
  }
}