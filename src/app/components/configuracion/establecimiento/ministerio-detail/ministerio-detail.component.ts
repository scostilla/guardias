import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Ministerio } from 'src/app/models/Configuracion/Ministerio';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ministerio-detail',
  templateUrl: './ministerio-detail.component.html',
  styleUrls: ['./ministerio-detail.component.css']
})
export class MinisterioDetailComponent implements OnInit {

  ministerio!: Ministerio;
  imageUrl: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<MinisterioDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Ministerio 
  ) { }

  ngOnInit(): void {
    this.ministerio = this.data;

    if (this.ministerio.url) {
      this.imageUrl = `${environment.apiUrl}${this.ministerio.url}`;
      console.log('🖼️ URL completa construida:', this.imageUrl);
    } else {
      console.log('❌ No hay URL de imagen');
    }
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    console.error('❌ Error al cargar imagen:');
    console.error('- URL que falló:', target.src);
    console.error('- URL original:', this.ministerio.url);
    console.error('- Ministerio ID:', this.ministerio.id);
    console.error('- Ministerio nombre:', this.ministerio.nombre);

    if (target) {
      target.style.display = 'none';
    }
  }

  onImageLoad(event: Event): void {
    const target = event.target as HTMLImageElement;
    console.log('✅ Imagen cargada exitosamente:', target.src);
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}