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
  mesSeleccionado: string = ''; // MM-YYYY
  mesesDisponibles: { value: string, label: string }[] = [];
  nombreMes: string = '';
  anoSeleccionado: number = 0;

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
      console.log('Asistencial recibido:', this.asistencial);

      if (!this.asistencial?.id) {
        this.location.back();
      } else {
        this.loadDistribuciones();  // Cargar las distribuciones
        this.loadNovedades();
        this.loadCargaHoraria();
        //this.calcularEstadoCargaHoraria();
      }

      // Inicializar el mes y año actual
      const fechaActual = moment();
      this.mesSeleccionado = `${fechaActual.month() + 1}-${fechaActual.year()}`;  // Formato MM-YYYY
      this.nombreMes = fechaActual.format('MMMM').toUpperCase();  // Nombre del mes
      this.anoSeleccionado = fechaActual.year();  // Año actual

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
  
    console.log('Combined Data:', combinedData);  // Verifica la estructura de los datos combinados
  
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

    // Agregar hasta 6 meses hacia adelante
    for (let i = 0; i < 6; i++) {
      const mesSeleccionado = fechaActual.clone().add(i, 'months');
      mesesFuturos.push({
        value: `${mesSeleccionado.month() + 1}-${mesSeleccionado.year()}`,
        label: mesSeleccionado.format('MMMM YYYY').toUpperCase(),
      });
    }

    this.mesesDisponibles = mesesFuturos; // Mostramos los meses desde el actual hasta el futuro
    console.log('Meses disponibles:', this.mesesDisponibles);
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
    this.mesSeleccionado = event.target.value;
    this.nombreMes = moment().month(mes - 1).format('MMMM').toUpperCase(); // Nombre del mes
    this.anoSeleccionado = anio; // Año seleccionado

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
      const mesSeleccionado = parseInt(this.mesSeleccionado.split('-')[0], 10) - 1; // Restar 1 porque los meses en moment.js son 0-based
      const anoSeleccionado = parseInt(this.anoSeleccionado.toString(), 10);
      
      return distribuciones.filter(d => {
        const fechaInicio = moment(d.fechaInicio);
        const fechaFinalizacion = moment(d.fechaFinalizacion);
    
        // Filtrar las distribuciones por el mes y año seleccionados
        return fechaInicio.month() === mesSeleccionado && fechaInicio.year() === anoSeleccionado;
      });
    }
    
  // Función para configurar las columnas dinámicas
  setupColumns(): void {
    if (!this.distribucionesGuardia.length) return;
    const fechaInicio = this.distribucionesGuardia[0].fechaInicio;
    const startOfMonth = moment(fechaInicio).startOf('month');
    const endOfMonth = moment(fechaInicio).endOf('month');
    const daysInMonth = endOfMonth.diff(startOfMonth, 'days') + 1;
    const columns: string[] = ['clase', 'totalHoras', 'totalHorasFinDeSemana', 'totalHorasLunesAViernes'];
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
        const mesSeleccionadoMoment = moment(this.mesSeleccionado, 'MM-YYYY');  // Captura la fecha seleccionada
        this.novedadesPersonales = novedades.filter(novedad => {
          const fechaInicio = moment(novedad.fechaInicio);
          const fechaFinal = moment(novedad.fechaFinal);
          return (
            (fechaInicio.month() === mesSeleccionadoMoment.month() && fechaInicio.year() === mesSeleccionadoMoment.year()) ||
            (fechaFinal.month() === mesSeleccionadoMoment.month() && fechaFinal.year() === mesSeleccionadoMoment.year())
          );
        });
        this.setupColumns();  // Configurar columnas dinámicamente para reflejar las novedades
      });
    }
  }
  
  aggregateDistribucionesGuardia(distribuciones: DistribucionGuardia[]): DistribucionGuardiaWithHoras {
    // Filtrar distribuciones por mes y año
    const distribucionesFiltradas = this.filterDistribucionesPorMes(distribuciones);
    console.log('Distribuciones filtradas para Guardias:', distribucionesFiltradas);
    
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
      const tooltip = `${distribucion.puestoSalud}, ${moment(distribucion.horaIngreso, 'HH:mm').format('HH:mm')} hs`;
      
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
    this.router.navigate(['/dist-horaria'], {
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
        mes: this.mesSeleccionado,
      }
    });
    

  }
  
}


