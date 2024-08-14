import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CargaHoraria } from 'src/app/models/Configuracion/CargaHoraria';
import { CargaHorariaService } from 'src/app/services/Configuracion/carga-horaria.service';
@Component({
  selector: 'app-carga-horaria-create',
  templateUrl: './carga-horaria-create.component.html',
  styleUrls: ['./carga-horaria-create.component.css']
})
export class CargaHorariaCreateComponent {
  cargaHorariaForm: FormGroup;
  esEdicion?: boolean;
  cantidadDuplicada: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CargaHorariaCreateComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: CargaHoraria,
    private cargaHorariaService: CargaHorariaService,
  ) {
    this.esEdicion = this.data != null;
    this.cargaHorariaForm = this.fb.group({
      cantidad: [data?.cantidad || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.cargaHorariaForm.valid) {
      const cantidad = Number(this.cargaHorariaForm.value.cantidad);
      this.cargaHorariaService.list().subscribe(data => {
        if (data.some(cargaHoraria => cargaHoraria.cantidad === cantidad) &&
    (!this.esEdicion || 
     (this.esEdicion && data.find(cargaHoraria => cargaHoraria.cantidad === cantidad)?.id !== this.data.id))) {
    this.cantidadDuplicada = true;
    this.cargaHorariaForm.get('cantidad')?.setErrors({ duplicate: true });
    
} else {
    this.cantidadDuplicada = false;
    this.dialogRef.close(this.cargaHorariaForm.value);
}
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
