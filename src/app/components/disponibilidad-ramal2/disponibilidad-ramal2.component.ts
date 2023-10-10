import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupCalendarioDispComponent} from '../popup-calendario-disp/popup-calendario-disp.component';

@Component({
  selector: 'app-disponibilidad-ramal2',
  templateUrl: './disponibilidad-ramal2.component.html',
  styleUrls: ['./disponibilidad-ramal2.component.css']
})
export class DisponibilidadRamal2Component {
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
