import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupCalendarioComponent} from '../popup-calendario/popup-calendario.component';
import { PopupCalendarioDisp2Component} from '../popup-calendario-disp2/popup-calendario-disp2.component';
import { PopupCalendarioVacioComponent} from '../popup-calendario-vacio/popup-calendario-vacio.component';


@Component({
  selector: 'app-cronograma',
  templateUrl: './cronograma.component.html',
  styleUrls: ['./cronograma.component.css']
})
export class CronogramaComponent {
  /* date = '2023-07-21T13:59:31.238Z';  */
  
  today:number = new Date(2023,7,0).getDate();//31
  numberOfMonth: Array<number> = new Array<number>();

  daysOfMonth: Array<Date> = new Array<Date>(); 
  
  constructor(
    public dialogReg: MatDialog,
  ){
    for (var dia = 1; dia <= this.today; dia++) {
      this.numberOfMonth.push(dia);
    }

    for (var di = 1; di <= this.numberOfMonth.length; di++) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const especificDate = new Date (year,month,di)
      this.daysOfMonth.push(especificDate);
      
    }
  }
  openPopupCalendario(){
    this.dialogReg.open(PopupCalendarioComponent, {
      width: '600px',
      disableClose: true,
    })
  }
  openPopupCalendarioDisp2(){
    this.dialogReg.open(PopupCalendarioDisp2Component, {
      width: '600px',
      disableClose: true,
    })
  }
    openPopupCalendarioVacio(){
      this.dialogReg.open(PopupCalendarioVacioComponent, {
        width: '600px',
        disableClose: true,
      }) 
  }
}


