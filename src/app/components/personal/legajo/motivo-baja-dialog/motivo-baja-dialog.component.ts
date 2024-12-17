import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-motivo-baja-dialog',
  templateUrl: './motivo-baja-dialog.component.html',
  styleUrls: ['./motivo-baja-dialog.component.css']
})
export class MotivoBajaDialogComponent {
  bajaForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MotivoBajaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.bajaForm = this.fb.group({
      motivoBaja: ['', [Validators.required, Validators.minLength(5)]],
      fechaFinal: ['', Validators.required]
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  darBaja(): void {
    if (this.bajaForm.valid) {
      this.dialogRef.close(this.bajaForm.value);
    }
  }
}