import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ministerio } from 'src/app/models/Configuracion/Ministerio';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { MinisterioDto } from 'src/app/dto/Configuracion/MinisterioDto';
import { Localidad } from 'src/app/models/Configuracion/Localidad';
import { LocalidadService } from 'src/app/services/Configuracion/localidad.service';
import { Region } from 'src/app/models/Configuracion/Region';
import { RegionService } from 'src/app/services/Configuracion/region.service';
import { ToastrService } from 'ngx-toastr';


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
    public dialogRef: MatDialogRef<MinisterioEditComponent>,
    private ministerioService: MinisterioService,
    private localidadService: LocalidadService, 
    private regionService: RegionService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: Ministerio
  ) {
    this.ministerioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,60}$')]],
      domicilio: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9., ]{3,80}$')]],
      localidad: ['', Validators.required],
      region: ['', Validators.required],
      observacion: [this.data ? this.data.observacion : '', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9., ]{3,80}$')]],
      telefono: [this.data ? this.data.telefono : '', [Validators.pattern('^[0-9]{9,15}$')]]
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

  onNombreInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const uppercaseValue = input.value.toUpperCase();
    this.ministerioForm.get('nombre')?.setValue(uppercaseValue);
  }

  saveMinisterio(): void {
    if (this.ministerioForm.valid) {
      const formValue = this.ministerioForm.value;
  
      const ministerioDto = new MinisterioDto(
        formValue.nombre.toUpperCase(),
        formValue.domicilio,
        formValue.region.id,
        formValue.localidad.id,
        formValue.telefono,
        formValue.observacion,
        this.data ? this.data.idCabecera : 1
      );
  
      console.log('MinisterioDto:', ministerioDto);
  
      if (this.data && this.data.id) {
        this.ministerioService.update(this.data.id, ministerioDto).subscribe(
          result => {
            console.log('Ministerio actualizado:', result);
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            console.error('Error al actualizar ministerio:', error);
            this.dialogRef.close({ type: 'error', data: error });
          }
        );
      } else {
        this.ministerioService.save(ministerioDto).subscribe(
          result => {
            console.log('Ministerio creado:', result);
            this.dialogRef.close({ type: 'save', data: result });
          },
          error => {
            console.error('Error al crear ministerio:', error);
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
