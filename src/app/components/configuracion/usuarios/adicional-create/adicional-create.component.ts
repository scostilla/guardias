import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Adicional } from 'src/app/models/Configuracion/Adicional';
import { AdicionalService } from 'src/app/services/Configuracion/adicional.service';
@Component({
  selector: 'app-adicional-create',
  templateUrl: './adicional-create.component.html',
  styleUrls: ['./adicional-create.component.css']
})
export class AdicionalCreateComponent {
  adicionalForm: FormGroup;
  esEdicion?: boolean;
  nombreDuplicado: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AdicionalCreateComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Adicional,
    private adicionalService: AdicionalService
  ) {
    this.esEdicion = this.data != null;
    this.adicionalForm = this.fb.group({
      nombre: [data?.nombre || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.adicionalForm.valid) {
      const nombre = this.adicionalForm.value.nombre;
      this.adicionalService.list().subscribe(data => {
        if (data.some(adicional => adicional.nombre === nombre) && (!this.esEdicion || (this.esEdicion && data.find(adicional => adicional.nombre === nombre)?.id !== this.data.id))) {
          this.nombreDuplicado = true;
          this.adicionalForm.get('nombre')?.setErrors({ duplicate: true });
        } else {
      this.dialogRef.close(this.adicionalForm.value);
    }
  });
  }
}

onCancel(): void {
  this.dialogRef.close();
}
}
