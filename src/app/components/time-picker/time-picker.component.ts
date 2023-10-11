import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent {

  // propiedad de entrada  para mostrar o utilizar el valor deseado
  @Input() timeValue: string=''; 
  
  timeControl: FormControl = new FormControl();
}
