import { Component } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: string;
  cant: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Dn. Pablo Soria', weight: 'Centro', cant: 8, symbol: ''},
  {position: 2, name: 'Materno Infantil "Dr. Hector Quintana"', weight: 'Centro', cant: 6, symbol: ''},
  {position: 3, name: 'San Roque', weight: 'Centro', cant: 14, symbol: ''},
];

/**
 * @title Basic use of `<table mat-table>`
 */

@Component({
  selector: 'app-popup-calendario-disp',
  templateUrl: './popup-calendario-disp.component.html',
  styleUrls: ['./popup-calendario-disp.component.css']
})

export class PopupCalendarioDispComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'cant', 'symbol'];
  dataSource = ELEMENT_DATA;
}
