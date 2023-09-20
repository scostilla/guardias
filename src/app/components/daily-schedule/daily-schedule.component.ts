import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.css'],
})
export class DailyScheduleComponent {
  @Input() tipoGuardia?: string;
  services: any[] | undefined;
  options: any[] | undefined;
  professionalGroups: { service: string; professionals: any[] }[] = [];
  selectedHospital: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.tipoGuardia !== 'pasiva') {
      this.http
        .get<any[]>('../assets/jsonFiles/hospitales.json')
        .subscribe((data) => {
          this.options = data;
          console.log(this.options);

        });

      this.http
        .get<any[]>('../assets/jsonFiles/profesionales.json')
        .subscribe((data) => {
          this.services = data.filter(
            (profesional) => profesional.tipoGuardia !== 'pasiva'
          );
        });
    } else {
      this.http
        .get<any[]>('../assets/jsonFiles/hospitales.json')
        .subscribe((data) => {
          this.options = data.filter((options) => options.pasivas == true);
          console.log(this.options);
        });

      this.http
        .get<any[]>('../assets/jsonFiles/profesionales.json')
        .subscribe((data) => {
          this.services = data.filter(
            (profesional) => profesional.tipoGuardia == 'pasiva'
          );
        });
    }
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
          hs: professional.cargaHoraria || null,
          type: professional.tipoGuardia,
        })),
      }));
      console.log(this.professionalGroups);
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
