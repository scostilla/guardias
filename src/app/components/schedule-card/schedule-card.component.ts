import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-schedule-card',
  templateUrl: './schedule-card.component.html',
  styleUrls: ['./schedule-card.component.css']
})
export class ScheduleCardComponent {
  @Input() service: string='';
  @Input() professional: string='';
  @Input() hours: string='';
  @Input() type: string='';

}
