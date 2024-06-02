import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { RegistroMensual } from 'src/app/models/RegistroMensual';

@Component({
  selector: 'app-ddjj-extra-detail',
  templateUrl: './ddjj-extra-detail.component.html',
  styleUrls: ['./ddjj-extra-detail.component.css']
})
export class DdjjExtraDetailComponent {

  asistencial!: Asistencial;
  month: number;
  year: number;
  registroMensual!: RegistroMensual;

  constructor(
    public dialogRef: MatDialogRef<DdjjExtraDetailComponent>,
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

  formatDate(startDate: Date, endDate: Date): string {
    const formattedStartDate = moment(startDate).format('DD/MM/YYYY');
    const formattedEndDate = moment(endDate).format('DD/MM/YYYY');
  
    if (formattedStartDate === formattedEndDate) {
      return formattedStartDate;
    } else {
      return `${formattedStartDate} - ${formattedEndDate}`;
    }
  }
    
  cerrar(): void {
    this.dialogRef.close();
  }
}
