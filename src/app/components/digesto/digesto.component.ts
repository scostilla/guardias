import { Component } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

export interface PeriodicElement {
    cat: string;
    position: number;
    detalle: string;
    ver: any;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, cat: 'Guardias', detalle: 'Reglamentaciones estatales.', ver: ''},
  {position: 2, cat: 'Guardias', detalle: 'Información general a nivel nacional.', ver: ''},
  {position: 3, cat: 'Ley', detalle: 'Articulos de la provincia de Jujuy.', ver: ''},
];


@Component({
  selector: 'app-digesto',
  templateUrl: './digesto.component.html',
  styleUrls: ['./digesto.component.css']
})

export class DigestoComponent {
  displayedColumns: string[] = ['position', 'cat', 'detalle', 'ver'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
