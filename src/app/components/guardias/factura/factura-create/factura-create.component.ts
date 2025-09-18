import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FacturaService } from 'src/app//services/factura.service';
import { FacturaDto } from 'src/app/dto/FacturaDto';
import { RegistroMensualService } from 'src/app/services/registroMensual.service';


@Component({
  selector: 'app-factura-create',
  templateUrl: './factura-create.component.html',
  styleUrls: ['./factura-create.component.css']
})
export class FacturaCreateComponent  implements OnInit {
  facturaForm!: FormGroup;
  disponible: number = 0;

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private registroMensualService: RegistroMensualService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<FacturaCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const rawCuil: string = this.data.asistencial?.cuil || '';
    let formattedCuil = '';

    // Si el CUIL tiene 11 dígitos (ej: 20123456783)
    if (/^\d{11}$/.test(rawCuil)) {
      const prefix = rawCuil.substring(0, 2);
      const middle = rawCuil.substring(2, rawCuil.length - 1);
      const suffix = rawCuil.substring(rawCuil.length - 1);

      formattedCuil = `${prefix}-${middle}-${suffix}`;
    }    

    this.facturaForm = this.fb.group({
      idAsistencial: [this.data.asistencial?.id, Validators.required],
      idRegistrosMensuales: [this.data.idRegistrosMensuales || [], Validators.required],

      nombreTitular: [this.data.asistencial?.nombre || '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚäëïöüÄËÏÖÜñÑ. ]{1,60}$')]],
      apellidoTitular: [this.data.asistencial?.apellido || '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚäëïöüÄËÏÖÜñÑ. ]{1,60}$')]],
      dniTitular: [this.data.asistencial?.dni || '', [Validators.required, Validators.pattern(/^\d{7,20}$/)]],
      cuilTitular: [formattedCuil || '', [Validators.required, Validators.pattern(/^\d{2}-\d{8}-\d{1}$/)]],

      contribuyente: ['', Validators.required],
      tipo: ['', Validators.required],
      puntoVenta: [0, [Validators.required, Validators.min(1), Validators.max(9999)]],     
      numeroFactura: [0, [Validators.required, Validators.min(1), Validators.max(99999999)]],
      fechaEmision: ['', Validators.required],
      monto: [0, [Validators.required, Validators.min(0), this.montoValidator.bind(this)]],
      activo: [true]
    });

     console.log('🔹 Datos recibidos en el diálogo:', this.data);
  console.log('🔹 idEfector recibido:', this.data.idEfector);

    this.calcularMontoDisponible(
      this.data.asistencial?.id,
      this.data.idEfector,
      this.data.quincena,
      this.data.mes,
      this.data.anio
    );
  }

calcularMontoDisponible(idAsistencial: number, idEfector: number, quincena: string, mes: string, anio: number): void {
  this.registroMensualService
    .getMontoTotalByQuincena(idAsistencial, idEfector, quincena, mes, anio)
    .subscribe({
      next: (total) => {
        this.facturaService
          .getMontoByQuincena(idAsistencial, idEfector, quincena, mes, anio)
          .subscribe({
            next: (facturado) => {
              this.disponible = total - facturado;
              console.log('💰 Total:', total, ' | Facturado:', facturado, ' | Disponible:', this.disponible);

              // actualiza validación del campo monto
              this.facturaForm.get('monto')?.updateValueAndValidity();
            },
            error: (err) => console.error('Error al obtener facturado', err),
          });
      },
      error: (err) => console.error('Error al obtener total', err),
    });
}

/* Validador para el campo monto */
montoValidator(control: AbstractControl): ValidationErrors | null {
  if (this.disponible && control.value > this.disponible) {
    return { excedeMonto: true };
  }
  return null;
}

onSave(): void {
  if (this.facturaForm.invalid) {
    this.toastr.error('Por favor complete todos los campos obligatorios', 'Error');
    return;
  }

  // Clona los valores del formulario
  const dto: FacturaDto = { ...this.facturaForm.value };

  // Quito los guiones del CUIL
  if (dto.cuilTitular) {
    dto.cuilTitular = dto.cuilTitular.replace(/-/g, '');
  }

  this.facturaService.create(dto).subscribe({
    next: () => {
      this.toastr.success('Factura creada correctamente', 'Éxito');
      this.dialogRef.close(true);
    },
    error: (err) => {
      console.error(err);
      this.toastr.error('No se pudo crear la factura', 'Error');
    }
  });
}

onCancel(): void {
    this.dialogRef.close(false);
  }
}
