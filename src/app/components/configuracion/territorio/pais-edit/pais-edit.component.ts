import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Pais } from 'src/app/models/Pais';
import { PaisService } from 'src/app/services/pais.service';

@Component({
  selector: 'app-pais-edit',
  templateUrl: './pais-edit.component.html',
  styleUrls: ['./pais-edit.component.css']
})
export class PaisEditComponent implements OnInit {

  form?: FormGroup;
  esEdicion?: boolean;
  esIgual: boolean = false;

  constructor(
    private fb: FormBuilder,
    private paisService: PaisService,
    private dialogRef: MatDialogRef<PaisEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Pais 
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data ? this.data.id : null],
      nombre: [this.data ? this.data.nombre : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]],
      codigo: [this.data ? this.data.codigo : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]],
      nacionalidad: [this.data ? this.data.nacionalidad : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]]
    });

    this.esEdicion = this.data != null;
    
    this.form.valueChanges.subscribe(val => {
    this.esIgual = val.id !== this.data?.id || val.nombre !== this.data?.nombre || val.codigo !== this.data?.codigo || val.nacionalidad !== this.data?.nacionalidad;
    });
  }

  savePais(): void {
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
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}