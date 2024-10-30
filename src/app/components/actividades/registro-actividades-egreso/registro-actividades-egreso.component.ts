import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistroActividad } from 'src/app/models/RegistroActividad'; // Puedes eliminar esto si no lo necesitas
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { TipoGuardiaService } from 'src/app/services/tipoGuardia.service';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { ServicioService } from 'src/app/services/servicio.service';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { RegistroActividadDto } from 'src/app/dto/RegistroActividadDto';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-registro-actividades-egreso',
  templateUrl: './registro-actividades-egreso.component.html',
  styleUrls: ['./registro-actividades-egreso.component.css']
})
export class RegistroActividadesEgresoComponent implements OnInit, OnDestroy {
  registroForm: FormGroup;
  tiposGuardias: TipoGuardia[] = [];
  asistenciales: Asistencial[] = [];
  servicios: Servicio[] = [];
  efectores: Efector[] = [];
  timeControl: FormControl = new FormControl();
  currentDate: Date = new Date();
  inputValue: string = '';
  registroId: number | null = null;
  private registroIdSubscription!: Subscription;

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
    private route: ActivatedRoute
  ) {
    this.currentDate = new Date();

    this.registroForm = this.fb.group({
      tipoGuardia: [{ value: '', disabled: true }],
      asistencial: [{ value: '', disabled: true }],
      servicio: [{ value: '', disabled: true }],
      efector: [{ value: '', disabled: true }],
      fechaIngreso: [{ value: '', disabled: true }],
      horaIngreso: [{ value: '', disabled: true }],
      fechaEgreso: [this.currentDate, Validators.required],
      horaEgreso: [this.formatCurrentTime(), Validators.required]
    });

    this.listTiposGuardias();
    this.listAsistenciales();
    this.listServicios();
    this.listEfectores();
  }

  ngOnInit() {
    // Obtener el ID de los parámetros de la ruta
    this.route.params.subscribe(params => {
      const id = params['id'];
      console.log('ID recibido en el componente:', id);
      if (id) {
        this.loadRegistro(+id); // Convertir a número y cargar el registro
      } else {
        // Redirigir si no hay ID
        this.router.navigate(['/home-profesional']);
      }
    });
  }
  
  private loadRegistro(id: number): void {
    this.registroActividadService.detail(id).subscribe(
      data => {
        console.log('Datos recibidos del servicio:', data);
        this.registroId = id; // Asignar el ID recibido
  
        const horaIngresoDate = data.horaIngreso ? moment(data.horaIngreso, 'HH:mm:ss.SSSSSSS').format('HH:mm') : '';
  
        this.registroForm.patchValue({
          tipoGuardia: data.tipoGuardia,
          asistencial: data.asistencial.id,
          servicio: data.servicio,
          efector: data.efector,
          fechaIngreso: data.fechaIngreso,
          horaIngreso: horaIngresoDate,
        });
  
        // Muestra el nombre y apellido en el input
        this.inputValue = `${data.asistencial.apellido} ${data.asistencial.nombre}`;
      },
      error => {
        this.toastr.error('Error al cargar el registro', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        console.error('Error al cargar el registro:', error);
      }
    );
  }

  getNombreCompleto(): string {
    const asistencial = this.registroForm.get('asistencial')?.value;
    // Aquí puedes retornar el nombre completo si lo tienes almacenado
    return asistencial ? `${asistencial.apellido} ${asistencial.nombre}` : '';
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

saveRegistro(): void {
  if (this.registroForm.valid) {
    this.registroForm.enable();

    const registroData = this.registroForm.value;
    
    // Log para ver los datos del formulario antes de enviar
    console.log('Datos a enviar:', registroData);

    const registroDto = new RegistroActividadDto(
      moment(registroData.fechaIngreso).startOf('day').toDate(),
      moment(registroData.fechaEgreso).startOf('day').toDate(),
      registroData.horaIngreso,
      registroData.horaEgreso,
      registroData.tipoGuardia.id, // Asegúrate de que esto sea válido
      true,
      registroData.asistencial,
      registroData.servicio.id,
      registroData.efector.id,
      1
    );

    // Log para ver el objeto que se enviará
    console.log('Objeto RegistroActividadDto a enviar:', registroDto);

    // Aquí puedes proceder a llamar a tu servicio para guardar
    if (this.registroId !== null) {
      this.registroActividadService.registrarSalida(this.registroId, registroDto).subscribe(
      result => {
        this.toastr.success('Registro guardado con éxito', 'ÉXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.listEfectores();
        this.router.navigate(['/home-profesional']);
      },
      error => {
        this.toastr.error('Ocurrió un error al guardar el registro', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.registroForm.disable();
      }
    );
  } else {
    this.toastr.error('El formulario no es válido', 'Error', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.registroForm.disable();
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

  ngOnDestroy() {
    if (this.registroIdSubscription) {
      this.registroIdSubscription.unsubscribe(); // Limpiar la suscripción
    }
    this.registroActividadService.clearRegistroId(); // Limpiar el ID en el servicio
  }
  
  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.router.navigate(['/home-profesional']);
  }
}
