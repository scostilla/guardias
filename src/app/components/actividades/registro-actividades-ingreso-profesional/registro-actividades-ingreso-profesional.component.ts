import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/login/token.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { RegistroActividadDto } from 'src/app/dto/RegistroActividadDto';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { RegActivRegIngresoDto } from 'src/app/dto/RegistroActividad/RegActivRegIngresoDto';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';
import { VerificacionTentativoResponseDto } from 'src/app/dto/Cronogramas/VerificacionTentativoResponseDto';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { AsistencialTiposGuardiasDto } from 'src/app/dto/Configuracion/asistencial/AsistencialTiposGuardiasDto';
import { TentativoIdsResponseDto } from 'src/app/dto/Cronogramas/TentativoIdsResponseDto';
import { TentativoSearchRequestDto } from 'src/app/dto/Cronogramas/TentativoSearchRequestDto';

@Component({
  selector: 'app-registro-actividades-ingreso-profesional',
  templateUrl: './registro-actividades-ingreso-profesional.component.html',
  styleUrls: ['./registro-actividades-ingreso-profesional.component.css']
})
export class RegistroActividadesIngresoProfesionalComponent implements OnInit {
  registroForm: FormGroup;
  tiposGuardias: AsistencialTiposGuardiasDto[] = [];
  //asistenciales: AsistencialSummaryDto[] = [];
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

  idServicio!: number;
  idTipoGuardia!: number;

