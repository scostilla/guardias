import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalidadDto } from 'src/app/dto/Configuracion/LocalidadDto';
import { Departamento } from 'src/app/models/Configuracion/Departamento';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Localidad } from 'src/app/models/Configuracion/Localidad';
import { DepartamentoService } from 'src/app/services/Configuracion/departamento.service';
import { LocalidadService } from 'src/app/services/Configuracion/localidad.service';

@Component({
  selector: 'app-localidad-edit',
  templateUrl: './localidad-edit.component.html',
  styleUrls: ['./localidad-edit.component.css']
})
export class LocalidadEditComponent implements OnInit {

  localidadform: FormGroup;
  initialData: any;
  departamento: Departamento[] = []; 
  efectores: Efector[] = [];


  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LocalidadEditComponent>,
    private localidadService: LocalidadService,
    private departamentoService: DepartamentoService, 

    @Inject(MAT_DIALOG_DATA) public data: Localidad 
  ) { 
    this.localidadform = this.fb.group({
      nombre: ['', Validators.required],
      departamento: ['', Validators.required],
    });
    this.listDepartamento();

    if (this.data) {
      this.localidadform.patchValue(data);
      }
    }
  

  ngOnInit(): void {
   this.initialData = this.localidadform.value;

  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.localidadform.value);
  }

  listDepartamento(): void {
    this.departamentoService.list().subscribe(data => {
      this.departamento = data;
    }, error => {
      console.log(error);
    });
  }

  saveLocalidad(): void {
    if (this.localidadform.valid) {
      const localidadData = this.localidadform.value;
      const localidadDto = new LocalidadDto(
        localidadData.nombre,
        localidadData.departamento.id,
        localidadData.activo
      );

      console.log("id efectores###",localidadDto)
      if (this.data && this.data.id) {
        this.localidadService.update(this.data.id, localidadDto).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );

  } else{
    this.localidadService.save(localidadDto).subscribe(
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
    /* const id = this.form?.get('id')?.value;
    const nombre = this.form?.get('nombre')?.value;
    const departamento = this.form?.get('departamento')?.value;

    const localidad = new Localidad(nombre, departamento);
    localidad.id = id;

    if (this.esEdicion) {
      this.localidadService.update(id, localidad).subscribe(data => {
        this.dialogRef.close(data);
      });
    } else {
      this.localidadService.save(localidad).subscribe(data => {
        this.dialogRef.close(data);
      });
    }
  } */
  

  compareDepartamento(p1: Departamento, p2: Departamento): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareEfector(p1: Efector, p2: Efector): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}