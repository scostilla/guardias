import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ValorGuardiasCargoService } from 'src/app/services/valorGuardiasCargo.service';
import { ValorGuardiaManualDto } from 'src/app/dto/Configuracion/ValorGuardiaManualDto';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { Hospital } from 'src/app/models/Configuracion/Hospital';

@Component({
  selector: 'app-valores-guardias-create',
  templateUrl: './valores-guardias-create.component.html',
  styleUrls: ['./valores-guardias-create.component.css']
})
export class ValoresGuardiasCreateComponent implements OnInit {

  form?: FormGroup;
  hospitales: Hospital[] = [];
  minDate!: Date;

  constructor(
    private fb: FormBuilder,
    private valorGuardiasCargoService: ValorGuardiasCargoService,
    private hospitalService: HospitalService,
    private dialogRef: MatDialogRef<ValoresGuardiasCreateComponent>,
  ) {
    this.minDate = new Date();
    this.form = this.fb.group({
      tipoGuardia: ['', Validators.required],
      nivelComplejidad: [null, [Validators.required]],
      totalLav: [0, [Validators.required, Validators.min(0)]],
      totalSdf: [0, [Validators.required, Validators.min(0)]],
      fechaInicio: [null, Validators.required],
      idsHospitales: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.listHospitales();
  }

  listHospitales(): void {
    this.hospitalService.list().subscribe(data => {
      this.hospitales = data;
    }, error => {
      console.log(error);
    });
  }

  saveValorManual(): void {
    if (this.form?.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Tomamos los valores del formulario
    const formValues = this.form!.value;

    // Creamos el DTO
    const nuevoValor = new ValorGuardiaManualDto(
      formValues.tipoGuardia,
      formValues.nivelComplejidad,
      formValues.totalLav,
      formValues.totalSdf,
      formValues.fechaInicio,
      formValues.idsHospitales
    );

    // Llamamos al servicio
    this.valorGuardiasCargoService.cargarValoresManual([nuevoValor]).subscribe({
      next: (res) => {
        console.log('Valor guardado exitosamente', res);
        this.dialogRef.close(true); // cerramos el diálogo indicando éxito
      },
      error: (err) => {
        console.error('Error al guardar el valor', err);
      }
    });
  }
  
  cancelar(): void {
    this.dialogRef.close();
  }
}