  constructor(
    private fb: FormBuilder,
    private registroActividadService: RegistroActividadService,
    private cronogramaTentativoService: CronogramaTentativoService,
    private novedadPersonalService: NovedadPersonalService,
    private asistencialService: AsistencialService,
    private efectorService: EfectorService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private tokenService: TokenService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {
    this.currentDate = new Date();
      const now = new Date();
      const fechaFormateada = now.toLocaleDateString('es-AR'); // esto da DD/MM/AAAA
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const horaFormateada = `${hours}:${minutes}`;

    this.registroForm = this.fb.group({
      idAsistencial: [{ value: '', disabled: true }],
      idEfector: [''],
      fechaIngreso: [fechaFormateada, Validators.required],
      eventStartTime: [horaFormateada, Validators.required],
      eventEndTime: [{ value: '', disabled: true }, Validators.required],
    });

    this.route.data.subscribe(data => {
      this.initialData = data['initialData'];
      if (this.initialData) {
        this.registroForm.patchValue(this.initialData);
      }
    });
  }

  ngOnInit(): void {
    // Obtener el ID efector del servicio
    this.efectorId = this.efectorService.getCurrentEfectorId();
      if (this.efectorId) {
        this.registroForm.patchValue({ idEfector: this.efectorId });
        this.loadEfectorName();
      } else {
        this.toastr.warning('No seleccionaste un efector', 'Advertencia', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      this.router.navigateByUrl('/home-page');
    }
  
    // Obtener rol actual
    this.tokenService.currentRole$.subscribe(role => {
      this.currentRole = role;
      this.UserRoles();

      if (!this.currentRole) {
        console.warn('No hay un rol seleccionado actualmente.');
      }
    });

    this.authService.detailPersonBasicPanelProfessional().subscribe((personDto: PersonBasicPanelDto) => {
      this.idPersona = personDto.id;
      this.nombrePersona = personDto.nombre;
      this.apellidoPersona = personDto.apellido;
      this.inputValue = `${this.apellidoPersona} ${this.nombrePersona}`;
      this.registroForm.patchValue({ idAsistencial: this.inputValue });
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

  saveRegistro(): void {
    if (!this.registroForm.valid) {
      console.warn('Formulario inválido, no se puede guardar.');
      return;
    }

    const registroData = this.registroForm.value;
    const idPersona = this.idPersona!;

    // Convertir fecha DD/MM/YYYY a YYYY-MM-DD
    const [dia, mes, anio] = registroData.fechaIngreso.split('/');
    const fechaConsulta = `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    registroData.fechaIngreso = fechaConsulta;

    console.log('Datos del formulario:', registroData);

    // 🔍 PRIMERO obtener servicio y tipo de guardia
    const searchDto: TentativoSearchRequestDto = {
      idAsistencial: idPersona,
      idEfector: registroData.idEfector,
      fechaIngreso: registroData.fechaIngreso,
      horaIngreso: registroData.eventStartTime
    };

    this.cronogramaTentativoService.getServicioAndTipoGuardia(searchDto).subscribe({
      next: (response: TentativoIdsResponseDto) => {
        console.log('🧩 Servicio y tipo de guardia desde backend:', response);

        this.idServicio = response.idServicio;
        this.idTipoGuardia = response.idTipoGuardia;

        // 👉 Ahora sí: verificar novedades
        this.novedadPersonalService.puedeHacerGuardia(idPersona, fechaConsulta).subscribe({
          next: (puedeHacerGuardia: boolean) => {
            if (!puedeHacerGuardia) {
              this.mostrarError('El profesional tiene novedades que impiden realizar guardia');
              return;
            }

            // 👉 Verificación en cronograma tentativo
            const verificarDto = this.crearVerificacionDto(registroData);
            console.log('Enviando VerificacionDto al backend:', verificarDto);

            this.cronogramaTentativoService.verificarRegistroIngresoEnTentativo(verificarDto).subscribe({
              next: (response: VerificacionTentativoResponseDto) => {
                if (!response.existe || !response.id) {
                  this.mostrarError('Los datos no coinciden con el cronograma tentativo del profesional');
                  return;
                }

                // 👉 Guardar registro con el id del cronograma
                this.guardarRegistro(registroData, response.id);
              },
              error: (error) => {
                console.error('Error al verificar cronograma tentativo:', error);
                this.mostrarError('Error al verificar cronograma tentativo', error);
              }
            });
          },
          error: (error) => {
            console.error('Error al verificar novedades del profesional:', error);
            this.mostrarError('Error al verificar novedades', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener servicio y tipo de guardia:', error);
        this.mostrarError('No se pudo obtener servicio y tipo de guardia', error);
      }
    });
  }

  private guardarRegistro(registroData: any, idCronograma: number): void {
    console.log('📌 Entrando a guardarRegistro con idCronograma:', idCronograma);

    const registroDto = this.crearRegistroDto(registroData, idCronograma);

    console.log('📦 DTO enviado a guardar:', {
      idCronograma,
      registroDto,
      modo: this.initialData?.id ? 'Actualización' : 'Creación'
    });

    const observable = this.initialData?.id
      ? this.registroActividadService.update(this.initialData.id, registroDto)
      : this.registroActividadService.save(registroDto);

    observable.subscribe({
      next: () => {
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
  const dto = new RegActivRegIngresoDto(
    this.idPersona!,
    registroData.idEfector,
    this.idTipoGuardia,
    this.idServicio,
    registroData.fechaIngreso,
    registroData.eventStartTime
  );

  console.log('🛠️ DTO creado para verificación:', {
    idAsistencial: this.idPersona,
    idEfector: registroData.idEfector,
    idTipoGuardia: this.idTipoGuardia,
    idServicio: this.idServicio,
    fechaIngreso: registroData.fechaIngreso,
    horaIngreso: registroData.eventStartTime
  });

  return dto;
}

  private crearRegistroDto(registroData: any, idCronograma: number): RegistroActividadDto {
    return new RegistroActividadDto(
      registroData.fechaIngreso,
      registroData.fechaEgreso,
      registroData.eventStartTime,
      registroData.eventEndTime,
      this.idTipoGuardia,
      true,
      this.idPersona!,
      this.idServicio,
      registroData.idEfector,
      this.userId!, //idUsuarioIngreso
      registroData.idUsuarioEgreso ?? null,
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

  compareTipoGuardia(p1: AsistencialTiposGuardiasDto, p2: AsistencialTiposGuardiasDto): boolean {
    return p1 && p2 ? p1.idTipoGuardia  === p2.idTipoGuardia  : p1 === p2;
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

