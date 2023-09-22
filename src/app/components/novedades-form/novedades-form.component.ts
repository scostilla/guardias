import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-novedades-form',
  templateUrl: './novedades-form.component.html',
  styleUrls: ['./novedades-form.component.css'],
})
export class NovedadesFormComponent {
  //hospitales:string[]= ['DN. PABLO SORIA'];
  //profesional:string[]= ['FIGUEROA	ELIO','ARRAYA	PEDRO ADEMIR','MORALES	RICARDO','ALFARO	FIDEL','MARTINEZ	YANINA VANESA G.'];
  //novedad:string[]=['Compensatorio','L.A.O.','Maternidad','Parte de Enfermo','Familiar Enfermo','Falta sin aviso']
  hospitales: any;
  selectedHospital?: any;
  profesionales: any;
  licencias: any;
  novedadesForm: any;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.novedadesForm = this.fb.group({
      hospital: ['', Validators.required],
      profesional: ['', Validators.required],
      novedad: ['', Validators.required],
      fecInicio: ['', Validators.required],
      fecFin: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.hospitales = data;
      });

    this.http
      .get<any[]>('../assets/jsonFiles/licencias.json')
      .subscribe((data) => {
        this.licencias = data;
      });
  }

  onHospitalSelectionChange(event: any) {
    this.selectedHospital = event.value;

    if (this.selectedHospital) {
        this.http
          .get<any[]>('../assets/jsonFiles/profesionales.json')
          .subscribe((data) => {
            this.profesionales = data.filter(
              (element) => element.hospital == this.selectedHospital.descripcion
            );
          });
    } else {
      this.profesionales = [];
    }
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
