import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  @Input() isReadOnly: Boolean = false;
  currentDate: string = new Date().toLocaleDateString('ea-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
