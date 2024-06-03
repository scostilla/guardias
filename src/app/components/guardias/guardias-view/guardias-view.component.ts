import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import * as moment from 'moment';

@Component({
  selector: 'app-guardias-view',
  templateUrl: './guardias-view.component.html',
  styleUrls: ['./guardias-view.component.css']
})
export class GuardiasViewComponent {
  services: any[] | undefined;
  options: any[] | undefined;
  professionalGroups: { service: string; professionals: any[] }[] = [];
  selectedHospital?: number | null = null; 
  hospitales: Hospital[]=[];
  fechaActual?: string;

  constructor(
    private hospitalService: HospitalService,
    private http: HttpClient,
    private router: Router
  ) {
  }

  ngOnInit() {

    this.fechaActual = moment().format('dddd, D [de] MMMM [de] YYYY');
    
    this.listHospitales();
    
    this.http
      .get<any[]>('../assets/jsonFiles/servicios.json')
      .subscribe((data) => {
        this.services = data;
      });
  }
  

  listHospitales(): void {
    this.hospitalService.list().subscribe(data => {
      this.hospitales = data;
      if (this.hospitales.length > 0) {
        this.selectedHospital = this.hospitales[0].id;
      }
    }, error => {
      console.log("Error en carga de hospitales: " + error) ;
    });
  }

  navigateToCargoyAgrup() {
    console.log('#### hospital que se envía: #####'+this.selectedHospital);
    this.router.navigate(['/ddjj-cargoyagrup'], { queryParams: { hospital: this.selectedHospital } });
  }

  navigateToExtra() {
    console.log('#### hospital que se envía: #####'+this.selectedHospital);
    this.router.navigate(['/ddjj-extra']);
  }
  
  updateHospital() {
    if (this.services) {
      const filteredData = this.services.filter(
        (item) => item.hospital === this.selectedHospital
      );

      const groupedData = this.groupBy(filteredData, 'servicio');

      this.professionalGroups = Object.keys(groupedData).map((service) => ({
        service,
        professionals: groupedData[service].map((professional: any) => ({
          apellido: professional.apellido,
          nombre: professional.nombre,
          hs: professional.hs || null,
          type: professional.tipo,
        })),
      }));
    } else {
      this.professionalGroups = [];
    }
  }

  private groupBy(array: any[], property: string) {
    return array.reduce((result, currentValue) => {
      const key = currentValue[property];
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(currentValue);
      return result;
    }, {});
  }
}
