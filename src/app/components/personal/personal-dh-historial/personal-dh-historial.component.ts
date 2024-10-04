import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
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
  selector: 'app-personal-dh-historial',
  templateUrl: './personal-dh-historial.component.html',
  styleUrls: ['./personal-dh-historial.component.css']
})
export class PersonalDhHistorialComponent implements OnInit, OnDestroy {
  suscription!: Subscription;

  asistencial: Asistencial | null = null;
  nombreMes!: string;
  anoActual!: number;
  

  mesesDisponibles: { value: string; label: string }[] = [];
  mesSeleccionado!: string;

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
  ) {
    const fechaActual = moment();
    this.anoActual = fechaActual.year();
    
    // Calcular el mes anterior
    const mesAnterior = fechaActual.month() === 0 ? 12 : fechaActual.month(); // Diciembre si es enero
    const anioDelMesAnterior = fechaActual.month() === 0 ? fechaActual.year() - 1 : fechaActual.year();
    
    this.mesSeleccionado = `${mesAnterior}-${anioDelMesAnterior}`; // Formato MM-YYYY
  }

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

    this.generarMesesDisponibles();
  }

  generarMesesDisponibles(): void {
    const fechaActual = moment();
    const mesesPasados = [];
  
    // Agregar meses desde enero hasta el mes anterior al actual
    for (let i = 1; i < fechaActual.month(); i++) {
      mesesPasados.push({
        value: `${i}-${this.anoActual}`, // Formato MM-YYYY
        label: moment().month(i - 1).format('MMMM YYYY').toUpperCase()
      });
    }
  
    // Agregar el mes anterior
    if (fechaActual.month() > 0) { // Si no es enero
      mesesPasados.push({
        value: `${fechaActual.month()}-${this.anoActual}`,
        label: moment().month(fechaActual.month() - 1).format('MMMM YYYY').toUpperCase()
      });
    } else { // Si es enero, agregar diciembre del año anterior
      mesesPasados.push({
        value: `12-${this.anoActual - 1}`,
        label: moment().month(11).format('MMMM YYYY').toUpperCase()
      });
    }
  
    this.mesesDisponibles = mesesPasados;
  
    // Establecer mes y año por defecto
    this.mesSeleccionado = this.mesesDisponibles[this.mesesDisponibles.length - 1].value; // El último mes disponible
    this.nombreMes = moment().month(fechaActual.month() - 1).format('MMMM').toUpperCase(); // Nombre en mayúsculas
  }
  
  onMonthChange(event: any): void {
    const [mes, anio] = event.target.value.split('-').map(Number);
    this.mesSeleccionado = event.target.value;
    this.nombreMes = moment().month(mes - 1).format('MMMM').toUpperCase(); // Nombre del mes en mayúsculas
    this.anoActual = anio;
  
    this.filtrarDistribucionesPorMes(); // Opcional: Filtrar distribuciones cuando cambie el mes
  }
      
  filtrarDistribucionesPorMes(): void {
    const [mes, anio] = this.mesSeleccionado.split('-').map(Number);
    console.log(`Filtrar distribuciones para: ${mes}/${anio}`);
  
    this.resetHorasPorDia(); // Reiniciar los contadores antes de filtrar
  
    if (this.asistencial?.id !== undefined) {
      this.loadDistribuciones(this.asistencial.id); // Cargar distribuciones filtradas
    } else {
      console.warn('No hay un asistencial válido para cargar las distribuciones.');
    }
  }

  resetHorasPorDia(): void {
    for (const key in this.horasPorDia) {
      this.horasPorDia[key].cantidad = 0;
      this.horasPorDia[key].horaIngreso = undefined;
    }
  
    this.totalHorasGuardia = 0;
    this.totalHorasConsultorio = 0;
    this.totalHorasOtro = 0;
    this.totalHorasGira = 0;
  }
  
  loadDistribuciones(idPersona: number): void {
    this.loadDistribucionesGuardia(idPersona);
    this.loadDistribucionesConsultorio(idPersona);
    this.loadDistribucionesGira(idPersona);
    this.loadDistribucionesOtro(idPersona);
  }

  loadDistribucionesGuardia(idPersona: number): void {
    this.distribucionGuardiaService.list().subscribe(distribuciones => {
        const [mesSeleccionado, anioSeleccionado] = this.mesSeleccionado.split('-').map(Number);
        
        // Establecer el rango de fechas para el mes seleccionado
        const inicioDelMes = moment().year(anioSeleccionado).month(mesSeleccionado - 1).startOf('month');
        const finDelMes = moment().year(anioSeleccionado).month(mesSeleccionado - 1).endOf('month');

        // Resetear horas antes de sumar
        this.resetHorasPorDia();

        distribuciones.forEach(distr => {
          if (distr.persona.id === idPersona) {
              const fechaInicio = moment(distr.fechaInicio);
              const fechaFinalizacion = moment(distr.fechaFinalizacion);
      
              // Verificar si el mes seleccionado está dentro del rango de fechas
              if ((fechaInicio.isBefore(finDelMes) && fechaFinalizacion.isAfter(inicioDelMes)) || 
                  (fechaInicio.isSame(inicioDelMes, 'month') || fechaFinalizacion.isSame(finDelMes, 'month'))) {
                  
                  // Usar locale y asegurarse que se utilice 'dddd' y toLowerCase
                  const diaKey = moment(fechaInicio).locale('es').format('dddd').toLowerCase(); // Obtener el día de la semana en español
                  const diaConAcento = diaKey === 'miércoles' ? 'miercoles' : diaKey === 'sábado' ? 'sabado' : diaKey;
                  this.horasPorDia[diaConAcento + 'Guardia'].cantidad += distr.cantidadHoras;
              }
          }
      });

        // Calcular total de horas de Guardia
        this.totalHorasGuardia = distribuciones.reduce((total, distr) => {
            const fechaInicio = moment(distr.fechaInicio);
            const fechaFinalizacion = moment(distr.fechaFinalizacion);
            if (distr.persona.id === idPersona && 
                (fechaInicio.isBefore(finDelMes) && fechaFinalizacion.isAfter(inicioDelMes))) {
                return total + distr.cantidadHoras;
            }
            return total;
        }, 0);
    });
}

