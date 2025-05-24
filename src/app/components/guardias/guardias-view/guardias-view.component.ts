import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { EfectorHospitalDto } from 'src/app/dto/Configuracion/efector/EfectorHospitalDto';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-guardias-view',
  templateUrl: './guardias-view.component.html',
  styleUrls: ['./guardias-view.component.css']
})

export class GuardiasViewComponent {
  hospitales: Hospital[]=[];
  fechaActual?: string;

  extraButtonDisabled: boolean = true;
  cargoAgrupButtonDisabled: boolean = true;
  contraFacturaButtonDisabled: boolean = true;

  efectorId: number | null = null;
  efectorNombre: string | null = null;


  private efectorIdSubscription!: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private router: Router,
    private efectorService: EfectorService,
  ) {
  }

  ngOnInit() {

    this.fechaActual = moment().format('dddd, D [de] MMMM [de] YYYY');
    
    this.efectorId = this.efectorService.getCurrentEfectorId();
    this.loadEfectorName();
    
  }

  //trae el nombre del efector esta en sesion
  loadEfectorName(): void { 
    if (this.efectorId) {
      this.hospitalService.detailNombreAll(this.efectorId).subscribe(
        (efector: EfectorHospitalDto) => {

          if (efector) {
            this.efectorNombre = efector.nombre;
          } else {
            this.handleInvalidEfector();
          }
        },
        (error) => {
          console.error('Error al obtener el efector desde el servicio:', error);
          this.handleInvalidEfector();
        }
      );
    } else {
      this.handleInvalidEfector();
    }
  }

  private handleInvalidEfector(): void {
    console.error('ID de efector inválido o no encontrado.');
    this.router.navigateByUrl('/home-page');
  }

  navigateToCargoyAgrup() {
    this.router.navigate(['/ddjj-cargoyagrup']);
  }

  navigateToExtra() {
    this.router.navigate(['/ddjj-extra']);
  }

  ngOnDestroy(): void {
    this.efectorIdSubscription?.unsubscribe();
  }  

}
