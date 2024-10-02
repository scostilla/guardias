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

  horasPorDia: { [key: string]: { manana: number; tarde: number } } = {
    domingo: { manana: 0, tarde: 0 },
    lunes: { manana: 0, tarde: 0 },
    martes: { manana: 0, tarde: 0 },
    miércoles: { manana: 0, tarde: 0 },
    jueves: { manana: 0, tarde: 0 },
    viernes: { manana: 0, tarde: 0 },
    sábado: { manana: 0, tarde: 0 },
  };


  constructor(
    private asistencialService: AsistencialService,
    private distribucionGuardiaService: DistribucionGuardiaService,
    private route: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    this.asistencialService.currentAsistencial$.subscribe(asistencial => {
      this.asistencial = asistencial;
      console.log('Asistencial recibido:', this.asistencial);
  
      // Solo cargar distribuciones para el asistencial seleccionado
      if (this.asistencial && this.asistencial.id) {
        this.loadDistribucionesGuardia(this.asistencial.id);
      } else {
        console.warn('Asistencial no tiene un ID válido.');
      }
    });
  
    const fechaActual = moment();
    this.nombreMes = this.getMonthName(fechaActual.month());
    this.anoActual = fechaActual.year();
  }

  initializeHorasPorDia(): { [key: string]: { manana: number; tarde: number } } {
    return {
      domingo: { manana: 0, tarde: 0 },
      lunes: { manana: 0, tarde: 0 },
      martes: { manana: 0, tarde: 0 },
      miércoles: { manana: 0, tarde: 0 },
      jueves: { manana: 0, tarde: 0 },
      viernes: { manana: 0, tarde: 0 },
      sábado: { manana: 0, tarde: 0 }
    };
  }

  loadDistribucionesGuardia(idPersona: number): void {
    this.distribucionGuardiaService.list().subscribe(distribuciones => {
      const fechaActual = moment(); // Obtén la fecha actual
      const mesActual = fechaActual.month(); // Obtén el mes actual
  
      // Filtrar distribuciones por idPersona y mesActual
      this.distribucionesGuardias = distribuciones.filter(d => 
        d.persona.id === idPersona && moment(d.fechaInicio).month() === mesActual
      );
  
      console.log('Distribuciones de Guardia:', this.distribucionesGuardias);
  
      this.horasPorDia = this.initializeHorasPorDia();
  
      this.distribucionesGuardias.forEach(distr => {
        const dia = distr.dia.toLowerCase();
        const horaIngreso = moment(distr.horaIngreso);
        const franja = horaIngreso.hour() < 12 ? 'manana' : 'tarde';
  
        if (!this.horasPorDia[dia]) {
          this.horasPorDia[dia] = { manana: 0, tarde: 0 };
        }
  
        // Suma las horas en la franja correspondiente
        this.horasPorDia[dia][franja] += distr.cantidadHoras;
      });
  
      console.log('Horas por día:', this.horasPorDia);
    });
  }
    
  getMonthName(monthIndex: number): string {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return monthNames[monthIndex];
  }  
  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }
}