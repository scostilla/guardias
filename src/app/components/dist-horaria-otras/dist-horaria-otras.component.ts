import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dist-horaria-otras',
  templateUrl: './dist-horaria-otras.component.html',
  styleUrls: ['./dist-horaria-otras.component.css']
})
export class DistHorariaOtrasComponent {
  hospitales:string[]= ['DN. PABLO SORIA'];
  profesional:string[]= ['FIGUEROA	ELIO','ARRAYA	PEDRO ADEMIR','MORALES	RICARDO','ALFARO	FIDEL','MARTINEZ	YANINA VANESA G.'];
  guardia:string[]= ['Cargo','Agrupacion'];
  dia:string[]= ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
  cons:string[]= ['Consultorio externo','Comisión'];
  turno:string[]= ['Mañana','Tarde'];

  selectedService: string = 'Cargo';
  selectedGuard: string = '';
  disableButton: boolean = this.selectedGuard == '';

  otrasActiv: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    ) {
      this.otrasActiv= this.fb.group({
        dia: ['', Validators.required],
        descrip: ['', Validators.required],
        hospital: ['', Validators.required],
        horas: ['', [Validators.pattern('[1-9]*'), Validators.required]]
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
