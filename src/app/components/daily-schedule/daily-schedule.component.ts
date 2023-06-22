import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.css']
})
export class DailyScheduleComponent {
  options: any[] | undefined;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('../assets/jsonFiles/hospitales.json').subscribe(data => {
      this.options = data;
    });
    console.log(this.options)
  }
}
