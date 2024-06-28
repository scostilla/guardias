import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-dist-horaria-guardia',
  templateUrl: './dist-horaria-guardia.component.html',
  styleUrls: ['./dist-horaria-guardia.component.css']
})
export class DistHorariaGuardiaComponent {
  hospitales:string[]= ['DN. PABLO SORIA'];
  profesional:string[]= ['FIGUEROA	ELIO','ARRAYA	PEDRO ADEMIR','MORALES	RICARDO','ALFARO	FIDEL','MARTINEZ	YANINA VANESA G.'];
  servicio:string[]= ['Clínica','Cardiología'];
  guardia:string[]= ['Cargo','Agrupacion'];
  dia:string[]= ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
  cons:string[]= ['Consultorio externo','Comisión'];
  turno:string[]= ['Mañana','Tarde'];

  selectedService: string = 'Cargo';
  selectedGuard: string = '';
  disableButton: boolean = this.selectedGuard == '';

  distribForm:FormGroup;


  constructor(
    private http: HttpClient,
    private fb:FormBuilder,
    ) {
      this.distribForm = this.fb.group({
        guardia: ['', Validators.required],
        dia: ['', Validators.required],
        horas: ['', [Validators.pattern('[1-9]*'), Validators.required]],
      })
    }
  options: any[] | undefined;

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.options = data;
      });
  }

}
