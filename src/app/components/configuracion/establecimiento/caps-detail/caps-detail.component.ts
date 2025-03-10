import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Caps } from 'src/app/models/Configuracion/Caps';
import { CapsService } from 'src/app/services/Configuracion/caps.service';

@Component({
  selector: 'app-caps-detail',
  templateUrl: './caps-detail.component.html',
  styleUrls: ['./caps-detail.component.css']
})
export class CapsDetailComponent implements OnInit {

  caps!: Caps;
  cabeceraName!: string;
  cargando = true; // Variable para mostrar el spinner de carga

  constructor(
    private dialogRef: MatDialogRef<CapsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Caps,
    private capsService: CapsService, 
    private cdRef: ChangeDetectorRef 
  ) { }

  ngOnInit(): void {
   
    this.caps = this.data;
    
    // Usar ChangeDetectorRef para asegurar la detección de cambios
    setTimeout(() => {
      this.getCabeceraName();
    }, 0);
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