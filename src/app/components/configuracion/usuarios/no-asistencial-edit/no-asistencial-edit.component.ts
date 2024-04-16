import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';

@Component({
  selector: 'app-no-asistencial-edit',
  templateUrl: './no-asistencial-edit.component.html',
  styleUrls: ['./no-asistencial-edit.component.css']
})
export class NoAsistencialEditComponent implements OnInit {
  asistencialForm: FormGroup;
  initialData: any;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NoAsistencialEditComponent>,
    private noasistencialService: NoAsistencialService,
    @Inject(MAT_DIALOG_DATA) public data: NoAsistencial
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

  saveNoAsistencial(): void {
    if (this.asistencialForm.valid) {
      const asistencialData = this.asistencialForm.value;
      if (this.data && this.data.id) {
        this.noasistencialService.update(this.data.id, asistencialData).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        this.noasistencialService.save(asistencialData).subscribe(
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
