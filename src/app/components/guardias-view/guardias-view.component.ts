import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

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
  region: string = '';

  @Input() extra: any[] = [];
  @Input() cargo: any[] = [];
  @Input() contrafactura: any[] = [];
  vector: any[] = [];

  enableExtra: any;
  enableCargo: any;
  enableContrafactura: any;

  constructor(private http: HttpClient, private router: Router) {}

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

  sendAndRedirect(value: string) {
    let url = '';

    switch (value) {
      case 'ddjjextra':
        this.vector = this.extra;
        url = '/ddjj-extra';
        break;
      case 'cargoyagrup':
        this.vector = this.cargo;
        url = '/ddjj-cargoyagrup';
        break;
      case 'contrafactura':
        this.vector = this.contrafactura;
        url = '/ddjj-contrafactura';
        break;
    }

    this.router.navigate([url], {
      queryParams: { vector: JSON.stringify(this.vector) },
    });
  }
}
