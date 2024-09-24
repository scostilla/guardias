import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NovedadPersonalDto } from 'src/app/dto/personal/NovedadPersonalDto';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-novedades-person-edit',
  templateUrl: './novedades-person-edit.component.html',
  styleUrls: ['./novedades-person-edit.component.css']
})
export class NovedadesPersonEditComponent implements OnInit {
  novedadPersonalForm!: FormGroup;
  initialData: any;
  asistenciales: Asistencial[] = [];
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<NovedadesPersonEditComponent>,
    private novedadPersonalService: NovedadPersonalService,
    private asistencialService: AsistencialService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: NovedadPersonalDto
  ) {
    this.novedadPersonalForm = this.fb.group({
      descripcion: ['', [Validators.required]],
      fechaInicio: ['', Validators.required],
      fechaFinal: ['', Validators.required],
      idSuplente: ['', Validators.required],
      puedeRealizarGuardia: [false],
      cobraSueldo: [false],
      necesitaReemplazo: [false],
      actual: [false]
    });

    this.listAsistencial();

    if (data) {
      this.novedadPersonalForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.initialData = this.novedadPersonalForm.value;
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.novedadPersonalForm.value);
  }

  listAsistencial(): void {
    this.asistencialService.list().subscribe(data => {
      this.asistenciales = data;
    }, error => {
      console.log(error);
    });
  }


  saveNovedadPersonal(): void {
    if (this.novedadPersonalForm.valid) {
      const formValue = this.novedadPersonalForm.value;

      const novedadPersonalDto = new NovedadPersonalDto(
        formValue.fechaInicio,
        formValue.fechaFinal,
        formValue.puedeRealizarGuardia,
        formValue.cobraSueldo,
        formValue.necesitaReemplazo,
        formValue.actual,
        formValue.descripcion,
        this.data ? this.data.idPersona : 42,
        formValue.idSuplente,
        this.data ? this.data.idArticulo : 1,
        this.data ? this.data.idInciso : 1
      );
      console.log('Datos a guardar:', novedadPersonalDto);

      if (this.data && this.data.id) {
        this.novedadPersonalService.update(this.data.id, novedadPersonalDto).subscribe(
          result => {
            console.log('Novedad actualizada:', result);
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            console.error('Error al actualizar la novedad:', error);
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        this.novedadPersonalService.save(novedadPersonalDto).subscribe(
          result => {
            console.log('Novedad creada:', result);
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            console.error('Error al crear la novedad:', error);
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      }
    }
}

  compareAsistencial(p1: Asistencial, p2: Asistencial): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancel(): void {
    this.dialogRef.close();
  }
}