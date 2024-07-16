import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Revista } from 'src/app/models/Configuracion/Revista';
import { RevistaService } from 'src/app/services/Configuracion/revista.service';
import { TipoRevista } from 'src/app/models/Configuracion/TipoRevista';
import { TipoRevistaService } from 'src/app/services/Configuracion/tipo-revista.service';

@Component({
  selector: 'app-revista-edit',
  templateUrl: './revista-edit.component.html',
  styleUrls: ['./revista-edit.component.css']
})
export class RevistaEditComponent implements OnInit {

  form?: FormGroup;
  esEdicion?: boolean;
  esIgual: boolean = false;
  tipoRevista: TipoRevista[] = []; 

  constructor(
    private fb: FormBuilder,
    private revistaService: RevistaService,
    private tipoRevistaService: TipoRevistaService, 
    private dialogRef: MatDialogRef<RevistaEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Revista 
  ) { 
    this.listProvincia();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.data ? this.data.id : null],
      agrupacion: [this.data ? this.data.agrupacion : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]],
      categoria: [this.data ? this.data.categoria : '', Validators.required],
      adicional: [this.data ? this.data.adicional : '', Validators.required],
      cargaHoraria: [this.data ? this.data.cargaHoraria : '', Validators.required],
      tipoRevista: [this.data ? this.data.tipoRevista : '', Validators.required]
    });

    this.esEdicion = this.data != null;
    
    this.form.valueChanges.subscribe(val => {
    this.esIgual = val.id !== this.data?.id || val.agrupacion !== this.data?.agrupacion || val.categoria !== this.data?.categoria || val.adicional !== this.data?.adicional || val.cargaHoraria !== this.data?.cargaHoraria || val.tipoRevista !== this.data?.tipoRevista;
    });

  }

  listProvincia(): void {
    this.tipoRevistaService.list().subscribe(data => {
      this.tipoRevista = data;
    }, error => {
      console.log(error);
    });
  }

  saveRevista(): void {
    /* const id = this.form?.get('id')?.value;
    const agrupacion = this.form?.get('agrupacion')?.value;
    const categoria = this.form?.get('categoria')?.value;
    const adicional = this.form?.get('adicional')?.value;
    const cargaHoraria = this.form?.get('cargaHoraria')?.value;
    const tipoRevista = this.form?.get('tipoRevista')?.value;


    const revista = new Revista(agrupacion, categoria, adicional, cargaHoraria, tipoRevista);
    revista.id = id;

    if (this.esEdicion) {
      this.revistaService.update(id, revista).subscribe(data => {
        this.dialogRef.close(data);
      });
    } else {
      this.revistaService.save(revista).subscribe(data => {
        this.dialogRef.close(data);
      });
    } */
  }

  compareTipoRevista(p1: TipoRevista, p2: TipoRevista): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}