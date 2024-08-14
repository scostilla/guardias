import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TipoRevista } from 'src/app/models/Configuracion/TipoRevista';
import { TipoRevistaService } from 'src/app/services/Configuracion/tipo-revista.service';

@Component({
  selector: 'app-tipo-revista-create',
  templateUrl: './tipo-revista-create.component.html',
  styleUrls: ['./tipo-revista-create.component.css']
})
export class TipoRevistaCreateComponent {
  tipoRevistaForm: FormGroup;
  esEdicion?: boolean;
  nombreDuplicado: boolean = false;  // Variable para manejar el error de nombre duplicado

  constructor(
    private dialogRef: MatDialogRef<TipoRevistaCreateComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: TipoRevista, // Inyectamos los datos
    private tipoRevistaService: TipoRevistaService // Inyectamos el servicio
  ) {
    this.esEdicion = this.data != null; // Si existen datos, es edición
    this.tipoRevistaForm = this.fb.group({
      nombre: [data?.nombre || '', Validators.required]  // Usamos los datos si existen
    });
  }

  onSubmit(): void {
    if (this.tipoRevistaForm.valid) {
      const nombre = this.tipoRevistaForm.value.nombre;
      this.tipoRevistaService.list().subscribe(data => {
        if (data.some(tipo => tipo.nombre === nombre) && (!this.esEdicion || (this.esEdicion && data.find(tipo => tipo.nombre === nombre)?.id !== this.data.id))) {
          this.nombreDuplicado = true;  // Marcar como duplicado
          this.tipoRevistaForm.get('nombre')?.setErrors({ duplicate: true });
        } else {
          this.dialogRef.close(this.tipoRevistaForm.value); // Cerrar diálogo si no hay duplicados
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}