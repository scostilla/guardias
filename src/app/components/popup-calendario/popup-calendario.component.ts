import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CronogramaFormAgregarComponent} from '../cronogramas/cronograma-form-agregar/cronograma-form-agregar.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: string;
  cant: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Colque, Natalia Jimena', weight: 'Clínica', cant: 8, symbol: ''},
  {position: 2, name: 'Palazzo, Alejandro Antonio', weight: 'Cardiología', cant: 6, symbol: ''},
  {position: 3, name: 'Cura, Pablo Luis Miguel', weight: 'Cirugía', cant: 12, symbol: ''},
  {position: 4, name: 'Ramirez, Luis antonio', weight: 'Clínica', cant: 12, symbol: ''},
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
  
  constructor(
    public dialogReg: MatDialog,
  ){}
    openPopupAgregar(){
      this.dialogReg.open(CronogramaFormAgregarComponent, {
        width: '550px',
        disableClose: true,
      }) 
  }


}
