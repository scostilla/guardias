import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CargoDto } from 'src/app/dto/Configuracion/CargoDto';
import { Cargo } from 'src/app/models/Configuracion/Cargo';
import { CargoService } from 'src/app/services/Configuracion/cargo.service';

@Component({
  selector: 'app-cargo-edit',
  templateUrl: './cargo-edit.component.html',
  styleUrls: ['./cargo-edit.component.css']
})
export class CargoEditComponent implements OnInit {
  cargoForm: FormGroup;
  initialData: any;
  
  constructor(
    private fb : FormBuilder,
    public dialogRef: MatDialogRef<CargoEditComponent>,
    private cargoService: CargoService,
    
    @Inject(MAT_DIALOG_DATA) public data: Cargo
  ) {
    this.cargoForm = this.fb.group({
      id:[this.data ? this.data.id : null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      activo: ['', Validators.required]
   });

   if(data){
   this.cargoForm.patchValue(data);
  }
}

  ngOnInit(): void {
    this.initialData = this.cargoForm.value;

    // Escuchar cambios en el campo 'nombre' y transformarlo a mayúsculas
    this.cargoForm.get('nombre')?.valueChanges.subscribe(value => {
      if (value) {
        const uppercaseValue = value.toUpperCase();
        this.cargoForm.get('nombre')?.setValue(uppercaseValue, { emitEvent: false });
      }
    });

  }
  
  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.cargoForm.value);
  }

  saveCargo(): void {
      const formValue = this.cargoForm.value;
      console.log('Nombre enviado a guardar:', formValue.nombre);
      const cargoDto = new CargoDto(
        formValue.nombre,
        formValue.descripcion,
        formValue.activo
      );

      console.log('cargoDto', cargoDto);
      if (this.data && this.data.id) {
        this.cargoService.update(this.data.id, cargoDto).subscribe(
          result => {
            this.dialogRef.close({type: 'save', data: result});
          },
          error => {
            this.dialogRef.close({type: 'error', data: error});
          });
        }else {
          this.cargoService.save(cargoDto).subscribe(
            result => {
              this.dialogRef.close({type: 'save', data: result});
            },
            error => {
              this.dialogRef.close({type: 'error', data: error});
            }
          );
        }
      
    }

    ngOnDestroy(): void {
    }

  cancel(): void {
    this.dialogRef.close({type: 'cancel'});
  }
        

}
