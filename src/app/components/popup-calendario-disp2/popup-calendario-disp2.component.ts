import { Component } from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: string;
  cant: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Medina, Lucia', weight: 'Clínica', cant: 12, symbol: ''},
  {position: 2, name: 'Quintero, Juan', weight: 'Cardiología', cant: 8, symbol: ''},
];

/**
 * @title Basic use of `<table mat-table>`
 */

@Component({
  selector: 'app-popup-calendario-disp2',
  templateUrl: './popup-calendario-disp2.component.html',
  styleUrls: ['./popup-calendario-disp2.component.css']
})

export class PopupCalendarioDisp2Component {
  displayedColumns: string[] = ['position', 'name', 'weight', 'cant', 'symbol'];
  dataSource = ELEMENT_DATA;
}