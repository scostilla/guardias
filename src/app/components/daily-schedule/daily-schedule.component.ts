import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { DateServiceService } from '../../services/DateService/date-service.service';

@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.css'],
})
export class DailyScheduleComponent implements OnDestroy {
  options: any[] | undefined;
  currentDate: Date | undefined;
  dateChangeSubscription: Subscription = new Subscription();
  selectedHospital: string = '';

  constructor(
    private http: HttpClient,
    private dateService: DateServiceService
  ) {
    this.dateChangeSubscription = this.dateService.dateChange$.subscribe(
      (date: Date) => {
        this.currentDate = date;
        console.log('daily-schedule: ' + this.currentDate);
      }
    );
  }

  ngOnDestroy(): void {
    this.dateChangeSubscription.unsubscribe();
  }

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.options = data;
      });
  }

  updateHospital() {
    console.log(this.selectedHospital);
  }
}
