import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Especialidad } from 'src/app/models/Especialidad';
import { EspecialidadService } from 'src/app/services/especialidad.service';
import { Profesion } from 'src/app/models/Profesion';
import { ProfesionService } from 'src/app/services/profesion.service';

@Component({
  selector: 'app-especialidad-edit',
  templateUrl: './especialidad-edit.component.html',
  styleUrls: ['./especialidad-edit.component.css']
})
export class EspecialidadEditComponent implements OnInit {

  form?: FormGroup;
  esEdicion?: boolean;
  esIgual: boolean = false;
  profesiones: Profesion[] = []; // lista de profesion

  constructor(
    private formBuilder: FormBuilder,
    private especialidadService: EspecialidadService,
    private profesionService: ProfesionService, // servicio de profesion
    private dialogRef: MatDialogRef<EspecialidadEditComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Especialidad 
  ) { 
    this.cargarProfesiones();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: [this.data ? this.data.id : null],
      nombre: [this.data ? this.data.nombre : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]],
      esPasiva: [this.data ? this.data.esPasiva : '', Validators.required],
      profesion: [this.data ? this.data.profesion : '', Validators.required]
    });

    this.esEdicion = this.data != null;
    
    this.form.valueChanges.subscribe(val => {
    this.esIgual = val.id !== this.data?.id || val.nombre !== this.data?.nombre || val.esPasiva !== this.data?.esPasiva || val.profesion !== this.data?.profesion;
    });

  }

  cargarProfesiones(): void {
    // obtener la lista de profesion del servicio
    this.profesionService.lista().subscribe(data => {
      this.profesiones = data;
    }, error => {
      console.log(error);
    });
  }

  saveEspecialidad(): void {
    const id = this.form?.get('id')?.value;
    const nombre = this.form?.get('nombre')?.value;
    const esPasiva = this.form?.get('esPasiva')?.value;
    const profesion = this.form?.get('profesion')?.value;

    const especialidad = new Especialidad(esPasiva, nombre, profesion);
    especialidad.id = id;

    if (this.esEdicion) {
      this.especialidadService.update(id, especialidad).subscribe(data => {
        this.dialogRef.close(data);
      });
    } else {
      this.especialidadService.save(especialidad).subscribe(data => {
        this.dialogRef.close(data);
      });
    }
  }

  compareProfesion(p1: Profesion, p2: Profesion): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}