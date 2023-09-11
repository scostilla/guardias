import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-professional-form-edit',
  templateUrl: './professional-form-edit.component.html',
  styleUrls: ['./professional-form-edit.component.css']
})
export class ProfessionalFormEditComponent {
  hospitales:string[]= ['DN. PABLO SORIA'];
  profesional:string[]= ['FIGUEROA	ELIO','ARRAYA	PEDRO ADEMIR','MORALES	RICARDO','ALFARO	FIDEL','MARTINEZ	YANINA VANESA G.'];
  guardia:string[]= ['Cargo','Agrupacion'];
  dia:string[]= ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
  cons:string[]= ['Consultorio externo','Comisión'];
  turno:string[]= ['Mañana','Tarde'];

  selectedService: string = 'Cargo';
  selectedGuard: string = '';
  disableButton: boolean = this.selectedGuard == '';
  constructor(private http: HttpClient) {}
  options: any[] | undefined;

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.options = data;
      });
  }

}