/*import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { DistribucionGuardiaService } from 'src/app/services/personal/distribucionGuardia.service';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { DistribucionGuardia } from 'src/app/models/personal/DistribucionGuardia';
import * as moment from 'moment';

@Component({
  selector: 'app-personal-dh',
  templateUrl: './personal-dh.component.html',
  styleUrls: ['./personal-dh.component.css']
})
export class PersonalDhComponent implements OnInit, OnDestroy {
  
  suscription!: Subscription;
  asistencial: Asistencial | null = null;
  distribuciones: DistribucionGuardia[] = [];
  selectedMonth = moment().month(); // Mes actual
  selectedYear = moment().year();  // Año actual
  displayedColumns: string[] = ['Tipo', 'totalHoras', 'weekdaysTotal', 'weekendsTotal'];

  // Nuevas propiedades para manejar la selección de mes y año
  mesSeleccionado: string = `${this.selectedMonth + 1}-${this.selectedYear}`; // Formato MM-YYYY
  nombreMes: string = moment().format('MMMM').toUpperCase();
  anoSeleccionado: number = this.selectedYear;
  mesesDisponibles: { value: string, label: string }[] = []; // Lista de meses disponibles
  
  constructor(
    private asistencialService: AsistencialService,
    private distribucionGuardiaService: DistribucionGuardiaService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.suscription = this.asistencialService.currentAsistencial$.subscribe(asistencial => {
      this.asistencial = asistencial;
      if (!this.asistencial?.id) {
        this.location.back(); // Redirigir a la página anterior si no hay asistencial
      } else {
        // Cargar distribuciones y generar columnas de la tabla
        this.getDistribuciones();
        this.generateTableColumns();
        
        // Generar meses disponibles
        this.generarMesesDisponibles();
      }
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  // Obtener distribuciones para el mes y año seleccionados
  getDistribuciones(): void {
    if (this.asistencial?.id) {
      this.distribucionGuardiaService.getDistribucionesByPersona(this.asistencial.id).subscribe(distribuciones => {
        // Filtrar las distribuciones para el mes y año seleccionados
        this.distribuciones = distribuciones.filter(distribucion => {
          const fechaInicio = moment(distribucion.fechaInicio);
          return fechaInicio.month() === this.selectedMonth && fechaInicio.year() === this.selectedYear;
        });
      });
    }
  }

  // Generar las columnas de la tabla, una por cada día del mes seleccionado
  generateTableColumns(): void {
    // Limpiar las columnas previas antes de agregar nuevas
    this.displayedColumns = ['Tipo', 'totalHoras', 'weekdaysTotal', 'weekendsTotal'];
    
    const startOfMonth = moment().month(this.selectedMonth).year(this.selectedYear).startOf('month');
    const endOfMonth = moment().month(this.selectedMonth).year(this.selectedYear).endOf('month');
    const daysInMonth = endOfMonth.date();

    // Agregar columnas para los días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment().month(this.selectedMonth).year(this.selectedYear).date(day);
      const columnId = date.format('YYYY_MM_DD');
      this.displayedColumns.push(columnId);  // Agregar columna para cada día
    }
  }

  // Generar los meses disponibles para el select (hasta 6 meses hacia adelante)
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
  
    this.mesesDisponibles = mesesFuturos; // Lista de meses disponibles
    console.log('Meses disponibles:', this.mesesDisponibles);
  }

  // Actualizar mes y año seleccionados al cambiar el valor en el select
  onMonthChange(event: any): void {
    const [mes, anio] = event.target.value.split('-').map(Number);
    this.selectedMonth = mes - 1; // Cambiar de formato MM-YYYY a índice de mes 0-11
    this.selectedYear = anio;
    this.mesSeleccionado = event.target.value;
    this.nombreMes = moment().month(this.selectedMonth).format('MMMM').toUpperCase(); // Nombre del mes en mayúsculas
    this.anoSeleccionado = anio; // Año seleccionado
    
    // Actualizar las distribuciones y las columnas de la tabla para el nuevo mes
    this.getDistribuciones();
    this.generateTableColumns();
  }

  // Calcular total de horas para lunes a viernes
  calculateWeekdaysTotal(distribucion: DistribucionGuardia): number {
    let totalHoras = 0;
    const diasDeLaSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];  // Mayúsculas y sin acentos
    const diaDistribucion = this.normalizarDia(distribucion.dia); // Normalizar el día de la distribucion
    if (diasDeLaSemana.includes(diaDistribucion)) {
      // Contar cuántos días de la semana ocurren en el mes
      const diasEnElMes = this.countDaysInMonth(diaDistribucion);
      totalHoras += distribucion.cantidadHoras * diasEnElMes; // Multiplicar por las repeticiones
    }
    return totalHoras;
  }

  // Calcular total de horas para sábado y domingo
  calculateWeekendsTotal(distribucion: DistribucionGuardia): number {
    let totalHoras = 0;
    const diasDeFinDeSemana = ['SABADO', 'DOMINGO']; // Mayúsculas y sin acentos
    const diaDistribucion = this.normalizarDia(distribucion.dia); // Normalizar el día de la distribucion
    if (diasDeFinDeSemana.includes(diaDistribucion)) {
      // Contar cuántos días de la semana ocurren en el mes
      const diasEnElMes = this.countDaysInMonth(diaDistribucion);
      totalHoras += distribucion.cantidadHoras * diasEnElMes; // Multiplicar por las repeticiones
    }
    return totalHoras;
  }

  // Calcular total de horas (suma de weekdaysTotal y weekendsTotal)
  calculateTotalHours(distribucion: DistribucionGuardia): number {
    return this.calculateWeekdaysTotal(distribucion) + this.calculateWeekendsTotal(distribucion);
  }

  // Calcular las horas para cada día específico del mes
  calculateHoursForDate(actividad: any, fechaColumna: string): string {
    // Usamos el nombre del día de la semana (Lunes, Martes, etc) y buscamos la distribución
    const fecha = moment(fechaColumna, 'YYYY_MM_DD').format('dddd').toUpperCase(); // Obtener el día de la semana en formato 'LUNES', 'MARTES', etc.
    
    // Encontrar la distribución que coincida con el día de la semana
    const distribucion = this.distribuciones.find(d => this.normalizarDia(d.dia) === fecha);
    
    return distribucion ? `${distribucion.cantidadHoras} hs` : '0 hs'; // Si hay una distribución, devolver las horas, sino devolver 0 hs
  }

  // Normalizar el nombre del día para que sea en mayúsculas y sin acentos
  normalizarDia(dia: string): string {
    const diasSinAcentos: { [key: string]: string } = {
      'Á': 'A',
      'É': 'E',
      'Í': 'I',
      'Ó': 'O',
      'Ú': 'U',
      'À': 'A',
      'È': 'E',
      'Ù': 'U',
      'Ç': 'C',
    };
    
    return dia.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Convertir a mayúsculas y quitar acentos
  }

  // Contar cuántos días del mes tienen la misma ocurrencia para un día específico (Lunes, Martes, etc)
  countDaysInMonth(dia: string): number {
    const startOfMonth = moment().month(this.selectedMonth).year(this.selectedYear).startOf('month');
    const endOfMonth = moment().month(this.selectedMonth).year(this.selectedYear).endOf('month');
    let count = 0;

    // Iterar sobre todos los días del mes
    for (let day = startOfMonth; day.isBefore(endOfMonth, 'day'); day.add(1, 'day')) {
      if (day.format('dddd').toUpperCase() === dia) {
        count++;
      }
    }

    return count; // Retorna cuántas veces se repite el día
  }

  // Obtener la fecha a partir del ID de la columna
  getFechaFromColumnId(columnId: string): Date {
    return moment(columnId, 'YYYY_MM_DD').toDate();
  }
  
  getTooltip(distribucion: DistribucionGuardia, columnId: string): string {
    const fechaColumna = moment(columnId, 'YYYY_MM_DD');
    const dia = fechaColumna.format('dddd').toUpperCase(); // Obtener el día de la semana en mayúsculas (ej: "LUNES")
  
    console.log(`Dia: ${distribucion.dia}, Fecha columna: ${dia}`); // Verifica que se está comparando correctamente
  
    // Verificamos si la distribución tiene guardia ese día
    if (distribucion.dia === dia) {
      return `Guardia: ${distribucion.tipoGuardia}; 
      Ingreso: ${distribucion.horaIngreso} hs; 
      Servicio: ${distribucion.servicio.descripcion}`;
        }
  
    return ''; // Si no coincide, no mostramos el tooltip
  }
}*/



/*import { Component, OnInit, OnDestroy } from '@angular/core';
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
        //this.loadDistribuciones(this.asistencial.id);
        this.loadCargaHoraria();
        this.loadNovedades(this.asistencial.id);
        
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

 // this.filtrarDistribucionesPorMes(); // Opcional: Filtrar distribuciones cuando cambie el mes
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



}*/
