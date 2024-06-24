import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
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

  asistencial!: Asistencial;
  nombreMes!: string;
  anoActual!: number;

  constructor(
    private asistencialService: AsistencialService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const asistencialId = params['id'];
      this.getAsistencialData(asistencialId);
    });

    const fechaActual = moment();

    this.nombreMes = this.getMonthName(fechaActual.month());
    this.anoActual = fechaActual.year();
  }
  
  getAsistencialData(id: number): void {
    this.asistencialService.detail(id).subscribe(
      (data: Asistencial) => {
        this.asistencial = data; // Asigna los datos a la propiedad asistencial
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
