import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FacturaService } from 'src/app/services/factura.service';
import { FacturaDto } from 'src/app/dto/FacturaDto';

@Component({
  selector: 'app-factura-edit',
  templateUrl: './factura-edit.component.html',
  styleUrls: ['./factura-edit.component.css']
})
export class FacturaEditComponent implements OnInit {

  facturaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<FacturaEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.facturaForm = this.fb.group({
      idAsistencial: [this.data.asistencial.id, Validators.required],
      idRegistrosMensuales: [
        (this.data.registrosMensuales as { id: number }[]).map(r => r.id),
        Validators.required
      ],
      nombreTitular: [this.data.nombreTitular, Validators.required],
      apellidoTitular: [this.data.apellidoTitular, Validators.required],
      dniTitular: [this.data.dniTitular, Validators.required],
      cuilTitular: [this.data.cuilTitular, Validators.required],
      contribuyente: [this.data.contribuyente, Validators.required],
      tipo: [this.data.tipo, Validators.required],
      puntoVenta: [this.data.puntoVenta, Validators.required],
      numeroFactura: [this.data.numeroFactura, Validators.required],
      fechaEmision: [this.data.fechaEmision, Validators.required],
      monto: [this.data.monto, [Validators.required, Validators.min(0)]],
      activo: [this.data.activo]
    });
  }

  onSave(): void {
    if (this.facturaForm.invalid) {
      this.toastr.error('Complete todos los campos obligatorios', 'Error');
      return;
    }

    const dto: FacturaDto = this.facturaForm.value;

    // formatear CUIL (quitar guiones) antes de enviar
    dto.cuilTitular = dto.cuilTitular.replace(/-/g, '');

    this.facturaService.update(this.data.id, dto).subscribe({
      next: () => {
        this.toastr.success('Factura actualizada correctamente', 'Éxito');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('No se pudo actualizar la factura', 'Error');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
