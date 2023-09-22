import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupCalendarioComponent} from '../popup-calendario/popup-calendario.component';
import { PopupCalendarioDisp2Component} from '../popup-calendario-disp2/popup-calendario-disp2.component';
import { PopupCalendarioVacioComponent} from '../popup-calendario-vacio/popup-calendario-vacio.component';

@Component({
  selector: 'app-cronograma-p',
  templateUrl: './cronograma-p.component.html',
  styleUrls: ['./cronograma-p.component.css']
})
export class CronogramaPComponent {

  constructor(
    public dialogReg: MatDialog,
  ){}


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
