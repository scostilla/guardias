import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupCalendarioDisp2Component } from '../popup-calendario-disp2/popup-calendario-disp2.component';
import { PopupCalendarioVacioComponent } from '../popup-calendario-vacio/popup-calendario-vacio.component';
import { PopupCalendarioComponent } from '../popup-calendario/popup-calendario.component';

@Component({
  selector: 'app-cronograma-p',
  templateUrl: './cronograma-p.component.html',
  styleUrls: ['./cronograma-p.component.css'],
})
export class CronogramaPComponent {
  profesionales?: any[];
  hospitales?: any[];
  profesionalesFiltrados?: any[];

  profDomingo: any[] = [];
  profLunes: any[] = [];
  profMartes: any[] = [];
  profMiercoles: any[] = [];
  profJueves: any[] = [];
  profViernes: any[] = [];
  profSabado: any[] = [];

  hospitalSeleccionado: any;
  profesionalActual: any;

  constructor(private http: HttpClient, public dialogReg: MatDialog) {}

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.hospitales = data.filter((options) => options.pasivas == true);
        this.hospitalSeleccionado = this.hospitales[1];
        this.filtratPorGuardia();
      });

    this.http
      .get<any[]>('../assets/jsonFiles/profesionalesPasivas.json')
      .subscribe((data) => {
        this.profesionales = data;
      });
  }

  seleccionarHospital(hospital: any) {
    this.hospitalSeleccionado = hospital;
    if (this.profesionales) {
      this.profesionalesFiltrados = this.profesionales.filter((profesional) => {
        return profesional.hospital == this.hospitalSeleccionado.descripcion;
      });
      this.filtratPorGuardia();
    }
  }

  filtratPorGuardia() {
    this.profesionalesFiltrados = [];

    this.profDomingo = [];
    this.profLunes = [];
    this.profMartes = [];
    this.profMiercoles = [];
    this.profJueves = [];
    this.profViernes = [];
    this.profSabado = [];
    this.filtrarProfesionalesPorHospital();

    if (this.profesionalesFiltrados) {
      for (let i = 0; i < this.profesionalesFiltrados.length; i++) {
        if(this.profesionalesFiltrados[i].pasivaDomingo){
          //EXTERME HARDCODE ALERT!!!!!!!!!!!!
          this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].pasivaDomingo;
          this.profDomingo.push(this.profesionalesFiltrados[i]);
        }

        if(this.profesionalesFiltrados[i].pasivaLunes){
          //EXTERME HARDCODE ALERT!!!!!!!!!!!!
          this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].pasivaLunes;
          this.profLunes.push(this.profesionalesFiltrados[i]);
        }

        if(this.profesionalesFiltrados[i].pasivaMartes){
          //EXTERME HARDCODE ALERT!!!!!!!!!!!!
          this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].pasivaMartes;
          this.profMartes.push(this.profesionalesFiltrados[i]);
        }

        if(this.profesionalesFiltrados[i].pasivaMiercoles){
          //EXTERME HARDCODE ALERT!!!!!!!!!!!!
          this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].pasivaMiercoles;
          this.profMiercoles.push(this.profesionalesFiltrados[i]);
        }

        if(this.profesionalesFiltrados[i].pasivaJueves){
          //EXTERME HARDCODE ALERT!!!!!!!!!!!!
          this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].pasivaJueves;
          this.profJueves.push(this.profesionalesFiltrados[i]);
        }

        if(this.profesionalesFiltrados[i].pasivaViernes){
          //EXTERME HARDCODE ALERT!!!!!!!!!!!!
          this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].pasivaViernes;
          this.profViernes.push(this.profesionalesFiltrados[i]);
        }

        if(this.profesionalesFiltrados[i].pasivaSabado){
          //EXTERME HARDCODE ALERT!!!!!!!!!!!!
          this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].pasivaSabado;
          this.profSabado.push(this.profesionalesFiltrados[i]);
        }
      }
    }
  }

  filtrarProfesionalesPorHospital() {
    if (this.profesionales) {
      this.profesionalesFiltrados = this.profesionales.filter((profesional) => {
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
