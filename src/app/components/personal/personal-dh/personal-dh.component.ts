import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { DistribucionGuardiaService } from 'src/app/services/personal/distribucionGuardia.service';
import { DistribucionConsultorioService } from 'src/app/services/personal/distribucionConsultorio.service';
import { DistribucionGiraService } from 'src/app/services/personal/distribucionGira.service'; 
import { DistribucionOtroService } from 'src/app/services/personal/distribucionOtro.service'; 
import { Router } from '@angular/router';
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
  nombreMes!: string;
  anoActual!: number;

  horasPorDia: { [key: string]: { cantidad: number; horaIngreso?: Date } } = {
    lunesGuardia: { cantidad: 0 }, martesGuardia: { cantidad: 0 }, miercolesGuardia: { cantidad: 0 }, juevesGuardia: { cantidad: 0 },
    viernesGuardia: { cantidad: 0 }, sabadoGuardia: { cantidad: 0 }, domingoGuardia: { cantidad: 0 },
    lunesConsultorio: { cantidad: 0 }, martesConsultorio: { cantidad: 0 }, miercolesConsultorio: { cantidad: 0 }, juevesConsultorio: { cantidad: 0 },
    viernesConsultorio: { cantidad: 0 }, sabadoConsultorio: { cantidad: 0 }, domingoConsultorio: { cantidad: 0 },
    lunesOtro: { cantidad: 0 }, martesOtro: { cantidad: 0 }, miercolesOtro: { cantidad: 0 }, juevesOtro: { cantidad: 0 },
    viernesOtro: { cantidad: 0 }, sabadoOtro: { cantidad: 0 }, domingoOtro: { cantidad: 0 },
    lunesGira: { cantidad: 0 }, martesGira: { cantidad: 0 }, miercolesGira: { cantidad: 0 }, juevesGira: { cantidad: 0 },
    viernesGira: { cantidad: 0 }, sabadoGira: { cantidad: 0 }, domingoGira: { cantidad: 0 }
  };
  
  totalHorasGuardia: number = 0;
  totalHorasConsultorio: number = 0;
  totalHorasOtro: number = 0;
  totalHorasGira: number = 0;

  cargaHoraria: number | undefined;
  mensajeCargaHoraria: string | null = null;
  tipoMensajeCargaHoraria: string | null = null;
  

  constructor(
    private asistencialService: AsistencialService,
    private distribucionGuardiaService: DistribucionGuardiaService,
    private distribucionConsultorioService: DistribucionConsultorioService,
    private distribucionGiraService: DistribucionGiraService,
    private distribucionOtroService: DistribucionOtroService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.suscription = this.asistencialService.currentAsistencial$.subscribe(asistencial => {
      this.asistencial = asistencial;
      console.log('Asistencial recibido:', this.asistencial);
  
      if (this.asistencial?.id) {
        this.loadDistribuciones(this.asistencial.id); // Cargar todas las distribuciones
        this.loadCargaHoraria(); // Cargar la carga horaria
      } else {
        console.warn('Asistencial no tiene un ID válido.');
      }
    });
  
    const fechaActual = moment();
    this.nombreMes = this.getMonthName(fechaActual.month());
    this.anoActual = fechaActual.year();
  }

  agregarDistribucion(asistencial: Asistencial | null): void {
    if (asistencial) { 
        this.asistencialService.setCurrentAsistencial(asistencial);
        this.router.navigate(['/dist-horaria']);
    } else {
        console.error('No se puede agregar distribución: asistencial es null.');
    }
}

  loadDistribuciones(idPersona: number): void {
    forkJoin([
      this.loadDistribucionesGuardia(idPersona),
      this.loadDistribucionesConsultorio(idPersona),
      this.loadDistribucionesGira(idPersona),
      this.loadDistribucionesOtro(idPersona)
    ]).subscribe(() => {
      this.calcularEstadoCargaHoraria();
    });
  }
  
  calcularEstadoCargaHoraria(): void {
    const totalHoras = this.totalHorasGuardia + this.totalHorasConsultorio + this.totalHorasGira + this.totalHorasOtro;

    console.log('Total Horas:', totalHoras);
    console.log('Carga Horaria:', this.cargaHoraria);
  
    if (this.cargaHoraria !== undefined) {
      if (totalHoras === this.cargaHoraria) {
        this.mensajeCargaHoraria = "El total de horas semanales cargadas coincide con las horas de carga horaria.";
        this.tipoMensajeCargaHoraria = 'success-message';
      } else if (totalHoras < this.cargaHoraria) {
        this.mensajeCargaHoraria = "Faltan horas semanales por cargar para completar las horas de carga horaria informada.";
        this.tipoMensajeCargaHoraria = 'pending-message';
      } else {
        this.mensajeCargaHoraria = "El total de horas semanales cargadas supera la carga horaria informada. Es necesario corregir.";
        this.tipoMensajeCargaHoraria = 'error-message';
      }
    }
  }

  
  loadDistribucionesGuardia(idPersona: number): Observable<void> {
    return new Observable(observer => {
      this.distribucionGuardiaService.list().subscribe(distribuciones => {
        const fechaActual = moment();
        const mesActual = fechaActual.month();
        const anioActual = fechaActual.year();
  
        const distribucionesGuardia = distribuciones.filter(d => {
          const fechaInicio = moment(d.fechaInicio);
          const fechaFinalizacion = moment(d.fechaFinalizacion);
  
          return d.persona.id === idPersona &&
            (fechaInicio.month() <= mesActual && fechaFinalizacion.month() >= mesActual &&
            fechaInicio.year() <= anioActual && fechaFinalizacion.year() >= anioActual);
        });
  
        distribucionesGuardia.forEach(distr => {
          const diaDeLaSemana = moment(distr.fechaInicio).locale('es').format('dddd').toLowerCase();
          const diaConAcento = diaDeLaSemana === 'miércoles' ? 'miercoles' : diaDeLaSemana === 'sábado' ? 'sabado' : diaDeLaSemana;
  
          this.horasPorDia[diaConAcento + 'Guardia'].cantidad += distr.cantidadHoras;
  
          if (!this.horasPorDia[diaConAcento + 'Guardia'].horaIngreso && distr.horaIngreso) {
            this.horasPorDia[diaConAcento + 'Guardia'].horaIngreso = distr.horaIngreso;
          }
        });
  
        this.totalHorasGuardia = distribucionesGuardia.reduce((total, distr) => total + distr.cantidadHoras, 0);
        observer.next();
        observer.complete();
      });
    });
  }
  
  loadDistribucionesConsultorio(idPersona: number): Observable<void> {
    return new Observable(observer => {
      this.distribucionConsultorioService.list().subscribe(distribuciones => {
        const fechaActual = moment();
        const mesActual = fechaActual.month();
        const anioActual = fechaActual.year();
  
        const distribucionesConsultorio = distribuciones.filter(d => {
          const fechaInicio = moment(d.fechaInicio);
          const fechaFinalizacion = moment(d.fechaFinalizacion);
  
          return d.persona.id === idPersona &&
            (fechaInicio.month() <= mesActual && fechaFinalizacion.month() >= mesActual &&
            fechaInicio.year() <= anioActual && fechaFinalizacion.year() >= anioActual);
        });
  
        distribucionesConsultorio.forEach(distr => {
          const diaDeLaSemana = moment(distr.fechaInicio).locale('es').format('dddd').toLowerCase();
          const diaConAcento = diaDeLaSemana === 'miércoles' ? 'miercoles' : diaDeLaSemana === 'sábado' ? 'sabado' : diaDeLaSemana;
  
          this.horasPorDia[diaConAcento + 'Consultorio'].cantidad += distr.cantidadHoras;
  
          if (!this.horasPorDia[diaConAcento + 'Consultorio'].horaIngreso && distr.horaIngreso) {
            this.horasPorDia[diaConAcento + 'Consultorio'].horaIngreso = distr.horaIngreso;
          }
        });
  
        this.totalHorasConsultorio = distribucionesConsultorio.reduce((total, distr) => total + distr.cantidadHoras, 0);
        observer.next();
        observer.complete();
      });
    });
  }
  
  loadDistribucionesGira(idPersona: number): Observable<void> {
    return new Observable(observer => {
      this.distribucionGiraService.list().subscribe(distribuciones => {
        const fechaActual = moment();
        const mesActual = fechaActual.month();
        const anioActual = fechaActual.year();
  
        const distribucionesGira = distribuciones.filter(d => {
          const fechaInicio = moment(d.fechaInicio);
          const fechaFinalizacion = moment(d.fechaFinalizacion);
  
          return d.persona.id === idPersona &&
            (fechaInicio.month() <= mesActual && fechaFinalizacion.month() >= mesActual &&
            fechaInicio.year() <= anioActual && fechaFinalizacion.year() >= anioActual);
        });
  
        distribucionesGira.forEach(distr => {
          const diaDeLaSemana = moment(distr.fechaInicio).locale('es').format('dddd').toLowerCase();
          const diaConAcento = diaDeLaSemana === 'miércoles' ? 'miercoles' : diaDeLaSemana === 'sábado' ? 'sabado' : diaDeLaSemana;
  
          this.horasPorDia[diaConAcento + 'Gira'].cantidad += distr.cantidadHoras;
  
          if (!this.horasPorDia[diaConAcento + 'Gira'].horaIngreso && distr.horaIngreso) {
            this.horasPorDia[diaConAcento + 'Gira'].horaIngreso = distr.horaIngreso;
          }
        });
  
        this.totalHorasGira = distribucionesGira.reduce((total, distr) => total + distr.cantidadHoras, 0);
        observer.next();
        observer.complete();
      });
    });
  }
  
  loadDistribucionesOtro(idPersona: number): Observable<void> {
    return new Observable(observer => {
      this.distribucionOtroService.list().subscribe(distribuciones => {
        const fechaActual = moment();
        const mesActual = fechaActual.month();
        const anioActual = fechaActual.year();
  
        const distribucionesOtro = distribuciones.filter(d => {
          const fechaInicio = moment(d.fechaInicio);
          const fechaFinalizacion = moment(d.fechaFinalizacion);
  
          return d.persona.id === idPersona &&
            (fechaInicio.month() <= mesActual && fechaFinalizacion.month() >= mesActual &&
            fechaInicio.year() <= anioActual && fechaFinalizacion.year() >= anioActual);
        });
  
        distribucionesOtro.forEach(distr => {
          const diaDeLaSemana = moment(distr.fechaInicio).locale('es').format('dddd').toLowerCase();
          const diaConAcento = diaDeLaSemana === 'miércoles' ? 'miercoles' : diaDeLaSemana === 'sábado' ? 'sabado' : diaDeLaSemana;
  
          this.horasPorDia[diaConAcento + 'Otro'].cantidad += distr.cantidadHoras;
  
          if (!this.horasPorDia[diaConAcento + 'Otro'].horaIngreso && distr.horaIngreso) {
            this.horasPorDia[diaConAcento + 'Otro'].horaIngreso = distr.horaIngreso;
          }
        });
  
        this.totalHorasOtro = distribucionesOtro.reduce((total, distr) => total + distr.cantidadHoras, 0);
        observer.next();
        observer.complete();
      });
    });
  }
  

  getMonthName(monthIndex: number): string {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return monthNames[monthIndex];
  }

  loadCargaHoraria(): void {
    const legajosActivos = this.asistencial?.legajos.filter(legajo => legajo.activo);
    if (legajosActivos && legajosActivos.length > 0) {
      const ultimoLegajoActivo = legajosActivos.sort((a, b) => b.id! - a.id!)[0];
      
      if (ultimoLegajoActivo.revista?.cargaHoraria) {
        this.cargaHoraria = ultimoLegajoActivo.revista.cargaHoraria.cantidad;
      } else {
        this.cargaHoraria = undefined; // Si no hay carga horaria
        // Puedes agregar un mensaje de advertencia aquí si lo deseas
      }
    } else {
      this.cargaHoraria = undefined; // No hay legajos activos
    }
  }

  verDistribucionHistorial(): void {
    if (this.asistencial && this.asistencial.id) {
      this.asistencialService.setCurrentAsistencial(this.asistencial);
      this.router.navigate(['/personal-dh-historial']); 
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
}

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }
}
