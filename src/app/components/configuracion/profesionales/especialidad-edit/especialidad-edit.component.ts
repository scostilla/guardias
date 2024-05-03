import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Especialidad } from 'src/app/models/Configuracion/Especialidad';
import { EspecialidadService } from 'src/app/services/Configuracion/especialidad.service';
import { Profesion } from 'src/app/models/Configuracion/Profesion';
import { ProfesionService } from 'src/app/services/Configuracion/profesion.service';
import { EspecialidadDto } from 'src/app/dto/Configuracion/EspecialidadDto';

@Component({
  selector: 'app-especialidad-edit',
  templateUrl: './especialidad-edit.component.html',
  styleUrls: ['./especialidad-edit.component.css']
})
export class EspecialidadEditComponent implements OnInit {

  form: FormGroup;
  initialData: any;
  profesiones: Profesion[] = []; 

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EspecialidadEditComponent>,
    private especialidadService: EspecialidadService,
    private profesionService: ProfesionService, 
    
    @Inject(MAT_DIALOG_DATA) public data: Especialidad 
  ) { 
    this.form = this.fb.group({
      id: [this.data ? this.data.id : null],
      nombre: [this.data ? this.data.nombre : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]],
      esPasiva: [this.data ? this.data.esPasiva : '', Validators.required],
      profesion: [this.data ? this.data.profesion : '', Validators.required]
    });

    this.listProfesiones();

    if (data) {
      this.form.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.initialData = this.form.value;
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.form.value);
  }

  listProfesiones(): void {
    this.profesionService.list().subscribe(data => {
      console.log('Lista de Profesiones:', data);
      this.profesiones = data;
    }, error => {
      console.log(error);
    });
  }

  saveEspecialidad(): void {
    if(this.form.valid){
      const especialidadData = this.form.value;

      const especialidadDto = new EspecialidadDto(
        especialidadData.nombre,
        especialidadData.profesion.id,
        especialidadData.esPasiva,
        especialidadData.activo
      );

    if (this.data && this.data.id) {
      this.especialidadService.update(this.data.id, especialidadDto).subscribe(
        result => {
          this.dialogRef.close({ type: 'save', data: result });
        },
        error => {
          this.dialogRef.close({ type: 'error', data: error });
        }
      );
    } else {
      this.especialidadService.save(especialidadDto).subscribe(
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

  compareProfesion(p1: Profesion, p2: Profesion): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}