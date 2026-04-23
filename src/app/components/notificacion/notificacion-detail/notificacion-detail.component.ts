import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Notificacion } from 'src/app/models/Notificacion';

@Component({
  selector: 'app-notificacion-detail',
  templateUrl: './notificacion-detail.component.html',
  styleUrls: ['./notificacion-detail.component.css']
})
export class NotificacionDetailComponent implements OnInit {

  notificacion!: Notificacion;
  pdfUrlAbs: string | null = null;
  readonly API_BASE = 'http://localhost:8080';

  constructor(
    private dialogRef: MatDialogRef<NotificacionDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Notificacion
  ) {}

  ngOnInit(): void {
    this.notificacion = this.data;
    this.pdfUrlAbs = this.buildFullUrl(this.notificacion?.url);
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

  cerrar(): void {
    this.dialogRef.close();
  }
}
