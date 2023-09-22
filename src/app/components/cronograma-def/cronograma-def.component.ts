import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-cronograma-def',
  templateUrl: './cronograma-def.component.html',
  styleUrls: ['./cronograma-def.component.css']
})
export class CronogramaDefComponent {


  profesionales?: any[] = [];
  hospitales?: any[] = [];
  profesionalesFiltrados?: any[] = [];
  profesionalesContrafactura?: any[] = [];
  profesionalesCargo?: any[] = [];
  profesionalesExtra?: any[] = [];
  profesionalesReagrupacion?: any[] = [];
  profesionalesPasiva?: any[] = [];

  hospitalSeleccionado: any;
  profesionalActual: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.hospitales = data;
        this.hospitalSeleccionado = this.hospitales[3];
        this.filtrarProfesionalesPorHospital();
      });

    this.http
      .get<any[]>('../assets/jsonFiles/profesionales.json')
      .subscribe((data) => {
        this.profesionales = data;
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
      this.profesionalesContrafactura = this.profesionalesFiltrados.filter((profesional) => {
        return profesional.tipoGuardia == "contrafactura";
      });
      this.profesionalesCargo = this.profesionalesFiltrados.filter((profesional) => {
        return profesional.tipoGuardia == "cargo";
      });
      this.profesionalesExtra = this.profesionalesFiltrados.filter((profesional) => {
        return profesional.tipoGuardia == "extra";
      });
      this.profesionalesReagrupacion = this.profesionalesFiltrados.filter((profesional) => {
        return profesional.tipoGuardia == "reagrupacion";
      });

      this.profesionalesPasiva = this.profesionalesFiltrados.filter((profesional) => {
        return profesional.tipoGuardia == "pasiva";
      });
    }
  }
}
