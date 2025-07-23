import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Especialidad } from 'src/app/models/Configuracion/Especialidad';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { Revista } from 'src/app/models/Configuracion/Revista';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';


@Component({
  selector: 'app-legajo-detail',
  templateUrl: './legajo-detail.component.html',
  styleUrls: ['./legajo-detail.component.css']
})
export class LegajoDetailComponent implements OnInit {

  legajo!: Legajo;
  revista: Revista | null | undefined;
  imageUrl: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<LegajoDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Legajo 
  ) { }

  ngOnInit(): void {
    this.legajo = this.data;
    this.revista = this.legajo.revista;
    console.log('Legajo recibido:', this.legajo);
  console.log('Revista asociada:', this.revista);
  console.log(' Url Original:', this.legajo.url)

  if (this.legajo.url) {
      this.imageUrl = `http://localhost:8080${this.legajo.url}`;
      console.log('🖼️ URL completa construida:', this.imageUrl);
    } else {
      console.log('❌ No hay URL de imagen');
    }
  }

  // 🔥 AGREGAR MÉTODO PARA MANEJAR ERROR DE IMAGEN
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    console.error('❌ Error al cargar imagen:');
    console.error('- URL que falló:', target.src);
    console.error('- URL original:', this.legajo.url);
    console.error('- Legajo ID:', this.legajo.id);
  
    if (target) {
      target.style.display = 'none';
    }
  }

  onImageLoad(event: Event): void {
    const target = event.target as HTMLImageElement;
    console.log('✅ Imagen cargada exitosamente:', target.src);
  }

  isLast(index: number, array: Efector[] | Especialidad[] | TipoGuardia[]): boolean {
    return index === array.length - 1;
  }
  
  cerrar(): void {
    this.dialogRef.close();
  }

}