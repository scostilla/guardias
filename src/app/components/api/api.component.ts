import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
/* const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.css'],
  standalone: true,
  imports: [MatTableModule, MatSortModule],
}) */
export class ApiComponent {
  date = '2023-07-21T13:59:31.238Z'; }
/*
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private _liveAnnouncer: LiveAnnouncer) {} */

  /* @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
 */
  /** Announce the change in sort state for assistive technology. */
  /* announceSortChange(sortState: Sort) {
   */  // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    /* if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    } 
  }
  */

  

  /* esto deberia ser un array q tenga cargado todos las fechas de determinado mes */


 /*  displayedColumns: string[] = ['1','2','3','4','5','6'];

  dataSource = new MatTableDataSource(ELEMENT_DATA); */

  /* esto deberia se un array q tenga cargado todos los dias de determinado mes  */
 /*  columnas = [
    {titulo:"Lu", name:"lunes"},
    {titulo:"Ma", name:"martes"},
    {titulo:"Mi", name:"miercoles"},
    {titulo:"Ju", name:"jueves"},
    {titulo:"Vi", name:"viernes"},
    {titulo:"Sa", name:"sabado"}
  ] 
}*/
