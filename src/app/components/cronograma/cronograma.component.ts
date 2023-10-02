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

  profDomingo: any[] = [];
  profLunes: any[] = [];
  profMartes: any[] = [];
  profMiercoles: any[] = [];
  profJueves: any[] = [];
  profViernes: any[] = [];
  profSabado: any[] = [];

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
        this.profesionalActual = this.profesionales[0];
        console.log(this.profesionalActual);
      });
  }

  seleccionarHospital(hospital: any) {
    console.log('Hospital seleccionado:', hospital.descripcion);
    this.profesionalesFiltrados = [];

    this.profDomingo = [];
    this.profLunes = [];
    this.profMartes = [];
    this.profMiercoles = [];
    this.profJueves = [];
    this.profViernes = [];
    this.profSabado = [];

    this.hospitalSeleccionado = hospital;
    this.filtrarProfesionalesPorHospital();
    if (this.profesionalesFiltrados) {
      for (let i = 0; i < this.profesionalesFiltrados.length; i++) {
        switch(this.profesionalesFiltrados[i].tipoGuardia){
          case 'cargo':
            this.profesionalesFiltrados[i].tipoGuardia =
          'calendar-dia--text circulo--' +
          this.profesionalesFiltrados[i].tipoGuardia;
            if(this.profesionalesFiltrados[i].cargoDomingo){
              //EXTERME HARDCODE ALERT!!!!!!!!!!!!
              this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].cargoDomingo;
              this.profDomingo.push(this.profesionalesFiltrados[i]);
              break;
            }
            if(this.profesionalesFiltrados[i].cargoLunes){
              //EXTERME HARDCODE ALERT!!!!!!!!!!!!
              this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].cargoLunes;
              this.profLunes.push(this.profesionalesFiltrados[i]);
              break;
            }
            if(this.profesionalesFiltrados[i].cargoMartes){
              //EXTERME HARDCODE ALERT!!!!!!!!!!!!
              this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].cargoMartes;
              this.profMartes.push(this.profesionalesFiltrados[i]);
              break;
            }
            if(this.profesionalesFiltrados[i].cargoMiercoles){
              //EXTERME HARDCODE ALERT!!!!!!!!!!!!
              this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].cargoMiercoles;
              this.profMiercoles.push(this.profesionalesFiltrados[i]);
              break;
            }
            if(this.profesionalesFiltrados[i].cargoJueves){
              //EXTERME HARDCODE ALERT!!!!!!!!!!!!
              this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].cargoJueves;
              this.profJueves.push(this.profesionalesFiltrados[i]);
              break;
            }
            if(this.profesionalesFiltrados[i].cargoViernes){
              //EXTERME HARDCODE ALERT!!!!!!!!!!!!
              this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].cargoViernes;
              this.profViernes.push(this.profesionalesFiltrados[i]);
              break;
            }
            if(this.profesionalesFiltrados[i].cargoSabado){
              //EXTERME HARDCODE ALERT!!!!!!!!!!!!
              this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].cargoSabado;
              this.profSabado.push(this.profesionalesFiltrados[i]);
              break;
            }
          break;
          case 'extra':
            this.profesionalesFiltrados[i].tipoGuardia =
          'calendar-dia--text circulo--' +
          this.profesionalesFiltrados[i].tipoGuardia;

            if(this.profesionalesFiltrados[i].extraDomingo){
              //EXTERME HARDCODE ALERT!!!!!!!!!!!!
              this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].extraDomingo;
              this.profDomingo.push(this.profesionalesFiltrados[i]);
              break;
            }
            if(this.profesionalesFiltrados[i].extraLunes){
              //EXTERME HARDCODE ALERT!!!!!!!!!!!!
              this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].extraLunes;
              this.profLunes.push(this.profesionalesFiltrados[i]);
              break;
            }
            if(this.profesionalesFiltrados[i].extraMartes){
              //EXTERME HARDCODE ALERT!!!!!!!!!!!!
              this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].extraMartes;
              this.profMartes.push(this.profesionalesFiltrados[i]);
              break;
            }
            if(this.profesionalesFiltrados[i].extraMiercoles){
              //EXTERME HARDCODE ALERT!!!!!!!!!!!!
              this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].extraMiercoles;
              this.profMiercoles.push(this.profesionalesFiltrados[i]);
              break;
            }
            if(this.profesionalesFiltrados[i].extraJueves){
              //EXTERME HARDCODE ALERT!!!!!!!!!!!!
              this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].extraJueves;
              this.profJueves.push(this.profesionalesFiltrados[i]);

              break;
            }
            if(this.profesionalesFiltrados[i].extraViernes){
              //EXTERME HARDCODE ALERT!!!!!!!!!!!!
              this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].extraViernes;
              this.profViernes.push(this.profesionalesFiltrados[i]);
              break;
            }
            if(this.profesionalesFiltrados[i].extraSabado)
            {
              //EXTERME HARDCODE ALERT!!!!!!!!!!!!
              this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].extraSabado;
              this.profSabado.push(this.profesionalesFiltrados[i]);
              break;
            }
          break;
          case 'agrupacion':
            this.profesionalesFiltrados[i].tipoGuardia =
          'calendar-dia--text circulo--' +
          this.profesionalesFiltrados[i].tipoGuardia;
          if(this.profesionalesFiltrados[i].agrupacionDomingo){
            //EXTERME HARDCODE ALERT!!!!!!!!!!!!
            this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].agrupacionDomingo;
            this.profDomingo.push(this.profesionalesFiltrados[i]);
            break;
          }
          if(this.profesionalesFiltrados[i].agrupacionLunes){
            //EXTERME HARDCODE ALERT!!!!!!!!!!!!
            this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].agrupacionLunes;
            this.profLunes.push(this.profesionalesFiltrados[i]);
            break;
          }
          if(this.profesionalesFiltrados[i].agrupacionMartes){
            //EXTERME HARDCODE ALERT!!!!!!!!!!!!
            this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].agrupacionMartes;
            this.profMartes.push(this.profesionalesFiltrados[i]);
            break;
          }
          if(this.profesionalesFiltrados[i].agrupacionMiercoles){
            //EXTERME HARDCODE ALERT!!!!!!!!!!!!
            this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].agrupacionMiercoles;
            this.profMiercoles.push(this.profesionalesFiltrados[i]);
            break;
          }
          if(this.profesionalesFiltrados[i].agrupacionJueves){
            //EXTERME HARDCODE ALERT!!!!!!!!!!!!
            this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].agrupacionJueves;
            this.profJueves.push(this.profesionalesFiltrados[i]);
            break;
          }
          if(this.profesionalesFiltrados[i].agrupacionViernes){
            //EXTERME HARDCODE ALERT!!!!!!!!!!!!
            this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].agrupacionViernes;
            this.profViernes.push(this.profesionalesFiltrados[i]);
            break;
          }
          if(this.profesionalesFiltrados[i].agrupacionSabado){
            //EXTERME HARDCODE ALERT!!!!!!!!!!!!
            this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].agrupacionSabado;
            this.profSabado.push(this.profesionalesFiltrados[i]);
            break;
          }
          break;
          case 'Contrafactura':
            this.profesionalesFiltrados[i].tipoGuardia =
          'calendar-dia--text circulo--' +
          this.profesionalesFiltrados[i].tipoGuardia;
          if(this.profesionalesFiltrados[i].contrafacturaDomingo){
            //EXTERME HARDCODE ALERT!!!!!!!!!!!!
            this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].contrafacturaDomingo;
            this.profDomingo.push(this.profesionalesFiltrados[i]);
            break;
          }
          if(this.profesionalesFiltrados[i].contrafacturaLunes){
            //EXTERME HARDCODE ALERT!!!!!!!!!!!!
            this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].contrafacturaLunes;
            this.profLunes.push(this.profesionalesFiltrados[i]);
            break;
          }
          if(this.profesionalesFiltrados[i].contrafacturaMartes){
            //EXTERME HARDCODE ALERT!!!!!!!!!!!!
            this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].contrafacturaMartes;
            this.profMartes.push(this.profesionalesFiltrados[i]);
            break;
          }
          if(this.profesionalesFiltrados[i].contrafacturaMiercoles){
            //EXTERME HARDCODE ALERT!!!!!!!!!!!!
            this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].contrafacturaMiercoles;
            this.profMiercoles.push(this.profesionalesFiltrados[i]);
            break;
          }
          if(this.profesionalesFiltrados[i].contrafacturaJueves){
            //EXTERME HARDCODE ALERT!!!!!!!!!!!!
            this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].contrafacturaJueves;
            this.profJueves.push(this.profesionalesFiltrados[i]);
            break;
          }
          if(this.profesionalesFiltrados[i].contrafacturaViernes){
            //EXTERME HARDCODE ALERT!!!!!!!!!!!!
            this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].contrafacturaViernes;
            this.profViernes.push(this.profesionalesFiltrados[i]);
            break;
          }
          if(this.profesionalesFiltrados[i].contrafacturaSabado){
            //EXTERME HARDCODE ALERT!!!!!!!!!!!!
            this.profesionalesFiltrados[i].cargaHoraria = this.profesionalesFiltrados[i].contrafacturaSabado;
            this.profSabado.push(this.profesionalesFiltrados[i]);
            break;
          }
          break;
        }
      }
    }



  }

  filtrarProfesionalesPorHospital() {
    if (this.profesionales) {
      this.profesionalesFiltrados = this.profesionales.filter((profesional) => {
        return profesional.hospital == this.hospitalSeleccionado.descripcion;
      });
      console.log(this.profesionalesFiltrados);
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
