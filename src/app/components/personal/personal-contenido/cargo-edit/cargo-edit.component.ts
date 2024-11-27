import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
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

   //útiles
   step = 0;
   maxDate!: Date;
   minFechaFinal!: Date;

  
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
      nroresolucion: ['', Validators.required],
      nrodecreto: ['', Validators.required],
      activo: ['', Validators.required],
      fechaResolucion: ['', Validators.required],
      fechaInicio: ['',[ Validators.required, this.dateLimitePresente]],
      fechaFinal: ['', Validators.required]

   });

   if(data){
   this.cargoForm.patchValue(data);

   //-----Manejo de fechas-----

   this.maxDate = new Date();
    
   // Deshabilitar fechaFinal hasta que se seleccione fechaInicio
   this.cargoForm.get('fechaFinal')?.disable(); 
 
   // Habilitar fechaFinal cuando fechaInicio tiene un valor
   this.cargoForm.get('fechaInicio')?.valueChanges.subscribe(fechaInicio => {
     if (fechaInicio) {
       this.cargoForm.get('fechaFinal')?.enable();
   
       // valor mínimo de fechaFinal, día siguiente a fechaInicio
       const fechaInicioDate = new Date(fechaInicio);
       fechaInicioDate.setDate(fechaInicioDate.getDate() + 1);
       this.minFechaFinal = fechaInicioDate;
   
       // Reseteo fechaFinal en caso se modifique fechaInicio
       this.cargoForm.get('fechaFinal')?.setValue('');
     } else {
        this.cargoForm.get('fechaFinal')?.disable(); 
       this.cargoForm.get('fechaFinal')?.setValue('');
     }
    });

  }
}

  ngOnInit(): void {
    this.initialData = this.cargoForm.value;
  }
  
  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.cargoForm.value);
  }

  dateLimitePresente(control: any) {
    const currentDate = new Date();
    if (control.value && new Date(control.value) > currentDate) {
      return { 'matDatepickerMin': true };
    }
    return null;
  }

  //Form Datos profesional: Habilita la fecha minima para fechaFinalizacion
  onDateChange(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
  }

  saveCargo(): void {
    console.log('saveCargo ejecutado');
    
      const formValue = this.cargoForm.value;
      const cargoDto = new CargoDto(
        formValue.nombre,
        formValue.descripcion,
        formValue.nroresolucion,
        formValue.nrodecreto,
        formValue.activo,
        formValue.fechaResolucion,
        formValue.fechaInicio,
        formValue.fechaFinal
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
