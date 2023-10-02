import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-cronograma-reg',
  templateUrl: './cronograma-reg.component.html',
  styleUrls: ['./cronograma-reg.component.css'],
})
export class CronogramaRegComponent implements OnInit {
  hospitales?: any[];
  hospitalesFiltrados?: any[];
  profesionales?: any[];
  profesionalesProRegion?: any[];

  descubiertoDomingo?: any[] = [];
  descubeirtoLunes?: any[] = [];
  descubiertoMartes?: any[] = [];
  descubiertoMiercoles?: any[] = [];
  descubiertoJueves?: any[] = [];
  descubiertoViernes?: any[] = [];
  descubiertoSabado?: any[] = [];

  selectedRegion: string = 'CENTRO';
  hospitalSeleccionado: any;
  class?: string;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.hospitales = data;
        this.filtrarHospitalPorRegion();
      });
  }

  selectRegion(region: string) {
    this.selectedRegion = region;
    this.filtrarHospitalPorRegion();
    console.log(this.hospitalesFiltrados);
    this.profesionalesPorRegion();
  }

  filtrarHospitalPorRegion() {
    if (this.hospitales) {
      this.hospitalesFiltrados = this.hospitales.filter((hospital) => {
        return hospital.region == this.selectedRegion;
      });
      this.profesionalesPorRegion();
    } else {
      console.log('nola');
    }
  }

  profesionalesPorRegion() {
    this.profesionalesProRegion = [];
    if (this.hospitalesFiltrados && this.hospitalesFiltrados.length > 0) {
      const observables = this.hospitalesFiltrados.map((hospital) => {
        return this.http
          .get<any[]>('../assets/jsonFiles/profesionales.json')
          .pipe(
            map((data) => {
              return data.filter(
                (profesional) => profesional.hospital === hospital.descripcion
              );
            })
          );
      });

      forkJoin(observables).subscribe((result) => {
        result.forEach((profesionalesPorHospital) => {
          this.profesionalesProRegion?.push(...profesionalesPorHospital);
        });
        console.log(this.profesionalesProRegion);
      });
    }
  }

  /*
  CARGAR DESCUBIERTO!!!!!!!!!!!!!!!!!!!!!!

  cargarDescubierto:
   const nuevoDescubierto = {
      nombreHospital: "Nombre del Hospital",
      descubierto: true
    };
    this.descubiertoDomingo.push(nuevoDescubierto);

  */
}
