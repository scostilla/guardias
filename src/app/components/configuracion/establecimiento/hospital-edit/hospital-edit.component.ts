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
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: Hospital
  ) {
    this.hospitalForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,60}$')]],
      domicilio: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9., ]{3,80}$')]],
      localidad: ['', Validators.required],
      region: ['', Validators.required],
      observacion: [this.data ? this.data.observacion : '', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9., ]{3,80}$')]],
      telefono: [this.data ? this.data.telefono : '', [Validators.pattern('^[0-9]{9,15}$')]],
      nivelComplejidad: ['', Validators.required],
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

  onNombreInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const uppercaseValue = input.value.toUpperCase();
    this.hospitalForm.get('nombre')?.setValue(uppercaseValue);
  }

  saveHospital(): void {
    if (this.hospitalForm.valid) {
      const formValue = this.hospitalForm.value;
  
      const hospitalDto = new HospitalDto(
        formValue.nombre.toUpperCase(),
        formValue.domicilio,
        formValue.region.id,
        formValue.localidad.id,
        formValue.telefono,
        formValue.observacion,
        formValue.esCabecera,
        formValue.admitePasiva,
        formValue.nivelComplejidad
      );
  
      console.log('HospitalDto:', hospitalDto);
  
      if (this.data && this.data.id) {
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
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.dialogRef.close({ type: 'cancel' });
  }
}
