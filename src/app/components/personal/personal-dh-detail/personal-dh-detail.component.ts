import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';

interface Tipos {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-personal-dh-detail',
  templateUrl: './personal-dh-detail.component.html',
  styleUrls: ['./personal-dh-detail.component.css']
})

export class PersonalDhDetailComponent {

  displayedColumns: string[] = [];
  dataSource: any[] = [];
  fechaInicioFormateada!: string;

  tipos: Tipos[] = [
    { value: 'PASE_DE_SALA', viewValue: 'Pase de sala' },
    { value: 'ATENEO', viewValue: 'Ateneo' },
    { value: 'CONSULTORIO_EN_CAPS', viewValue: 'Consultorio en CAPS' },
    { value: 'OTROS', viewValue: 'Otros' },
  ];

  constructor(
    public dialogRef: MatDialogRef<PersonalDhDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { distribuciones: any[], tipo: string, fechaInicio: string }
  ) {
    this.setColumnsBasedOnTipo(data.tipo);
this.dataSource = data.distribuciones.map(d => ({
  ...d,
  horaIngreso: moment(d.horaIngreso, 'HH:mm:ss').format('HH:mm'),
  fechaInicio: moment(d.fechaInicio).toDate(),
  fechaFinalizacion: moment(d.fechaFinalizacion).toDate(),
  cantidadHoras: data.tipo === 'consultorio'
    ? this.convertirDecimalAHorasYMinutos(d.cantidadHoras)
    : d.cantidadHoras
}));

    this.fechaInicioFormateada = this.formatearFecha(data.fechaInicio);
  }

// Método para formatear la fecha (solo con mes y año)
formatearFecha(fechaInicio: string): string {
  // Asumimos que fechaInicio está en formato "MM-YYYY"
  const [mes, anio] = fechaInicio.split('-');

  // Usamos moment para formatear correctamente el mes y año, sin necesidad de agregar el día.
  return moment(`${anio}-${mes}`, 'YYYY-MM').format('MMMM YYYY'); // Formatea a "Enero 2024"
}

private convertirDecimalAHorasYMinutos(decimal: number): string {
  const horas = Math.floor(decimal);
  const minutos = Math.round((decimal - horas) * 60);

  return minutos === 0
    ? `${horas}`
    : `${horas}:${minutos.toString().padStart(2, '0')}`;
}

  // Establece las columnas a mostrar según el tipo de distribución
  setColumnsBasedOnTipo(tipo: string): void {
    switch (tipo) {
      case 'guardia':
        this.displayedColumns = ['dia', 'horaIngreso', 'servicio', 'tipoGuardia', 'cantidadHoras', 'fechas'];
        break;
      case 'consultorio':
        this.displayedColumns = ['dia', 'horaIngreso', 'servicio', 'tipoConsultorio', 'cantidadHoras', 'fechas'];
        break;
      case 'gira':
        this.displayedColumns = ['dia', 'horaIngreso', 'puestoSalud', 'cantidadHoras', 'fechas'];
        break;
      case 'otro':
        this.displayedColumns = ['dia', 'horaIngreso', 'tipo', 'descripcion', 'lugar', 'cantidadHoras', 'fechas'];
        break;
      default:
        this.displayedColumns = ['dia', 'horaIngreso', 'cantidadHoras', 'fechas'];  // En caso de un tipo no reconocido
    }
  }

  getTipoViewValue(value: string): string {
  return this.tipos.find(t => t.value === value)?.viewValue || value;
  }

  cerrar(): void {
    this.dialogRef.close();
  }

}