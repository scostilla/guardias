import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-novedades-form',
  templateUrl: './novedades-form.component.html',
  styleUrls: ['./novedades-form.component.css'],
})
export class NovedadesFormComponent {
  hospitales:string[]= ['DN. PABLO SORIA'];
  profesional:string[]= ['FIGUEROA	ELIO','ARRAYA	PEDRO ADEMIR','MORALES	RICARDO','ALFARO	FIDEL','MARTINEZ	YANINA VANESA G.'];
  novedad:string[]=['Compensatorio','L.A.O.','Maternidad','Parte de Enfermo','Familiar Enfermo','Falta sin aviso'];
  novedadesForm:FormGroup;

  constructor(
    private fb:FormBuilder,
  ){
    this.novedadesForm = this.fb.group({
      hospital: ['', Validators.required],
      profesional: ['', Validators.required],
      novedad: ['', Validators.required],
      fecInicio: ['', Validators.required],
      fecFin: ['', Validators.required],

    });
  }
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
