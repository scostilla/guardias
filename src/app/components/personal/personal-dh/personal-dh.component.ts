import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { DistribucionGuardiaService } from 'src/app/services/personal/distribucionGuardia.service';
import { DistribucionConsultorioService } from 'src/app/services/personal/distribucionConsultorio.service';
import { DistribucionGiraService } from 'src/app/services/personal/distribucionGira.service'; 
import { DistribucionOtroService } from 'src/app/services/personal/distribucionOtro.service';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';
import { NovedadPersonal } from 'src/app/models/personal/NovedadPersonal';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
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
  anoSeleccionado!: number;
  novedades: NovedadPersonal[] = [];
  

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
    private novedadPersonalService: NovedadPersonalService,
    private toastr: ToastrService,
    private location: Location,
    private router: Router,
  ) {
    const fechaActual = moment();
    this.anoActual = fechaActual.year();
    
    // Calcular el mes anterior
    let mesAnterior = fechaActual.month() === 0 ? 11 : fechaActual.month() - 1; // Enero (0) es diciembre (11) del año anterior
    let anioDelMesAnterior = fechaActual.month() === 0 ? fechaActual.year() - 1 : fechaActual.year();
    
    this.mesSeleccionado = `${mesAnterior + 1}-${anioDelMesAnterior}`; // Formato MM-YYYY (agregamos 1 al mes para que sea 1-12)
  }

  ngOnInit(): void {
    this.suscription = this.asistencialService.currentAsistencial$.subscribe(asistencial => {
      this.asistencial = asistencial;
      console.log('Asistencial recibido:', this.asistencial);
  
      if (!this.asistencial?.id) {
        this.location.back(); // Redirigir a la página anterior
      } else {
        // Si hay un asistencial con id, cargar distribuciones y carga horaria
        this.loadDistribuciones(this.asistencial.id);
        this.loadCargaHoraria();
        
        // Iniciar con el mes y año actual
        const fechaActual = moment();
        this.anoActual = fechaActual.year();
        this.mesSeleccionado = `${fechaActual.month() + 1}-${fechaActual.year()}`; // Formato MM-YYYY
        this.nombreMes = fechaActual.format('MMMM').toUpperCase(); // Nombre del mes en mayúsculas
        this.anoSeleccionado = fechaActual.year(); // Año actual
  
        // Generar meses disponibles
        this.generarMesesDisponibles();
  
        // Cargar las novedades con el mes actual
        this.loadNovedades(this.asistencial.id);
      }
    });
  }
    
  generarMesesDisponibles(): void {
    const fechaActual = moment();
    const mesesFuturos = [];
  
    // Agregar hasta 6 meses hacia adelante
    for (let i = 0; i < 6; i++) {
      let mesSeleccionado = fechaActual.clone().add(i, 'months');
      mesesFuturos.push({
        value: `${mesSeleccionado.month() + 1}-${mesSeleccionado.year()}`,
        label: mesSeleccionado.format('MMMM YYYY').toUpperCase(),
      });
    }
  
    this.mesesDisponibles = mesesFuturos; // Mostramos los meses desde el actual hasta el futuro
    console.log('Meses disponibles:', this.mesesDisponibles);
  }
  
