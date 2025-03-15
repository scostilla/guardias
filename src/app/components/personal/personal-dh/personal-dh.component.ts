import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { DistribucionGuardiaService } from 'src/app/services/personal/distribucionGuardia.service';
import { DistribucionGuardia } from 'src/app/models/personal/DistribucionGuardia';
import { DistribucionConsultorioService } from 'src/app/services/personal/distribucionConsultorio.service';
import { DistribucionConsultorio } from 'src/app/models/personal/DistribucionConsultorio';
import { DistribucionGiraService } from 'src/app/services/personal/distribucionGira.service';
import { DistribucionGira } from 'src/app/models/personal/DistribucionGira';
import { DistribucionOtroService } from 'src/app/services/personal/distribucionOtro.service';
import { DistribucionOtro } from 'src/app/models/personal/DistribucionOtro';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';
import { NovedadPersonal } from 'src/app/models/personal/NovedadPersonal';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

// Interfaz temporal para agrupar las horas por día y calcular totales
interface DistribucionGuardiaWithHoras extends DistribucionGuardia {
  horasPorDia: { [key: string]: { horas: string; tooltip: string }[] };
  totalHorasFinDeSemana: number;  // Total horas sábado y domingo
  totalHorasLunesAViernes: number;  // Total horas lunes a viernes
  totalHoras: number;  // Total de todas las horas
  totalHorasSinOcurrencias: number;
  clase?: string;
}

interface DistribucionConsultorioWithHoras extends DistribucionConsultorio {
  horasPorDia: { [key: string]: { horas: string; tooltip: string }[] };
  totalHorasFinDeSemana: number;
  totalHorasLunesAViernes: number;
  totalHoras: number;
  totalHorasSinOcurrencias: number;
  clase?: string;
}

interface DistribucionGiraWithHoras extends DistribucionGira {
  horasPorDia: { [key: string]: { horas: string; tooltip: string }[] };
  totalHorasFinDeSemana: number;
  totalHorasLunesAViernes: number;
  totalHoras: number;
  totalHorasSinOcurrencias: number;
  clase?: string;
}

interface DistribucionOtroWithHoras extends DistribucionOtro {
  horasPorDia: { [key: string]: { horas: string; tooltip: string }[] };
  totalHorasFinDeSemana: number;
  totalHorasLunesAViernes: number;
  totalHoras: number;
  totalHorasSinOcurrencias: number;
  clase?: string;
}

