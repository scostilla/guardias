import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: string;
  cant: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Perez, Cándido', weight: 'Clínica', cant: 8, symbol: ''},
  {position: 2, name: 'Monteros, María Paz', weight: 'Ginecología', cant: 6, symbol: ''},
  {position: 3, name: 'Felicitas, Juana', weight: 'Ginecología', cant: 14, symbol: ''},
];

/**
 * @title Basic use of `<table mat-table>`
 */

@Component({
  selector: 'app-popup-calendario',
  templateUrl: './popup-calendario.component.html',
  styleUrls: ['./popup-calendario.component.css'],
 
})
export class PopupCalendarioComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'cant', 'symbol'];
  dataSource = ELEMENT_DATA;
}
