import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CronogramaFormAgregarComponent} from '../cronograma-form-agregar/cronograma-form-agregar.component';

@Component({
  selector: 'app-popup-calendario-vacio',
  templateUrl: './popup-calendario-vacio.component.html',
  styleUrls: ['./popup-calendario-vacio.component.css']
})
export class PopupCalendarioVacioComponent {
  constructor(
    public dialogReg: MatDialog,
  ){}
    openPopupAgregar(){
      this.dialogReg.open(CronogramaFormAgregarComponent, {
        width: '550px',
        disableClose: true,
      }) 
  }

}