@Component({
  selector: 'app-personal-dh',
  templateUrl: './personal-dh.component.html',
  styleUrls: ['./personal-dh.component.css']
})
export class PersonalDhComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort) sort!: MatSort;
  suscription!: Subscription;
  asistencial: Asistencial | null = null;
  distribucionesGuardia: DistribucionGuardiaWithHoras[] = [];
  distribucionesConsultorio: DistribucionConsultorioWithHoras[] = [];
  distribucionesGira: DistribucionGiraWithHoras[] = [];
  distribucionesOtro: DistribucionOtroWithHoras[] = [];
  displayedColumns: string[] = [];
  novedadesPersonales: NovedadPersonal[] = [];

  // Variables para el selector de mes y año
  mesYanio: string = ''; // MM-YYYY
  mesesDisponibles: { value: string, label: string }[] = [];
  nombreMes: string = '';
  anioSeleccionado: number = 0;
  mesSeleccionado: number = 0;

  showDetails: boolean = false;
  showTable = false;
  noHayDistribuciones: boolean = false;

  cargaHoraria: number | undefined;
  mensajeCargaHoraria: string | null = null;
  tipoMensajeCargaHoraria: string | null = null;


  mapaDias: { [key: string]: string } = {
  'LUNES': 'lunes',
  'MARTES': 'martes',
  'MIERCOLES': 'miércoles',
  'JUEVES': 'jueves',
  'VIERNES': 'viernes',
  'SABADO': 'sábado',
  'DOMINGO': 'domingo'
};

  constructor(
    private asistencialService: AsistencialService,
    private distribucionGuardiaService: DistribucionGuardiaService,
    private distribucionConsultorioService: DistribucionConsultorioService,
    private distribucionGiraService: DistribucionGiraService,
    private distribucionOtroService: DistribucionOtroService,
    private router: Router,
    private location: Location,
    private novedadPersonalService: NovedadPersonalService
  ) { }

  ngOnInit(): void {
    this.suscription = this.asistencialService.currentAsistencial$.subscribe(asistencial => {
      this.asistencial = asistencial;
      //console.log('Asistencial recibido:', this.asistencial);

      if (!this.asistencial?.id) {
        this.location.back();
      } else {
        this.loadDistribuciones();
        this.loadNovedades();
        this.loadCargaHoraria();
      }

      // Inicializar el mes y año actual
      const fechaActual = moment();
      this.mesYanio = `${fechaActual.month() + 1}-${fechaActual.year()}`;  // Formato MM-YYYY
      this.nombreMes = fechaActual.format('MMMM').toUpperCase();  // Nombre del mes
      this.anioSeleccionado = fechaActual.year();  // Año actual

      this.generarMesesDisponibles();  // Generar meses disponibles
    });
  }

  // Función para combinar los datos y aplicar la agregación
  getCombinedData() {
    const combinedDataGuardia = this.distribucionesGuardia.length > 0 ? [this.aggregateDistribucionesGuardia(this.distribucionesGuardia)] : [];
    const combinedDataConsultorio = this.distribucionesConsultorio.length > 0 ? [this.aggregateDistribucionesConsultorio(this.distribucionesConsultorio)] : [];
    const combinedDataGira = this.distribucionesGira.length > 0 ? [this.aggregateDistribucionesGira(this.distribucionesGira)] : [];
    const combinedDataOtro = this.distribucionesOtro.length > 0 ? [this.aggregateDistribucionesOtro(this.distribucionesOtro)] : [];
  
    const combinedData = [
      ...combinedDataGuardia,
      ...combinedDataConsultorio,
      ...combinedDataGira,
      ...combinedDataOtro
    ];
  
    //console.log('Combined Data:', combinedData);  // Verifica la estructura de los datos combinados
  
    return combinedData; // Si está vacío, no se mostrará la tabla
  }

  ngOnDestroy(): void {
    if (this.suscription) {
      this.suscription.unsubscribe();
    }
  }

  // Función para generar los meses disponibles (6 meses hacia adelante)
  generarMesesDisponibles(): void {
    const fechaActual = moment();
    const mesesFuturos = [];

    // Agregar hasta 6 meses hacia adelante del actual
    for (let i = 0; i < 7; i++) {
      const mesYanio = fechaActual.clone().add(i, 'months');
      mesesFuturos.push({
        value: `${mesYanio.month() + 1}-${mesYanio.year()}`,
        label: mesYanio.format('MMMM YYYY').toUpperCase(),
      });
    }

    this.mesesDisponibles = mesesFuturos; // Mostramos los meses desde el actual hasta el futuro
    //console.log('Meses disponibles:', this.mesesDisponibles);
  }

  resetData(): void {
    this.distribucionesGuardia = [];
    this.distribucionesConsultorio = [];
    this.distribucionesGira = [];
    this.distribucionesOtro = [];
  }
  
  // Función que se ejecuta cuando se selecciona un mes y año
  onMonthChange(event: any): void {
    const [mes, anio] = event.target.value.split('-').map(Number);
    this.mesYanio = event.target.value;
    this.nombreMes = moment().month(mes - 1).format('MMMM').toUpperCase(); // Nombre del mes
    this.anioSeleccionado = anio; // Año seleccionado
    this.mesSeleccionado = mes;

    this.resetData(); // Resetear datos antes de cargar nuevas distribuciones
    this.showTable = false;

    // Cargar las distribuciones filtradas por mes y año
    this.loadDistribuciones();
    this.loadNovedades();
  }



  loadDistribuciones(): void {
    if (!this.asistencial) return;
    
    // Usar promesas para esperar que todas las distribuciones se hayan cargado
    Promise.all([
      this.loadDistribucionGuardia(),
      this.loadDistribucionConsultorio(),
      this.loadDistribucionGira(),
      this.loadDistribucionOtro()
    ]).then(() => {
      this.getCombinedData(); // Llamamos a la agregación después de cargar todos los datos
      this.checkLoadingState(); // Verificamos si los datos están completos
    }).catch(error => {
      console.error("Error al cargar distribuciones", error);
    });
  }
    
  // Cargar distribuciones por tipo y aplicar filtro
  loadDistribucionGuardia(): void {
    this.distribucionGuardiaService.getDistribucionesGuardiaByPersona(this.asistencial!.id!).subscribe((distribuciones: DistribucionGuardia[]) => {
      this.distribucionesGuardia = this.filterDistribucionesPorMes(distribuciones);
      this.checkLoadingState();
      this.setupColumns();
    });
  }
  
  loadDistribucionConsultorio(): void {
    this.distribucionConsultorioService.getDistribucionesConsultorioByPersona(this.asistencial!.id!).subscribe((distribuciones: DistribucionConsultorio[]) => {
      this.distribucionesConsultorio = this.filterDistribucionesPorMes(distribuciones);
      this.checkLoadingState();
      this.setupColumns();
    });
  }
  
  loadDistribucionGira(): void {
    this.distribucionGiraService.getDistribucionesGiraByPersona(this.asistencial!.id!).subscribe((distribuciones: DistribucionGira[]) => {
      this.distribucionesGira = this.filterDistribucionesPorMes(distribuciones);
      this.checkLoadingState();
      this.setupColumns();
    });
  }
  
  loadDistribucionOtro(): void {
    this.distribucionOtroService.getDistribucionesOtroByPersona(this.asistencial!.id!).subscribe((distribuciones: DistribucionOtro[]) => {
      this.distribucionesOtro = this.filterDistribucionesPorMes(distribuciones);
      this.checkLoadingState();
      this.setupColumns();
    });
  }

    // Método para verificar el estado de carga
    checkLoadingState() {
      // Verificar si alguna de las distribuciones tiene elementos
      const hayDatos = this.distribucionesGuardia.length > 0 || 
                       this.distribucionesConsultorio.length > 0 || 
                       this.distribucionesGira.length > 0 || 
                       this.distribucionesOtro.length > 0;
    
      this.showTable = hayDatos;
      this.noHayDistribuciones = !hayDatos;
    }
    
    // Filtrar distribuciones por mes
    filterDistribucionesPorMes(distribuciones: any[]): any[] {
      // Convertir el mes y año seleccionados en números
      const mesYanio = parseInt(this.mesYanio.split('-')[0], 10) - 1; // Restar 1 porque los meses en moment.js son 0-based
      const anioSeleccionado = parseInt(this.anioSeleccionado.toString(), 10);
      
      return distribuciones.filter(d => {
        const fechaInicio = moment(d.fechaInicio);
        const fechaFinalizacion = moment(d.fechaFinalizacion);
    
        // Filtrar las distribuciones por el mes y año seleccionados
        return fechaInicio.month() === mesYanio && fechaInicio.year() === anioSeleccionado;
      });
    }
    
  // Función para configurar las columnas dinámicas
  setupColumns(): void {
    // Verificar que haya al menos una distribución de cualquiera de los tipos
    if (!this.distribucionesGuardia.length && 
        !this.distribucionesConsultorio.length && 
        !this.distribucionesGira.length && 
        !this.distribucionesOtro.length) {
      return; // Si no hay distribuciones, no hacer nada
    }
    
    // Usar la primera distribución que esté disponible para calcular la fecha de inicio
    let fechaInicio;
    if (this.distribucionesGuardia.length) {
      fechaInicio = this.distribucionesGuardia[0].fechaInicio;
    } else if (this.distribucionesConsultorio.length) {
      fechaInicio = this.distribucionesConsultorio[0].fechaInicio;
    } else if (this.distribucionesGira.length) {
      fechaInicio = this.distribucionesGira[0].fechaInicio;
    } else if (this.distribucionesOtro.length) {
      fechaInicio = this.distribucionesOtro[0].fechaInicio;
    }
  
    const startOfMonth = moment(fechaInicio).startOf('month');
    const endOfMonth = moment(fechaInicio).endOf('month');
    const daysInMonth = endOfMonth.diff(startOfMonth, 'days') + 1;
    const columns: string[] = ['clase', 'totalHoras', 'totalHorasFinDeSemana', 'totalHorasLunesAViernes'];
  
    // Agregar columnas por cada día del mes
    for (let i = 0; i < daysInMonth; i++) {
      columns.push(startOfMonth.clone().add(i, 'days').format('YYYY_MM_DD'));
    }
  
    this.displayedColumns = columns;
  }
  
  getFechaFromColumnId(columnId: string): string {
    const fecha = moment(columnId, 'YYYY_MM_DD').toDate();
    return fecha ? fecha.toISOString().split('T')[0] : '';
  }

