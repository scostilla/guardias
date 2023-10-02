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
  @Input() extra: any[] = [];
  @Input() cargo: any[] = [];
  @Input() contrafactura: any[] = [];

  professionalGroups: { service: string; professionals: any[] }[] = [];
  selectedHospital: string = 'DN. PABLO SORIA';
  @Output() enableExtra: EventEmitter<{
    enableExtra: boolean;
    extraVector: any[];
  }> = new EventEmitter<{ enableExtra: boolean; extraVector: any[] }>();
  @Output() enableCargo: EventEmitter<{
    enableCargo: boolean;
    cargoVector: any[];
  }> = new EventEmitter<{ enableCargo: boolean; cargoVector: any[] }>();
  @Output() enableContrafactura: EventEmitter<{
    enableContrafactura: boolean;
    contrafacturaVector: any[];
  }> = new EventEmitter<{
    enableContrafactura: boolean;
    contrafacturaVector: any[];
  }>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.tipoGuardia !== 'pasiva') {
      this.http
        .get<any[]>('../assets/jsonFiles/hospitales.json')
        .subscribe((data) => {
          this.options = data;
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
        });

      this.http
        .get<any[]>('../assets/jsonFiles/profesionalesPasivas.json')
        .subscribe((data) => {
          this.services = data;
        });
    }
  }

  updateHospital() {
    if (this.services) {
      const filteredData = this.services.filter(
        (item) => item.hospital === this.selectedHospital
      );
      const groupedData = this.groupBy(filteredData, 'servicio');

      this.professionalGroups = Object.keys(groupedData).map((service) => ({
        service,
        professionals: groupedData[service].map((professional: any) => ({
          id: professional.id,
          apellido: professional.apellido,
          nombre: professional.nombre,
          hs: professional.cargaHoraria || null,
          type: professional.tipoGuardia,
          hospital: professional.hospital,
          servicio: professional.servicio,
          cuil: professional.cuil,
          sitRevista: professional.sitRevista,
          cat: professional.cat,
          adicional: professional.adicional || null,
          region: professional.region,
          cargoLunes: professional.cargoLunes,
          cargoMartes: professional.cargoMartes,
          cargoMiercoles: professional.cargoMiercoles,
          cargoJueves: professional.cargoJueves,
          cargoViernes: professional.cargoViernes,
          cargoSabado: professional.cargoSabado,
          cargoDomingo: professional.cargoDomingo,
          extraLunes: professional.extraLunes,
          extraMartes: professional.extraMartes,
          extraMiercoles: professional.extraMiercoles,
          extraJueves: professional.extraJueves,
          extraViernes: professional.extraViernes,
          extraSabado: professional.extraSabado,
          extraDomingo: professional.extraDomingo,
          agrupacionLunes: professional.agrupacionLunes,
          agrupacionMartes: professional.agrupacionMartes,
          agrupacionMiercoles: professional.agrupacionMiercoles,
          agrupacionJueves: professional.agrupacionJueves,
          agrupacionViernes: professional.agrupacionViernes,
          agrupacionSabado: professional.agrupacionSabado,
          agrupacionDomingo: professional.agrupacionDomingo,
          contrafacturaLunes: professional.contrafacturaLunes,
          contrafacturaMartes: professional.contrafacturaMartes,
          contrafacturaMiercoles: professional.contrafacturaMiercoles,
          contrafacturaJueves: professional.contrafacturaJueves,
          contrafacturaViernes: professional.contrafacturaViernes,
          contrafacturaSabado: professional.contrafacturaSabado,
          contrafacturaDomingo: professional.contrafacturaDomingo,
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
  }

  enbleGuardias() {
    this.enableCargo.emit({ enableCargo: false, cargoVector: [] });
    this.enableExtra.emit({ enableExtra: false, extraVector: [] });
    this.enableContrafactura.emit({
      enableContrafactura: false,
      contrafacturaVector: [],
    });

    if (this.professionalGroups) {
      this.professionalGroups.forEach((group) => {
        group.professionals.forEach((professional) => {
          switch (professional.type) {
            case 'cargo':
              this.enableCargo.emit({
                enableCargo: true,
                cargoVector: this.cargo,
              });
              break;
            case 'extra':
              this.enableExtra.emit({
                enableExtra: true,
                extraVector: this.extra,
              });
              break;
            case 'contrafactura':
              this.enableContrafactura.emit({
                enableContrafactura: true,
                contrafacturaVector: this.contrafactura,
              });
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
