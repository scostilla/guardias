import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dist-horaria-giras',
  templateUrl: './dist-horaria-giras.component.html',
  styleUrls: ['./dist-horaria-giras.component.css']
})
export class DistHorariaGirasComponent {
  hospitales:string[]= ['DN. PABLO SORIA'];
  profesional:string[]= ['FIGUEROA	ELIO','ARRAYA	PEDRO ADEMIR','MORALES	RICARDO','ALFARO	FIDEL','MARTINEZ	YANINA VANESA G.'];
  guardia:string[]= ['Cargo','Agrupacion'];
  dia:string[]= ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];
  cons:string[]= ['Consultorio externo','Comisión'];
  turno:string[]= ['Mañana','Tarde'];

  selectedService: string = 'Cargo';
  selectedGuard: string = '';
  disableButton: boolean = this.selectedGuard == '';

  giras: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
    ) {
      this.giras=this.fb.group({
        dia: ['', Validators.required],
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
