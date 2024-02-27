import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Departamento } from 'src/app/models/Departamento';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { Provincia } from 'src/app/models/Provincia';
import { ProvinciaService } from 'src/app/services/provincia.service';

@Component({
  selector: 'app-departamento-edit',
  templateUrl: './departamento-edit.component.html',
  styleUrls: ['./departamento-edit.component.css']
})
export class DepartamentoEditComponent implements OnInit {

  form?: FormGroup;
  esEdicion?: boolean;
  esIgual: boolean = false;
  provincias: Provincia[] = []; 

  constructor(
    private fb: FormBuilder,
    private departamentoService: DepartamentoService,
    private provinciaService: ProvinciaService, 
    private dialogRef: MatDialogRef<DepartamentoEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Departamento 
  ) { 
    this.listProvincia();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data ? this.data.id : null],
      nombre: [this.data ? this.data.nombre : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]],
      codigoPostal: [this.data ? this.data.codigoPostal : '', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      provincia: [this.data ? this.data.provincia : '', Validators.required]
    });

    this.esEdicion = this.data != null;
    
    this.form.valueChanges.subscribe(val => {
    this.esIgual = val.id !== this.data?.id || val.nombre !== this.data?.nombre || val.codigoPostal !== this.data?.codigoPostal || val.provincia !== this.data?.provincia;
    });

  }

  listProvincia(): void {
    this.provinciaService.lista().subscribe(data => {
      this.provincias = data;
    }, error => {
      console.log(error);
    });
  }

  saveDepartamento(): void {
    const id = this.form?.get('id')?.value;
    const nombre = this.form?.get('nombre')?.value;
    const codigoPostal = this.form?.get('codigoPostal')?.value;
    const provincia = this.form?.get('provincia')?.value;

    const departamento = new Departamento(codigoPostal, nombre, provincia);
    departamento.id = id;

    if (this.esEdicion) {
      this.departamentoService.update(id, departamento).subscribe(data => {
        this.dialogRef.close(data);
      });
    } else {
      this.departamentoService.save(departamento).subscribe(data => {
        this.dialogRef.close(data);
      });
    }
  }

  compareProvincia(p1: Provincia, p2: Provincia): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}