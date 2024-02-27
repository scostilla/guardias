import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Localidad } from 'src/app/models/Localidad';
import { LocalidadService } from 'src/app/services/localidad.service';
import { Departamento } from 'src/app/models/Departamento';
import { DepartamentoService } from 'src/app/services/departamento.service';

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
    this.departamentoService.lista().subscribe(data => {
      this.departamentos = data;
    }, error => {
      console.log(error);
    });
  }

  saveLocalidad(): void {
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
  }

  compareDepartamento(p1: Departamento, p2: Departamento): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}