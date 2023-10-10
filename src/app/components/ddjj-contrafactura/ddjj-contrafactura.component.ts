import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DialogData } from '../ddjj-cargoyagrup/ddjj-cargoyagrup.component';
import { PopupDdjjCfEditComponent } from '../popup-ddjj-cf-edit/popup-ddjj-cf-edit.component';
import { PopupDdjjCfComponent } from '../popup-ddjj-cf/popup-ddjj-cf.component';

@Component({
  selector: 'app-ddjj-contrafactura',
  templateUrl: './ddjj-contrafactura.component.html',
  styleUrls: ['./ddjj-contrafactura.component.css'],
})
export class DdjjContrafacturaComponent {
  profesionales: any[] = [];
  enableTotales: boolean = false;
  enableAprobada: boolean = false;
  enableRechazada: boolean = false;
  estado: string = 'pendiente';
  observ!: string;

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
        this.profesionales = JSON.parse(params['vector']);
        console.log(this.profesionales);
      }
    });
  }

  openPopupCfedit() {
    this.dialogReg.open(PopupDdjjCfEditComponent, {
      width: '550px',
      disableClose: true,
    });
  }
  btnAprobado() {
    this.enableAprobada = true;
    this.estado = 'aprobado';
  }

  btnRechazado() {
    if (this.observ) {
      this.enableRechazada = true;
      this.estado = 'rechazado';
    } else {
      this.enableRechazada = false;
      this.estado = 'pendiente';
    }
    console.log(this.enableRechazada);
  }
}
export class DialogObserv {
  constructor(
    public dialogRef: MatDialogRef<DialogObserv>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
