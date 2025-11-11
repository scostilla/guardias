import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ServicioDto } from 'src/app/dto/ServicioDto';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { ServicioService } from 'src/app/services/servicio.service';

@Component({
  selector: 'app-servicio-edit',
  templateUrl: './servicio-edit.component.html',
  styleUrls: ['./servicio-edit.component.css']
})
export class ServicioEditComponent implements OnInit {
  servicioForm: FormGroup;
  esEdicion?: boolean;
  initialData: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ServicioEditComponent>,
    private toastr: ToastrService,
    private servicioService: ServicioService,
    @Inject(MAT_DIALOG_DATA) public data: Servicio
  ) {

    // Valores por defecto cuando data es null (creación) -> nivel y critico vacíos (null)
    const servicioData = data ? data : ({ descripcion: '', nivel: null, critico: null } as unknown as Servicio);

    this.servicioForm = this.fb.group({
      descripcion: [servicioData.descripcion ?? '', Validators.required],
      // dejar valor inicial en null para que el select aparezca vacío al crear
      nivel: [servicioData.nivel ?? null, Validators.required],
      critico: [servicioData.critico ?? null, Validators.required]
    });

    this.esEdicion = !!data;
  }

  ngOnInit(): void {
    this.initialData = this.servicioForm.value;


  }

  isModified(): boolean {
    if (!this.data) {
      return this.servicioForm.dirty;
    }

    const currentValue = this.servicioForm.value;
    const hasFormChanges = JSON.stringify(currentValue) !== JSON.stringify(this.initialData);
    return hasFormChanges;
  }

  OnDescripcionInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const uppercasedValue = input.value.toUpperCase();
    this.servicioForm.get('descripcion')?.setValue(uppercasedValue);
  }

  saveServicio(): void {
    if (this.servicioForm.valid) {
      const formValue = this.servicioForm.value;

      const servicioDto: ServicioDto = {
        descripcion: formValue.descripcion,
        nivel: Number(formValue.nivel),
        critico: Boolean(formValue.critico),
        activo: true,
        idRegistrosActividades: [],
      };

      if (this.data && this.data.id) {
        this.servicioService.update(this.data.id, servicioDto).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        this.servicioService.save(servicioDto).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      }
    }
  }


 cancelar(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.dialogRef.close();
  }
}
