import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProfesionDto } from 'src/app/dto/Configuracion/ProfesionDto';
import { Profesion } from 'src/app/models/Configuracion/Profesion';
import { ProfesionService } from 'src/app/services/Configuracion/profesion.service';

@Component({
  selector: 'app-profesion-edit',
  templateUrl: './profesion-edit.component.html',
  styleUrls: ['./profesion-edit.component.css']
})
export class ProfesionEditComponent implements OnInit {
  profesionForm: FormGroup;
  initialData: any;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProfesionEditComponent>,
    private profesionService: ProfesionService,
    
    @Inject(MAT_DIALOG_DATA) public data: Profesion 
  ) { 
    this.profesionForm = this.fb.group({
      //id: [this.data ? this.data.id : null],
      nombre: [ '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]],
      asistencial: [ '', Validators.required]
    });

    if (data) {
      this.profesionForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.initialData = this.profesionForm.value;
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.profesionForm.value);
  }

  saveProfesion(): void {
    if(this.profesionForm.valid){
      const profesionData = this.profesionForm.value;

      const profesionDto = new ProfesionDto(
        profesionData.nombre,
        profesionData.asistencial,
        profesionData.activo
      );

      if (this.data && this.data.id) {
        this.profesionService.update(this.data.id, profesionDto).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        this.profesionService.save(profesionDto).subscribe(
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

  cancel(): void {
    this.dialogRef.close();
  }

}