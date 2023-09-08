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


@Component({
  selector: 'app-cronograma-form-agregar',
  templateUrl: './cronograma-form-agregar.component.html',
  styleUrls: ['./cronograma-form-agregar.component.css'],
})
export class CronogramaFormAgregarComponent {
  profs: Prof[] = [
    {value: 'steak-0', viewValue: 'Candido Perez'},
    {value: 'pizza-1', viewValue: 'María Paz Monteros'},
    {value: 'tacos-2', viewValue: 'Juana Felicitas'},
  ];

  servs: Serv[] = [
    {value: 'steak-0', viewValue: 'Clínica'},
    {value: 'pizza-1', viewValue: 'Cardiología'},
    {value: 'tacos-2', viewValue: 'Ginecología'},
  ];

}
