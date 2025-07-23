import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Hospital } from 'src/app/models/Configuracion/Hospital';

@Component({
  selector: 'app-hospital-detail',
  templateUrl: './hospital-detail.component.html',
  styleUrls: ['./hospital-detail.component.css']
})
export class HospitalDetailComponent implements OnInit {
  hospital!: Hospital;
  imageUrl: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<HospitalDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Hospital 
  ) { }

  ngOnInit(): void {
    this.hospital = this.data;
    
    // 🔥 DEBUG: MOSTRAR TODA LA INFORMACIÓN
    console.log('🏥 Hospital completo:', this.hospital);
    console.log('🔗 URL original:', this.hospital.url);
    
    if (this.hospital.url) {
      this.imageUrl = `http://localhost:8080${this.hospital.url}`;
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
    console.error('- URL original:', this.hospital.url);
    console.error('- Hospital ID:', this.hospital.id);
    console.error('- Hospital nombre:', this.hospital.nombre);
    
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