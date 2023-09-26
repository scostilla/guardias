import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupCalendarioDispComponent} from '../popup-calendario-disp/popup-calendario-disp.component';

@Component({
  selector: 'app-disponibilidad',
  templateUrl: './disponibilidad.component.html',
  styleUrls: ['./disponibilidad.component.css']
})
export class DisponibilidadComponent {
  constructor(
    public dialogReg: MatDialog,
  ){}
  openPopupCalendarioDisp(){
    this.dialogReg.open(PopupCalendarioDispComponent, {
      width: '600px',
      disableClose: true,
    })
}
}
