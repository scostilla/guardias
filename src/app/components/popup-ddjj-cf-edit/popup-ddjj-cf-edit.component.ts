import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-ddjj-cf-edit',
  templateUrl: './popup-ddjj-cf-edit.component.html',
  styleUrls: ['./popup-ddjj-cf-edit.component.css'],
})
export class PopupDdjjCfEditComponent {
  alert: any = '79990.97';

  compContribuyente: any;
  compFactura: any;
  compFecha: any;
  cfTotalLiq: any;
  apellido: any;
  nombre: any;
  cuil: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.apellido = data.apellido;
    this.nombre = data.nombre;
    this.cuil = data.cuil;
    this.compContribuyente = data.compContribuyente;
    this.compFactura = data.compFactura;
    this.compFecha = this.compFecha = new Date(data.compFecha);
    this.cfTotalLiq = data.cfTotalLiq;
  }
}
