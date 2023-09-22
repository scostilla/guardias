import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupCalendarioDisp2Component } from '../popup-calendario-disp2/popup-calendario-disp2.component';
import { PopupCalendarioVacioComponent } from '../popup-calendario-vacio/popup-calendario-vacio.component';
import { PopupCalendarioComponent } from '../popup-calendario/popup-calendario.component';

@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.css'],
})
export class CronogramaComponent {
  /* date = '2023-07-21T13:59:31.238Z';  */

  today: number = new Date(2023, 7, 0).getDate(); //31
  numberOfMonth: Array<number> = new Array<number>();

  daysOfMonth: Array<Date> = new Array<Date>();
  profesionales?: any[];
  hospitales?: any[];
  profesionalesFiltrados?: any[];
  hospitalSeleccionado: any;
  profesionalActual: any;
  class?: string;

  constructor(public dialogReg: MatDialog, private http: HttpClient) {
    for (var dia = 1; dia <= this.today; dia++) {
      this.numberOfMonth.push(dia);
    }

    for (var di = 1; di <= this.numberOfMonth.length; di++) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const especificDate = new Date(year, month, di);
      this.daysOfMonth.push(especificDate);
    }
  }

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.hospitales = data;
        this.hospitalSeleccionado = this.hospitales[3];
        this.filtrarProfesionalesPorHospital();
      });

    this.http
      .get<any[]>('../assets/jsonFiles/profesionales.json')
      .subscribe((data) => {
        this.profesionales = data;
      });

    this.http
      .get<any[]>('../assets/jsonFiles/profesionales.json')
      .subscribe((data) => {
        this.profesionales = data;
        this.profesionalActual = this.profesionales[0];
      });
  }

  seleccionarHospital(hospital: any) {
    console.log('Hospital seleccionado:', hospital.descripcion);
    this.profesionalesFiltrados = [];
    this.hospitalSeleccionado = hospital;
    this.filtrarProfesionalesPorHospital();
    if (this.profesionalesFiltrados) {
      for (let i = 0; i < this.profesionalesFiltrados.length; i++) {
        console.log(this.profesionalesFiltrados[i].tipoGuardia);
        this.profesionalesFiltrados[i].tipoGuardia =
          'calendar-dia--text circulo--' +
          this.profesionalesFiltrados[i].tipoGuardia;
      }
    }
  }

  filtrarProfesionalesPorHospital() {
    if (this.profesionales) {
      this.profesionalesFiltrados = this.profesionales.filter((profesional) => {
        console.log(this.profesionalesFiltrados);
        return profesional.hospital == this.hospitalSeleccionado.descripcion;
      });
    }
  }

  openPopupCalendario() {
    this.dialogReg.open(PopupCalendarioComponent, {
      width: '600px',
      disableClose: true,
    });
  }
  openPopupCalendarioDisp2() {
    this.dialogReg.open(PopupCalendarioDisp2Component, {
      width: '600px',
      disableClose: true,
    });
  }
  openPopupCalendarioVacio() {
    this.dialogReg.open(PopupCalendarioVacioComponent, {
      width: '600px',
      disableClose: true,
    });
  }
}
