import { Component } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {

  selectedDate: Date;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(private datePipe: DatePipe) {
    this.bsConfig = {
      containerClass: 'theme-default'
    };
    this.selectedDate = new Date(); // Ejemplo de inicialización con la fecha actual
  }
}
