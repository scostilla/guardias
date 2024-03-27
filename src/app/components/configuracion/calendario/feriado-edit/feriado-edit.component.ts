import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Feriado } from 'src/app/models/Configuracion/Feriado';
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service';

@Component({
  selector: 'app-feriado-edit',
  templateUrl: './feriado-edit.component.html',
  styleUrls: ['./feriado-edit.component.css']
})
export class FeriadoEditComponent implements OnInit {
  feriadoForm: FormGroup;
  initialData: any;
  
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FeriadoEditComponent>,
    private feriadoService: FeriadoService,
    @Inject(MAT_DIALOG_DATA) public data: Feriado
  ) {
    this.feriadoForm = this.fb.group({
      motivo: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]],
      fecha: ['', Validators.required],
      tipoFeriado: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ. ]{1,60}$')]]
    });

    if (data) {
      this.feriadoForm.patchValue(data);
    }
  }

  ngOnInit(): void {
    this.initialData = this.feriadoForm.value;
  }

  isModified(): boolean {
    return JSON.stringify(this.initialData) !== JSON.stringify(this.feriadoForm.value);
  }

  saveFeriado(): void {
    if (this.feriadoForm.valid) {
      const feriadoData = this.feriadoForm.value;
      if (this.data && this.data.id) {
        this.feriadoService.update(this.data.id, feriadoData).subscribe(
          result => {
            this.dialogRef.close(result);
          },
          error => {
          }
        );
      } else {
        this.feriadoService.save(feriadoData).subscribe(
          result => {
            this.dialogRef.close(result);
          },
          error => {
          }
        );
      }
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}