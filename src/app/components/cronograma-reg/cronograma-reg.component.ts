import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cronograma-reg',
  templateUrl: './cronograma-reg.component.html',
  styleUrls: ['./cronograma-reg.component.css']
})
export class CronogramaRegComponent  implements OnInit {

  hospitales?: any[];
  hospitalesFiltrados?: any[];
  selectedRegion: string = 'CENTRO';
  hospitalSeleccionado: any;
  class?: string;


  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<any[]>('../assets/jsonFiles/hospitales.json')
      .subscribe((data) => {
        this.hospitales = data;
      this.filtrarHospitalPorRegion()
      });
  }


  selectRegion(region: string) {
    this.selectedRegion = region;
    this.filtrarHospitalPorRegion()
    console.log(this.hospitalesFiltrados);

  }

  filtrarHospitalPorRegion() {
    if (this.hospitales) {
      this.hospitalesFiltrados = this.hospitales.filter((hospital) => {
        return hospital.region == this.selectedRegion;
      });
    }else{
      console.log("nola");
    }
  }
}
