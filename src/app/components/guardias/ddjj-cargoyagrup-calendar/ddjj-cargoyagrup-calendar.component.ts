import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ddjj-cargoyagrup-calendar',
  templateUrl: './ddjj-cargoyagrup-calendar.component.html',
  styleUrls: ['./ddjj-cargoyagrup-calendar.component.css']
})
export class DdjjCargoyagrupCalendarComponent implements OnInit {
  fechaIngreso: Date | null = null;
  horaIngreso: string | null = null;
  fechaEgreso: Date | null = null;
  horaEgreso: string | null = null;
  totalHoras: number | null = null;
  diasEnMes: Date[] = [];
  nombreAsistencial: string | null = null;
  apellidoAsistencial: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<DdjjCargoyagrupCalendarComponent>,
    @Inject(LOCALE_ID) private locale: string,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.fechaIngreso = data.fechaIngreso;
      this.horaIngreso = data.horaIngreso;
      this.nombreAsistencial = data.nombreAsistencial;
      this.apellidoAsistencial = data.apellidoAsistencial;
    }
  }
  
    ngOnInit() {
      this.generarDiasDelMes(5, 2024); // Mayo de 2024
      this.calcularHoras();
    }
  
    generarDiasDelMes(mes: number, año: number) {
      let fecha = new Date(año, mes - 1, 1);
      while (fecha.getMonth() === mes - 1) {
        this.diasEnMes.push(new Date(fecha));
        fecha.setDate(fecha.getDate() + 1);
      }
    }
  
    calcularHoras() {
      if (this.fechaIngreso && this.horaIngreso && this.fechaEgreso && this.horaEgreso) {
        // Parsear las horas de ingreso y egreso
        const [horasIngreso, minutosIngreso] = this.horaIngreso.split(':').map(Number);
        const [horasEgreso, minutosEgreso] = this.horaEgreso.split(':').map(Number);
    
        // Crear objetos de fecha con las horas exactas
        const inicio = new Date(this.fechaIngreso);
        inicio.setHours(horasIngreso, minutosIngreso, 0, 0);
        const fin = new Date(this.fechaEgreso);
        fin.setHours(horasEgreso, minutosEgreso, 0, 0);
    
        // Calcular la diferencia en milisegundos y convertir a horas
        const diferencia = fin.getTime() - inicio.getTime();
        this.totalHoras = diferencia / (1000 * 60 * 60);
      }
    }
    
    compararFechas(fecha1: Date | null, fecha2: Date | null): boolean {
      if (!fecha1 || !fecha2) {
        return false; 
      }
      const f1 = new Date(fecha1);
      f1.setHours(0, 0, 0, 0);
      const f2 = new Date(fecha2);
      f2.setHours(0, 0, 0, 0);
      return f1.getTime() === f2.getTime();
    }

    cerrar(): void {
      this.dialogRef.close();
    }
  
  }