import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValorGmi } from 'src/app/models/ValorGmi';
import { ValorGmiService } from 'src/app/services/valorGmi.service';

@Component({
  selector: 'app-valores-guardias-create',
  templateUrl: './valores-guardias-create.component.html',
  styleUrls: ['./valores-guardias-create.component.css']
})
export class ValoresGuardiasCreateComponent implements OnInit {

  form?: FormGroup;

  constructor(
    private fb: FormBuilder,
    private valorGmiService: ValorGmiService,
    private dialogRef: MatDialogRef<ValoresGuardiasCreateComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ValorGmi 
  ) {
    this.form = this.fb.group({
      monto: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      documentoLegal: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{2,60}$')]],
      fechaInicio: ['', Validators.required],
      tipoGuardia: [[], [Validators.required]]
    });

  }

  ngOnInit(): void {
  }

  saveGMI(): void {
    if (this.form?.invalid) {
      return;
    }

    const tipoGuardiaValue = this.form?.get('tipoGuardia')?.value;
    const tipoGuardiaInteger = this.getTipoGuardiaFromFormValue(tipoGuardiaValue);

    // Crear una instancia de ValorGmi con los datos del formulario
    const valorGmi: ValorGmi = {
      fechaInicio: new Date(this.form?.get('fechaInicio')?.value),
      fechaFin: new Date(), // despues cambiar por null ya que esto se cargará recién cuando haya un nuevo valor GMI
      monto: parseFloat(this.form?.get('monto')?.value),
      tipoGuardia: tipoGuardiaInteger,
      documentoLegal: this.form?.get('documentoLegal')?.value
    };

    this.valorGmiService.save(valorGmi).subscribe(
      response => {
        console.log('ValorGmi guardado exitosamente', response);
        this.dialogRef.close(true);
      },
      error => {
        console.error('Error al guardar ValorGmi', error);
      }
    );
  }

  getTipoGuardiaFromFormValue(value: string): number {
    switch(value) {
      case 'CARGO':
        return 1;
      case 'EXTRA':
        return 2;
      case 'PASIVA':
        return 3;
      default:
        throw new Error('Tipo de guardia desconocido');
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

}
