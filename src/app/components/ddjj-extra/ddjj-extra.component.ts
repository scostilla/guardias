import { Component } from '@angular/core';

@Component({
  selector: 'app-ddjj-extra',
  templateUrl: './ddjj-extra.component.html',
  styleUrls: ['./ddjj-extra.component.css'],
  
})
export class DdjjExtraComponent {
  displayedColumns = [
    'position',
    'servicio',
    'nya',
    'cuil',
    'vinculo',
    'categoria',
    'novedades'
  ];
  dataSource = ELEMENT_DATA;
  }

  export interface PeriodicElement {
   
    nya: string;
    position: number;
    servicio:string;
     
    cuil: number;
    vinculo: string;
    categoria:string;
    novedades:string;
  }
  
  const ELEMENT_DATA: PeriodicElement[] = [
    {position: 1, nya: 'Hydrogen', servicio:'clinica',cuil: 1.0079, vinculo: 'H',categoria:'E(J-1)',novedades:'L.A.O. Del 24 al 31-04-23'},
    {position: 2, nya: 'Helium', servicio:'clinica',cuil: 4.0026, vinculo: 'He',categoria:'E(J-1)',novedades:'L.A.O. Del 24 al 31-04-23'},
    {position: 3, nya: 'Lithium', servicio:'clinica', cuil: 6.941, vinculo: 'Li',categoria:'E(J-1)',novedades:'L.A.O. Del 24 al 31-04-23'},
    {position: 4, nya: 'Beryllium', servicio:'clinica', cuil: 9.0122, vinculo: 'Be',categoria:'E(J-1)',novedades:'L.A.O. Del 24 al 31-04-23'},
   
  ];