loadDistribucionesConsultorio(idPersona: number): void {
    this.distribucionConsultorioService.list().subscribe(distribuciones => {
        const [mesSeleccionado, anioSeleccionado] = this.mesSeleccionado.split('-').map(Number);

        const inicioDelMes = moment().year(anioSeleccionado).month(mesSeleccionado - 1).startOf('month');
        const finDelMes = moment().year(anioSeleccionado).month(mesSeleccionado - 1).endOf('month');

        const distribucionesConsultorio = distribuciones.filter(d => 
            d.persona.id === idPersona &&
            moment(d.fechaInicio).isBefore(finDelMes) && 
            moment(d.fechaFinalizacion).isAfter(inicioDelMes) // Verifica que el mes esté dentro del rango
        );

        distribucionesConsultorio.forEach(distr => {
            const fechaInicio = moment(distr.fechaInicio);
            const diaKey = fechaInicio.locale('es').format('dddd').toLowerCase(); // Obtener el día de la semana en español
            const diaConAcento = diaKey === 'miércoles' ? 'miercoles' : diaKey === 'sábado' ? 'sabado' : diaKey;
            this.horasPorDia[diaConAcento + 'Consultorio'].cantidad += distr.cantidadHoras;
        });

        this.totalHorasConsultorio = distribucionesConsultorio.reduce((total, distr) => total + distr.cantidadHoras, 0);
    });
}

loadDistribucionesGira(idPersona: number): void {
    this.distribucionGiraService.list().subscribe(distribuciones => {
        const [mesSeleccionado, anioSeleccionado] = this.mesSeleccionado.split('-').map(Number);

        const inicioDelMes = moment().year(anioSeleccionado).month(mesSeleccionado - 1).startOf('month');
        const finDelMes = moment().year(anioSeleccionado).month(mesSeleccionado - 1).endOf('month');

        const distribucionesGira = distribuciones.filter(d => 
            d.persona.id === idPersona &&
            moment(d.fechaInicio).isBefore(finDelMes) && 
            moment(d.fechaFinalizacion).isAfter(inicioDelMes) // Verifica que el mes esté dentro del rango
        );

        distribucionesGira.forEach(distr => {
            const fechaInicio = moment(distr.fechaInicio);
            const diaKey = fechaInicio.locale('es').format('dddd').toLowerCase(); // Obtener el día de la semana en español
            const diaConAcento = diaKey === 'miércoles' ? 'miercoles' : diaKey === 'sábado' ? 'sabado' : diaKey;
            this.horasPorDia[diaConAcento + 'Gira'].cantidad += distr.cantidadHoras;
        });

        this.totalHorasGira = distribucionesGira.reduce((total, distr) => total + distr.cantidadHoras, 0);
    });
}

loadDistribucionesOtro(idPersona: number): void {
    this.distribucionOtroService.list().subscribe(distribuciones => {
        const [mesSeleccionado, anioSeleccionado] = this.mesSeleccionado.split('-').map(Number);

        const inicioDelMes = moment().year(anioSeleccionado).month(mesSeleccionado - 1).startOf('month');
        const finDelMes = moment().year(anioSeleccionado).month(mesSeleccionado - 1).endOf('month');

        const distribucionesOtro = distribuciones.filter(d => 
            d.persona.id === idPersona &&
            moment(d.fechaInicio).isBefore(finDelMes) && 
            moment(d.fechaFinalizacion).isAfter(inicioDelMes) // Verifica que el mes esté dentro del rango
        );

        distribucionesOtro.forEach(distr => {
            const fechaInicio = moment(distr.fechaInicio);
            const diaKey = fechaInicio.locale('es').format('dddd').toLowerCase(); // Obtener el día de la semana en español
            const diaConAcento = diaKey === 'miércoles' ? 'miercoles' : diaKey === 'sábado' ? 'sabado' : diaKey;
            this.horasPorDia[diaConAcento + 'Otro'].cantidad += distr.cantidadHoras;
        });

        this.totalHorasOtro = distribucionesOtro.reduce((total, distr) => total + distr.cantidadHoras, 0);
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

  volverDistribucion(): void {
    if (this.asistencial && this.asistencial.id) {
      this.asistencialService.setCurrentAsistencial(this.asistencial);
      this.router.navigate(['/personal-dh']); 
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
}

  
  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }
}
