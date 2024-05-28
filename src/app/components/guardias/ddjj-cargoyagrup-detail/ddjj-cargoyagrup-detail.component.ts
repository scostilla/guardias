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
      const inicio = new Date(novedad.fechaInicio);
        const fin = new Date(novedad.fechaFinal);

        const inicioMes = inicio.getMonth() + 1;
        const inicioAnio = inicio.getFullYear();
        const finMes = fin.getMonth() + 1;
        const finAnio = fin.getFullYear();

        const selectedMonth = this.month;
        const selectedYear = this.year;

        console.log("###inicioMes: ", inicioMes);
        console.log("###inicioAnio: ", inicioAnio);
        console.log("###finMes: ", finMes);
        console.log("###finAnio: ", finAnio);
        console.log("###selectedMonth: %%%%%%%%%%%%% TOMA EL MES ANTERIOR.... CORREGIR y para anio NO FUNCIONA INTENTAR MOSTRAR NOVEDAD 1 ", selectedMonth);
        console.log("###selectedYear: ", selectedYear);

        return (
            ((inicioAnio < selectedYear) || (inicioAnio === selectedYear && inicioMes <= selectedMonth)) &&
            ((finAnio > selectedYear) || (finAnio === selectedYear && finMes >= selectedMonth)) &&
            novedad.actual
        );
    });
  }
}