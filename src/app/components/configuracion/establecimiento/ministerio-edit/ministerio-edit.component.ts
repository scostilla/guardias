import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ministerio } from 'src/app/models/Configuracion/Ministerio';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { Localidad } from 'src/app/models/Configuracion/Localidad';
import { LocalidadService } from 'src/app/services/Configuracion/localidad.service';
import { Region } from 'src/app/models/Configuracion/Region';
import { RegionService } from 'src/app/services/Configuracion/region.service';


@Component({
  selector: 'app-ministerio-edit',
  templateUrl: './ministerio-edit.component.html',
  styleUrls: ['./ministerio-edit.component.css']
})
export class MinisterioEditComponent implements OnInit {

  ministerioForm: FormGroup;
  initialData: any;
  localidades: Localidad[] = []; 
  regiones: Region[] = []; 
  


  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MinisterioEditComponent>,
    private ministerioService: MinisterioService,
    private localidadService: LocalidadService, 
    private regionService: RegionService, 
    @Inject(MAT_DIALOG_DATA) public data: Ministerio 
  ) { 

    this.ministerioForm = this.fb.group({
      id: [this.data ? this.data.id : null],
      nombre: [this.data ? this.data.nombre : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,50}$')]],
      domicilio: [this.data ? this.data.domicilio : '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9., ]{3,80}$')]],
      observacion: [this.data ? this.data.observacion : '', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9., ]{3,80}$')]],
      telefono: [this.data ? this.data.telefono : '', [Validators.pattern('^[0-9]{9,15}$')]],
      localidad: [this.data ? this.data.localidad : '', Validators.required],
      region: [this.data ? this.data.region : '', Validators.required],
      estado: [this.data ? this.data.estado : '', Validators.required],
      idCabecera: [this.data ? this.data.idCabecera : ''],
      porcentajePorZona: [this.data ? this.data.porcentajePorZona : '']
    });

    this.listLocalidad();
    this.listRegion();

    if (data) {
      this.ministerioForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.initialData = this.ministerioForm.value;
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.ministerioForm.value);
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

  saveMinisterio(): void {

    if (this.ministerioForm.valid) {
      const miniterioData = this.ministerioForm.value;
      if (this.data && this.data.id) {
        this.ministerioService.update(this.data.id, miniterioData).subscribe(
          result => {
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {

        this.ministerioService.save(miniterioData).subscribe(
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

  compareLocalidad(p1: Localidad, p2: Localidad): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  compareRegion(p1: Region, p2: Region): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}