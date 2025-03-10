import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';


@Component({
  selector: 'app-guardias-view',
  templateUrl: './guardias-view.component.html',
  styleUrls: ['./guardias-view.component.css']
})
export class GuardiasViewComponent implements OnInit {
  services: any[] | undefined;
  options: any[] | undefined;
  professionalGroups: { service: string; professionals: any[] }[] = [];
  selectedHospital?: number | null = null; 
  hospitales: Hospital[] = [];
  fechaActual?: string;
  registrosHospital: any[] = [];

  extraButtonDisabled: boolean = true;
  cargoAgrupButtonDisabled: boolean = true;
  contraFacturaButtonDisabled: boolean = true;
  efectorId: number | null = null;
  efectorNombre: string | null = null;

  private efectorIdSubscription!: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private http: HttpClient,
    private router: Router,
    private efectorService: EfectorService,
    private registroActividadService: RegistroActividadService
  ) { }

  ngOnInit() {
    this.fechaActual = moment().format('dddd, D [de] MMMM [de] YYYY');
    
    this.listHospitales();
    this.efectorId = this.efectorService.getCurrentEfectorId();
    this.loadEfectorName();
    
    this.http
      .get<any[]>('../assets/jsonFiles/servicios.json')
      .subscribe((data) => {
        this.services = data;
      });
  }

  //trae el nombre del efector esta en sesion que filtra lo mostrado
  loadEfectorName(): void {
    if (this.efectorId) {
      this.efectorService.getEfectorTipo(this.efectorId).subscribe(
        (efector: Efector) => {
          // traigo nombre del efector
          console.log('Efector recibido:', efector);  // Log para verificar el objeto efector recibido
          this.efectorNombre = efector.nombre;  // Asigna el nombre del efector a la variable
          console.log('Nombre del efector:', this.efectorNombre);  // Log para verificar el nombre del efector
        },
        (error) => {
          console.error('Error al obtener el efector:', error);
          this.efectorNombre = null;
        }
      );
    }
  }

  private loadHospitales() {
    this.hospitalService.list().subscribe(data => {
      this.hospitales = data;
      if (this.hospitales.length > 0) {
        this.selectedHospital = this.hospitales[0].id;
        this.updateButtonStates(); // Actualizar estados de botones al cargar los hospitales
      }
    }, error => {
      console.log("Error en carga de hospitales: " + error);
    });
  }

  private loadServices() {
    this.http.get<any[]>('../assets/jsonFiles/servicios.json')
      .subscribe((data) => {
        this.services = data;
      }, error => {
        console.log("Error en carga de servicios: " + error);
      });
  }

  onHospitalChange(event: any) {
    this.selectedHospital = +event.target.value;
    this.updateButtonStates(); // Actualizar datos cuando cambie la selección del hospital
  }

  private updateButtonStates() {
    if (this.selectedHospital) {
      this.registroActividadService.list().subscribe(registros => {
        this.registrosHospital = registros.filter(
          (registro) => registro.efector.id === this.selectedHospital
        );

        // Verificar la existencia de cada tipo de guardia
        const tieneTipoGuardiaExtra = this.registrosHospital.some((registro) => registro.tipoGuardia?.id === 2);
        const tieneTipoGuardiaCargoAgrup = this.registrosHospital.some((registro) => registro.tipoGuardia?.id === 3 || registro.tipoGuardia?.id === 4);
        const tieneTipoGuardiaContraFactura = this.registrosHospital.some((registro) => registro.tipoGuardia?.id === 1);

        // Deshabilitar los botones según la existencia de cada tipo de guardia
        this.extraButtonDisabled = !tieneTipoGuardiaExtra;
        this.cargoAgrupButtonDisabled = !tieneTipoGuardiaCargoAgrup;
        this.contraFacturaButtonDisabled = !tieneTipoGuardiaContraFactura;
      }, error => {
        console.log("Error en carga de registros de actividad: " + error);
      });
    } else {
      // Deshabilitar todos los botones si no hay un hospital seleccionado
      this.extraButtonDisabled = true;
      this.cargoAgrupButtonDisabled = true;
      this.contraFacturaButtonDisabled = true;
      this.registrosHospital = []; // Limpiar registros si no hay hospital seleccionado
    }
  }

  navigateToCargoyAgrup() {
    this.router.navigate(['/ddjj-cargoyagrup'], { queryParams: { hospital: this.selectedHospital } });
  }

  navigateToExtra() {
    this.router.navigate(['/ddjj-extra'], { queryParams: { hospital: this.selectedHospital } });
  }

  ngOnDestroy(): void {
    this.efectorIdSubscription?.unsubscribe();
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
