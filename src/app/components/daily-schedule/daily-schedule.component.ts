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
  services: any[] | undefined;
  options: any[] | undefined;
  professionalGroups: { service: string; professionals: any[] }[] = [];
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
    this.http
      .get<any[]>('../assets/jsonFiles/servicios.json')
      .subscribe((data) => {
        this.services = data;
      });
  }

  updateHospital() {
    console.log('update hospital');
    if (this.services) {
      const filteredData = this.services.filter(
        (item) => item.hospital === this.selectedHospital
      );

      const groupedData = this.groupBy(filteredData, 'servicio');

      this.professionalGroups = Object.keys(groupedData).map((service) => ({
        service,
        professionals: groupedData[service].map((professional: any) => ({
          apellido: professional.apellido,
          nombre: professional.nombre,
          hs: professional.hs || null, // Si hs es vacío, se asigna null en su lugar
        })),
      }));
    } else {
      this.professionalGroups = [];
    }
  }


  private groupBy(array: any[], property: string) {
    return array.reduce((result, currentValue) => {
      const key = currentValue[property];
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(currentValue);
      return result;
    }, {});
  }
}
