import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Factura } from 'src/app/models/Factura';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-factura-detail',
  templateUrl: './factura-detail.component.html',
  styleUrls: ['./factura-detail.component.css']
})
export class FacturaDetailComponent {

  factura: Factura;
  pdfUrlAbs: string | null = null;
  readonly API_BASE = environment.apiUrl;

  constructor(
    private dialogRef: MatDialogRef<FacturaDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Factura
  ) {
    this.factura = data;
    this.pdfUrlAbs = this.buildFullUrl(this.factura?.url);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  private buildFullUrl(url?: string): string | null {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    return url.startsWith('/') ? `${this.API_BASE}${url}` : `${this.API_BASE}/${url}`;
  }

  displayFileName(url?: string): string {
    if (!url) return '';
    const file = (url.split('/').pop() || url);
    const dot = file.lastIndexOf('.');
    const ext = dot >= 0 ? file.substring(dot) : '';
    let base = dot >= 0 ? file.substring(0, dot) : file;
    base = base.replace(/_\d+$/, '').replace(/_/g, ' ').trim();
    return base + ext;
  }

  openPdf(): void {
    if (!this.pdfUrlAbs) return;
    window.open(this.pdfUrlAbs, '_blank');
  }
}
