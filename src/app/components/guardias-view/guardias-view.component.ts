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

  onExtraChange(eventData: { enableExtra: boolean; extraVector: any[] }) {
    this.enableExtra = eventData.enableExtra;
    this.extra = eventData.extraVector;
  }

  onCargoChange(eventData: { enableCargo: boolean; cargoVector: any[] }) {
    this.enableCargo = eventData.enableCargo;
    this.cargo = eventData.cargoVector;
  }

  onContrafacturaChange(eventData: {
    enableContrafactura: boolean;
    contrafacturaVector: any[];
  }) {
    this.enableContrafactura = eventData.enableContrafactura;
    this.contrafactura = eventData.contrafacturaVector;
  }
}
