import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/login/token.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistroActividad } from 'src/app/models/RegistroActividad'; // Puedes eliminar esto si no lo necesitas
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { TipoGuardiaService } from 'src/app/services/tipoGuardia.service';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { RegistroActividadDto } from 'src/app/dto/RegistroActividadDto';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AsistencialFiltradoSelectorComponent } from '../../personal/personal-contenido/asistencial-selector/asistencial-filtrado-selector/asistencial-filtrado-selector.component';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { RegistrosPendientes } from 'src/app/models/RegistrosPendientes';
import { RegistroPendienteService } from 'src/app/services/registroPendiente.service';
import { AsistencialMode } from 'src/app/enums/asistencial-mode';
import { RegActivRegSalidaDto } from 'src/app/dto/RegistroActividad/RegActivRegSalidaDto';

@Component({
  selector: 'app-registro-actividades-egreso',
  templateUrl: './registro-actividades-egreso.component.html',
  styleUrls: ['./registro-actividades-egreso.component.css']
})
export class RegistroActividadesEgresoComponent implements OnInit {
  registroForm: FormGroup;
  tiposGuardias: TipoGuardia[] = [];
  asistenciales: Asistencial[] = [];
  efectorId: number | null = null;
  efectorNombre: string | null = null; // Propiedad para almacenar el nombre del efector
  timeControl: FormControl = new FormControl();
  currentDate: Date = new Date();
  initialData: any;
  inputValue: string = '';

  isLogged = false;
  userId: number | null = null;
  nombreUsuario: string = '';
  apellidoUsuario: string = '';
  nombresEfectores: EfectorSummaryDto[] = [];
  ultimoRegistro: RegistroActividad | null = null;
  usuarioPersona: number | null = null;

  registrosPendientes: RegistrosPendientes[] = [];
  registroSeleccionado: RegistroActividad | null = null;
  idRegistroActividad: number | null = null;
  /* mesActual: number;
  anioActual: number; */

  constructor(
    private fb: FormBuilder,
    private registroActividadService: RegistroActividadService,
    private tipoGuardiaService: TipoGuardiaService,
    private asistencialService: AsistencialService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private tokenService: TokenService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private efectorService: EfectorService
  ) {
    //const fechaActual = new Date();
    //this.mesActual = 4;
    /* this.mesActual = fechaActual.getMonth() + 1; */
    //this.anioActual = fechaActual.getFullYear();

    this.currentDate = new Date();
    // Inicializar formulario
    this.registroForm = this.fb.group({
      idTipoGuardia: ['', Validators.required],
      idAsistencial: ['', Validators.required],
      idEfector: [''],
      fechaIngreso: ['', Validators.required],
      eventStartTime: ['', Validators.required],
      idRegistroActividad: [''],
      fechaEgreso: [Validators.required],
      //fechaEgreso: [fechaActual, Validators.required],
      eventEndTime: ['', Validators.required],
      idServicio: ['']
    });
  }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;

      const userIdFromToken = this.tokenService.getUserIdFromToken();
      this.userId = userIdFromToken !== null ? Number(userIdFromToken) : null;
      console.log('ID del usuario logeado:', this.userId);

      // Obtener detalles del usuario
      this.authService.detailPersonBasicPanel().subscribe(
        (response: PersonBasicPanelDto) => {
          this.usuarioPersona = response.id;
          this.nombreUsuario = response.nombre;
          this.apellidoUsuario = response.apellido;

          // Log para mostrar el usuario y los efectores
          console.log('Usuario logueado:', this.nombreUsuario, this.apellidoUsuario, this.usuarioPersona);
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
    // Obtener el ID efector del servicio
    this.efectorId = this.efectorService.getCurrentEfectorId();

    /* if (this.efectorId) {
      this.registroForm.patchValue({ idEfector: this.efectorId });
    } */

    this.listTiposGuardias();
    this.listAsistenciales();
  }

  listTiposGuardias(): void {
    this.tipoGuardiaService.list().subscribe(data => {
      console.log('Lista de Tipos de Guardias:', data);
      this.tiposGuardias = data;
    }, error => {
      console.log(error);
    });
  }

  listAsistenciales(): void {
    this.asistencialService.list().subscribe(data => {
      console.log('Lista de asistenciales de cargo:', data);
      this.asistenciales = data;
    }, error => {
      console.log(error);
    });
  }

  onTipoGuardiaChange(event: any): void {
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

  }

  openAsistencialDialog(): void {
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
  }

  cargarRegistrosPendientes(asistencialId: number): void {

    this.registroActividadService.getRegActivPendiente(asistencialId, this.efectorId!).subscribe({
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

    //Formatear hora (HH:mm:ss -> HH:mm)
    const horaFormateada = registro.horaIngreso.split(':').slice(0, 2).join(':');
    
    // Divide solo en 2 partes (HH y mm)
    const [hours, minutes] = registro.horaIngreso.split(':');

    // Obtener el tipo de guardia seleccionado actualmente
    //const tipoGuardiaActual = this.registroForm.get('idTipoGuardia')?.value;

    this.registroForm.patchValue({
      idRegistroActividad: registro.id,
      //horaFormateada,
      fechaIngreso: registro.fechaIngreso,
      eventStartTime: `${hours}:${minutes}`, // Formato HH:mm
      idEfector: registro.idEfector,
      idServicio: registro.idServicio
    });

    console.log('Formulario después de patch:', this.registroForm.value);

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

  saveRegistro(): void {
    console.log('Estado del formulario:', this.registroForm.status);
    const formValue = this.registroForm.getRawValue(); // Usar getRawValue() para incluir campos disabled
    console.log('Valores del formulario (raw):', formValue);

    if (this.registroForm.valid && this.idRegistroActividad) {
      
      // Verificar que tenemos el tipo de guardia
      if (!formValue.idTipoGuardia || !formValue.idTipoGuardia.id) {
        this.toastr.error('Debe seleccionar un tipo de guardia válido');
        return;
      }
      // Divide solo en 2 partes (HH y mm)
      const horaFormateada = formValue.fechaIngreso.split(':').slice(0, 2).join(':');

      // Crear DTO con los IDs numéricos necesarios
      const registroSalidaDto = new RegistroActividadDto(
        //formValue.fechaIngreso,
        horaFormateada,
        formValue.fechaEgreso,
        formValue.eventStartTime,
        formValue.eventEndTime,
        formValue.idTipoGuardia.id, // Solo el ID numérico
        true,
        formValue.idAsistencial,
        formValue.idServicio,
        formValue.idEfector,
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
          this.toastr.success('Salida registrada correctamente');
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

  compareAsistencial(p1: Asistencial, p2: Asistencial): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.router.navigate(['/registro-diario']);
  }
}

