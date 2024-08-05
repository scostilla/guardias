import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dist-horaria-cons',
  templateUrl: './dist-horaria-cons.component.html',
  styleUrls: ['./dist-horaria-cons.component.css']
})
export class DistHorariaConsComponent {
  hospitales:string[]= ['Hospital', 'Puestos de salud'];
  profesional:string[]= ['FIGUEROA	ELIO','ARRAYA	PEDRO ADEMIR','MORALES	RICARDO','ALFARO	FIDEL','MARTINEZ	YANINA VANESA G.'];
  servicio:string[]= ['Clínica','Cardiología'];
  guardia:string[]= ['Cargo','Agrupacion'];
  dia:string[]= ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
  cons:string[]= ['Consultorio externo'];
  turno:string[]= ['Mañana','Tarde'];

  selectedService: string = 'Cargo';
  selectedGuard: string = '';
  disableButton: boolean = this.selectedGuard == '';

  distHoraria: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    ) {
      this.distHoraria = this.fb.group({
        consultorio: ['', Validators.required],
        dia: ['', Validators.required],
        lugar: ['', Validators.required],
        turno: ['', Validators.required],
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
