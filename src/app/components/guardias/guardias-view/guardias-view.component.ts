import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { CapsService } from 'src/app/services/Configuracion/caps.service';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { EfectorHospitalDto } from 'src/app/dto/Configuracion/efector/EfectorHospitalDto';
import { EfectorMinisterioDto } from 'src/app/dto/Configuracion/efector/EfectorMinisterioDto';
import { EfectorCapsDto } from 'src/app/dto/Configuracion/efector/EfectorCapsDto';
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
    private capsService: CapsService,
    private ministerioService: MinisterioService,
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
    if (!this.efectorId) {
      this.efectorNombre = null;
      return;
    }

    this.hospitalService.detailNombreAll(this.efectorId).subscribe((hospital: EfectorHospitalDto | null) => {
      if (hospital) {
        this.efectorNombre = hospital.nombre;
      } else {
        this.ministerioService.detailNombreAll(this.efectorId!).subscribe((ministerio: EfectorMinisterioDto | null) => {
          if (ministerio) {
            this.efectorNombre = ministerio.nombre;
          } else {
            this.capsService.detailNombreAll(this.efectorId!).subscribe((cap: EfectorCapsDto | null) => {
              if (cap) {
                this.efectorNombre = cap.nombre;
              } else {
                console.warn('No se encontró el efector con ID:', this.efectorId);
                this.router.navigateByUrl('/home-page');
                this.efectorNombre = null;
              }
            });
          }
        });
      }
    });
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
