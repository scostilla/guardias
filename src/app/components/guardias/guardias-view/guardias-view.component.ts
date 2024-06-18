import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import * as moment from 'moment';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';

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

  extraButtonDisabled: boolean = true;
  cargoAgrupButtonDisabled: boolean = true;
  contraFacturaButtonDisabled: boolean = true;

  constructor(
    private hospitalService: HospitalService,
    private http: HttpClient,
    private router: Router,
    private registroActividadService: RegistroActividadService
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
    this.router.navigate(['/ddjj-extra'], { queryParams: { hospital: this.selectedHospital } });
  }

  /*updateHospital() {
    if (this.services) {
      // Lógica existente para obtener servicios y profesionales

      // Obtener registros de actividad del efector seleccionado
      this.registroActividadService.list().subscribe(registros => {
        const tipoGuardiaIds = [1, 2, 3, 4];
        const tieneTipoGuardia = registros.some(registro =>
          registro.efector.id === this.selectedHospital &&
          registro.tipoGuardia?.id !== undefined &&
          tipoGuardiaIds.includes(registro.tipoGuardia!.id)
        );
      
        this.extraButtonDisabled = !tieneTipoGuardia || !tipoGuardiaIds.includes(3);
        this.cargoAgrupButtonDisabled = !tieneTipoGuardia || !(tipoGuardiaIds.includes(1) || tipoGuardiaIds.includes(2));
        this.contraFacturaButtonDisabled = !tieneTipoGuardia || !tipoGuardiaIds.includes(4);
      });
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
  }*/
}
