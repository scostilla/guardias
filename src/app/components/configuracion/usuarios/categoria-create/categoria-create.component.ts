import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Categoria } from 'src/app/models/Configuracion/Categoria';
import { CategoriaService } from 'src/app/services/Configuracion/categoria.service';

@Component({
  selector: 'app-categoria-create',
  templateUrl: './categoria-create.component.html',
  styleUrls: ['./categoria-create.component.css']
})
export class CategoriaCreateComponent {
  categoriaForm: FormGroup;
  esEdicion?: boolean;
  nombreDuplicado: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<CategoriaCreateComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Categoria,
    private categoriaService: CategoriaService
  ) {
    this.esEdicion = this.data != null;
    this.categoriaForm = this.fb.group({
      nombre: [data?.nombre || '', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.categoriaForm.valid) {
      const nombre = this.categoriaForm.value.nombre;
      this.categoriaService.list().subscribe(data => {
        if (data.some(categoria => categoria.nombre === nombre) && (!this.esEdicion || (this.esEdicion && data.find(categoria => categoria.nombre === nombre)?.id !== this.data.id))) {
          this.nombreDuplicado = true;
          this.categoriaForm.get('nombre')?.setErrors({ duplicate: true });
        } else {
      this.dialogRef.close(this.categoriaForm.value);
    }
  });
  }
}

  onCancel(): void {
    this.dialogRef.close();
  }
}