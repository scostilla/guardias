import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PopupDdjjCfEditComponent } from '../popup-ddjj-cf-edit/popup-ddjj-cf-edit.component';
import { PopupDdjjCfComponent } from '../popup-ddjj-cf/popup-ddjj-cf.component';

@Component({
  selector: 'app-ddjj-contrafactura',
  templateUrl: './ddjj-contrafactura.component.html',
  styleUrls: ['./ddjj-contrafactura.component.css'],
})
export class DdjjContrafacturaComponent {
  profesional: any[] = [];

  constructor(public dialogReg: MatDialog, private route: ActivatedRoute) {}
  openPopupCf() {
    this.dialogReg.open(PopupDdjjCfComponent, {
      width: '550px',
      disableClose: true,
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['vector']) {
        this.profesional = JSON.parse(params['vector']);
        console.log(this.profesional);
      }
    });
  }

  openPopupCfedit() {
    this.dialogReg.open(PopupDdjjCfEditComponent, {
      width: '550px',
      disableClose: true,
    });
  }
}
