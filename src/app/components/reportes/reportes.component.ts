import { Component } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {

  hospitales = 25;
  medicos = 10;
  usuariosActivos = 6;

  // ===== BARRAS =====
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Hospital Central', 'Hospital Norte', 'Hospital Sur'],
    datasets: [
      {
        label: 'CARGO',
        data: [120, 90, 110],
        backgroundColor: '#3f51b5'
      },
      {
        label: 'AGRUPACION',
        data: [80, 60, 70],
        backgroundColor: '#009688'
      },
      {
        label: 'EXTRA',
        data: [45, 40, 55],
        backgroundColor: '#ff9800'
      },
      {
        label: 'CONTRAFACTURA',
        data: [30, 20, 25],
        backgroundColor: '#f44336'
      }
    ]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  // ===== PIE (TORTA) =====
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['CARGO', 'AGRUPACION', 'EXTRA', 'CONTRAFACTURA'],
    datasets: [
      {
        data: [320, 210, 140, 75],
        backgroundColor: [
          '#5c6bc0',
          '#26a69a',
          '#ffa726',
          '#ef5350'
        ]
      }
    ]
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };
}
