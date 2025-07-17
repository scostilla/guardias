import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';

import { RegistroActividadDto } from 'src/app/dto/RegistroActividadDto';
import { AsistencialTiposGuardiasDto } from 'src/app/dto/Configuracion/asistencial/AsistencialTiposGuardiasDto';
import { ServicioSummaryDto } from 'src/app/dto/Configuracion/ServicioSummaryDto';

@Component({
  selector: 'app-registro-actividades-edit',
  templateUrl: './registro-actividades-edit.component.html',
  styleUrls: ['./registro-actividades-edit.component.css']
})
export class RegistroActividadesEditComponent implements OnInit {
  form!: FormGroup;
  idRegistro!: number;

  tiposGuardia: AsistencialTiposGuardiasDto[] = [];
  servicios: ServicioSummaryDto[] = [];

  efectorId: number | null = null;
  asistencialId: number | null = null;
  usuarioIngresoId: number | null = null;
  usuarioEgresoId: number | null = null;
  activo: boolean = true;

  minFechaIngreso: string = moment().format('YYYY-MM-DD');
  maxFechaIngreso: string = moment().format('YYYY-MM-DD');
  maxHoraIngreso: string = '23:59';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistroActividadesEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private registroActividadService: RegistroActividadService,
    private asistencialService: AsistencialService,
    private hospitalService: HospitalService,
    private efectorService: EfectorService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.idRegistro = this.data.id;

    this.form = this.fb.group({
      fechaIngreso: [null, Validators.required],
      fechaEgreso: [null, Validators.required],
      horaIngreso: [null, Validators.required],
      horaEgreso: [null, Validators.required],
      idTipoGuardia: [null, Validators.required],
      activo: [{ value: true, disabled: true }],
      idAsistencial: [{ value: null, disabled: true }, Validators.required],
      idServicio: [null, Validators.required],
      idEfector: [{ value: null, disabled: true }, Validators.required],
      idUsuarioIngreso: [{ value: null, disabled: true }, Validators.required],
      idUsuarioEgreso: [{ value: null, disabled: true }]
    }, { validators: this.validarFechasHoras.bind(this) });

    this.efectorId = this.efectorService.getCurrentEfectorId();
    if (this.efectorId) {
      this.form.patchValue({ idEfector: this.efectorId });
      this.listServicios();
    }

    this.loadRegistro();

    // Control dinámico de hora máxima según fechaIngreso
    this.form.get('fechaIngreso')?.valueChanges.subscribe(value => {
    const hoy = moment();
    this.minFechaIngreso = hoy.clone().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
    this.maxFechaIngreso = hoy.clone().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
    });
  }

  listServicios(): void {
    if (this.efectorId) {
      this.hospitalService.getActiveServicesByHospital(this.efectorId).subscribe({
        next: data => this.servicios = data,
        error: err => console.error('Error cargando servicios', err)
      });
    }
  }

  loadTiposGuardias(asistencialId: number): void {
    this.asistencialService.getTiposGuardias(asistencialId).subscribe({
      next: data => this.tiposGuardia = data,
      error: err => {
        this.tiposGuardia = [];
        console.error('Error cargando tipos de guardia asistencial', err);
      }
    });
  }

  validarFechasHoras(formGroup: FormGroup): ValidationErrors | null {
    const fechaIngreso = formGroup.get('fechaIngreso')?.value;
    const fechaEgreso = formGroup.get('fechaEgreso')?.value;
    const horaIngreso = formGroup.get('horaIngreso')?.value;
    const horaEgreso = formGroup.get('horaEgreso')?.value;

    if (!fechaIngreso || !fechaEgreso || !horaIngreso || !horaEgreso) {
      return null; // no validamos si falta alguno
    }

    const fechaIngresoMoment = moment(fechaIngreso, 'YYYY-MM-DD');
    const fechaEgresoMoment = moment(fechaEgreso, 'YYYY-MM-DD');

    if (fechaEgresoMoment.isBefore(fechaIngresoMoment)) {
      return { fechaEgresoAnterior: true };
    }

    if (fechaEgresoMoment.isSame(fechaIngresoMoment)) {
      const horaIngresoMoment = moment(horaIngreso, 'HH:mm');
      const horaEgresoMoment = moment(horaEgreso, 'HH:mm');

      if (!horaEgresoMoment.isAfter(horaIngresoMoment)) {
        return { horaEgresoInvalida: true };
      }
    }

    return null;
  }
  
  loadRegistro(): void {
    this.registroActividadService.detail(this.idRegistro).subscribe(data => {
      // Guardo IDs en propiedades internas para luego enviarlos al guardar
      this.asistencialId = data.asistencial?.id || null;
      this.efectorId = data.efector?.id || this.efectorId;
      this.usuarioIngresoId = data.usuarioIngreso?.id || null;
      this.usuarioEgresoId = data.usuarioEgreso?.id || null;
      this.activo = data.activo;

      const [hours, minutes] = data.horaIngreso.split(':');
      const [hoursE, minutesE] = data.horaEgreso!.split(':');

      // Patch solo campos editables en el form
      this.form.patchValue({
        fechaIngreso: data.fechaIngreso,
        horaIngreso: `${hours}:${minutes}`,
        fechaEgreso: data.fechaEgreso,
        horaEgreso: `${hoursE}:${minutesE}`,
        idTipoGuardia: data.tipoGuardia?.id || null,
        idServicio: data.servicio?.id || null,
        idAsistencial: this.asistencialId,
        idEfector: this.efectorId,
        idUsuarioIngreso: this.usuarioIngresoId,
        idUsuarioEgreso: this.usuarioEgresoId,
        activo: this.activo
      });

      // Cargar tipos guardia según asistencial
      if (this.asistencialId) {
        this.loadTiposGuardias(this.asistencialId);
      }
    });
  }

  save(): void {
    if (this.form.invalid) return;

    if (this.asistencialId === null) {
      this.toastr.error('El asistencial es obligatorio');
      return;
    }

    const raw = this.form.getRawValue();

    const dto = new RegistroActividadDto(
      raw.fechaIngreso,
      raw.fechaEgreso,
      raw.horaIngreso,
      raw.horaEgreso,
      raw.idTipoGuardia,
      this.activo,
      this.asistencialId,
      raw.idServicio,
      this.efectorId!,
      this.usuarioIngresoId!,
      this.usuarioEgresoId!
    );

    this.registroActividadService.update(this.idRegistro, dto).subscribe({
      next: () => {
        this.toastr.success('Registro actividad actualizado correctamente', 'Exito', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
        this.dialogRef.close('updated');
      },
      error: () => {
        this.toastr.error('No se pudo actualizar el registro actividad', 'Error', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
