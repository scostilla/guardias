import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { RegistroMensual } from 'src/app/models/RegistroMensual';
import { NovedadPersonal } from 'src/app/models/guardias/NovedadPersonal';
import * as moment from 'moment';

@Component({
  selector: 'app-ddjj-cargoyagrup-detail',
  templateUrl: './ddjj-cargoyagrup-detail.component.html',
  styleUrls: ['./ddjj-cargoyagrup-detail.component.css']
})
export class DdjjCargoyagrupDetailComponent implements OnInit {
  asistencial!: Asistencial;
  month: number;
  year: number;
  registroMensual!: RegistroMensual;

  constructor(
    public dialogRef: MatDialogRef<DdjjCargoyagrupDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.asistencial = data.asistencial;
    this.month = data.month;
    this.year = data.year;
  }

  ngOnInit(): void {
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

  getNovedadesActivas(asistencial: Asistencial): NovedadPersonal[] {
    const selectedMonth = this.month;
    const selectedYear = this.year;
  
    return asistencial.novedadesPersonales.filter(novedad => {
      const inicio = moment(novedad.fechaInicio);
      const fin = moment(novedad.fechaFinal);
  
      if (
        (inicio.year() < selectedYear || (inicio.year() === selectedYear && inicio.month() <= selectedMonth)) &&
        (fin.year() > selectedYear || (fin.year() === selectedYear && fin.month() >= selectedMonth))
      ) {
        return true;
      }
  
      return false;
    });
  }  

  formatDate(startDate: Date, endDate: Date): string {
    const formattedStartDate = moment(startDate).format('DD/MM/YYYY');
    const formattedEndDate = moment(endDate).format('DD/MM/YYYY');
  
    if (formattedStartDate === formattedEndDate) {
      return formattedStartDate;
    } else {
      return `${formattedStartDate} - ${formattedEndDate}`;
    }
  }
}