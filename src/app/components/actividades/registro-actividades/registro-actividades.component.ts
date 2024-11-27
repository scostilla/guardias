import { Component } from '@angular/core';
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
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-registro-actividades',
  templateUrl: './registro-actividades.component.html',
  styleUrls: ['./registro-actividades.component.css']
})
export class RegistroActividadesComponent {
  registroForm: FormGroup;
  tiposGuardias: TipoGuardia[] = [];
  asistenciales: Asistencial[] = [];
  servicios: Servicio[] = [];
  efectores: Efector[] = [];
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
      idAsistencial: ['', Validators.required],
      idServicio: ['', Validators.required],
      idEfector: ['', Validators.required],
      fechaIngreso: ['', Validators.required],
      eventStartTime: ['', Validators.required],
      fechaEgreso: [{ value: '', disabled: true }],
      eventEndTime: [{ value: '', disabled: true }, Validators.required]
    });

    this.registroForm.get('fechaIngreso')?.valueChanges.subscribe(value => {
      this.updateFechaEgresoState(value);
    });

    this.registroForm.get('fechaEgreso')?.valueChanges.subscribe(value => {
      this.updateEventEndTimeState(value);
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


  onTipoGuardiaChange(event: any) {
    console.log("Tipo de guardia seleccionado:", event.value);
  }

  private updateFechaEgresoState(fechaIngreso: Date | null): void {
    const fechaEgresoControl = this.registroForm.get('fechaEgreso') as FormControl;

    if (fechaIngreso) {
      fechaEgresoControl.enable();
      fechaEgresoControl.setValidators([this.fechaEgresoValidator(fechaIngreso)]);
    } else {
      fechaEgresoControl.disable();
      fechaEgresoControl.clearValidators();
    }

    fechaEgresoControl.updateValueAndValidity();
  }

  private updateEventEndTimeState(fechaEgreso: Date | null): void {
    const eventEndTimeControl = this.registroForm.get('eventEndTime') as FormControl;

    if (fechaEgreso) {
      eventEndTimeControl.enable();
      eventEndTimeControl.setValidators([Validators.required]);
    } else {
      eventEndTimeControl.disable();
      eventEndTimeControl.clearValidators();
    }

    eventEndTimeControl.updateValueAndValidity();
  }

  private fechaEgresoValidator(fechaIngreso: Date): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const fechaEgreso = control.value ? new Date(control.value) : null;

      // Si no hay fecha de egreso, no hay error
      if (!fechaEgreso) {
        return null;
      }

      // Validar que la fecha de egreso sea igual o mayor a la fecha de ingreso
      const isValid = fechaEgreso >= fechaIngreso;
      return isValid ? null : { fechaEgresoInvalida: true };
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

  openAsistencialDialog(): void {
    const dialogRef = this.dialog.open(AsistencialSelectorComponent, {
      width: '800px',
      disableClose: true
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
      const registroDto = new RegistroActividadDto(
        registroData.fechaIngreso,
        registroData.fechaEgreso,
        registroData.eventStartTime,
        registroData.eventEndTime,
        registroData.idTipoGuardia.id,
        true, 
        registroData.idAsistencial,
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
            this.router.navigate(['/home-page']);
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
            this.router.navigate(['/home-page']);
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
    this.router.navigate(['/home-page']);
  }
}
