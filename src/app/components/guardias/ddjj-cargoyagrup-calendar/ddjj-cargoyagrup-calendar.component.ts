import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ddjj-cargoyagrup-calendar',
  templateUrl: './ddjj-cargoyagrup-calendar.component.html',
  styleUrls: ['./ddjj-cargoyagrup-calendar.component.css']
})
export class DdjjCargoyagrupCalendarComponent implements OnInit {
  diasEnMes?: moment.Moment[];
  totalHoras?: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DdjjCargoyagrupCalendarComponent>) { }

  ngOnInit(): void {
    moment.locale('es');
    this.generarDiasDelMes();
  }

  generarDiasDelMes(): void {
    this.diasEnMes = [];
    const startOfMonth = moment([2024, 4, 1]); // Mayo 2024
    const endOfMonth = startOfMonth.clone().endOf('month');

    let day = startOfMonth;

    while(day <= endOfMonth) {
      this.diasEnMes.push(day.clone());
      day.add(1, 'day');
    }
  }

  calcularTotalHoras(fecha: moment.Moment): string {
    if (this.data.fechaEgreso && this.data.horaEgreso) {
      const inicio = moment(this.data.fechaIngreso + 'T' + this.data.horaIngreso);
      const fin = moment(this.data.fechaEgreso + 'T' + this.data.horaEgreso);
      const duracion = fin.diff(inicio, 'hours', true);
  
      return Math.round(duracion).toString();
    } else {
      return "Falta Egreso";
    }
  }

  getColor(fecha: moment.Moment): string {
    if (fecha.isSame(this.data.fechaIngreso, 'day')) {
      return this.data.tipoGuardia === 1 ? '#91A8DA' : this.data.tipoGuardia === 2 ? '#F4AF88' : '';
    }
    return '';
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}