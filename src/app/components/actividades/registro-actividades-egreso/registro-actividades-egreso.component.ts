import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/login/token.service';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RegistroActividad } from 'src/app/models/RegistroActividad'; // Puedes eliminar esto si no lo necesitas
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { TipoGuardiaService } from 'src/app/services/tipoGuardia.service';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { RegistroActividadDto } from 'src/app/dto/RegistroActividadDto';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AsistencialFiltradoSelectorComponent } from '../../personal/personal-contenido/asistencial-selector/asistencial-filtrado-selector/asistencial-filtrado-selector.component';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { RegistrosPendientes } from 'src/app/models/RegistrosPendientes';
import { AsistencialMode } from 'src/app/enums/asistencial-mode';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { RegActivRegIngresoDto } from 'src/app/dto/RegistroActividad/RegActivRegIngresoDto';
import { RegActivRegSalidaDto } from 'src/app/dto/RegistroActividad/RegActivRegSalidaDto';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';
import * as moment from 'moment';

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
  efectorNombre: string | null = null;
  timeControl: FormControl = new FormControl();
  currentDate: Date = new Date();
  initialData: any;
  inputValue: string = '';

  minFechaIngreso: string = moment().format('YYYY-MM-DD');
  maxFechaIngreso: string = moment().format('YYYY-MM-DD');
  maxHoraIngreso: string = '00:00';

  maxFechaHoraEgreso: Date | null = null;
  maxFechaEgreso: Date | null = null;
  maxHoraEgreso: string = '00:00';

  //Autenticación
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;
  isAutoridad: boolean = false;
  userId: number | null = null;
  idPersona: number | null = null;
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
    private efectorService: EfectorService,
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
      fechaEgreso: [null, Validators.required],
      //fechaEgreso: [fechaActual, Validators.required],
      eventEndTime: [null, Validators.required],
      idServicio: [''],
      idUsuarioIngreso: [''],},
      {   validators: [
        this.validarFechaEgresoMayorOIgual(),           // fecha egreso >= fecha ingreso
        this.validarFechaHoraEgresoNoAnterior(),
        this.validarFechaHoraEgresoNoExcedida()         // no superar hora máxima permitida
      ]});
  }

  ngOnInit(): void {
    // Obtener el ID efector del servicio
    this.efectorId = this.efectorService.getCurrentEfectorId();
      if (this.efectorId) {
        this.registroForm.patchValue({ idEfector: this.efectorId });
        this.loadEfectorName();
        this.listTiposGuardias();
        /*this.listAsistenciales();*/
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

    const userIdFromToken = this.tokenService.getUserIdFromToken();
    this.userId = userIdFromToken !== null ? Number(userIdFromToken) : null;
    
    const hoy = moment();
    this.maxFechaIngreso = hoy.format('YYYY-MM-DD');
    this.minFechaIngreso = hoy.clone().subtract(14, 'days').format('YYYY-MM-DD');
    this.registroForm.get('fechaIngreso')?.valueChanges.subscribe((fechaSeleccionada: string | Date) => {
      const fecha = moment(fechaSeleccionada);
      const hoy = moment();
      const esHoy = fecha.isSame(hoy, 'day');

      // Actualizo el máximo para el picker de hora
      this.maxHoraIngreso = esHoy ? hoy.format('HH:mm') : '23:59';

      // Reseteo la hora de inicio cuando cambia la fecha
      this.registroForm.get('eventStartTime')?.setValue(null);

      // Si querés mantener el required, lo podés setear aquí
      const horaControl = this.registroForm.get('eventStartTime');
      horaControl?.setValidators([Validators.required]);
      horaControl?.updateValueAndValidity();
    });
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

validarFechaHoraEgresoNoAnterior(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const fechaIngreso = formGroup.get('fechaIngreso')?.value;
    const horaIngreso = formGroup.get('eventStartTime')?.value;
    const fechaEgreso = formGroup.get('fechaEgreso')?.value;
    const horaEgreso = formGroup.get('eventEndTime')?.value;

    console.log('[Validador] Fecha Ingreso:', fechaIngreso);
    console.log('[Validador] Hora Ingreso:', horaIngreso);
    console.log('[Validador] Fecha Egreso:', fechaEgreso);
    console.log('[Validador] Hora Egreso:', horaEgreso);

    if (!fechaIngreso || !horaIngreso || !fechaEgreso || !horaEgreso) {
      return null;
    }

    const [ingHora, ingMin] = horaIngreso.split(':').map(Number);
    const [egrHora, egrMin] = horaEgreso.split(':').map(Number);

    const fechaHoraIngreso = moment(fechaIngreso).set({ hour: ingHora, minute: ingMin, second: 0 });
    const fechaHoraEgreso = moment(fechaEgreso).set({ hour: egrHora, minute: egrMin, second: 0 });

    console.log('[Validador] FechaHoraIngreso:', fechaHoraIngreso.format('YYYY-MM-DD HH:mm'));
    console.log('[Validador] FechaHoraEgreso:', fechaHoraEgreso.format('YYYY-MM-DD HH:mm'));

    if (fechaHoraEgreso.isBefore(fechaHoraIngreso)) {
      formGroup.get('fechaEgreso')?.setErrors({ egresoAntesDeIngreso: true });
      formGroup.get('eventEndTime')?.setErrors({ egresoAntesDeIngreso: true });
      return { egresoAntesDeIngreso: true };
    } else {
      // Limpiar errores si ya no aplica
      const fechaCtrl = formGroup.get('fechaEgreso');
      const horaCtrl = formGroup.get('eventEndTime');

      if (fechaCtrl?.hasError('egresoAntesDeIngreso')) {
        delete fechaCtrl.errors?.['egresoAntesDeIngreso'];
        if (Object.keys(fechaCtrl.errors ?? {}).length === 0) fechaCtrl.setErrors(null);
      }

      if (horaCtrl?.hasError('egresoAntesDeIngreso')) {
        delete horaCtrl.errors?.['egresoAntesDeIngreso'];
        if (Object.keys(horaCtrl.errors ?? {}).length === 0) horaCtrl.setErrors(null);
      }

      return null;
    }
  };
}

validarFechaHoraEgresoNoExcedida(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    if (!this.maxFechaHoraEgreso) return null;

    const fecha = formGroup.get('fechaEgreso')?.value;
    const hora = formGroup.get('eventEndTime')?.value;

    if (!fecha || !hora) return null;

    const [horaStr, minutoStr] = hora.split(':');
    const fechaHoraIngresada = moment(fecha).set({
      hour: +horaStr,
      minute: +minutoStr
    });

    const fechaHoraLimite = moment(this.maxFechaHoraEgreso);

    if (fechaHoraIngresada.isAfter(fechaHoraLimite)) {
      formGroup.get('fechaEgreso')?.setErrors({ egresoExcedido: true });
      formGroup.get('eventEndTime')?.setErrors({ egresoExcedido: true });
      return { egresoExcedido: true };
    } else {
      const fechaCtrl = formGroup.get('fechaEgreso');
      const horaCtrl = formGroup.get('eventEndTime');

      if (fechaCtrl?.hasError('egresoExcedido')) {
        delete fechaCtrl.errors?.['egresoExcedido'];
        if (Object.keys(fechaCtrl.errors ?? {}).length === 0) {
          fechaCtrl.setErrors(null);
        }
      }

      if (horaCtrl?.hasError('egresoExcedido')) {
        delete horaCtrl.errors?.['egresoExcedido'];
        if (Object.keys(horaCtrl.errors ?? {}).length === 0) {
          horaCtrl.setErrors(null);
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

  this.idRegistroActividad = registro.id;

  const [hours, minutes] = registro.horaIngreso.split(':');

  this.registroForm.patchValue({
    idRegistroActividad: registro.id,
    fechaIngreso: registro.fechaIngreso,
    eventStartTime: `${hours}:${minutes}`,
    idEfector: registro.idEfector,
    idServicio: registro.idServicio,
    idUsuarioIngreso: registro.idUsuarioIngreso,
    idAsistencial: registro.idAsistencial,
  });

  console.log('Formulario después de patch:', this.registroForm.value);

  // Construcción del DTO
const fechaIngresoString = moment(registro.fechaIngreso).format('YYYY-MM-DD');
const horaIngresoString = registro.horaIngreso.slice(0, 5);

const dto = new RegActivRegIngresoDto(
  registro.idAsistencial,
  registro.idEfector,
  registro.idTipoGuardia,
  registro.idServicio,
  fechaIngresoString,
  horaIngresoString
);

// Llamar al backend para obtener el límite de hora de salida
  this.cronogramaTentativoService.calcularHoraMaximaSalida(dto).subscribe({
    next: (respuesta: string) => {
      const horaMaxima = new Date(respuesta);
      console.log('Hora máxima permitida para egreso:', horaMaxima);

      // Guardar como variable interna si querés reutilizarlo
      this.maxFechaHoraEgreso = horaMaxima;

      // Separar fecha y hora para aplicar restricciones por separado
      const fechaMax = moment(horaMaxima).startOf('day').toDate();
      const horaMax = moment(horaMaxima).format('HH:mm');

      // Aplicar el máximo en el control
      this.maxFechaEgreso = fechaMax;
      this.maxHoraEgreso = horaMax;

      /*/ Opcional: setear por defecto fecha y hora de egreso como el máximo permitido
      this.registroForm.patchValue({
        fechaEgreso: fechaMax,
        eventEndTime: horaMax
      });*/
    },
    error: (err) => {
      console.error('Error al calcular hora máxima de salida:', err);
      this.toastr.error('No se pudo verificar el límite de hora de salida');
    }
  });

  this.registroForm.setValidators([
    this.validarFechaEgresoMayorOIgual(),
    this.validarFechaHoraEgresoNoAnterior(),
    this.validarFechaHoraEgresoNoExcedida()
  ]);
  this.registroForm.updateValueAndValidity();
}

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
        formValue.fechaIngreso,
        formValue.fechaEgreso,
        formValue.eventStartTime,
        formValue.eventEndTime,
        formValue.idTipoGuardia.id, // Solo el ID numérico
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

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.router.navigate(['/registro-diario']);
  }
}