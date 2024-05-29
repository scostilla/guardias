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
    return asistencial.novedadesPersonales.filter(novedad => {
      const inicio = moment(novedad.fechaInicio);
      const fin = moment(novedad.fechaFinal);
  
      const inicioMes = inicio.month();
      const inicioAnio = inicio.year();
      const finMes = fin.month();      const finAnio = fin.year();
  
      const selectedMonth = this.month;
      const selectedYear = this.year;

      console.log("### Fecha de inicio: ", inicio.format("YYYY-MM-DD"));
      console.log("### Fecha de fin: ", fin.format("YYYY-MM-DD"));
      console.log("### Mes de inicio (ajustado): ", inicioMes + 1);
      console.log("### Año de inicio: ", inicioAnio);
      console.log("### Mes de fin (ajustado): ", finMes + 1);
      console.log("### Año de fin: ", finAnio);
      console.log("### Mes seleccionado: ", selectedMonth + 1);
      console.log("### Año seleccionado: ", selectedYear);
  
      return (
        inicio.isSameOrBefore(moment({ year: selectedYear, month: selectedMonth })) &&
        fin.isSameOrAfter(moment({ year: selectedYear, month: selectedMonth })) &&
        novedad.actual
      );
    });
  }
}