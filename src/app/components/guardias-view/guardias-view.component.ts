import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-guardias-view',
  templateUrl: './guardias-view.component.html',
  styleUrls: ['./guardias-view.component.css'],
})
export class GuardiasViewComponent {
  services: any[] | undefined;
  options: any[] | undefined;
  professionalGroups: { service: string; professionals: any[] }[] = [];
  selectedHospital: string = 'DN. PABLO SORIA';

  @Input() extra: any[] = [];
  @Input() cargo: any[] = [];
  @Input() contrafactura: any[] = [];

  enableExtra: any;
  enableCargo: any;
  enableContrafactura: any;

  constructor(private http: HttpClient) {}

  onExtraChange(eventData: { enableExtra: boolean, extraVector: any[] }) {
    this.enableExtra = eventData.enableExtra;
    this.extra = eventData.extraVector;
    console.log('EXTRA ' + this.enableExtra);
    console.log(this.extra);
  }

  onCargoChange(eventData: { enableCargo: boolean, cargoVector: any[] }) {
    this.enableCargo = eventData.enableCargo;
    this.cargo = eventData.cargoVector;
    console.log('CARGO ' + this.enableCargo);
    console.log(this.cargo);
  }

  onContrafacturaChange(eventData: { enableContrafactura: boolean, contrafacturaVector: any[] }) {
    this.enableContrafactura = eventData.enableContrafactura;
    this.contrafactura = eventData.contrafacturaVector;
    console.log('CONTRAFACTURA ' + this.enableContrafactura);
    console.log(this.contrafactura);
  }


  /*
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
  }*/
}
