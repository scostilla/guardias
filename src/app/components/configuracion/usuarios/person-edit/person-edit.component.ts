import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsistencialDto } from 'src/app/dto/Configuracion/AsistencialDto';
import { PersonDto } from 'src/app/dto/Configuracion/PersonDto';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';

@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.css']
})
export class PersonEditComponent implements OnInit {
  asistencialForm: FormGroup;
  initialData: any;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PersonEditComponent>,
    private asistencialService: AsistencialService,
    @Inject(MAT_DIALOG_DATA) public data: Asistencial
  ) {
    this.asistencialForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8,20}$/)]],
      domicilio: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      esAsistencial: ['', Validators.required],
      cuil: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      fechaNacimiento: ['', Validators.required],
      sexo: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9,30}$/)]]
    });

    if (data) {
      this.asistencialForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.initialData = this.asistencialForm.value;
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.asistencialForm.value);
  }

  saveAsistencial(): void {
    if (this.asistencialForm.valid) {
      const asistencialData = this.asistencialForm.value;

      const asistencialDto = new AsistencialDto(
        asistencialData.nombre,
        asistencialData.apellido,
        asistencialData.dni,
        asistencialData.cuil,
        asistencialData.fechaNacimiento,
        asistencialData.sexo,
        asistencialData.telefono,
        asistencialData.email,
        asistencialData.domicilio,
        asistencialData.esAsistencial,
        asistencialData.activo
      );

      if (this.data && this.data.id) {
        this.asistencialService.update(this.data.id, asistencialDto).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        this.asistencialService.save(asistencialDto).subscribe(
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
    this.dialogRef.close({ type: 'cancel' });
  }
}