getHorasForDate(distribucion: DistribucionGuardiaWithHoras | DistribucionConsultorioWithHoras | DistribucionGiraWithHoras | DistribucionOtroWithHoras, fechaColumna: string): { horas: string, tooltip: string, showDetails: boolean }[] {
  const diaColumn = moment(fechaColumna, 'YYYY_MM_DD').format('dddd').toLowerCase();
  const horasPorDia = distribucion.horasPorDia;
  if (horasPorDia[diaColumn]) {
    // Si ya existe un arreglo de horas para el día, devolver todas las entradas
    return horasPorDia[diaColumn].map(entry => ({
      ...entry,
      showDetails: this.showDetails // El valor de `showDetails` controla si se muestran los detalles
    }));
  } else {
    return []; // Si no hay horas para ese día, devolver un arreglo vacío
  }
}

  // Función que alterna la visibilidad de los detalles globalmente
  toggleAllDetails(): void {
    this.showDetails = !this.showDetails; // Alterna la visibilidad de los detalles
  }

  getNovedadClass(fecha: string): string {
    const novedad = this.novedadesPersonales.find(novedad => {
      const inicio = moment(novedad.fechaInicio);
      const final = moment(novedad.fechaFinal);
      const current = moment(fecha, 'YYYY-MM-DD');
      return current.isBetween(inicio, final, 'days', '[]');
    });
    return novedad ? this.getNovedadClassFromTipo(novedad) : '';
  }

  getNovedadClassFromTipo(novedad: NovedadPersonal): string {
    switch (novedad.tipoLicencia.nombre.toLowerCase()) {
      case 'compensatorio': return 'novedad-personal-compensatorio';
      case 'licencia anual ordinaria': return 'novedad-personal-lao';
      case 'licencia por maternidad': return 'novedad-personal-maternidad';
      case 'parte por enfermedad': return 'novedad-personal-parte-enfermo';
      case 'parte por cuidado de familiar enfermo': return 'novedad-personal-familiar-enfermo';
      case 'falta sin aviso': return 'novedad-personal-falta-sin-aviso';
      default: return 'novedad-personal-otros';
    }
  }

  // Cargar las novedades personales
  loadNovedades(): void {
    if (this.asistencial) {
      this.novedadPersonalService.getNovedadesByPersona(this.asistencial.id!).subscribe((novedades) => {
        // Filtrar las novedades que coinciden con el mes y año seleccionados
        const mesYanioMoment = moment(this.mesYanio, 'MM-YYYY');  // Captura la fecha seleccionada
        this.novedadesPersonales = novedades.filter(novedad => {
          const fechaInicio = moment(novedad.fechaInicio);
          const fechaFinal = moment(novedad.fechaFinal);
          return (
            (fechaInicio.month() === mesYanioMoment.month() && fechaInicio.year() === mesYanioMoment.year()) ||
            (fechaFinal.month() === mesYanioMoment.month() && fechaFinal.year() === mesYanioMoment.year())
          );
        });
        this.setupColumns();  // Configurar columnas dinámicamente para reflejar las novedades
      });
    }
  }
  
  aggregateDistribucionesGuardia(distribuciones: DistribucionGuardia[]): DistribucionGuardiaWithHoras {
    // Filtrar distribuciones por mes y año
    const distribucionesFiltradas = this.filterDistribucionesPorMes(distribuciones);
    //console.log('Distribuciones filtradas para Guardias:', distribucionesFiltradas);
    
    if (distribucionesFiltradas.length === 0) {
      console.log('No hay distribuciones disponibles.');
      return {} as DistribucionGuardiaWithHoras;
    }
  
    const aggregatedDistribucion = { ...distribucionesFiltradas[0] } as DistribucionGuardiaWithHoras;
    aggregatedDistribucion.clase = 'Guardias';
    const horasPorDia: { [key: string]: { horas: string, tooltip: string }[] } = {};
    let totalHorasFinDeSemana = 0;
    let totalHorasLunesAViernes = 0;
    let totalHoras = 0;
    let totalHorasSinOcurrencias = 0;
    
    const ocurrenciasPorDia: { [key: string]: number } = this.contarOcurrenciasDeDiasEnMes();
  
    distribucionesFiltradas.forEach(distribucion => {
      const dia = this.mapaDias[distribucion.dia];  // Usamos la propiedad directamente
      if (!dia) {
        console.error(`Error: Día no reconocido en la base de datos: ${distribucion.dia}`);
        return;
      }
      const horas = distribucion.cantidadHoras;
      const cantidadOcurrencias = ocurrenciasPorDia[dia];
      const horasTotalesPorDia = horas * cantidadOcurrencias;
      const tooltip = `${distribucion.tipoGuardia}, ${distribucion.servicio.descripcion}, ${moment(distribucion.horaIngreso, 'HH:mm').format('HH:mm')} hs`;

      totalHorasSinOcurrencias += horas;

      if (horasPorDia[dia]) {
        horasPorDia[dia].push({ horas: `${distribucion.cantidadHoras} hs`, tooltip });
      } else {
        horasPorDia[dia] = [{ horas: `${distribucion.cantidadHoras} hs`, tooltip }];
      }
  
      if (dia === 'sábado' || dia === 'domingo') {
        totalHorasFinDeSemana += horasTotalesPorDia;
      } else {
        totalHorasLunesAViernes += horasTotalesPorDia;
      }
  
      totalHoras += horasTotalesPorDia;
    });
  
    aggregatedDistribucion.totalHorasSinOcurrencias = totalHorasSinOcurrencias;
    aggregatedDistribucion.horasPorDia = horasPorDia;
    aggregatedDistribucion.totalHorasFinDeSemana = totalHorasFinDeSemana;
    aggregatedDistribucion.totalHorasLunesAViernes = totalHorasLunesAViernes;
    aggregatedDistribucion.totalHoras = totalHoras;
  
    console.log('Distribución agregada:', aggregatedDistribucion);
  
    return aggregatedDistribucion;
  }
      
  aggregateDistribucionesConsultorio(distribuciones: DistribucionConsultorio[]): DistribucionConsultorioWithHoras {
    // Filtrar distribuciones por mes y año
    const distribucionesFiltradas = this.filterDistribucionesPorMes(distribuciones);
  
    if (distribucionesFiltradas.length === 0) {
      return {} as DistribucionConsultorioWithHoras;
    }
  
    const aggregatedDistribucion = { ...distribucionesFiltradas[0] } as DistribucionConsultorioWithHoras;
    aggregatedDistribucion.clase = 'Consultorio';
    const horasPorDia: { [key: string]: { horas: string, tooltip: string }[] } = {};
    let totalHorasFinDeSemana = 0;
    let totalHorasLunesAViernes = 0;
    let totalHoras = 0;
    let totalHorasSinOcurrencias = 0;

    const ocurrenciasPorDia: { [key: string]: number } = this.contarOcurrenciasDeDiasEnMes();
  
    distribucionesFiltradas.forEach(distribucion => {
      const dia = this.mapaDias[distribucion.dia];  // Usamos la propiedad directamente
      if (!dia) {
        console.error(`Error: Día no reconocido en la base de datos: ${distribucion.dia}`);
        return;
      }
      const horas = distribucion.cantidadHoras;
      const cantidadOcurrencias = ocurrenciasPorDia[dia];
      const horasTotalesPorDia = horas * cantidadOcurrencias;
      const tooltip = `${distribucion.tipoConsultorio}, ${distribucion.servicio.descripcion}, ${moment(distribucion.horaIngreso, 'HH:mm').format('HH:mm')} hs`;

      totalHorasSinOcurrencias += horas;
  
      if (horasPorDia[dia]) {
        horasPorDia[dia].push({ horas: `${distribucion.cantidadHoras} hs`, tooltip });
      } else {
        horasPorDia[dia] = [{ horas: `${distribucion.cantidadHoras} hs`, tooltip }];
      }
  
      if (dia === 'sábado' || dia === 'domingo') {
        totalHorasFinDeSemana += horasTotalesPorDia;
      } else {
        totalHorasLunesAViernes += horasTotalesPorDia;
      }
      totalHoras += horasTotalesPorDia;
    });
  
    aggregatedDistribucion.totalHorasSinOcurrencias = totalHorasSinOcurrencias;
    aggregatedDistribucion.horasPorDia = horasPorDia;
    aggregatedDistribucion.totalHorasFinDeSemana = totalHorasFinDeSemana;
    aggregatedDistribucion.totalHorasLunesAViernes = totalHorasLunesAViernes;
    aggregatedDistribucion.totalHoras = totalHoras;
  
    return aggregatedDistribucion;
  }
    
  aggregateDistribucionesGira(distribuciones: DistribucionGira[]): DistribucionGiraWithHoras {
    // Filtrar distribuciones por mes y año
    const distribucionesFiltradas = this.filterDistribucionesPorMes(distribuciones);
  
    if (distribucionesFiltradas.length === 0) {
      return {} as DistribucionGiraWithHoras;
    }
  
    const aggregatedDistribucion = { ...distribucionesFiltradas[0] } as DistribucionGiraWithHoras;
    aggregatedDistribucion.clase = 'Giras';
    const horasPorDia: { [key: string]: { horas: string, tooltip: string }[] } = {};
    let totalHorasFinDeSemana = 0;
    let totalHorasLunesAViernes = 0;
    let totalHoras = 0;
    let totalHorasSinOcurrencias = 0;

    const ocurrenciasPorDia: { [key: string]: number } = this.contarOcurrenciasDeDiasEnMes();
  
    distribucionesFiltradas.forEach(distribucion => {
      const dia = this.mapaDias[distribucion.dia];  // Usamos la propiedad directamente
      if (!dia) {
        console.error(`Error: Día no reconocido en la base de datos: ${distribucion.dia}`);
        return;
      }
      const horas = distribucion.cantidadHoras;
      const cantidadOcurrencias = ocurrenciasPorDia[dia];
      const horasTotalesPorDia = horas * cantidadOcurrencias;
      //const tooltip = `${distribucion.puestoSalud}, ${moment(distribucion.horaIngreso, 'HH:mm').format('HH:mm')} hs`;
      const tooltip = `${moment(distribucion.horaIngreso, 'HH:mm').format('HH:mm')} hs`;
      
      totalHorasSinOcurrencias += horas;
  
      if (horasPorDia[dia]) {
        horasPorDia[dia].push({ horas: `${distribucion.cantidadHoras} hs`, tooltip });
      } else {
        horasPorDia[dia] = [{ horas: `${distribucion.cantidadHoras} hs`, tooltip }];
      }
  
      if (dia === 'sábado' || dia === 'domingo') {
        totalHorasFinDeSemana += horasTotalesPorDia;
      } else {
        totalHorasLunesAViernes += horasTotalesPorDia;
      }
      totalHoras += horasTotalesPorDia;
    });
  
    aggregatedDistribucion.totalHorasSinOcurrencias = totalHorasSinOcurrencias;
    aggregatedDistribucion.horasPorDia = horasPorDia;
    aggregatedDistribucion.totalHorasFinDeSemana = totalHorasFinDeSemana;
    aggregatedDistribucion.totalHorasLunesAViernes = totalHorasLunesAViernes;
    aggregatedDistribucion.totalHoras = totalHoras;
  
    return aggregatedDistribucion;
  }
    
  aggregateDistribucionesOtro(distribuciones: DistribucionOtro[]): DistribucionOtroWithHoras {
    // Filtrar distribuciones por mes y año
    const distribucionesFiltradas = this.filterDistribucionesPorMes(distribuciones);
  
    if (distribucionesFiltradas.length === 0) {
      return {} as DistribucionOtroWithHoras;
    }
  
    const aggregatedDistribucion = { ...distribucionesFiltradas[0] } as DistribucionOtroWithHoras;
    aggregatedDistribucion.clase = 'Otros';
    const horasPorDia: { [key: string]: { horas: string, tooltip: string }[] } = {};
    let totalHorasFinDeSemana = 0;
    let totalHorasLunesAViernes = 0;
    let totalHoras = 0;
    let totalHorasSinOcurrencias = 0;

    const ocurrenciasPorDia: { [key: string]: number } = this.contarOcurrenciasDeDiasEnMes();
  
    distribucionesFiltradas.forEach(distribucion => {
      const dia = this.mapaDias[distribucion.dia];  // Usamos la propiedad directamente
      if (!dia) {
        console.error(`Error: Día no reconocido en la base de datos: ${distribucion.dia}`);
        return;
      }
      const horas = distribucion.cantidadHoras;
      const cantidadOcurrencias = ocurrenciasPorDia[dia];
      const horasTotalesPorDia = horas * cantidadOcurrencias;
      const tooltip = `${distribucion.descripcion}, ${distribucion.lugar}, ${moment(distribucion.horaIngreso, 'HH:mm').format('HH:mm')} hs`;

      totalHorasSinOcurrencias += horas;
  
      if (horasPorDia[dia]) {
        horasPorDia[dia].push({ horas: `${distribucion.cantidadHoras} hs`, tooltip });
      } else {
        horasPorDia[dia] = [{ horas: `${distribucion.cantidadHoras} hs`, tooltip }];
      }
  
      if (dia === 'sábado' || dia === 'domingo') {
        totalHorasFinDeSemana += horasTotalesPorDia;
      } else {
        totalHorasLunesAViernes += horasTotalesPorDia;
      }
      totalHoras += horasTotalesPorDia;
    });
  
    aggregatedDistribucion.totalHorasSinOcurrencias = totalHorasSinOcurrencias;
    aggregatedDistribucion.horasPorDia = horasPorDia;
    aggregatedDistribucion.totalHorasFinDeSemana = totalHorasFinDeSemana;
    aggregatedDistribucion.totalHorasLunesAViernes = totalHorasLunesAViernes;
    aggregatedDistribucion.totalHoras = totalHoras;
  
    return aggregatedDistribucion;
  }
        
      
  // Contar las ocurrencias de cada día en el mes
  contarOcurrenciasDeDiasEnMes(): { [key: string]: number } {
    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');
    const diasDeLaSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    const ocurrenciasPorDia: { [key: string]: number } = {};

    for (let m = startOfMonth; m.isBefore(endOfMonth, 'day'); m.add(1, 'days')) {
      const diaSemana = m.format('dddd').toLowerCase();
      if (!ocurrenciasPorDia[diaSemana]) {
        ocurrenciasPorDia[diaSemana] = 0;
      }
      ocurrenciasPorDia[diaSemana]++;
    }

    return ocurrenciasPorDia;
  }
        
  getNovedadTooltip(fecha: string): string {
    const novedad = this.novedadesPersonales.find(novedad => {
      const inicio = moment(novedad.fechaInicio);
      const final = moment(novedad.fechaFinal);
      const current = moment(fecha, 'YYYY-MM-DD');
      return current.isBetween(inicio, final, 'days', '[]');
    });
  
    return novedad ? novedad.tipoLicencia.nombre : '';
    
  }

  loadCargaHoraria(): void {
    const legajosActivos = this.asistencial?.legajos.filter(legajo => legajo.activo);
    if (legajosActivos && legajosActivos.length > 0) {
      const ultimoLegajoActivo = legajosActivos.sort((a, b) => b.id! - a.id!)[0];
      
      if (ultimoLegajoActivo.revista?.cargaHoraria) {
        this.cargaHoraria = ultimoLegajoActivo.revista.cargaHoraria.cantidad;
      } else {
        this.cargaHoraria = undefined; // Si no hay carga horaria
        // agregar un mensaje de advertencia aquí
      }
    } else {
      this.cargaHoraria = undefined; // No hay legajos activos
    }
  }

  /*calcularEstadoCargaHoraria(): void {
    // Obtener los totales sin ocurrencias para cada tipo de distribución
    const totalHorasGuardiaSinOcurrencias = this.aggregateDistribucionesGuardia(this.distribucionesGuardia).totalHorasSinOcurrencias;
    const totalHorasConsultorioSinOcurrencias = this.aggregateDistribucionesConsultorio(this.distribucionesConsultorio).totalHorasSinOcurrencias;
    const totalHorasGiraSinOcurrencias = this.aggregateDistribucionesGira(this.distribucionesGira).totalHorasSinOcurrencias;
    const totalHorasOtroSinOcurrencias = this.aggregateDistribucionesOtro(this.distribucionesOtro).totalHorasSinOcurrencias;
  
    // Calcular el total de horas sin ocurrencias
    const totalHorasSinOcurrencias = totalHorasGuardiaSinOcurrencias + totalHorasConsultorioSinOcurrencias + totalHorasGiraSinOcurrencias + totalHorasOtroSinOcurrencias;
    console.log('Total Horas Sin Ocurrencias:', totalHorasSinOcurrencias);
    console.log('Carga Horaria:', this.cargaHoraria);
  
    // Comprobar la carga horaria
    if (this.cargaHoraria !== undefined) {
      if (totalHorasSinOcurrencias === this.cargaHoraria) {
        this.mensajeCargaHoraria = "El total de horas semanales cargadas coincide con las horas de carga horaria.";
        this.tipoMensajeCargaHoraria = 'success-message';
      } else if (totalHorasSinOcurrencias < this.cargaHoraria) {
        this.mensajeCargaHoraria = "Faltan horas semanales por cargar para completar las horas de carga horaria informada.";
        this.tipoMensajeCargaHoraria = 'pending-message';
      } else {
        this.mensajeCargaHoraria = "El total de horas semanales cargadas supera la carga horaria informada. Es necesario corregir.";
        this.tipoMensajeCargaHoraria = 'error-message';
      }
    }
  }*/

  crearDistribucion(): void {
    this.router.navigate(['/personal-dh-create'], {
      state: { asistencial: this.asistencial }
    });
  }
    
  verDistribucionHistorial(): void {
    if (this.asistencial && this.asistencial.id) {
      this.asistencialService.setCurrentAsistencial(this.asistencial);
      this.router.navigate(['/personal-dh-historial']); 
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
  }  

  editarMes(): void {
    this.router.navigate(['/personal-dh-edit'], {
      queryParams: {
        asistencialId: this.asistencial?.id,
        mes: this.mesYanio,
      }
    });
    

  }
  
}
