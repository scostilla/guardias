import { Component } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';

export interface PeriodicElement {
  acc: string;
  date: string;
  seccion: string;
  user: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
{date: '12/07/2023', acc: 'Modificacion', seccion: '/Cronograma', user: ''},
{date: '01/08/2023', acc: 'Agregar', seccion: '/Cronograma ', user: ''},
{date: '07/08/2023', acc: 'Solicitud', seccion: '/cambio-contrasena', user: ''},
];

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent {
  displayedColumns: string[] = ['date', 'acc', 'seccion', 'user'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