onMonthChange(event: any): void {
  const [mes, anio] = event.target.value.split('-').map(Number);
  this.mesSeleccionado = event.target.value;
  this.nombreMes = moment().month(mes - 1).format('MMMM').toUpperCase(); // Nombre del mes en mayúsculas
  this.anoSeleccionado = anio; // Actualizamos el año con el valor seleccionado

  // Actualizar las novedades al cambiar el mes
  if (this.asistencial?.id) {
    this.loadNovedades(this.asistencial.id);
  }

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
    forkJoin([
      this.loadDistribucionesGuardia(idPersona),
      this.loadDistribucionesConsultorio(idPersona),
      this.loadDistribucionesGira(idPersona),
      this.loadDistribucionesOtro(idPersona)
    ]).subscribe(() => {
      this.calcularEstadoCargaHoraria();
    });
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

// Método en el componente PersonalDhHistorialComponent
loadNovedades(idPersona: number): void {
  if (!this.mesSeleccionado) {
    return; // Si mesSeleccionado no está definido, no hacer nada
  }

  const [mesSeleccionado, anioSeleccionado] = this.mesSeleccionado.split('-').map(Number);

  // Establecer el rango de fechas para el mes seleccionado
  const inicioDelMes = moment().year(anioSeleccionado).month(mesSeleccionado - 1).startOf('month');
  const finDelMes = moment().year(anioSeleccionado).month(mesSeleccionado - 1).endOf('month');

  // Llamada al servicio de novedades personales
  this.novedadPersonalService.list().subscribe(novedades => {
    this.novedades = novedades.filter(novedad => {
      // Filtrar novedades donde la persona es el asistencial y la fecha está dentro del rango del mes seleccionado
      const fechaInicio = moment(novedad.fechaInicio);
      const fechaFinal = moment(novedad.fechaFinal);

      return (novedad.persona.id === idPersona) && 
        ((fechaInicio.isBefore(finDelMes) && fechaFinal.isAfter(inicioDelMes)) ||
         (fechaInicio.isSameOrAfter(inicioDelMes) && fechaFinal.isBefore(finDelMes)) ||
         (fechaInicio.isSameOrBefore(inicioDelMes) && fechaFinal.isSameOrAfter(finDelMes)));
    });

    console.log('Novedades filtradas:', this.novedades);
  });
}

agregarDistribucion(asistencial: Asistencial | null): void {
  if (asistencial) { 
      this.asistencialService.setCurrentAsistencial(asistencial);
      this.router.navigate(['/dist-horaria']);
  } else {
      console.error('No se puede agregar distribución: asistencial es null.');
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


/*

  suscription!: Subscription;

  asistencial: Asistencial | null = null;
  nombreMes!: string;
  anoActual!: number;
  mesSeleccionado!: string;
  novedades: NovedadPersonal[] = [];


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
    private novedadPersonalService: NovedadPersonalService,
    private toastr: ToastrService,
    private location: Location,
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
  
      // Verificar si el id de asistencial está asignado
      if (!this.asistencial?.id) {
        this.toastr.warning('Vuelve a seleccionar el asistencial.', 'Advertencia');
        window.history.back(); // Redirigir a la página anterior
      } else {
        // Si hay un asistencial con id, cargar distribuciones y carga horaria
        this.loadDistribuciones(this.asistencial.id);
        this.loadCargaHoraria();
        this.loadNovedades(this.asistencial.id);
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

// Método en el componente PersonalDhHistorialComponent
loadNovedades(idPersona: number): void {
  const [mesSeleccionado, anioSeleccionado] = this.mesSeleccionado.split('-').map(Number);

  // Establecer el rango de fechas para el mes seleccionado
  const inicioDelMes = moment().year(anioSeleccionado).month(mesSeleccionado - 1).startOf('month');
  const finDelMes = moment().year(anioSeleccionado).month(mesSeleccionado - 1).endOf('month');

  // Llamada al servicio de novedades personales
  this.novedadPersonalService.list().subscribe(novedades => {
    this.novedades = novedades.filter(novedad => {
      // Filtrar novedades donde la persona es el asistencial y la fecha está dentro del rango del mes seleccionado
      const fechaInicio = moment(novedad.fechaInicio);
      const fechaFinal = moment(novedad.fechaFinal);

      return (novedad.persona.id === idPersona) && 
        ((fechaInicio.isBefore(finDelMes) && fechaFinal.isAfter(inicioDelMes)) ||
         (fechaInicio.isSameOrAfter(inicioDelMes) && fechaFinal.isBefore(finDelMes)) ||
         (fechaInicio.isSameOrBefore(inicioDelMes) && fechaFinal.isSameOrAfter(finDelMes)));
    });

    console.log('Novedades filtradas:', this.novedades);
  });
}

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }*/
}
