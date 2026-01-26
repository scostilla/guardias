import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-motivo-modificacion-dialog',
  templateUrl: './motivo-modificacion-dialog.component.html',
  styleUrls: ['./motivo-modificacion-dialog.component.css']
})
export class MotivoModificacionDialogComponent {
  motivoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MotivoModificacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title?: string } | null,
    private fb: FormBuilder
  ) {
    this.motivoForm = this.fb.group({
      motivoModificacion: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  cancelar(): void {
    this.dialogRef.close(null);
  }

  confirmar(): void {
    if (this.motivoForm.valid) {
      const motivo = String(this.motivoForm.value.motivoModificacion ?? '').trim();
      this.dialogRef.close(motivo);
    }
  }
}
