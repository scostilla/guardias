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
      documentoLegal: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9. °]{2,60}$')]],
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
    const nuevaFechaInicio = new Date(this.form?.get('fechaInicio')?.value);

    this.valorGmiService.list().subscribe(
      valorGmis => {
        valorGmis.forEach(gmi => {
          if (typeof gmi.fechaInicio === 'string') {
            gmi.fechaInicio = new Date(gmi.fechaInicio);
          }
          if (gmi.fechaFin && typeof gmi.fechaFin === 'string') {
            gmi.fechaFin = new Date(gmi.fechaFin);
          }
        });

        const filteredRecords = valorGmis.filter(gmi => gmi.tipoGuardia === tipoGuardiaInteger);
        const lastRecord = filteredRecords.sort((a, b) => b.fechaInicio.getTime() - a.fechaInicio.getTime())[0];

        if (lastRecord) {
          const updatedLastRecord = { ...lastRecord, fechaFin: nuevaFechaInicio };

          this.valorGmiService.update(lastRecord.id!, updatedLastRecord).subscribe(
            () => {
              const valorGmi: ValorGmi = {
                fechaInicio: nuevaFechaInicio,
                fechaFin: null,
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
            },
            error => {
              console.error('Error al actualizar el último ValorGmi', error);
            }
          );
        } else {
          const valorGmi: ValorGmi = {
            fechaInicio: nuevaFechaInicio,
            fechaFin: null,
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
      },
      error => {
        console.error('Error al obtener el último ValorGmi', error);
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
