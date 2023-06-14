import { Component, Input } from '@angular/core';
import { DateServiceService } from '../../services/DateService/date-service.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  @Input() isReadOnly: Boolean = false;
  selectedDate: Date = new Date();
  dateValue: string = '';

  constructor(private dateService: DateServiceService) {}

  currentDate: string = new Date().toLocaleDateString('ea-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  changeDate(event: any) {
    this.selectedDate = event.value;
    this.dateValue = this.selectedDate
      ? this.selectedDate.toLocaleDateString('ea-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '';

    if (this.dateValue) {
      const dateParts = event.value.toLocaleDateString('ea-AR').split('/');
      this.dateValue = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`;
    } else {
      this.dateValue = '';
    }
    console.log('date: ' + this.dateValue);
    this.dateService.emitDateChange(this.selectedDate);
  }
}
