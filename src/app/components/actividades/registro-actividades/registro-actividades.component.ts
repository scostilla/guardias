import { Component } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(
    private fb: FormBuilder,
    private registroActividadService: RegistroActividadService,
    private tipoGuardiaService: TipoGuardiaService,
    private asistencialService: AsistencialService,
    private servicioService: ServicioService,
    private hospitalService: HospitalService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registroForm = this.fb.group({
      tipoGuardia: ['', Validators.required],
      asistencial: ['', Validators.required],
      servicio: ['', Validators.required],
      efector: ['', Validators.required],
      fecIngreso: ['', Validators.required],
      eventStartTime: ['', Validators.required],
      fecEgreso: [''],
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

  saveRegistro(): void {
    if (this.registroForm.valid) {
      const registroData = this.registroForm.value;
      const registroDto = new RegistroActividadDto(
        registroData.fecIngreso,
        registroData.fecEgreso,
        registroData.eventStartTime,
        registroData.eventEndTime,
        registroData.tipoGuardia.id,
        registroData.activo, 
        registroData.asistencial.id,
        registroData.servicio.id,
        registroData.efector.id
      );
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
