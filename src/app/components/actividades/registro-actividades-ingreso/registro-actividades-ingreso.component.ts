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
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { ServicioService } from 'src/app/services/servicio.service';
import { RegistroActividadDto } from 'src/app/dto/RegistroActividadDto';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AsistencialFiltradoSelectorComponent } from '../../personal/personal-contenido/asistencial-selector/asistencial-filtrado-selector/asistencial-filtrado-selector.component';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { AsistencialMode } from 'src/app/enums/asistencial-mode';
import { RegActivRegIngresoDto } from 'src/app/dto/RegistroActividad/RegActivRegIngresoDto';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';
import { VerificacionTentativoResponseDto } from 'src/app/dto/Cronogramas/VerificacionTentativoResponseDto';

@Component({
  selector: 'app-registro-actividades-ingreso',
  templateUrl: './registro-actividades-ingreso.component.html',
  styleUrls: ['./registro-actividades-ingreso.component.css']
})
export class RegistroActividadesIngresoComponent implements OnInit {
  registroForm: FormGroup;
  tiposGuardias: TipoGuardia[] = [];
  asistenciales: Asistencial[] = [];
  servicios: Servicio[] = [];
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

  constructor(
    private fb: FormBuilder,
    private registroActividadService: RegistroActividadService,
    private cronogramaTentativoService: CronogramaTentativoService,
    private novedadPersonalService: NovedadPersonalService,
    private tipoGuardiaService: TipoGuardiaService,
    private asistencialService: AsistencialService,
    private servicioService: ServicioService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private tokenService: TokenService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private efectorService: EfectorService // Inyectar el servicio EfectorService
  ) {
    this.currentDate = new Date();

    this.registroForm = this.fb.group({
      idTipoGuardia: ['', Validators.required],
      idAsistencial: ['', Validators.required],
      idServicio: ['', Validators.required],
      idEfector: [''],
      fechaIngreso: ['', Validators.required],
      eventStartTime: ['', Validators.required],
      eventEndTime: [{ value: '', disabled: true }, Validators.required]
    });

    this.route.data.subscribe(data => {
      this.initialData = data['initialData'];
      if (this.initialData) {
        this.registroForm.patchValue(this.initialData);
      }
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

    if (this.efectorId) {
      this.registroForm.patchValue({ idEfector: this.efectorId });
    }

    this.listTiposGuardias();
    this.listAsistenciales();
    this.listServicios();
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

  listServicios(): void {
    this.servicioService.list().subscribe(data => {
      console.log('Lista de servicios:', data);
      this.servicios = data;
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
    this.registroForm.get('idServicio')?.reset();

    // Actualizar el tipo de guardia en el formulario
    this.registroForm.get('idTipoGuardia')?.setValue(nuevoTipoGuardia);

  }

  openAsistencialDialog(): void {
    console.log("Datos enviados al diálogo:", {
      idEfector: this.efectorId,
      tipoGuardia: this.registroForm.get('idTipoGuardia')?.value.nombre,
      mode: AsistencialMode.INGRESO
    });
    const dialogRef = this.dialog.open(AsistencialFiltradoSelectorComponent, {
      width: '800px',
      disableClose: true,
      data: {
        idEfector: this.efectorId, // Pasar el idEfector desde el sessionStorage
        tipoGuardia: this.registroForm.get('idTipoGuardia')?.value.nombre, // Pasar el tipo de guardia seleccionado
        mode: AsistencialMode.INGRESO
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

  saveRegistro(): void {
    if (this.registroForm.valid) {
      const registroData = this.registroForm.value;
      const idPersona = registroData.idAsistencial;

      // 1. Verificar si puede hacer guardia
      const fechaConsulta = registroData.fechaIngreso.format('YYYY-MM-DD');
      this.novedadPersonalService.puedeHacerGuardia(idPersona, fechaConsulta).subscribe({
        next: (puedeHacerGuardia: boolean) => {
          if (!puedeHacerGuardia) {
            this.mostrarError('El profesional tiene novedades que impiden realizar guardia');
            return;
          }

          // 2. Verificar cronograma tentativo
          const verificarDto = this.crearVerificacionDto(registroData);
          this.cronogramaTentativoService.verificarRegistroIngresoEnTentativo(verificarDto).subscribe({
            next: (response: VerificacionTentativoResponseDto) => {
              if (!response.existe || !response.id) {
                this.mostrarError('Los datos no coinciden con el cronograma tentativo del profesional');
                return;
              }

              // 3. Primero guardar el registro
              this.guardarRegistro(registroData, response.id);
            },
            error: (error) => this.mostrarError('Error al verificar cronograma tentativo', error)
          });
        },
        error: (error) => this.mostrarError('Error al verificar novedades', error)
      });
    }
  }

  private guardarRegistro(registroData: any, idCronograma: number): void {
    const registroDto = this.crearRegistroDto(registroData, idCronograma);
    const observable = this.initialData?.id 
      ? this.registroActividadService.update(this.initialData.id, registroDto)
      : this.registroActividadService.save(registroDto);

    observable.subscribe({
      next: () => {
        // 4. Solo si el registro se guardó correctamente, marcamos como aceptado
        this.cronogramaTentativoService.aceptar(idCronograma).subscribe({
          next: () => {
            this.mostrarExito('Registro guardado y cronograma aceptado');
            this.router.navigate(['/registro-diario']);
          },
          error: (error) => {
            this.mostrarExito('Registro guardado, pero no se pudo marcar el cronograma como aceptado');
            this.router.navigate(['/registro-diario']);
            console.error('Error al aceptar cronograma:', error);
          }
        });
      },
      error: (error) => this.mostrarError('Error al guardar el registro', error)
    });
  }

  // Métodos auxiliares
  private crearVerificacionDto(registroData: any): RegActivRegIngresoDto {
    return new RegActivRegIngresoDto(
      registroData.idAsistencial,
      registroData.idEfector,
      registroData.idTipoGuardia.id,
      registroData.idServicio.id,
      registroData.fechaIngreso,
      registroData.eventStartTime
    );
  }

  private crearRegistroDto(registroData: any, idCronograma: number): RegistroActividadDto {
    return new RegistroActividadDto(
      registroData.fechaIngreso,
      registroData.fechaEgreso,
      registroData.eventStartTime,
      registroData.eventEndTime,
      registroData.idTipoGuardia.id,
      true,
      registroData.idAsistencial,
      registroData.idServicio.id,
      registroData.idEfector,
      this.userId!,
      idCronograma
    );
  }

  private mostrarError(mensaje: string, error?: any): void {
    if (error) console.error(mensaje, error);
    this.toastr.error(mensaje, 'Error', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
  }

  private mostrarExito(mensaje: string): void {
    this.toastr.success(mensaje, 'Éxito', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
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

  compareServicio(p1: Servicio, p2: Servicio): boolean {
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

