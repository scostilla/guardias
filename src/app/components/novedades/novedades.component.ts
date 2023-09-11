import { Component } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { PopupNovedadAgregarComponent} from '../popup-novedad-agregar/popup-novedad-agregar.component';


export interface PeriodicElement {
  cat: string;
  act: string;
  detalle: string;
  edit: any;
  ver: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
{cat: 'Digesto', act: '24/07/2023', detalle: 'Circular N° 11: Ajustes guardias contra factura 1° y 2° corte - Mayo 2023', edit: '', ver: '/digesto'},
{cat: 'Digesto', act: '17/07/2023', detalle: 'Circular N° 10: Rectificativa circular N° 2 - Guardias contra factura', edit: '', ver: '/digesto'},
{cat: 'Novedad', act: '11/07/2023', detalle: 'Se ha modificado tu contraseña.', edit: '', ver: '#'},
{cat: 'Digesto', act: '10/11/2016', detalle: 'Decreto N° 2423: Implementación de Sistema de Guardias Pasivas en distintos establecimientos del Sistema Público Provincial de Salud.', edit: '', ver: '/digesto'},
];

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.css']
})
export class NovedadesComponent {
  displayedColumns: string[] = ['cat', 'act', 'detalle', 'edit', 'ver'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(public dialog: MatDialog) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  openPopupNovedad(){
    this.dialog.open(PopupNovedadAgregarComponent, {
      width: '600px',
      disableClose: true,
    })
  }

}
