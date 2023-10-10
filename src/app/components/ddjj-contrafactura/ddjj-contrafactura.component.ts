import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { PopupDdjjCfEditComponent } from '../popup-ddjj-cf-edit/popup-ddjj-cf-edit.component';
import { PopupDdjjCfComponent } from '../popup-ddjj-cf/popup-ddjj-cf.component';

export interface DialogData {
  observ: string;
}

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

  constructor(
    public dialogReg: MatDialog,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {}
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

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogObserv, {
      data: { observ: this.observ },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.observ = result;
    });
  }

  openPopupCfedit(
    apellido: string,
    nombre: string,
    cuil: string,
    compContribuyente: string,
    compFactura: string,
    compFecha: string,
    cfTotalLiq: number
  ) {
    this.dialogReg.open(PopupDdjjCfEditComponent, {
      width: '550px',
      disableClose: true,
      data: {
        apellido: apellido,
        nombre: nombre,
        cuil: cuil,
        compContribuyente: compContribuyente,
        compFactura: compFactura,
        compFecha: compFecha,
        cfTotalLiq: cfTotalLiq || 0,
      },
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

  btnPaseDPH() {
    this.enableTotales = true;
  }
}

@Component({
  selector: 'dialog-observ',
  templateUrl: 'dialog-observ.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class DialogObserv {
  constructor(
    public dialogRef: MatDialogRef<DialogObserv>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
