import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

interface Prof {
  value: string;
  viewValue: string;
}

interface Serv {
  value: string;
  viewValue: string;
}

interface Guard {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-cronograma-form-agregar',
  templateUrl: './cronograma-form-agregar.component.html',
  styleUrls: ['./cronograma-form-agregar.component.css'],
})
export class CronogramaFormAgregarComponent {
  profs: Prof[] = [
    {value: 'steak-0', viewValue: 'Colque, Natalia Jimena'},
    {value: 'pizza-1', viewValue: 'Palazzo, Alejandro Antonio'},
    {value: 'tacos-2', viewValue: 'Carrillo, Daniela Mercedes'},
    {value: 'tacos-3', viewValue: 'Cura, Pablo Luis Miguel'},
    {value: 'tacos-4', viewValue: 'Ramirez, Luis Antonio'},
  ];

  servs: Serv[] = [
    {value: 'steak-0', viewValue: 'Clínica'},
    {value: 'pizza-1', viewValue: 'Cardiología'},
    {value: 'tacos-2', viewValue: 'Ginecología'},
    {value: 'tacos-3', viewValue: 'Cirugia'},
    {value: 'tacos-4', viewValue: 'Oncohematología'},
  ];

  guards: Guard[] = [
    {value: 'extra', viewValue: 'Extra'},
    {value: 'cargo', viewValue: 'Cargo'},
    {value: 'agrupacion', viewValue: 'Agrupación'},
    {value: 'contrafactura', viewValue: 'Contrafactura'},
  ];

}
