
import { Component } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {

  hospitales = 25;
  medicos = 6;
  guardiasImpagas = 2;

  // Paleta pastel
  readonly pastelColors = {
    azul: '#7986cb',
    verde: '#4db6ac',
    naranja: '#ffb74d',
    rojo: '#e57373'
  };


  // ===== GRÁFICO DE BARRAS =====
barChartData: ChartData<'bar'> = {
  labels: ['Wenseslao Wallardo', 'Zabala', 'CEN'],
  datasets: [
    {
      label: 'CARGO',
      data: [120, 90, 110],
      backgroundColor: this.pastelColors.azul
    },
    {
      label: 'AGRUPACION',
      data: [80, 60, 70],
      backgroundColor: this.pastelColors.verde
    },
    {
      label: 'EXTRA',
      data: [45, 40, 55],
      backgroundColor: this.pastelColors.naranja
    },
    {
      label: 'CONTRAFACTURA',
      data: [30, 20, 25],
      backgroundColor: this.pastelColors.rojo
    }
  ]
};

barChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    x: {},
    y: {
      beginAtZero: true
    }
  }
};

  // ===== GRÁFICO DE TORTA =====
pieChartData: ChartData<'pie'> = {
  labels: ['CARGO', 'AGRUPACION', 'EXTRA', 'CONTRAFACTURA'],
  datasets: [
    {
      data: [320, 210, 140, 75],
      backgroundColor: [
        this.pastelColors.azul,
        this.pastelColors.verde,
        this.pastelColors.naranja,
        this.pastelColors.rojo
      ]
    }
  ]
};

pieChartOptions: ChartOptions<'pie'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
};
}
