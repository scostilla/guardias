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
      idRegistroActividad: ['', Validators.required],
      fechaEgreso: [Validators.required],
      //fechaEgreso: [fechaActual, Validators.required],
      eventEndTime: ['', Validators.required]
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
      tipoGuardia: this.registroForm.get('idTipoGuardia')?.value.id,
      mode: AsistencialMode.SALIDA
    });
    const dialogRef = this.dialog.open(AsistencialFiltradoSelectorComponent, {
      width: '800px',
      disableClose: true,
      data: { 
        idEfector: this.efectorId, 
        tipoGuardia: this.registroForm.get('idTipoGuardia')?.value.id,
        mode: AsistencialMode.SALIDA
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Actualizo el valor legible para mostrarlo y el id para el formulario
        this.inputValue = `${result.apellido} ${result.nombre}`;
        this.registroForm.patchValue({ idAsistencial: result.id });
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
    console.log('Formulario válido:', this.registroForm.valid);
    console.log('Formulario modificado:', this.isModified());
    console.log('Valores del formulario:', this.registroForm.value);
    if (this.registroForm.valid  && this.registroSeleccionado) {
      const registroData = this.registroForm.value;
      const registroSalida = new RegistroActividadDto(
        this.registroSeleccionado.fechaIngreso,
        registroData.fechaEgreso,
        this.registroSeleccionado.horaIngreso,
        registroData.eventEndTime,
        this.registroSeleccionado.tipoGuardia.id! || 0,
        true,
        this.registroSeleccionado.asistencial.id! || 0,
        //aqui tiene que tomar el id del servicio del registro de actividad encontrado a treves del registro pendiente
        this.registroSeleccionado.servicio.id! || 0,
        registroData.idEfector || 0,
        this.userId! || 0
      );

      console.log('Registro a enviar:', registroSalida);

      this.registroActividadService.registrarSalida(
        this.registroSeleccionado.id!, registroSalida
      ).subscribe(
          result => {
            this.toastr.success('Salida registrada correctamente', 'EXITO', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            this.router.navigate(['/registro-diario']);
          },
          error => {
            this.toastr.error('Error al registrar salida', 'Error', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
          }
        );
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
    this.router.navigate(['/home-page']);
  }
}

