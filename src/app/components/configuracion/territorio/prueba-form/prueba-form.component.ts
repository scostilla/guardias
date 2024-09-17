import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DistribucionGuardiaService } from 'src/app/services/personal/distribucionGuardia.service';
import { DistribucionGuardiaDto } from 'src/app/dto/personal/DistribucionGuardiaDto';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { ServicioService } from 'src/app/services/Configuracion/servicio.service';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';



@Component({
  selector: 'app-prueba-form',
  templateUrl: './prueba-form.component.html',
  styleUrls: ['./prueba-form.component.css']
})
export class PruebaFormComponent implements OnInit {
  distribucionForm: FormGroup;
  initialData: any;
  hospitales: Hospital[] = [];
  servicios: Servicio[] = []; 
  asistenciales: Asistencial[] = [];


  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PruebaFormComponent>,
    private distribucionGuardiaService: DistribucionGuardiaService,
    private hospitalService: HospitalService, 
    private servicioService: ServicioService,
    private asistencialService: AsistencialService,
    @Inject(MAT_DIALOG_DATA) public data: Hospital
  ) {
    this.distribucionForm = this.fb.group({
      idPersona: ['', Validators.required],
      tipoGuardia: ['', Validators.required],
      dia: ['', Validators.required],
      cantidadHoras: ['', [Validators.required, Validators.min(0)]],
      idEfector: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFinalizacion: ['', Validators.required],
      horaIngreso: ['', Validators.required],
      idServicio: ['', Validators.required],
    });

    this.listHospital();
    this.listServicio();
    this.listAsistencial();


    if (data) {
      this.distribucionForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.initialData = this.distribucionForm.value;
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.distribucionForm.value);
  }

  listHospital(): void {
    this.hospitalService.list().subscribe(data => {
      this.hospitales = data;
    }, error => {
      console.log(error);
    });
  }

  listServicio(): void {
    this.servicioService.list().subscribe(data => {
      this.servicios = data;
    }, error => {
      console.log(error);
    });
  }

  listAsistencial(): void {
    this.asistencialService.list().subscribe(data => {
      this.asistenciales = data;
    }, error => {
      console.log(error);
    });
  }

  saveHospital(): void {
    if (this.distribucionForm.valid) {
      const formValue = this.distribucionForm.value;
  
      const distribucionGuardiaDto = new DistribucionGuardiaDto(
        formValue.dia,
        formValue.cantidadHoras,
        formValue.idPersona.id,
        formValue.idEfector.id,
        formValue.fechaInicio,
        formValue.fechaFinalizacion,
        formValue.horaIngreso,
        formValue.tipoGuardia,
        formValue.idServicio.id
      );
  
      console.log('distribucionGuardiaDto:', distribucionGuardiaDto);
  
      if (this.data && this.data.id) {
        this.distribucionGuardiaService.update(this.data.id, distribucionGuardiaDto).subscribe(
          result => {
            console.log('Hospital actualizado:', result);
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            console.error('Error al actualizar hospital:', error);
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        this.distribucionGuardiaService.save(distribucionGuardiaDto).subscribe(
          result => {
            console.log('Hospital creado:', result);
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            console.error('Error al crear hospital:', error);
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      }
    }
  }
      
  compareHospital(p1: Hospital, p2: Hospital): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareServicio(p1: Servicio, p2: Servicio): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareAsistencial(p1: Asistencial, p2: Asistencial): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancel(): void {
    this.dialogRef.close({ type: 'cancel' });
  }
}
