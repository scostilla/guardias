import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { RegistroActividadDto } from 'src/app/dto/RegistroActividadDto';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-registro-actividades-edit',
  templateUrl: './registro-actividades-edit.component.html',
  styleUrls: ['./registro-actividades-edit.component.css']
})
export class RegistroActividadesEditComponent implements OnInit {
  form!: FormGroup;
  idRegistro!: number;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistroActividadesEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private registroActividadService: RegistroActividadService,
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
      activo: [true],
      idAsistencial: [null, Validators.required],
      idServicio: [null, Validators.required],
      idEfector: [null, Validators.required],
      idUsuarioIngreso: [null, Validators.required],
      idUsuarioEgreso: [null]
    });

    // Cargar datos actuales del registro si es necesario
    this.loadRegistro();
  }

  loadRegistro(): void {
      this.registroActividadService.detail(this.idRegistro).subscribe(data => {
      this.form.patchValue(data); // rellenamos el formulario con los datos actuales
    });
  }

  save(): void {
    if (this.form.invalid) return;

    const dto = new RegistroActividadDto(
      this.form.value.fechaIngreso,
      this.form.value.fechaEgreso,
      this.form.value.horaIngreso,
      this.form.value.horaEgreso,
      this.form.value.idTipoGuardia,
      this.form.value.activo,
      this.form.value.idAsistencial,
      this.form.value.idServicio,
      this.form.value.idEfector,
      this.form.value.idUsuarioIngreso,
      this.form.value.idUsuarioEgreso
    );

    this.registroActividadService.update(this.idRegistro, dto).subscribe({
      next: () => {
        this.toastr.success('Registro actualizado');
        this.dialogRef.close('updated');
      },
      error: () => {
        this.toastr.error('Error al actualizar el registro');
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
