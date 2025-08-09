import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsistencialListForRmensualDto } from 'src/app/dto/guardias/AsistencialListForRmensualDto';
import { RegActivListDto } from 'src/app/dto/guardias/RegActivListDto';
import * as moment from 'moment';

@Component({
  selector: 'app-rmensual-cargoyagrup-detail',
  templateUrl: './rmensual-cargoyagrup-detail.component.html',
  styleUrls: ['./rmensual-cargoyagrup-detail.component.css']
})
export class RmensualCargoyagrupDetailComponent implements OnInit {
  asistencial!: AsistencialListForRmensualDto;
  registroActividad!: RegActivListDto[];
  novedadesActivas!: any[];

  constructor(
    public dialogRef: MatDialogRef<RmensualCargoyagrupDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.asistencial = data.asistencial;
    this.registroActividad = data.registroActividad;
    this.novedadesActivas = data.novedades;
  }

  ngOnInit(): void {
  }

  formatCuil(cuil: string): string {
    if (!cuil) return '';
    // Asegurarse de que sea solo números
    const clean = cuil.replace(/\D/g, '');
    if (clean.length !== 11) return cuil; // formato incorrecto, devolver tal cual
    return `${clean.substring(0, 2)}-${clean.substring(2, 10)}-${clean.substring(10)}`;
  }

  formatDate(startDate: Date, endDate: Date): string {
    const formattedStartDate = moment(startDate).format('DD/MM/YYYY');
    const formattedEndDate = moment(endDate).format('DD/MM/YYYY');
  
    return formattedStartDate === formattedEndDate
      ? formattedStartDate
      : `${formattedStartDate} - ${formattedEndDate}`;
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
