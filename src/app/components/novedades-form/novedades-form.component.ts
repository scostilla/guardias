import { Component } from '@angular/core';


@Component({
  selector: 'app-novedades-form',
  templateUrl: './novedades-form.component.html',
  styleUrls: ['./novedades-form.component.css'],
})
export class NovedadesFormComponent {
  hospitales:string[]= ['DN. PABLO SORIA'];
  profesional:string[]= ['FIGUEROA	ELIO','ARRAYA	PEDRO ADEMIR','MORALES	RICARDO','ALFARO	FIDEL','MARTINEZ	YANINA VANESA G.'];
  novedad:string[]=['Compensatorio','L.A.O.','Maternidad','Parte de Enfermo','Familiar Enfermo','Falta sin aviso']
  /*
  selectedService: string = 'Compensatorio';
  selectedGuard: string = '';
  disableButton: boolean = this.selectedGuard == '';
  options: any[] | undefined;

  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.options = data;
      });
  }
  */
}
