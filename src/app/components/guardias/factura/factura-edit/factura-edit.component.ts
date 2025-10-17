import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { FacturaDto } from 'src/app/dto/FacturaDto';
import { FacturaService } from 'src/app/services/factura.service';

@Component({
  selector: 'app-factura-edit',
  templateUrl: './factura-edit.component.html',
  styleUrls: ['./factura-edit.component.css']
})
export class FacturaEditComponent implements OnInit {

  facturaForm!: FormGroup;

  // --- NUEVO: indicación de modo edición para el template ---
  esEdicion: boolean = false;
  // --- FIN NUEVO ---

  // --- NUEVO: pdf handling ---
  selectedFile: File | null = null;
  fileUrl: string | null = null;
  sanitizedPdfUrl?: SafeResourceUrl;
  isDragOver: boolean = false;
  isUploading: boolean = false;
  uploadError: string | null = null;
  // --- FIN NUEVO ---

  // --- NUEVO: base API para construir URL absoluta (ajustar si corresponde) ---
  private readonly API_BASE = 'http://localhost:8080';
  // --- FIN NUEVO ---

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<FacturaEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer // <- agregado
  ) { }

  ngOnInit(): void {
    // Inicializar flag de edición para la plantilla
    this.esEdicion = !!this.data && !!this.data.id;

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

    // Si trae URL existente, preparar preview
    if (this.data?.url) {
      // Construir URL absoluta (similar a notificacion). Evita 404 por rutas relativas.
      this.fileUrl = this.buildFullUrl(this.data.url);
      this.sanitizedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl as string);
    }
  }

  // Construye URL absoluta a partir de URL relativa o ya absoluta
  private buildFullUrl(url: string): string {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return url.startsWith('/') ? `${this.API_BASE}${url}` : `${this.API_BASE}/${url}`;
  }

  // --- NUEVO: helpers archivo ---
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
    } catch {
      this.fileUrl = null;
      this.sanitizedPdfUrl = undefined;
    }
    this.uploadError = null;
  }

  openFileSelector(): void { const fileInput = document.getElementById('archivo-factura-edit') as HTMLInputElement; if (fileInput) fileInput.click(); }
  removeSelectedFile(): void {
    if (this.fileUrl) {
      try { URL.revokeObjectURL(this.fileUrl); } catch {}
    }
    this.selectedFile = null;
    // Restaurar preview original si existe: construir URL absoluta
    this.fileUrl = this.data?.url ? this.buildFullUrl(this.data.url) : null;
    this.sanitizedPdfUrl = this.fileUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl as string) : undefined;
    this.uploadError = null;
    const fileInput = document.getElementById('archivo-factura-edit') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onDragEnter(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); if (event.dataTransfer?.types.includes('Files')) { this.isDragOver = true; this.uploadError = null; } }
  onDragOver(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'; this.isDragOver = true; }
  onDragLeave(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); this.isDragOver = false; }
  onDrop(event: DragEvent): void { event.preventDefault(); event.stopPropagation(); this.isDragOver = false; const files = event.dataTransfer?.files; if (files && files.length > 0) { const fakeEvent = { target: { files } } as any; this.onFileSelected(fakeEvent); } }
  onMouseLeave(_: MouseEvent): void { this.isDragOver = false; }

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

  onSave(): void {
    if (this.facturaForm.invalid) {
      this.toastr.error('Complete todos los campos obligatorios', 'Error');
      return;
    }

    const dto: FacturaDto = this.facturaForm.value;
    dto.cuilTitular = dto.cuilTitular.replace(/-/g, '');

    // Si hay archivo seleccionado: actualizar primero, luego subir PDF
    if (this.selectedFile) {
      this.isUploading = true;
      this.facturaService.update(this.data.id, dto).subscribe({
        next: () => {
          this.facturaService.uploadPdf(this.data.id, this.selectedFile!).subscribe({
            next: () => {
              this.isUploading = false;
              this.toastr.success('Factura actualizada y PDF subido', 'Éxito');
              this.dialogRef.close(true);
            },
            error: (err) => {
              this.isUploading = false;
              console.error('[UPLOAD PDF] Error:', err);
              this.toastr.error('Factura actualizada pero no se pudo subir el PDF', 'Error');
              this.dialogRef.close(true);
            }
          });
        },
        error: (err) => {
          this.isUploading = false;
          console.error(err);
          this.toastr.error('No se pudo actualizar la factura', 'Error');
        }
      });
      return;
    }

    // Sin archivo: comportamiento original
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

  verPdfActual(): void {
    if (!this.fileUrl) {
      this.toastr.info('No hay PDF cargado');
      return;
    }
    window.open(this.fileUrl, '_blank');
  }
}
