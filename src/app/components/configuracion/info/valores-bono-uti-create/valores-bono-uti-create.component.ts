import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValorBonoUti } from 'src/app/models/ValorBonoUti';
import { ValorBonoUtiService } from 'src/app/services/valorBonoUti.service';

@Component({
  selector: 'app-valores-bono-uti-create',
  templateUrl: './valores-bono-uti-create.component.html',
  styleUrls: ['./valores-bono-uti-create.component.css']
})
export class ValoresBonoUtiCreateComponent implements OnInit {

  form?: FormGroup;

  constructor(
    private fb: FormBuilder,
    private valorBonoUtiService: ValorBonoUtiService,
    private dialogRef: MatDialogRef<ValoresBonoUtiCreateComponent>,
    @Inject(MAT_DIALOG_DATA) private data: ValorBonoUti 
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

  saveUTI(): void {
    if (this.form?.invalid) {
      return;
    }

    const nuevaFechaInicio = new Date(this.form?.get('fechaInicio')?.value);

    this.valorBonoUtiService.list().subscribe(
      valorBonoUtis => {
        valorBonoUtis.forEach(uti => {
          if (typeof uti.fechaInicio === 'string') {
            uti.fechaInicio = new Date(uti.fechaInicio);
          }
          if (uti.fechaFin && typeof uti.fechaFin === 'string') {
            uti.fechaFin = new Date(uti.fechaFin);
          }
        });

        const lastRecord = valorBonoUtis.sort((a, b) => b.fechaInicio.getTime() - a.fechaInicio.getTime())[0];

        if (lastRecord) {
          const updatedLastRecord = { ...lastRecord, fechaFin: nuevaFechaInicio };

          this.valorBonoUtiService.update(lastRecord.id!, updatedLastRecord).subscribe(
            () => {
              const valorBonoUti: ValorBonoUti = {
                fechaInicio: nuevaFechaInicio,
                fechaFin: null,
                monto: parseFloat(this.form?.get('monto')?.value),
                documentoLegal: this.form?.get('documentoLegal')?.value
              };

              this.valorBonoUtiService.save(valorBonoUti).subscribe(
                response => {
                  console.log('Valor Bono Uti guardado exitosamente', response);
                  this.dialogRef.close(true);
                },
                error => {
                  console.error('Error al guardar Valor Bono Uti', error);
                }
              );
            },
            error => {
              console.error('Error al actualizar el último Valor Bono Uti', error);
            }
          );
        } else {
          const valorBonoUti: ValorBonoUti = {
            fechaInicio: nuevaFechaInicio,
            fechaFin: null,
            monto: parseFloat(this.form?.get('monto')?.value),
            documentoLegal: this.form?.get('documentoLegal')?.value
          };

          this.valorBonoUtiService.save(valorBonoUti).subscribe(
            response => {
              console.log('Valor Bono Uti guardado exitosamente', response);
              this.dialogRef.close(true);
            },
            error => {
              console.error('Error al guardar Valor Bono Uti', error);
            }
          );
        }
      },
      error => {
        console.error('Error al obtener el último Valor Bono Uti', error);
      }
    );
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
