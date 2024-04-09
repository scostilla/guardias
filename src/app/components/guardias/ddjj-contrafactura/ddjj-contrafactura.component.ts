import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupDdjjCfComponent} from '../../popup-ddjj-cf/popup-ddjj-cf.component';
import { PopupDdjjCfEditComponent} from '../../popup-ddjj-cf-edit/popup-ddjj-cf-edit.component';


@Component({
  selector: 'app-ddjj-contrafactura',
  templateUrl: './ddjj-contrafactura.component.html',
  styleUrls: ['./ddjj-contrafactura.component.css']
})
export class DdjjContrafacturaComponent {
  constructor(
    public dialogReg: MatDialog,
  ){}
    openPopupCf(){
      this.dialogReg.open(PopupDdjjCfComponent, {
        width: '550px',
        disableClose: true,
      }) 
  }

  openPopupCfedit(){
    this.dialogReg.open(PopupDdjjCfEditComponent, {
      width: '550px',
      disableClose: true,
    }) 
}


}
