import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Caps } from 'src/app/models/Configuracion/Caps';
import { CapsService } from 'src/app/services/Configuracion/caps.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-caps-detail',
  templateUrl: './caps-detail.component.html',
  styleUrls: ['./caps-detail.component.css']
})
export class CapsDetailComponent implements OnInit {

  caps!: Caps;
  cabeceraName!: string;
  cargando = true; // Variable para mostrar el spinner de carga
  imageUrl: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<CapsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Caps,
    private capsService: CapsService, 
    private cdRef: ChangeDetectorRef 
  ) { }

  ngOnInit(): void {
   
    this.caps = this.data;

    console.log('🏥 Caps completo:', this.caps);
    console.log('🔗 URL original:', this.caps.url);

    if (this.caps.url) {
      this.imageUrl = `${environment.apiUrl}${this.caps.url}`;
      console.log('🖼️ URL completa construida:', this.imageUrl);
    } else {
      console.log('❌ No hay URL de imagen');
    }

    // Usar ChangeDetectorRef para asegurar la detección de cambios
    setTimeout(() => {
      this.getCabeceraName();
    }, 0);
  }

  // 🔥 AGREGAR MÉTODO PARA MANEJAR ERROR DE IMAGEN
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    console.error('❌ Error al cargar imagen:');
    console.error('- URL que falló:', target.src);
    console.error('- URL original:', this.caps.url);
    console.error('- Caps ID:', this.caps.id);
    console.error('- Caps nombre:', this.caps.nombre);

    if (target) {
      target.style.display = 'none';
    }
  }

  onImageLoad(event: Event): void {
    const target = event.target as HTMLImageElement;
    console.log('✅ Imagen cargada exitosamente:', target.src);
  }

  // Método para obtener el nombre de la cabecera desde el servicio
  getCabeceraName(): void {
    this.cargando = true;

    this.capsService.getCabeceraNameByCapsId(this.caps.id!).subscribe(
      (name) => {
        console.log('Nombre de la cabecera recibido:', name);
        this.cabeceraName = name;
        this.cargando = false; 
        this.cdRef.detectChanges(); 
      },
      (error) => {
        console.error('Error al obtener el nombre de la cabecera:', error);
        this.cabeceraName = 'Cabecera no encontrada';
        this.cargando = false; 
        this.cdRef.detectChanges(); 
      }
    );
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}