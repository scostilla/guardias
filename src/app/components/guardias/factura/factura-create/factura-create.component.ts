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
  disponible: number | null = null;
  loading = true;
  maximoAlcanzado = false; 

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private registroMensualService: RegistroMensualService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<FacturaCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

// ngOnInit()
ngOnInit(): void {
  // 1. Preparar CUIL formateado
  const rawCuil: string = this.data.asistencial?.cuil || '';
  let formattedCuil = '';
  if (/^\d{11}$/.test(rawCuil)) {
    const prefix = rawCuil.substring(0, 2);
    const middle = rawCuil.substring(2, rawCuil.length - 1);
    const suffix = rawCuil.substring(rawCuil.length - 1);
    formattedCuil = `${prefix}-${middle}-${suffix}`;
  }

  // 2. Crear SIEMPRE el formulario con los datos iniciales
  this.facturaForm = this.fb.group({
    idAsistencial: [this.data.asistencial?.id, Validators.required],
    idRegistrosMensuales: [this.data.idRegistrosMensuales || [], Validators.required],

    nombreTitular: [this.data.asistencial?.nombre || '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚäëïöüÄËÏÖÜñÑ. ]{1,60}$')]],
    apellidoTitular: [this.data.asistencial?.apellido || '', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚäëïöüÄËÏÖÜñÑ. ]{1,60}$')]],
    dniTitular: [this.data.asistencial?.dni || '', [Validators.required, Validators.pattern(/^\d{7,20}$/)]],
    cuilTitular: [formattedCuil || '', [Validators.required, Validators.pattern(/^\d{2}-\d{8}-\d{1}$/)]],

    contribuyente: ['', Validators.required],
    tipo: ['', Validators.required],
    puntoVenta: [0, [Validators.required, Validators.min(1), Validators.max(999)]],
    numeroFactura: [0, [Validators.required, Validators.min(1), Validators.max(99999999)]],
    fechaEmision: ['', Validators.required],
    monto: [0, [Validators.required, Validators.min(0), this.montoValidator.bind(this)]],
    activo: [true]
  });

  console.log('🔹 Datos recibidos en el diálogo:', this.data);
  console.log('🔹 idEfector recibido:', this.data.idEfector);

 // 3. Verificar si ya hay 2 facturas
  this.facturaService.existenDosFacturas(
    this.data.asistencial?.id,
    this.data.idEfector,
    this.data.anio,
    this.data.mes,
    this.data.quincena
  ).subscribe({
    next: (existenDos: boolean) => {
      this.maximoAlcanzado = existenDos;

      if (existenDos) {
        // Si ya hay 2, sólo mostramos mensaje; calculamos disponible para la UI pero NO parcheamos monto
        this.calcularMontoDisponible(
          this.data.asistencial?.id,
          this.data.idEfector,
          this.data.quincena,
          this.data.mes,
          this.data.anio,
          (disponible) => {
            // guardo disponible redondeado para mostrar en la UI
            this.disponible = Number(disponible.toFixed(2));
            // aseguramos que el campo monto quede en 0 (no debe autocompletarse)
            this.facturaForm.patchValue({ monto: 0 });
            this.facturaForm.get('monto')?.enable();
            this.facturaForm.get('monto')?.updateValueAndValidity();

            // <-- Aquí: sólo cuando ya tenemos disponible, dejamos de cargar
            this.loading = false;
          }
        );
      } else {
        // Si todavía no son 2, chequeo si existe al menos 1 factura
        this.facturaService.existeFactura(
          this.data.asistencial?.id,
          this.data.idEfector,
          this.data.anio,
          this.data.mes,
          this.data.quincena
        ).subscribe({
          next: (existe: boolean) => {
            // calculo disponible siempre para mostrar en la UI
            this.calcularMontoDisponible(
              this.data.asistencial?.id,
              this.data.idEfector,
              this.data.quincena,
              this.data.mes,
              this.data.anio,
              (disponible) => {
                const rounded = Number(disponible.toFixed(2));
                this.disponible = rounded;

                if (existe) {
                  this.facturaForm.patchValue({ monto: rounded });
                } else {
                  this.facturaForm.patchValue({ monto: 0 });
                }
                this.facturaForm.get('monto')?.updateValueAndValidity();

                // <-- Aquí: sólo cuando ya tenemos disponible, dejamos de cargar
                this.loading = false;
              }
            );
          },
          error: (err) => {
            console.error('Error verificando existencia de factura', err);
            this.facturaForm.patchValue({ monto: 0 });
            this.facturaForm.get('monto')?.updateValueAndValidity();

            // en caso de error también detenemos el loading
            this.disponible = 0;
            this.loading = false;
          }
        });
      }

      // NO dejar this.loading = false; aquí (lo movimos dentro de los callbacks)
    },
    error: (err) => {
      console.error('Error verificando si existen dos facturas', err);
      this.maximoAlcanzado = true;
      this.disponible = 0;
      this.loading = false;
    }
  });
}

// calcularMontoDisponible ahora acepta un callback opcional
calcularMontoDisponible(
  idAsistencial: number,
  idEfector: number,
  quincena: string,
  mes: string,
  anio: number,
  callback?: (disponible: number) => void
): void {
  this.registroMensualService
    .getMontoTotalByQuincena(idAsistencial, idEfector, quincena, mes, anio)
    .subscribe({
      next: (total) => {
        this.facturaService
          .getMontoByQuincena(idAsistencial, idEfector, quincena, mes, anio)
          .subscribe({
            next: (facturado) => {
              const rawDisponible = total - facturado;
              // redondeamos a 2 decimales para evitar artefactos de punto flotante
              const rounded = Number(rawDisponible.toFixed(2));
              this.disponible = rounded;
              console.log('💰 Total:', total, ' | Facturado:', facturado, ' | Disponible:', this.disponible);

              // llamamos al callback sólo si nos lo pasaron (el callback decide si parchea el form)
              if (callback) {
                callback(rounded);
              }

              // actualiza validación del campo monto
              this.facturaForm.get('monto')?.updateValueAndValidity();
            },
            error: (err) => {
              console.error('Error al obtener facturado', err);
              if (callback) callback(0);
            },
          });
      },
      error: (err) => {
        console.error('Error al obtener total', err);
        if (callback) callback(0);
      },
    });
}

/* Validador para el campo monto */
montoValidator(control: AbstractControl): ValidationErrors | null {
  if (this.disponible && control.value > this.disponible) {
    return { excedeMonto: true };
  }
  return null;
}

onMontoInput(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.value) {
    this.facturaForm.patchValue({ monto: 0 }, { emitEvent: false });
    return;
  }

  // Solo números
  const numericValue = input.value.replace(/\D/g, ''); // quita todo menos dígitos
  const valueNumber = parseFloat(numericValue) / 100; // mueve decimales a la derecha

  // Actualiza el form y el input
  this.facturaForm.patchValue({ monto: valueNumber }, { emitEvent: false });
  input.value = valueNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

initForm(): void {
    this.facturaForm = this.fb.group({
      nombreTitular: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,60}$/)]],
      apellidoTitular: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]{2,60}$/)]],
      dniTitular: ['', [Validators.required, Validators.pattern(/^\d{8,20}$/)]],
      cuilTitular: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      contribuyente: ['', Validators.required],
      tipo: ['', Validators.required],
      puntoVenta: [null, [Validators.min(1), Validators.max(9999)]],
      numeroFactura: [null, [Validators.min(1), Validators.max(99999999)]],
      fechaEmision: ['', Validators.required],
      monto: [null]
    });
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
