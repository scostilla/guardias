import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { HospitalDto } from 'src/app/dto/Configuracion/HospitalDto';
import { Localidad } from 'src/app/models/Configuracion/Localidad';
import { LocalidadService } from 'src/app/services/Configuracion/localidad.service';
import { Region } from 'src/app/models/Configuracion/Region';
import { RegionService } from 'src/app/services/Configuracion/region.service';


@Component({
  selector: 'app-hospital-edit',
  templateUrl: './hospital-edit.component.html',
  styleUrls: ['./hospital-edit.component.css']
})
export class HospitalEditComponent implements OnInit {
  hospitalForm: FormGroup;
  initialData: any;
  localidades: Localidad[] = []; 
  regiones: Region[] = []; 

  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<HospitalEditComponent>,
    private hospitalService: HospitalService,
    private localidadService: LocalidadService, 
    private regionService: RegionService, 
    @Inject(MAT_DIALOG_DATA) public data: Hospital
  ) {
    this.hospitalForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,60}$')]],
      domicilio: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9., ]{3,80}$')]],
      localidad: ['', Validators.required],
      region: ['', Validators.required],
      nivelComplejidad: ['', Validators.required],
      porcentajePorZona: ['', Validators.required],
      esCabecera: ['', Validators.required],
      admitePasiva: ['', Validators.required]
    });

    this.listLocalidad();
    this.listRegion();

    if (data) {
      this.hospitalForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.initialData = this.hospitalForm.value;
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.hospitalForm.value);
  }

  listLocalidad(): void {
    this.localidadService.list().subscribe(data => {
      this.localidades = data;
    }, error => {
      console.log(error);
    });
  }

  listRegion(): void {
    this.regionService.list().subscribe(data => {
      this.regiones = data;
    }, error => {
      console.log(error);
    });
  }

  saveHospital(): void {
    if (this.hospitalForm.valid) {
      const formValue = this.hospitalForm.value;
  
      // Aquí se debería incluir esCabecera y admitePasiva
      const hospitalDto = new HospitalDto(
        formValue.nombre,
        formValue.domicilio,
        formValue.region,
        formValue.localidad,
        formValue.esCabecera,
        formValue.admitePasiva,
        formValue.nivelComplejidad,
        formValue.porcentajePorZona
      );
  
      console.log('HospitalDto:', hospitalDto);
  
      if (this.data && this.data.id) {
        // Actualiza el hospital existente
        this.hospitalService.update(this.data.id, hospitalDto).subscribe(
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
        // Crea un nuevo hospital
        this.hospitalService.save(hospitalDto).subscribe(
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
      
  compareLocalidad(p1: Localidad, p2: Localidad): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareRegion(p1: Region, p2: Region): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }


  cancel(): void {
    this.dialogRef.close({ type: 'cancel' });
  }
}
