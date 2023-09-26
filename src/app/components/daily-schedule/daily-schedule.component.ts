import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.css'],
})
export class DailyScheduleComponent {
  @Input() tipoGuardia?: string;
  services: any[] | undefined;
  options: any[] | undefined;
  extra: any[] = [];
cargo: any[] = [];
contrafactura: any[] = [];

  professionalGroups: { service: string; professionals: any[] }[] = [];
  selectedHospital: string = 'DN. PABLO SORIA';
  @Output() enableExtra: EventEmitter<any> = new EventEmitter<any>();
  @Output() enableCargo: EventEmitter<any> = new EventEmitter<any>();
  @Output() enableContrafactura: EventEmitter<any> = new EventEmitter<any>();

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
      console.log(this.selectedHospital);

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
      this.filtrarGuardias();
      this.enbleGuardias();
    } else {
      this.professionalGroups = [];
    }
  }

  filtrarGuardias() {
    this.extra = [];
    this.cargo = [];
    this.contrafactura = [];

    if (this.professionalGroups) {
      this.professionalGroups.forEach((group) => {
        group.professionals.forEach((professional) => {
          switch (professional.type) {
            case 'cargo':
              this.cargo.push(professional);
              break;
            case 'extra':
              this.extra.push(professional);
              break;
            case 'contrafactura':
              this.contrafactura.push(professional);
              break;
          }
        });
      });
    }
    console.log("guardias extra: ");
    console.log(this.extra);
    console.log("guardias del cargo: ");
    console.log(this.cargo);
    console.log("guardias contrafactura: ");
    console.log(this.contrafactura);
  }

  enbleGuardias() {
    this.enableCargo.emit(false);
    this.enableExtra.emit(false);
    this.enableContrafactura.emit(false);

    if (this.professionalGroups) {
      this.professionalGroups.forEach((group) => {
        group.professionals.forEach((professional) => {
          switch (professional.type) {
            case 'cargo':
              this.enableCargo.emit(true);
              break;
            case 'extra':
              this.enableExtra.emit(true);
              break;
            case 'contrafactura':
              this.enableContrafactura.emit(true);
              break;
          }
        });
      });
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
