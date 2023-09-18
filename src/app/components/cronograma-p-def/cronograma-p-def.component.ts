import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-cronograma-p-def',
  templateUrl: './cronograma-p-def.component.html',
  styleUrls: ['./cronograma-p-def.component.css']
})
export class CronogramaPDefComponent {

  profesionales?: any[] = [];
  hospitales?: any[] = [];
  profesionalesFiltrados?: any[] = [];
  profesionalesPasiva?: any[] = [];

  hospitalSeleccionado: any;
  profesionalActual: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.hospitales = data;
        this.hospitales = this.hospitales.filter(hospital => hospital.pasivas === true);
        this.hospitalSeleccionado = this.hospitales[1];
        this.filtrarProfesionalesPorHospital();
      });

    this.http
      .get<any[]>('../assets/jsonFiles/profesionales.json')
      .subscribe((data) => {
        this.profesionales = data;
        this.profesionalActual = this.profesionales[0];
      });
  }

  seleccionarHospital(hospital: any) {
    console.log('Hospital seleccionado:', hospital.descripcion);
    this.profesionalesFiltrados = [];
    this.hospitalSeleccionado = hospital;
    this.filtrarProfesionalesPorHospital();
  }

  filtrarProfesionalesPorHospital() {
    if (this.profesionales) {
      this.profesionalesFiltrados = this.profesionales.filter((profesional) => {
        console.log(this.profesionalesFiltrados);
        return profesional.hospital == this.hospitalSeleccionado.descripcion;
      });
      this.filtrarPorTipoGuardia();
    }
  }

  filtrarPorTipoGuardia(){
    if (this.profesionalesFiltrados) {
      this.profesionalesPasiva = this.profesionalesFiltrados.filter((profesional) => {
        return profesional.tipoGuardia == "pasiva";
      });
    }
  }

  getRowIndex(profesionalActual: any): number {
    if (this.profesionalesPasiva && this.profesionalesPasiva.length > 0) {
      return this.profesionalesPasiva.indexOf(profesionalActual) + 1;
    }
    return 0;
  }


}
