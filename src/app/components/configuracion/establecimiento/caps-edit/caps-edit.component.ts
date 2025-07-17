import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CapsDto } from 'src/app/dto/Configuracion/CapsDto';
import { Caps } from 'src/app/models/Configuracion/Caps';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { Localidad } from 'src/app/models/Configuracion/Localidad';
import { Region } from 'src/app/models/Configuracion/Region';
import { CapsService } from 'src/app/services/Configuracion/caps.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { LocalidadService } from 'src/app/services/Configuracion/localidad.service';
import { RegionService } from 'src/app/services/Configuracion/region.service';


@Component({
  selector: 'app-caps-edit',
  templateUrl: './caps-edit.component.html',
  styleUrls: ['./caps-edit.component.css']
})
export class CapsEditComponent implements OnInit {
  capsForm: FormGroup;
  initialData: any;
  localidades: Localidad[] = [];
  regiones: Region[] = [];
  hospitales: Hospital[] = [];
  selectedFile: File | null = null;
  fileUrl: string | null = null;


  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CapsEditComponent>,
    private capsService: CapsService,
    private localidadService: LocalidadService, 
    private regionService: RegionService,
    private hospitalService: HospitalService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: Caps
  ) {
    this.capsForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ.() ]{2,60}$')]],
      domicilio: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9.,()° ]{3,80}$')]],
      localidad: ['', Validators.required],
      region: ['', Validators.required],
      observacion: [this.data ? this.data.observacion : '', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9.,()° ]{3,80}$')]],
      url: [this.data ? this.data.url : ''],
      telefono: [this.data ? this.data.telefono : '', [Validators.pattern('^[0-9]{9,15}$')]],
      cabecera: ['', Validators.required],
      tipoCaps: ['', Validators.required]
    });

    this.listLocalidad();
    this.listRegion();
    this.listHospital();

    if (data) {
      this.capsForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.initialData = this.capsForm.value;
    
    /* if (this.data) {
      console.log('ID Cabecera en data:', this.data.idCabecera);
      this.listHospital(); // Asegúrate de cargar hospitales
    } */
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.capsForm.value);
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

  listHospital(): void {
    /* this.hospitalService.list().subscribe(data => {
      this.hospitales = data;
      if (this.data) {
        console.log('Datos antes de patchValue:', this.data);
        this.capsForm.patchValue({
          ...this.data,
          idCabecera: this.data.idCabecera
        });
        console.log('Formulario después de patchValue:', this.capsForm.value);
      }
    }, error => {
      console.log(error);
    }); */

    this.hospitalService.list().subscribe(data => {
      this.hospitales = data;
    }, error => {
      console.log(error);
    });
  }

  onNombreInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const uppercaseValue = input.value.toUpperCase();
    this.capsForm.get('nombre')?.setValue(uppercaseValue);
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.uploadFile(); 
  }

  uploadFile(): void {
    if (this.selectedFile) {
      const filename = `${this.selectedFile.name}`;
      this.fileUrl = `assets/img/sello-efectores/${filename}`;
      this.capsForm.patchValue({ url: this.fileUrl });
      console.log('Archivo simulado guardado en:', this.fileUrl);
    } else {
      console.error('No se ha seleccionado ningún archivo.');
    }
  }
  saveCaps(): void {
    if (this.capsForm.valid) {
      const formValue = this.capsForm.value;
  
      const capsDto = new CapsDto(
        formValue.nombre.toUpperCase(),
        formValue.domicilio,
        formValue.region.id,
        formValue.localidad.id,
        formValue.telefono,
        formValue.observacion,
        formValue.url,
        //formValue.idCabecera.id,
        formValue.cabecera.id,
        this.data ? this.data.areaProgramatica : 1,
        formValue.tipoCaps
      );
  
      console.log('CapsDto:', capsDto);
  
      if (this.data && this.data.id) {
        this.capsService.update(this.data.id, capsDto).subscribe(
          result => {
            console.log('Caps actualizado:', result);
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            console.error('Error al actualizar caps:', error);
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        this.capsService.save(capsDto).subscribe(
          result => {
            console.log('Caps creado:', result);
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            console.error('Error al crear caps:', error);
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

compareHospital(p1: Hospital, p2: Hospital): boolean {
  return p1 && p2 ? p1.id === p2.id : p1 === p2;
}
/* compareHospital(hospitalId: number, hospital: Hospital): boolean {
  return hospital ? hospital.id === hospitalId : false;
} */

  cancel(): void {
    this.toastr.info('No se guardaron los datos.', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.dialogRef.close({ type: 'cancel' });
  }
}
