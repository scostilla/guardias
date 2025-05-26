import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/login/token.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { TipoGuardiaService } from 'src/app/services/tipoGuardia.service';
//import { AsistencialSummaryDto } from 'src/app/dto/Configuracion/asistencial/AsistencialSummaryDto';
//import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
//import { ServicioService } from 'src/app/services/servicio.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { RegistroActividadDto } from 'src/app/dto/RegistroActividadDto';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AsistencialFiltradoSelectorComponent } from '../../personal/personal-contenido/asistencial-selector/asistencial-filtrado-selector/asistencial-filtrado-selector.component';
import { AsistencialMode } from 'src/app/enums/asistencial-mode';
import { RegActivRegIngresoDto } from 'src/app/dto/RegistroActividad/RegActivRegIngresoDto';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';
import { VerificacionTentativoResponseDto } from 'src/app/dto/Cronogramas/VerificacionTentativoResponseDto';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { ServicioSummaryDto } from 'src/app/dto/Configuracion/ServicioSummaryDto';

@Component({
  selector: 'app-registro-actividades-ingreso',
  templateUrl: './registro-actividades-ingreso.component.html',
  styleUrls: ['./registro-actividades-ingreso.component.css']
})
export class RegistroActividadesIngresoComponent implements OnInit {
  registroForm: FormGroup;
  tiposGuardias: TipoGuardia[] = [];
  //asistenciales: AsistencialSummaryDto[] = [];
  servicios: ServicioSummaryDto[] = [];
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
  currentRole: string | null = null;


  constructor(
    private fb: FormBuilder,
    private registroActividadService: RegistroActividadService,
    private cronogramaTentativoService: CronogramaTentativoService,
    private novedadPersonalService: NovedadPersonalService,
    private tipoGuardiaService: TipoGuardiaService,
    //private asistencialService: AsistencialService,
    private hospitalService: HospitalService,
    private efectorService: EfectorService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private tokenService: TokenService,
    private route: ActivatedRoute,
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
  // Obtener rol actual
  this.tokenService.currentRole$.subscribe(role => {
    this.currentRole = role;
    this.UserRoles();

    if (!this.currentRole) {
      console.warn('No hay un rol seleccionado actualmente.');
    }
  });

  const userIdFromToken = this.tokenService.getUserIdFromToken();
  this.userId = userIdFromToken !== null ? Number(userIdFromToken) : null;

  this.efectorId = this.efectorService.getCurrentEfectorId();

    if (this.efectorId) {
      this.registroForm.patchValue({ idEfector: this.efectorId });
    }

    this.listTiposGuardias();
    /*this.listAsistenciales();*/
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

  /*listAsistenciales(): void {
    this.asistencialService.listSummary().subscribe(data => {
      console.log('Lista de asistenciales de cargo:', data);
      this.asistenciales = data;
    }, error => {
      console.log(error);
    });
  }*/

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

  listServicios(): void {
    this.hospitalService.getActiveServicesByHospital(this.efectorId!).subscribe((data: ServicioSummaryDto[]) => {
      this.servicios = data;
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

  /*compareAsistencial(p1: AsistencialSummaryDto, p2: AsistencialSummaryDto): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }*/

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

