import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dist-horaria-otras',
  templateUrl: './dist-horaria-otras.component.html',
  styleUrls: ['./dist-horaria-otras.component.css'],
})
export class DistHorariaOtrasComponent {
  hospitales: any;
  //hospitales:string[]= ['DN. PABLO SORIA'];
  profesional: string[] = [
    'FIGUEROA	ELIO',
    'ARRAYA	PEDRO ADEMIR',
    'MORALES	RICARDO',
    'ALFARO	FIDEL',
    'MARTINEZ	YANINA VANESA G.',
  ];
  guardia: string[] = ['Cargo', 'Agrupacion'];
  dia: string[] = [
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
    'Domingo',
  ];
  cons: string[] = ['Consultorio externo', 'Comisión'];
  turno: string[] = ['Mañana', 'Tarde'];

  selectedService: string = 'Cargo';
  selectedGuard: string = '';
  disableButton: boolean = this.selectedGuard == '';
  constructor(private http: HttpClient) {}
  options: any[] | undefined;

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.hospitales = data;
      });
  }
}