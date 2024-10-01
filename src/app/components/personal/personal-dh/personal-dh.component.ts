import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { DistribucionGuardia } from 'src/app/models/personal/DistribucionGuardia';
import { DistribucionGuardiaService } from 'src/app/services/personal/distribucionGuardia.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/es';


@Component({
  selector: 'app-personal-dh',
  templateUrl: './personal-dh.component.html',
  styleUrls: ['./personal-dh.component.css']
})

export class PersonalDhComponent implements OnInit, OnDestroy {
  suscription!: Subscription;

  asistencial: Asistencial | null = null;
  distribucionesGuardias: DistribucionGuardia[] = [];
  nombreMes!: string;
  anoActual!: number;

  asistencialId?: number;
  nombreCompleto: string = '';
  tieneDH: boolean = true;


  constructor(
    private asistencialService: AsistencialService,
    private distribucionGuardiaService: DistribucionGuardiaService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.asistencialService.currentAsistencial$.subscribe(asistencial => {
      this.asistencial = asistencial;
      console.log('Asistencial recibido:', this.asistencial); // Para depuración
    });
  
    const fechaActual = moment();
    this.nombreMes = this.getMonthName(fechaActual.month());
    this.anoActual = fechaActual.year();
  }
      
  getAsistencialData(id: number): void {
    this.asistencialService.detail(id).subscribe(
      (data: Asistencial) => {
        this.asistencial = data;
      },
      error => {
        console.error('Error al obtener datos de asistencial:', error);
      }
    );
  }


  getMonthName(monthIndex: number): string {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return monthNames[monthIndex];
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

}
