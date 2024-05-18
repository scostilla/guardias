import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { RegistroMensual } from 'src/app/models/RegistroMensual';
import { NovedadPersonal } from 'src/app/models/guardias/NovedadPersonal';

@Component({
  selector: 'app-ddjj-cargoyagrup-detail',
  templateUrl: './ddjj-cargoyagrup-detail.component.html',
  styleUrls: ['./ddjj-cargoyagrup-detail.component.css']
})
export class DdjjCargoyagrupDetailComponent implements OnInit {
  asistencial!: Asistencial;
  registroMensual!: RegistroMensual;

  constructor(
    public dialogRef: MatDialogRef<DdjjCargoyagrupDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Asistencial
  ) {}

  ngOnInit(): void {
    // Asigna los datos recibidos a registroMensual
    this.asistencial = this.data;
  }
  
  getLegajoActualId(asistencial: Asistencial): Legajo | undefined {
    const legajoActual = asistencial.legajos.find(legajo => legajo.actual);
    return legajoActual ? legajoActual : undefined;
  } 

  getNovedades(asistencial: Asistencial): NovedadPersonal[] {
    return asistencial.novedadesPersonales;
  }
    
  cerrar(): void {
    this.dialogRef.close();
  }
}