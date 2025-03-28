import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Feriado } from 'src/app/models/Configuracion/Feriado';
import { FeriadoDto } from 'src/app/dto/Configuracion/FeriadoDto';
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import * as moment from 'moment';

@Component({
  selector: 'app-feriado-edit',
  templateUrl: './feriado-edit.component.html',
  styleUrls: ['./feriado-edit.component.css']
})
export class FeriadoEditComponent implements OnInit {
  feriadoForm: FormGroup;
  initialData: any;
  hospitales: Hospital[] = []; 
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FeriadoEditComponent>,
    private feriadoService: FeriadoService,
    private hospitalService: HospitalService,
    @Inject(MAT_DIALOG_DATA) public data: Feriado
  ) {
    this.feriadoForm = this.fb.group({
      motivo: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      fecha: ['', Validators.required],
      tipoFeriado: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      esPatronal: [false],
      efector: ['']
    });

    this.listHospital();

    if (data) {
      this.feriadoForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.initialData = this.feriadoForm.value;
  }

  listHospital(){
    this.hospitalService.list().subscribe(data => {
      this.hospitales = data;
    }, error => {
      console.log(error);
    });

  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.feriadoForm.value);
  }


  saveFeriado(): void {
    if (this.feriadoForm.valid) {
      const formValue = this.feriadoForm.value;
  
      // Usar Moment.js para manejar la fecha y convertirla en un objeto Date
      const formattedFecha = moment(formValue.fecha).toDate();  // Convertimos a Date
  
      // Crea una instancia del DTO con los datos del formulario
      const feriadoDto = new FeriadoDto(
        formattedFecha,  // Aquí enviamos la fecha como objeto Date
        formValue.motivo,
        formValue.tipoFeriado,
        formValue.descripcion,
        formValue.esPatronal,
        formValue.idEfector || null  // idEfector puede ser opcional
      );
  
      // Log para verificar qué datos se están enviando
      console.log('Datos que se enviarán al backend:', feriadoDto);
  
      // Si estamos editando (tiene un id), utilizamos el método update
      if (this.data && this.data.id) {
        this.feriadoService.update(this.data.id, feriadoDto).subscribe(
          result => {
            this.dialogRef.close(result);
          },
          error => {
            console.error('Error updating feriado:', error);
          }
        );
      } else {
        // Si estamos creando un nuevo feriado, usamos el método save
        this.feriadoService.save(feriadoDto).subscribe(
          result => {
            this.dialogRef.close(result);
          },
          error => {
            console.error('Error saving feriado:', error);
          }
        );
      }
    }
  }
    
  compareHospital(p1: Hospital, p2: Hospital): boolean {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }  

  cancel(): void {
    this.dialogRef.close();
  }
}