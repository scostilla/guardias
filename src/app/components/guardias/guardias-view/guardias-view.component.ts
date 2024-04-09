import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-guardias-view',
  templateUrl: './guardias-view.component.html',
  styleUrls: ['./guardias-view.component.css']
})
export class GuardiasViewComponent {
  services: any[] | undefined;
  options: any[] | undefined;
  professionalGroups: { service: string; professionals: any[] }[] = [];
  selectedHospital: string = 'DN. PABLO SORIA';

  constructor(
    private http: HttpClient,
  ) {
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
    //console.log('update hospital');
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
          hs: professional.hs || null,
          type: professional.tipo,
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
