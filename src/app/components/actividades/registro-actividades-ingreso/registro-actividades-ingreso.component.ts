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
import { AsistencialSelectorComponent } from 'src/app/components/personal/personal-contenido/asistencial-selector/asistencial-selector.component';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { ServicioService } from 'src/app/services/servicio.service';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { RegistroActividadDto } from 'src/app/dto/RegistroActividadDto';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';


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
  efectores: Efector[] = [];
  timeControl: FormControl = new FormControl();
  currentDate: Date = new Date();
  initialData: any;
  inputValue: string = '';
  asistencialSeleccionado: Asistencial | null = null;

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
    private tipoGuardiaService: TipoGuardiaService,
    private asistencialService: AsistencialService,
    private servicioService: ServicioService,
    private hospitalService: HospitalService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private tokenService: TokenService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.currentDate = new Date();

    this.registroForm = this.fb.group({
      idTipoGuardia: ['', Validators.required],
      idServicio: ['', Validators.required],
      idEfector: ['', Validators.required],
      fechaIngreso: [this.currentDate, Validators.required], // Fecha actual
      eventStartTime: [this.formatCurrentTime(), Validators.required], // Hora actual
      fechaEgreso: [''],
      eventEndTime: ['']
    });

    this.listTiposGuardias();
    this.listAsistenciales();
    this.listServicios();
    this.listEfectores();

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
      console.log('ID del usuario logeado:',this.userId);

      // Obtener detalles del usuario
      this.authService.detailPersonBasicPanel().subscribe(
        (response: PersonBasicPanelDto) => {
          this.usuarioPersona = response.id;
          this.nombreUsuario = response.nombre;
          this.apellidoUsuario = response.apellido;
          this.nombresEfectores = response.efectores; // Asignar efectores

          this.loadAsistencialData();

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
  }

  private formatCurrentTime(): string {
    const hours = this.currentDate.getHours().toString().padStart(2, '0');
    const minutes = this.currentDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`; // Formato HH:mm
  }

  onTipoGuardiaChange(event: any) {
    console.log("Tipo de guardia seleccionado:", event.value);
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

  listEfectores(): void {
    this.hospitalService.list().subscribe(data => {
      console.log('Lista de efectores:', data);
      this.efectores = data;
    }, error => {
      console.log(error);
    });
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.registroForm.value);
  }

  private loadAsistencialData(): void {
    this.inputValue = `${this.apellidoUsuario} ${this.nombreUsuario}`;
  }
  
  saveRegistro(): void {
    if (this.registroForm.valid) {
      const registroData = this.registroForm.value;
      const asistencialId = this.usuarioPersona !== null ? this.usuarioPersona : 0;

      const registroDto = new RegistroActividadDto(
        moment(registroData.fechaIngreso).startOf('day').toDate(), // Asegúrate de que sea un objeto Date
        registroData.fechaEgreso,
        registroData.eventStartTime,
        registroData.eventEndTime,
        registroData.idTipoGuardia.id,
        true, 
        asistencialId,
        registroData.idServicio.id,
        registroData.idEfector.id,
        this.userId!
      );

      console.log('Registro a enviar:', registroDto);

      if (this.initialData && this.initialData.id) {
        this.registroActividadService.update(this.initialData.id, registroDto).subscribe(
          result => {
            this.toastr.success('Registro diario creado con éxito', 'EXITO', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            this.router.navigate(['/home-profesional']);
          },
          error => {
            this.toastr.error('Ocurrió un error al crear o editar el registro diario', 'Error', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
          }
        );
      } else {
        this.registroActividadService.save(registroDto).subscribe(
          result => {
            this.toastr.success('Registro guardado con éxito', 'EXITO', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            this.router.navigate(['/home-profesional']);
          },
          error => {
            this.toastr.error('Ocurrió un error al guardar el registro', 'Error', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
          }
        );
      }
    }
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

  compareEfector(p1: Efector, p2: Efector): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.router.navigate(['/home-profesional']);
  }

  onLogOut(): void {
    this.tokenService.logOut();
    window.location.reload();
  }

}
