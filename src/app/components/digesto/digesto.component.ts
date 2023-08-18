import { Component } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

export interface PeriodicElement {
    guardia: string;
    cat: string;
    position: number;
    act: string;
    detalle: string;
    ver: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {guardia: 'guardia-act', position: 1, cat: 'Circular', act: '24/07/2023', detalle: 'Circular N° 11: Ajustes guardias contra factura 1° y 2° corte - Mayo 2023', ver: '/assets/digesto/CIRCULAR-11-DPH-2023.pdf'},
  {guardia: 'guardia-act', position: 2, cat: 'Circular', act: '17/07/2023', detalle: 'Circular N° 10: Rectificativa circular N° 2 - Guardias contra factura', ver: '/assets/digesto/CIRCULAR-10-2023.pdf'},
  {guardia: 'guardia-pas', position: 3, cat: 'Resolución conjunta', act: '17/07/2023', detalle: 'Resolución conjunta N° 114: necesidad de actualizar los valores del régimen de guardias brindadas en los establecimientos. Descongelamiento del valor de la Guardia Médica del Interior.', ver: '/assets/digesto/RESOL-CONJUNTA-114-SyHF-2023.pdf'},
  {guardia: 'guardia-act', position: 4, cat: 'Resolución conjunta', act: '03/07/2023', detalle: 'Resolución conjunta N° 161: en referencia a la resolución conjunta N° 114, sobre el descongelamiento del valor de la Guardia Médica del Interior.', ver: '/assets/digesto/RESOL-CONJUNTA-161-S-2023.pdf'},
];


@Component({
  selector: 'app-digesto',
  templateUrl: './digesto.component.html',
  styleUrls: ['./digesto.component.css']
})

export class DigestoComponent {
  displayedColumns: string[] = ['guardia', 'position', 'cat', 'act', 'detalle', 'ver'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
