import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DepartamentoDto } from 'src/app/dto/Configuracion/DepartamentoDto';
import { Departamento } from 'src/app/models/Configuracion/Departamento';
import { Provincia } from 'src/app/models/Configuracion/Provincia';
import { DepartamentoService } from 'src/app/services/Configuracion/departamento.service';
import { ProvinciaService } from 'src/app/services/Configuracion/provincia.service';
@Component({
  selector: 'app-departamento-edit',
  templateUrl: './departamento-edit.component.html',
  styleUrls: ['./departamento-edit.component.css']
})
export class DepartamentoEditComponent implements OnInit {

  departamentoform: FormGroup;
  initialData: any;
  provincia: Provincia[] = [];
  

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DepartamentoEditComponent>,
    private departamentoService: DepartamentoService,
    private provinciaService: ProvinciaService, 
   
    
    @Inject(MAT_DIALOG_DATA) public data: Departamento 
  ) { 
    this.departamentoform = this.fb.group({
      id: [this.data ? this.data.id : null],
      nombre: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      provincia: ['', Validators.required],
    
    });
    this.listProvincia();

    if (this.data) {
      this.departamentoform.patchValue(data);
      }

    }


  ngOnInit(): void {
    this.initialData = this.departamentoform.value;
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.departamentoform.value);
  }

  listProvincia(): void {
    this.provinciaService.list().subscribe(data => {
      console.log('Lista de Provincias:', data);
      this.provincia = data;
    }, error => {
      console.log(error);
    });
  }


  saveDepartamento(): void {
    if (this.form?.valid) {
      const departamentoData = this.form?.value;

      const departamentoDto = new DepartamentoDto(
        departamentoData.nombre,
        departamentoData.codigoPostal,
        departamentoData.provincia.id
      );

      if (this.data && this.data.id) {
        this.departamentoService.update(this.data.id, departamentoDto).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        this.departamentoService.save(departamentoDto).subscribe(
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

  /* saveDepartamento(): void {
    const id = this.form?.get('id')?.value;
    const nombre = this.form?.get('nombre')?.value;
    const codigoPostal = this.form?.get('codigoPostal')?.value;
    const provincia = this.form?.get('provincia')?.value;

    const departamento = new Departamento(codigoPostal, nombre, provincia);
    departamento.id = id;

     // Log para verificar los datos a guardar
  console.log('### Datos a guardar:');
  console.log('ID:', departamento.id);
  console.log('Nombre:', departamento.nombre);
  console.log('Código Postal:', departamento.codigoPostal);
  console.log('Provincia (ID):', departamento.provincia?.id);
  console.log('Provincia (Nombre):', departamento.provincia?.nombre);


    if (this.esEdicion) {
      this.departamentoService.update(id, departamento).subscribe(data => {
        this.dialogRef.close(data);
      });
    } else {
      this.departamentoService.save(departamento).subscribe(data => {
        this.dialogRef.close(data);
      });
    }
  } */

  compareProvincia(p1: Provincia, p2: Provincia): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }



  cancelar(): void {
    this.dialogRef.close();
  }

}