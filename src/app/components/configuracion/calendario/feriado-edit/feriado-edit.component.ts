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
      efector: [{ value: '', disabled: true }]
    });

    this.listHospital();

    if (data) {
      this.feriadoForm.patchValue(data);  // Aquí aplicamos patchValue
  
      if (data.esPatronal) {
        this.feriadoForm.get('efector')?.enable();
        this.feriadoForm.get('efector')?.setValidators([Validators.required]);
      }
    }
  }

  ngOnInit(): void {
    this.initialData = this.feriadoForm.value;

    // Observa el cambio del checkbox 'esPatronal'
    this.feriadoForm.get('esPatronal')?.valueChanges.subscribe(value => {
      if (!value) {
        // Si 'esPatronal' es false, resetea el campo 'efector', quita la validación y deshabilita el select
        this.feriadoForm.get('efector')?.reset();
        this.feriadoForm.get('efector')?.clearValidators();
        this.feriadoForm.get('efector')?.disable();
      } else {
        // Si 'esPatronal' es true, hace el campo 'efector' obligatorio y habilita el select
        this.feriadoForm.get('efector')?.setValidators([Validators.required]);
        this.feriadoForm.get('efector')?.enable();
      }
      // Después de cambiar las validaciones y habilitación/deshabilitación, vuelve a hacer una validación del formulario
      this.feriadoForm.get('efector')?.updateValueAndValidity();
    });
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
  
      let formattedFecha: Date;
  
      if (this.data && this.data.id) {
        // para edición, fecha sin formatear
        formattedFecha = formValue.fecha;
      } else {
        // para creación, formateo fecha
        formattedFecha = moment(formValue.fecha).toDate();
      }
  
      // Verifica si el campo 'efector' está habilitado y tiene un valor
      let efectorValue = null;
      if (this.feriadoForm.get('efector')?.enabled && formValue.efector) {
        efectorValue = formValue.efector ? formValue.efector.id : null;
      }
  
      const feriadoDto = new FeriadoDto(
        formattedFecha,
        formValue.motivo,
        formValue.tipoFeriado,
        formValue.esPatronal,
        formValue.descripcion,
        efectorValue
      );
  
      // Agregar el log para ver qué datos se envían al servidor
      console.log('Enviando datos al servidor:', feriadoDto);
  
      if (this.data && this.data.id) {
        feriadoDto.id = this.data.id;
  
        this.feriadoService.update(this.data.id, feriadoDto).subscribe(
          result => {
            this.dialogRef.close(result);
          },
          error => {
            console.error('Error updating feriado:', error);
          }
        );
      } else {
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