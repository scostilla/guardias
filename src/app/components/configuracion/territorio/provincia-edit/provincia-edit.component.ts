import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Provincia } from 'src/app/models/Configuracion/Provincia';
import { ProvinciaService } from 'src/app/services/Configuracion/provincia.service';
import { Pais } from 'src/app/models/Configuracion/Pais';
import { PaisService } from 'src/app/services/Configuracion/pais.service';

@Component({
  selector: 'app-provincia-edit',
  templateUrl: './provincia-edit.component.html',
  styleUrls: ['./provincia-edit.component.css']
})
export class ProvinciaEditComponent implements OnInit {

  form?: FormGroup;
  esEdicion?: boolean;
  esIgual: boolean = false;
  paises: Pais[] = []; 

  constructor(
    private fb: FormBuilder,
    private provinciaService: ProvinciaService,
    private paisService: PaisService, 
    private dialogRef: MatDialogRef<ProvinciaEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Provincia 
  ) { 
    this.listPais();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data ? this.data.id : null],
      nombre: [this.data ? this.data.nombre : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]],
      gentilicio: [this.data ? this.data.gentilicio : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]],
      pais: [this.data ? this.data.pais : '', Validators.required]
    });

    this.esEdicion = this.data != null;
    
    this.form.valueChanges.subscribe(val => {
    this.esIgual = val.id !== this.data?.id || val.nombre !== this.data?.nombre || val.gentilicio !== this.data?.gentilicio || val.pais !== this.data?.pais;
    });

  }

  listPais(): void {
    this.paisService.list().subscribe(data => {
      this.paises = data;
    }, error => {
      console.log(error);
    });
  }

  saveProvincia(): void {
    const id = this.form?.get('id')?.value;
    const nombre = this.form?.get('nombre')?.value;
    const gentilicio = this.form?.get('gentilicio')?.value;
    const pais = this.form?.get('pais')?.value;

    const provincia = new Provincia(gentilicio, nombre, pais);
    provincia.id = id;

    if (this.esEdicion) {
      this.provinciaService.update(id, provincia).subscribe(data => {
        this.dialogRef.close(data);
      });
    } else {
      this.provinciaService.save(provincia).subscribe(data => {
        this.dialogRef.close(data);
      });
    }
  }

  comparePais(p1: Pais, p2: Pais): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}