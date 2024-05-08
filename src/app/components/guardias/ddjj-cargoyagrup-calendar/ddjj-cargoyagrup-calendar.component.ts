import { Component, OnInit, Inject } from '@angular/core';
  import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ddjj-cargoyagrup-calendar',
  templateUrl: './ddjj-cargoyagrup-calendar.component.html',
  styleUrls: ['./ddjj-cargoyagrup-calendar.component.css']
})
export class DdjjCargoyagrupCalendarComponent implements OnInit {

    diasDelMes: Date[] = [];
    mesActual!: number;
    anoActual!: number;
    registros: any[];
    constructor(
      public dialogRef: MatDialogRef<DdjjCargoyagrupCalendarComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.registros = data.registros;
    }
  
    ngOnInit(): void {
      this.mesActual = new Date().getMonth();
      this.anoActual = new Date().getFullYear();
      this.generarDiasDelMes();
    }
  
    generarDiasDelMes(): void {
      let cantidadDias = new Date(this.anoActual, this.mesActual + 1, 0).getDate();
      for (let i = 1; i <= cantidadDias; i++) {
        this.diasDelMes.push(new Date(this.anoActual, this.mesActual, i));
      }
    }
  
    calcularHoras(fechaIngreso: Date, horaIngreso: Date, fechaEgreso?: Date, horaEgreso?: Date): number | null {
      if (!fechaEgreso || !horaEgreso) {
        return null;
      }
      let inicio = new Date(fechaIngreso);
      inicio.setHours(horaIngreso.getHours(), horaIngreso.getMinutes());
      let fin = new Date(fechaEgreso);
      fin.setHours(horaEgreso.getHours(), horaEgreso.getMinutes());
      let diferencia = fin.getTime() - inicio.getTime();
      let horas = diferencia / (1000 * 60 * 60);
      return Math.round(horas * 100) / 100;
    }
  
    cerrarDialogo(): void {
      this.dialogRef.close();
    }
  }
