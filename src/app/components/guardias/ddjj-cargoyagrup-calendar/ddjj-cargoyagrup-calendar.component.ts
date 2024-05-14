import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { RegistroMensual } from 'src/app/models/RegistroMensual';
import { NovedadPersonal } from 'src/app/models/guardias/NovedadPersonal';

@Component({
  selector: 'app-ddjj-cargoyagrup-calendar',
  templateUrl: './ddjj-cargoyagrup-calendar.component.html',
  styleUrls: ['./ddjj-cargoyagrup-calendar.component.css']
})
export class DdjjCargoyagrupCalendarComponent implements OnInit {
  asistencial!: Asistencial;
  registroMensual!: RegistroMensual;

  constructor(
    public dialogRef: MatDialogRef<DdjjCargoyagrupCalendarComponent>,
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

  getNovedadActualId(asistencial: Asistencial): NovedadPersonal | undefined {
    const novedadActual = asistencial.novedadesPersonales.find(novedadPersonal => novedadPersonal.actual);
    return novedadActual ? novedadActual : undefined;
  } 
  
  cerrar(): void {
    this.dialogRef.close();
  }
}