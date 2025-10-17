import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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

  // --- NUEVO: manejo de PDF ---
  selectedFile: File | null = null;
  fileUrl: string | null = null;
  sanitizedPdfUrl?: SafeResourceUrl;
  isDragOver: boolean = false;
  isUploading: boolean = false;
  uploadError: string | null = null;
  // --- FIN NUEVO ---

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private registroMensualService: RegistroMensualService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<FacturaCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer // <- inyectado
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

  const dto: FacturaDto = { ...this.facturaForm.value };

  if (dto.cuilTitular) {
    dto.cuilTitular = dto.cuilTitular.replace(/-/g, '');
  }

  // Si hay archivo seleccionado: crear factura y luego subir PDF asociado
  if (this.selectedFile) {
    this.isUploading = true;
    this.facturaService.create(dto).subscribe({
      next: (resp) => {
        // Intento robusto de obtener el id creado
        const createdId = resp && (resp.id || resp.facturaId || resp.notificacionId || resp.data?.id) ? (resp.id || resp.facturaId || resp.notificacionId || resp.data?.id) : (typeof resp === 'number' ? resp : undefined);
        const id = createdId || resp?.id;
        if (id) {
          this.facturaService.uploadPdf(id, this.selectedFile!).subscribe({
            next: (uploadResp) => {
              this.isUploading = false;
              this.toastr.success('Factura creada y PDF subido', 'Éxito');
              this.dialogRef.close(true);
            },
            error: (err) => {
              this.isUploading = false;
              console.error('[UPLOAD PDF] Error:', err);
              this.toastr.error('Factura creada pero no se pudo subir el PDF', 'Error');
              // opcional: cerrar igualmente o dejar abierto -> aquí cerramos para mantener el flujo
              this.dialogRef.close(true);
            }
          });
        } else {
          // Si no se pudo obtener id, informar pero cerrar
          this.isUploading = false;
          this.toastr.success('Factura creada', 'Éxito');
          this.dialogRef.close(true);
        }
      },
      error: (err) => {
        this.isUploading = false;
        console.error(err);
        this.toastr.error('No se pudo crear la factura', 'Error');
      }
    });
    return;
  }

  // Sin archivo: comportamiento original
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

  // --- NUEVO: helpers para archivo ---
  private updateSanitized(): void {
    this.sanitizedPdfUrl = this.fileUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl) : undefined;
  }

  onFileSelected(event: any): void {
    const file: File | undefined = event.target.files?.[0];
    if (!file) { this.selectedFile = null; this.uploadError = 'No se seleccionó ningún archivo'; return; }
    if (file.type !== 'application/pdf') { this.toastr.warning('Solo se permiten archivos PDF', 'Archivo no válido'); event.target.value = ''; this.selectedFile = null; this.uploadError = 'Formato no válido'; return; }
    if (file.size > 10 * 1024 * 1024) { this.toastr.warning('El archivo supera los 10MB', 'Archivo muy grande'); event.target.value = ''; this.selectedFile = null; this.uploadError = 'Archivo muy grande'; return; }
    this.selectedFile = file;
    try {
      this.fileUrl = URL.createObjectURL(file);
      this.updateSanitized();
    } catch (e) {
      this.fileUrl = null;
      this.sanitizedPdfUrl = undefined;
    }
    this.uploadError = null;
  }

  onDragEnter(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); if (event.dataTransfer?.types.includes('Files')) { this.isDragOver = true; this.uploadError = null; } }
  onDragOver(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'; this.isDragOver = true; }
  onDragLeave(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); this.isDragOver = false; }
  onDrop(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); this.isDragOver = false; const files = event.dataTransfer?.files; if (files && files.length > 0) { const fakeEvent = { target: { files } } as any; this.onFileSelected(fakeEvent); } }
  onMouseLeave(_: MouseEvent): void { this.isDragOver = false; }

  openFileSelector(): void { const fileInput = document.getElementById('archivo-factura') as HTMLInputElement; if (fileInput) fileInput.click(); }

  removeSelectedFile(): void {
    if (this.fileUrl) {
      try { URL.revokeObjectURL(this.fileUrl); } catch { /* ignore */ }
    }
    this.selectedFile = null;
    this.fileUrl = null;
    this.sanitizedPdfUrl = undefined;
    this.uploadError = null;
    const fileInput = document.getElementById('archivo-factura') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  getFileInfo(): string {
    if (!this.selectedFile) return '';
    const sizeInMB = (this.selectedFile.size / (1024 * 1024)).toFixed(2);
    return `${this.selectedFile.name} (${sizeInMB} MB)`;
  }

  getDropAreaClasses(): string {
    let classes = 'file-drop-area';
    if (this.isUploading) classes += ' uploading';
    else if (this.isDragOver) classes += ' drag-over';
    else if (this.selectedFile && !this.uploadError) classes += ' has-file';
    else if (this.uploadError) classes += ' error';
    return classes;
  }
  // --- FIN NUEVO ---
}
