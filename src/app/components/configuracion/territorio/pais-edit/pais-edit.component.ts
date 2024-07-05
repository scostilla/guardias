import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaisDto } from 'src/app/dto/Configuracion/PaisDto';
import { Pais } from 'src/app/models/Configuracion/Pais';
import { PaisService } from 'src/app/services/Configuracion/pais.service';
@Component({
  selector: 'app-pais-edit',
  templateUrl: './pais-edit.component.html',
  styleUrls: ['./pais-edit.component.css']
})
export class PaisEditComponent implements OnInit {

  paisForm: FormGroup;
  initialData: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PaisEditComponent>,
    private paisService: PaisService,

    @Inject(MAT_DIALOG_DATA) public data: Pais 
  ) { 
    this.paisForm = this.fb.group({
      id: [this.data ? this.data.id : null],
      nombre: [this.data ? this.data.nombre : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]],
      nacionalidad: [this.data ? this.data.nacionalidad : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]],
      codigo: [this.data ? this.data.codigo : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]]
     
    });
    
}

  ngOnInit(): void {
    this.initialData = this.paisForm.value;
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.paisForm.value);
  }

  savePais(): void {
    if (this.paisForm.valid) {
      const paisData = this.paisForm.value;
      
      const paisDto = new PaisDto(
        paisData.nombre,
        paisData.nacionalidad,
        paisData.codigo,
        paisData.activo
      );

      if (this.data && this.data.id) {
        this.paisService.update(this.data.id, paisDto).subscribe(
          result => {
          this.dialogRef.close({type: 'save', data: result});
        },
        error => {
          this.dialogRef.close({type: 'error', data: error});
        }
      );
      }else{
        this.paisService.save(paisDto).subscribe(
          result => {
          this.dialogRef.close({type: 'save', data: result});
        },
        error => {
          this.dialogRef.close({type: 'error', data: error});
      }
    );
  }
}
  }

 /*  savePais(): void {
    const id = this.form?.get('id')?.value;
    const nombre = this.form?.get('nombre')?.value;
    const codigo = this.form?.get('codigo')?.value;
    const nacionalidad = this.form?.get('nacionalidad')?.value;

    const pais = new Pais(codigo, nacionalidad, nombre);
    pais.id = id;

    if (this.esEdicion) {
      this.paisService.update(id, pais).subscribe(data => {
        this.dialogRef.close(data);
      });
    } else {
      this.paisService.save(pais).subscribe(data => {
        this.dialogRef.close(data);
      });
    }
  } */

  cancelar(): void {
    this.dialogRef.close();
  }

}