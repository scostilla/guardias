import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalidadDto } from 'src/app/dto/Configuracion/LocalidadDto';
import { Departamento } from 'src/app/models/Configuracion/Departamento';
import { Localidad } from 'src/app/models/Configuracion/Localidad';
import { DepartamentoService } from 'src/app/services/Configuracion/departamento.service';
import { LocalidadService } from 'src/app/services/Configuracion/localidad.service';

@Component({
  selector: 'app-localidad-edit',
  templateUrl: './localidad-edit.component.html',
  styleUrls: ['./localidad-edit.component.css']
})
export class LocalidadEditComponent implements OnInit {

  form?: FormGroup;
  esEdicion?: boolean;
  esIgual: boolean = false;
  departamentos: Departamento[] = []; 

  constructor(
    private fb: FormBuilder,
    private localidadService: LocalidadService,
    private departamentoService: DepartamentoService, 
    private dialogRef: MatDialogRef<LocalidadEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Localidad 
  ) { 
    this.listDepartamento();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data ? this.data.id : null],
      nombre: [this.data ? this.data.nombre : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]],
      departamento: [this.data ? this.data.departamento : '', Validators.required]
    });

    this.esEdicion = this.data != null;
    
    this.form.valueChanges.subscribe(val => {
    this.esIgual = val.id !== this.data?.id || val.nombre !== this.data?.nombre || val.departamento !== this.data?.departamento;
    });

  }

  listDepartamento(): void {
    this.departamentoService.list().subscribe(data => {
      this.departamentos = data;
    }, error => {
      console.log(error);
    });
  }

  saveLocalidad(): void {
    if (this.form?.valid) {
      const localidadData = this.form?.value;

      const localidadDto = new LocalidadDto(
        localidadData.nombre,
        localidadData.departamento.id,
      );

      if (this.data && this.data.id) {
        this.localidadService.update(this.data.id, localidadDto).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
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
/*   saveLocalidad(): void {
    const id = this.form?.get('id')?.value;
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

  cancelar(): void {
    this.dialogRef.close();
  }

}