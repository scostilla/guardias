import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subscription, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
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
import { PersonalDhDetailComponent } from '../personal-dh-detail/personal-dh-detail.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

// Interfaz temporal para agrupar las horas por día y calcular totales
interface DistribucionGuardiaWithHoras extends DistribucionGuardia {
  horasPorDia: { 
    [key: string]: { 
      horas: string; 
      tooltip: string;
      fechaInicio: Date;
      fechaFin: Date;
    }[] 
  };
  totalHorasFinDeSemana: number;
  totalHorasLunesAViernes: number;
  totalHoras: number;
  totalHorasSinOcurrencias: number;
  clase?: string;
  totalHorasLunesAViernesTexto?: string;
  totalHorasFinDeSemanaTexto?: string;
  totalHorasTexto?: string;
}

interface DistribucionConsultorioWithHoras extends DistribucionConsultorio {
  horasPorDia: { 
    [key: string]: { 
      horas: string; 
      tooltip: string;
      fechaInicio: Date;
      fechaFin: Date;
    }[] 
  };
  totalHorasFinDeSemana: number;
  totalHorasLunesAViernes: number;
  totalHoras: number;
  totalHorasSinOcurrencias: number;
  clase?: string;
  totalHorasLunesAViernesTexto?: string;
  totalHorasFinDeSemanaTexto?: string;
  totalHorasTexto?: string;
}

interface DistribucionGiraWithHoras extends DistribucionGira {
  horasPorDia: { 
    [key: string]: { 
      horas: string; 
      tooltip: string;
      fechaInicio: Date;
      fechaFin: Date;
    }[] 
  };
  totalHorasFinDeSemana: number;
  totalHorasLunesAViernes: number;
  totalHoras: number;
  totalHorasSinOcurrencias: number;
  clase?: string;
  totalHorasLunesAViernesTexto?: string;
  totalHorasFinDeSemanaTexto?: string;
  totalHorasTexto?: string;
}

interface DistribucionOtroWithHoras extends DistribucionOtro {
  horasPorDia: { 
    [key: string]: { 
      horas: string; 
      tooltip: string;
      fechaInicio: Date;
      fechaFin: Date;
    }[] 
  };
  totalHorasFinDeSemana: number;
  totalHorasLunesAViernes: number;
  totalHoras: number;
  totalHorasSinOcurrencias: number;
  clase?: string;
  totalHorasLunesAViernesTexto?: string;
  totalHorasFinDeSemanaTexto?: string;
  totalHorasTexto?: string;
}

interface Tipos {
  value: string;
  viewValue: string;
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
  asistencialId!: number;
  distribucionesGuardia: DistribucionGuardiaWithHoras[] = [];
  distribucionesConsultorio: DistribucionConsultorioWithHoras[] = [];
  distribucionesGira: DistribucionGiraWithHoras[] = [];
  distribucionesOtro: DistribucionOtroWithHoras[] = [];
  displayedColumns: string[] = [];
  novedadesPersonales: NovedadPersonal[] = [];

  //Para el dialog
  distribucionesGuardia_dialog: DistribucionGuardia[] = [];
  distribucionesConsultorio_dialog: DistribucionConsultorio[] = [];
  distribucionesGira_dialog: DistribucionGira[] = [];
  distribucionesOtro_dialog: DistribucionOtro[] = [];

  hasGuardiaDistributions: boolean = false;
  hasConsultorioDistributions: boolean = false;
  hasGiraDistributions: boolean = false;
  hasOtroDistributions: boolean = false;

  // Variables para el selector de mes y año
  mesYanio: string = ''; // MM-YYYY
  mesesDisponibles: { value: string, label: string }[] = [];
  nombreMes: string = '';
  anioSeleccionado!: number;
  mesSeleccionado!: number;

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

  tipos: Tipos[] = [
    { value: 'PASE_DE_SALA', viewValue: 'Pase de sala' },
    { value: 'ATENEO', viewValue: 'Ateneo' },
    { value: 'CONSULTORIO_EN_CAPS', viewValue: 'Consultorio en CAPS' },
    { value: 'OTROS', viewValue: 'Otros' },
  ];

  constructor(
    private asistencialService: AsistencialService,
    private distribucionGuardiaService: DistribucionGuardiaService,
    private distribucionConsultorioService: DistribucionConsultorioService,
    private distribucionGiraService: DistribucionGiraService,
    private distribucionOtroService: DistribucionOtroService,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
    private novedadPersonalService: NovedadPersonalService
  ) { }

  ngOnInit(): void {
    this.suscription = this.asistencialService.currentAsistencialId$.subscribe(id => {
      if (id === null) {
        this.location.back();
        return;
      }
    
      this.asistencialService.detail(id).subscribe({
        next: (asistencial) => {
          this.asistencial = asistencial;
    
          const fechaActual = moment();
          this.mesYanio = `${fechaActual.month() + 1}-${fechaActual.year()}`;
          this.nombreMes = fechaActual.format('MMMM').toUpperCase();
          this.anioSeleccionado = fechaActual.year();
          this.mesSeleccionado = fechaActual.month() + 1;
    
          this.generarMesesDisponibles();
          this.loadDistribuciones();
          this.loadNovedades();
          this.loadCargaHoraria();
          this.verificarDistribuciones();
        },
        error: (err) => {
          console.error('No se pudo obtener el asistencial por ID:', err);
          this.location.back();
        }
      });
    });
  }  

  /*ngOnInit(): void {
    this.suscription = this.asistencialService.currentAsistencial$.subscribe(asistencial => {
      this.asistencial = asistencial;
      //console.log('Asistencial recibido:', this.asistencial);
  
      if (!this.asistencial?.id) {
        this.location.back();
      } else {
        // Inicializar el mes y año actual
        const fechaActual = moment();
        this.mesYanio = `${fechaActual.month() + 1}-${fechaActual.year()}`;  // Formato MM-YYYY
        this.nombreMes = fechaActual.format('MMMM').toUpperCase();  // Nombre del mes
        this.anioSeleccionado = fechaActual.year();  // Año actual
        this.mesSeleccionado = fechaActual.month() + 1;  // Mes actual (1-12)
  
        this.generarMesesDisponibles();  // Generar meses disponibles
  
        // Cargar distribuciones y novedades
        this.loadDistribuciones();
        this.loadNovedades();
        this.loadCargaHoraria();
  
        // Verificar distribuciones después de cargar los datos
        this.verificarDistribuciones();
      }
    });
  }*/

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
  
    this.distribucionesGuardia_dialog = [];
    this.distribucionesConsultorio_dialog = [];
    this.distribucionesGira_dialog = [];
    this.distribucionesOtro_dialog = [];
  
    this.hasGuardiaDistributions = false;
    this.hasConsultorioDistributions = false;
    this.hasGiraDistributions = false;
    this.hasOtroDistributions = false;
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
  
    // Verificar si hay distribuciones disponibles para cada tipo
    this.verificarDistribuciones();
  }
  
  verificarDistribuciones(): void {
    if (!this.asistencial) {
      return;
    }
  
    const mes = this.mesSeleccionado;
    const anio = this.anioSeleccionado;
  
    // Verificar distribuciones para cada tipo
    this.distribucionGuardiaService.getDistribucionesByActivoPersonaAndFechaInicio(this.asistencial.id!, mes, anio).subscribe(
      (distribuciones) => {
        this.hasGuardiaDistributions = (distribuciones && distribuciones.length > 0) || false;
      },
      (error) => {
        // Manejo de error
        console.error('Error al obtener distribuciones de Guardia:', error);
        this.hasGuardiaDistributions = false;
      }
    );
  
    this.distribucionConsultorioService.getDistribucionesByActivoPersonaAndFechaInicio(this.asistencial.id!, mes, anio).subscribe(
      (distribuciones) => {
        this.hasConsultorioDistributions = (distribuciones && distribuciones.length > 0) || false;
      },
      (error) => {
        // Manejo de error
        console.error('Error al obtener distribuciones de Consultorio:', error);
        this.hasConsultorioDistributions = false;
      }
    );
  
    this.distribucionGiraService.getDistribucionesByActivoPersonaAndFechaInicio(this.asistencial.id!, mes, anio).subscribe(
      (distribuciones) => {
        this.hasGiraDistributions = (distribuciones && distribuciones.length > 0) || false;
      },
      (error) => {
        // Manejo de error
        console.error('Error al obtener distribuciones de Gira:', error);
        this.hasGiraDistributions = false;
      }
    );
  
    this.distribucionOtroService.getDistribucionesByActivoPersonaAndFechaInicio(this.asistencial.id!, mes, anio).subscribe(
      (distribuciones) => {
        this.hasOtroDistributions = (distribuciones && distribuciones.length > 0) || false;
      },
      (error) => {
        // Manejo de error
        console.error('Error al obtener distribuciones de Otro:', error);
        this.hasOtroDistributions = false;
      }
    );
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
    if (!this.asistencial || !this.mesYanio || !this.anioSeleccionado) return;

    const mes = parseInt(this.mesYanio.split('-')[0], 10);
    const anio = parseInt(this.anioSeleccionado.toString(), 10);

    this.distribucionGuardiaService
      .getDistribucionesByActivoPersonaAndFechaInicio(this.asistencial.id!, mes, anio)
      .subscribe((distribuciones: DistribucionGuardia[]) => {
        const data = distribuciones ?? [];
        this.distribucionesGuardia = data.map(d => ({
          ...d,
          horasPorDia: {},
          totalHoras: 0,
          totalHorasFinDeSemana: 0,
          totalHorasLunesAViernes: 0,
          totalHorasSinOcurrencias: 0,
          clase: ''
        }));
        this.checkLoadingState();
        this.setupColumns();
      }, error => {
        console.error('Error al cargar distribuciones de guardia:', error);
        this.distribucionesGuardia = [];
        this.checkLoadingState();
      });
  }
  
  loadDistribucionConsultorio(): void {
    if (!this.asistencial || !this.mesYanio || !this.anioSeleccionado) return;

    const mes = parseInt(this.mesYanio.split('-')[0], 10);
    const anio = parseInt(this.anioSeleccionado.toString(), 10);

    this.distribucionConsultorioService
      .getDistribucionesByActivoPersonaAndFechaInicio(this.asistencial.id!, mes, anio)
      .subscribe((distribuciones: DistribucionConsultorio[]) => {
        const data = distribuciones ?? [];
        this.distribucionesConsultorio = data.map(d => ({
          ...d,
          horasPorDia: {},
          totalHoras: 0,
          totalHorasFinDeSemana: 0,
          totalHorasLunesAViernes: 0,
          totalHorasSinOcurrencias: 0,
          clase: ''
        }));
        this.checkLoadingState();
        this.setupColumns();
      }, error => {
        console.error('Error al cargar distribuciones de consultorio:', error);
        this.distribucionesConsultorio = [];
        this.checkLoadingState();
      });
  }
  
  loadDistribucionGira(): void {
    if (!this.asistencial || !this.mesYanio || !this.anioSeleccionado) return;

    const mes = parseInt(this.mesYanio.split('-')[0], 10);
    const anio = parseInt(this.anioSeleccionado.toString(), 10);

    this.distribucionGiraService
      .getDistribucionesByActivoPersonaAndFechaInicio(this.asistencial.id!, mes, anio)
      .subscribe((distribuciones: DistribucionGira[]) => {
        const data = distribuciones ?? [];
        this.distribucionesGira = data.map(d => ({
          ...d,
          horasPorDia: {},
          totalHoras: 0,
          totalHorasFinDeSemana: 0,
          totalHorasLunesAViernes: 0,
          totalHorasSinOcurrencias: 0,
          clase: ''
        }));
        this.checkLoadingState();
        this.setupColumns();
      }, error => {
        console.error('Error al cargar distribuciones de gira:', error);
        this.distribucionesGira = [];
        this.checkLoadingState();
      });
  }
  
  loadDistribucionOtro(): void {
    if (!this.asistencial || !this.mesYanio || !this.anioSeleccionado) return;

    const mes = parseInt(this.mesYanio.split('-')[0], 10);
    const anio = parseInt(this.anioSeleccionado.toString(), 10);

    this.distribucionOtroService
      .getDistribucionesByActivoPersonaAndFechaInicio(this.asistencial.id!, mes, anio)
      .subscribe((distribuciones: DistribucionOtro[]) => {
        const data = distribuciones ?? [];
        this.distribucionesOtro = data.map(d => ({
          ...d,
          horasPorDia: {},
          totalHoras: 0,
          totalHorasFinDeSemana: 0,
          totalHorasLunesAViernes: 0,
          totalHorasSinOcurrencias: 0,
          clase: ''
        }));
        this.checkLoadingState();
        this.setupColumns();
      }, error => {
        console.error('Error al cargar distribuciones de otro:', error);
        this.distribucionesOtro = [];
        this.checkLoadingState();
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
    
    /*/ Filtrar distribuciones por mes
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
    }*/
    
  // Función para configurar las columnas dinámicas
setupColumns(): void {
  const todasLasDistribuciones = [
    ...this.distribucionesGuardia,
    ...this.distribucionesConsultorio,
    ...this.distribucionesGira,
    ...this.distribucionesOtro
  ];

  if (todasLasDistribuciones.length === 0) return;

  // Obtener el rango completo de fechas
  const fechasInicio = todasLasDistribuciones.map(d => moment(d.fechaInicio));
  const fechasFin = todasLasDistribuciones.map(d => moment(d.fechaFinalizacion ?? d.fechaInicio));

  const minFecha = moment.min(fechasInicio).startOf('day');
  const maxFecha = moment.max(fechasFin).endOf('day');

  // Asegurarse de que el rango cubre todo el mes seleccionado
  const mes = this.mesYanio ? parseInt(this.mesYanio.split('-')[0], 10) : moment().month() + 1;
  const anio = this.anioSeleccionado || moment().year();
  
  const inicioMes = moment(`${anio}-${mes}-01`, 'YYYY-M-DD');
  const finMes = moment(inicioMes).endOf('month');

  // Usar el rango más amplio (entre el mes completo y las fechas de las distribuciones)
  const fechaInicioMostrar = moment.min(inicioMes, minFecha);
  const fechaFinMostrar = moment.max(finMes, maxFecha);

  const daysRange = fechaFinMostrar.diff(fechaInicioMostrar, 'days') + 1;

  const columns: string[] = ['clase', 'totalHoras', 'totalHorasFinDeSemana', 'totalHorasLunesAViernes'];

  for (let i = 0; i < daysRange; i++) {
    columns.push(fechaInicioMostrar.clone().add(i, 'days').format('YYYY_MM_DD'));
  }

  this.displayedColumns = columns;
}
  
getFechaFromColumnId(columnId: string): string {
  const fecha = moment(columnId, 'YYYY_MM_DD').toDate();
    return fecha ? fecha.toISOString().split('T')[0] : '';
 }

getHorasForDate(
  distribucion: DistribucionGuardiaWithHoras, 
  fechaColumna: string
): { horas: string, tooltip: string, showDetails: boolean }[] {
  const fechaMoment = moment(fechaColumna, 'YYYY_MM_DD');
  const diaColumn = fechaMoment.format('dddd').toLowerCase();
  
  if (distribucion.horasPorDia[diaColumn]) {
    return distribucion.horasPorDia[diaColumn]
      .filter(entry => {
        const entryInicio = moment(entry.fechaInicio);
        const entryFin = moment(entry.fechaFin);
        return fechaMoment.isBetween(entryInicio, entryFin, 'day', '[]');
      })
      .map(entry => ({
        horas: entry.horas,
        tooltip: entry.tooltip,
        showDetails: this.showDetails
      }));
  }
  return [];
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
      case 'duelo': return 'novedad-personal-duelo';
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

convertirDecimalAHorasYMinutos(decimal: number): string {
  const horas = Math.floor(decimal);
  const minutos = Math.round((decimal - horas) * 60);

  if (minutos === 0) {
    return `${horas}`; // Solo horas si minutos es 0
  } else {
    return `${horas}:${minutos.toString().padStart(2, '0')}`;
  }
}
  
aggregateDistribucionesGuardia(distribuciones: DistribucionGuardia[]): DistribucionGuardiaWithHoras {
  if (!distribuciones.length) return {} as DistribucionGuardiaWithHoras;

  const horasPorDia: { 
    [key: string]: { 
      horas: string, 
      tooltip: string, 
      fechaInicio: Date, 
      fechaFin: Date 
    }[] 
  } = {};

  let totalHorasFinDeSemana = 0;
  let totalHorasLunesAViernes = 0;
  let totalHoras = 0;
  let totalHorasSinOcurrencias = 0;

  distribuciones.forEach(distribucion => {
    const fechaInicio = moment(distribucion.fechaInicio);
    const fechaFin = moment(distribucion.fechaFinalizacion ?? distribucion.fechaInicio);
    const dia = this.mapaDias[distribucion.dia];
    
    if (!dia) {
      console.error(`Día inválido: ${distribucion.dia}`);
      return;
    }

    // Calcular cuántas veces ocurre este día específico en el rango
    let ocurrencias = 0;
    for (let m = fechaInicio.clone(); m.isSameOrBefore(fechaFin, 'day'); m.add(1, 'days')) {
      if (m.format('dddd').toLowerCase() === dia.toLowerCase()) {
        ocurrencias++;
      }
    }

    const horas = distribucion.cantidadHoras;
    const horasTotalesPorDia = horas * ocurrencias;
    const tooltip = `${distribucion.tipoGuardia}, ${distribucion.servicio.descripcion}, ${moment(distribucion.horaIngreso, 'HH:mm').format('HH:mm')} hs`;

    totalHorasSinOcurrencias += horas;

    // Guardar con información de rango
    if (horasPorDia[dia]) {
      horasPorDia[dia].push({ 
        horas: `${horas} hs`, 
        tooltip,
        fechaInicio: fechaInicio.toDate(),
        fechaFin: fechaFin.toDate()
      });
    } else {
      horasPorDia[dia] = [{ 
        horas: `${horas} hs`, 
        tooltip,
        fechaInicio: fechaInicio.toDate(),
        fechaFin: fechaFin.toDate()
      }];
    }

    // Calcular totales
    if (dia === 'sábado' || dia === 'domingo') {
      totalHorasFinDeSemana += horasTotalesPorDia;
    } else {
      totalHorasLunesAViernes += horasTotalesPorDia;
    }

    totalHoras += horasTotalesPorDia;
  });

  // Crear objeto resultante
  const aggregatedDistribucion = { 
    ...distribuciones[0],
    horasPorDia,
    totalHorasFinDeSemana,
    totalHorasLunesAViernes,
    totalHoras,
    totalHorasSinOcurrencias,
    clase: 'Guardias'
  } as DistribucionGuardiaWithHoras;

  aggregatedDistribucion.totalHorasLunesAViernesTexto = this.convertirDecimalAHorasYMinutos(totalHorasLunesAViernes) + ' horas';
  aggregatedDistribucion.totalHorasFinDeSemanaTexto = this.convertirDecimalAHorasYMinutos(totalHorasFinDeSemana) + ' horas';
  aggregatedDistribucion.totalHorasTexto = this.convertirDecimalAHorasYMinutos(totalHoras) + ' horas';
  
  return aggregatedDistribucion;
}

aggregateDistribucionesConsultorio(distribuciones: DistribucionConsultorio[]): DistribucionConsultorioWithHoras {
  if (!distribuciones.length) return {} as DistribucionConsultorioWithHoras;

  const horasPorDia: { [key: string]: { horas: string, tooltip: string, fechaInicio: Date, fechaFin: Date }[] } = {};
  let totalHorasFinDeSemana = 0;
  let totalHorasLunesAViernes = 0;
  let totalHoras = 0;
  let totalHorasSinOcurrencias = 0;

  distribuciones.forEach(distribucion => {
    const fechaInicio = moment(distribucion.fechaInicio);
    const fechaFin = moment(distribucion.fechaFinalizacion ?? distribucion.fechaInicio);
    const dia = this.mapaDias[distribucion.dia];
    
    if (!dia) {
      console.error(`Día inválido: ${distribucion.dia}`);
      return;
    }

    // Calcular ocurrencias para este rango específico
    let ocurrencias = 0;
    for (let m = fechaInicio.clone(); m.isSameOrBefore(fechaFin, 'day'); m.add(1, 'days')) {
      if (m.format('dddd').toLowerCase() === dia.toLowerCase()) {
        ocurrencias++;
      }
    }

    const horas = distribucion.cantidadHoras;
    const horasTotalesPorDia = horas * ocurrencias;
    const horasFormato = this.convertirDecimalAHorasYMinutos(horas);
    const tooltip = `${distribucion.tipoConsultorio}, ${distribucion.servicio.descripcion}, ${moment(distribucion.horaIngreso, 'HH:mm').format('HH:mm')} hs`;

    totalHorasSinOcurrencias += horas;

    if (horasPorDia[dia]) {
      horasPorDia[dia].push({ 
        horas: `${horasFormato} hs`, 
        tooltip,
        fechaInicio: fechaInicio.toDate(),
        fechaFin: fechaFin.toDate()
      });
    } else {
      horasPorDia[dia] = [{ 
        horas: `${horasFormato} hs`, 
        tooltip,
        fechaInicio: fechaInicio.toDate(),
        fechaFin: fechaFin.toDate()
      }];
    }

    if (dia === 'sábado' || dia === 'domingo') {
      totalHorasFinDeSemana += horasTotalesPorDia;
    } else {
      totalHorasLunesAViernes += horasTotalesPorDia;
    }

    totalHoras += horasTotalesPorDia;
  });

  const aggregatedDistribucion = { 
    ...distribuciones[0],
    horasPorDia,
    totalHorasFinDeSemana,
    totalHorasLunesAViernes,
    totalHoras,
    totalHorasSinOcurrencias,
    clase: 'Consultorio'
  } as DistribucionConsultorioWithHoras;

  aggregatedDistribucion.totalHorasLunesAViernesTexto = this.convertirDecimalAHorasYMinutos(totalHorasLunesAViernes) + ' horas';
  aggregatedDistribucion.totalHorasFinDeSemanaTexto = this.convertirDecimalAHorasYMinutos(totalHorasFinDeSemana) + ' horas';
  aggregatedDistribucion.totalHorasTexto = this.convertirDecimalAHorasYMinutos(totalHoras) + ' horas';

  return aggregatedDistribucion;
}

aggregateDistribucionesGira(distribuciones: DistribucionGira[]): DistribucionGiraWithHoras {
  if (!distribuciones.length) return {} as DistribucionGiraWithHoras;

  const horasPorDia: { [key: string]: { horas: string, tooltip: string, fechaInicio: Date, fechaFin: Date }[] } = {};
  let totalHorasFinDeSemana = 0;
  let totalHorasLunesAViernes = 0;
  let totalHoras = 0;
  let totalHorasSinOcurrencias = 0;

  distribuciones.forEach(distribucion => {
    const fechaInicio = moment(distribucion.fechaInicio);
    const fechaFin = moment(distribucion.fechaFinalizacion ?? distribucion.fechaInicio);
    const dia = this.mapaDias[distribucion.dia];
    
    if (!dia) {
      console.error(`Día inválido: ${distribucion.dia}`);
      return;
    }

    let ocurrencias = 0;
    for (let m = fechaInicio.clone(); m.isSameOrBefore(fechaFin, 'day'); m.add(1, 'days')) {
      if (m.format('dddd').toLowerCase() === dia.toLowerCase()) {
        ocurrencias++;
      }
    }

    const horas = distribucion.cantidadHoras;
    const horasTotalesPorDia = horas * ocurrencias;
    const tooltip = `${moment(distribucion.horaIngreso, 'HH:mm').format('HH:mm')} hs`;

    totalHorasSinOcurrencias += horas;

    if (horasPorDia[dia]) {
      horasPorDia[dia].push({ 
        horas: `${horas} hs`, 
        tooltip,
        fechaInicio: fechaInicio.toDate(),
        fechaFin: fechaFin.toDate()
      });
    } else {
      horasPorDia[dia] = [{ 
        horas: `${horas} hs`, 
        tooltip,
        fechaInicio: fechaInicio.toDate(),
        fechaFin: fechaFin.toDate()
      }];
    }

    if (dia === 'sábado' || dia === 'domingo') {
      totalHorasFinDeSemana += horasTotalesPorDia;
    } else {
      totalHorasLunesAViernes += horasTotalesPorDia;
    }

    totalHoras += horasTotalesPorDia;
  });

  const aggregatedDistribucion = { 
    ...distribuciones[0],
    horasPorDia,
    totalHorasFinDeSemana,
    totalHorasLunesAViernes,
    totalHoras,
    totalHorasSinOcurrencias,
    clase: 'Giras'
  } as DistribucionGiraWithHoras;

  aggregatedDistribucion.totalHorasLunesAViernesTexto = this.convertirDecimalAHorasYMinutos(totalHorasLunesAViernes) + ' horas';
  aggregatedDistribucion.totalHorasFinDeSemanaTexto = this.convertirDecimalAHorasYMinutos(totalHorasFinDeSemana) + ' horas';
  aggregatedDistribucion.totalHorasTexto = this.convertirDecimalAHorasYMinutos(totalHoras) + ' horas';

  return aggregatedDistribucion;
}

aggregateDistribucionesOtro(distribuciones: DistribucionOtro[]): DistribucionOtroWithHoras {
  if (!distribuciones.length) return {} as DistribucionOtroWithHoras;

  const horasPorDia: { [key: string]: { horas: string, tooltip: string, fechaInicio: Date, fechaFin: Date }[] } = {};
  let totalHorasFinDeSemana = 0;
  let totalHorasLunesAViernes = 0;
  let totalHoras = 0;
  let totalHorasSinOcurrencias = 0;

  distribuciones.forEach(distribucion => {
    const fechaInicio = moment(distribucion.fechaInicio);
    const fechaFin = moment(distribucion.fechaFinalizacion ?? distribucion.fechaInicio);
    const dia = this.mapaDias[distribucion.dia];
    
    if (!dia) {
      console.error(`Día no reconocido: ${distribucion.dia}`);
      return;
    }

    let ocurrencias = 0;
    for (let m = fechaInicio.clone(); m.isSameOrBefore(fechaFin, 'day'); m.add(1, 'days')) {
      if (m.format('dddd').toLowerCase() === dia.toLowerCase()) {
        ocurrencias++;
      }
    }

    const horas = distribucion.cantidadHoras;
    const horasTotalesPorDia = horas * ocurrencias;
    const horasFormato = this.convertirDecimalAHorasYMinutos(horas);
    const tipoView = this.tipos.find(t => t.value === distribucion.tipo)?.viewValue || distribucion.tipo;
    const descripcionPart = distribucion.descripcion ? `, ${distribucion.descripcion}` : '';
    const tooltip = `${tipoView}${descripcionPart}, ${distribucion.lugar}, ${moment(distribucion.horaIngreso, 'HH:mm').format('HH:mm')} hs`;

    totalHorasSinOcurrencias += horas;

    if (horasPorDia[dia]) {
      horasPorDia[dia].push({ 
        horas: `${horasFormato} hs`, 
        tooltip,
        fechaInicio: fechaInicio.toDate(),
        fechaFin: fechaFin.toDate()
      });
    } else {
      horasPorDia[dia] = [{ 
        horas: `${horasFormato} hs`, 
        tooltip,
        fechaInicio: fechaInicio.toDate(),
        fechaFin: fechaFin.toDate()
      }];
    }

    if (dia === 'sábado' || dia === 'domingo') {
      totalHorasFinDeSemana += horasTotalesPorDia;
    } else {
      totalHorasLunesAViernes += horasTotalesPorDia;
    }

    totalHoras += horasTotalesPorDia;
  });

  const aggregatedDistribucion = { 
    ...distribuciones[0],
    horasPorDia,
    totalHorasFinDeSemana,
    totalHorasLunesAViernes,
    totalHoras,
    totalHorasSinOcurrencias,
    clase: 'Otros'
  } as DistribucionOtroWithHoras;

  aggregatedDistribucion.totalHorasLunesAViernesTexto = this.convertirDecimalAHorasYMinutos(totalHorasLunesAViernes) + ' horas';
  aggregatedDistribucion.totalHorasFinDeSemanaTexto = this.convertirDecimalAHorasYMinutos(totalHorasFinDeSemana) + ' horas';
  aggregatedDistribucion.totalHorasTexto = this.convertirDecimalAHorasYMinutos(totalHoras) + ' horas';

  return aggregatedDistribucion;
}        
      
  /*/ Contar las ocurrencias de cada día en el mes
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
  }*/

  contarOcurrenciasEnRango(fechaInicio: moment.Moment, fechaFin: moment.Moment): { [key: string]: number } {
  const ocurrencias: { [key: string]: number } = {};

  for (let m = fechaInicio.clone(); m.isSameOrBefore(fechaFin, 'day'); m.add(1, 'days')) {
    const dia = m.format('dddd').toLowerCase();
    if (!ocurrencias[dia]) ocurrencias[dia] = 0;
    ocurrencias[dia]++;
  }

  return ocurrencias;
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
    // Verificar que el ID esté disponible
    this.asistencialService.currentAsistencialId$.subscribe(id => {
      if (id === null) {
        console.error('El ID del asistencial no está disponible.');
        this.location.back();
        return;
      }
  
      // Obtener el asistencial utilizando el ID
      this.asistencialService.detail(id).subscribe({
        next: (asistencial) => {
          // Asignamos el objeto asistencial al componente
          this.asistencial = asistencial;
  
          // Redirigir al historial
          this.router.navigate(['/personal-dh-historial']);
        },
        error: (err) => {
          console.error('No se pudo obtener el asistencial por ID:', err);
          this.location.back();
        }
      });
    });
  }
  
editarMes(): void {
  if (!this.asistencial) return;

  // Obtener todas las distribuciones combinadas
  const todasLasDistribuciones = [
    ...this.distribucionesGuardia,
    ...this.distribucionesConsultorio,
    ...this.distribucionesGira,
    ...this.distribucionesOtro
  ];

  // Si no hay distribuciones, usar el mes actual como fallback
  if (todasLasDistribuciones.length === 0) {
    this.router.navigate(['/personal-dh-edit'], {
      queryParams: {
        asistencialId: this.asistencial.id,
        fechaInicio: this.mesYanio,
      }
    });
    return;
  }

  // Inicializar con la primera fecha disponible (asegurando que es un moment.Moment)
  let ultimaFecha: moment.Moment = moment(todasLasDistribuciones[0].fechaInicio);
  
  // Encontrar la fecha más reciente
  todasLasDistribuciones.forEach(dist => {
    const fechaDist = moment(dist.fechaInicio);
    if (fechaDist.isAfter(ultimaFecha)) {
      ultimaFecha = fechaDist;
    }
  });

  // Navegar con la fecha formateada
  this.router.navigate(['/personal-dh-edit'], {
    queryParams: {
      asistencialId: this.asistencial.id,
      fechaInicio: ultimaFecha.format('YYYY-MM-DD')
    }
  });
}

  obtenerDistribucionesYAbrirDialogo(tipo: string): void {
    if (!this.asistencial) {
      console.error("No se ha encontrado el asistencial");
      return; // No continuar si asistencial es null
    }
  
    let distribuciones$: Observable<any>;  // Usamos `any` para ser flexibles con los diferentes tipos
  
    // Obtener el mes y año seleccionados
    const mes = this.mesSeleccionado; // Mes seleccionado (debería ser 1-12)
    const anio = this.anioSeleccionado; // Año seleccionado (debería ser un número como 2025)
  
    // Según el tipo de distribución, llamamos al servicio correspondiente
    switch (tipo) {
      case 'guardia':
        distribuciones$ = this.distribucionGuardiaService.getDistribucionesByActivoPersonaAndFechaInicio(this.asistencial.id!, mes, anio);
        break;
      case 'consultorio':
        distribuciones$ = this.distribucionConsultorioService.getDistribucionesByActivoPersonaAndFechaInicio(this.asistencial.id!, mes, anio);
        break;
      case 'gira':
        distribuciones$ = this.distribucionGiraService.getDistribucionesByActivoPersonaAndFechaInicio(this.asistencial.id!, mes, anio);
        break;
      case 'otro':
        distribuciones$ = this.distribucionOtroService.getDistribucionesByActivoPersonaAndFechaInicio(this.asistencial.id!, mes, anio);
        break;
      default:
        console.error('Tipo de distribución no reconocido');
        return;
    }
  
    // Una vez obtenidas las distribuciones, actualizamos las propiedades y abrimos el diálogo
    distribuciones$.subscribe(
      (distribuciones: any[]) => {  // `any[]` porque el tipo varía según el tipo de distribución
        // Almacenar las distribuciones según el tipo
        switch (tipo) {
          case 'guardia':
            this.distribucionesGuardia_dialog = distribuciones;
            this.hasGuardiaDistributions = distribuciones.length > 0;
            break;
          case 'consultorio':
            this.distribucionesConsultorio_dialog = distribuciones;
            this.hasConsultorioDistributions = distribuciones.length > 0;
            break;
          case 'gira':
            this.distribucionesGira_dialog = distribuciones;
            this.hasGiraDistributions = distribuciones.length > 0;
            break;
          case 'otro':
            this.distribucionesOtro_dialog = distribuciones;
            this.hasOtroDistributions = distribuciones.length > 0;
            break;
        }
  
        // Abre el diálogo con las distribuciones correspondientes
        this.dialog.open(PersonalDhDetailComponent, {
          data: {
            distribuciones: distribuciones, // Pasa las distribuciones obtenidas
            tipo: tipo, // Pasa el tipo de distribución
            idPersona: this.asistencial!.id, // Pasa el idPersona
            fechaInicio: `${mes}-${anio}` // Pasa el mes y año en formato MM-YYYY
          }
        });
      },
      (error) => {
        console.error('Error al obtener distribuciones:', error);
      }
    );
  }

  isColSombreada(index: number): boolean {
  // Alternar columnas: sombrear las impares (índice base 0 = 0, 2, 4...)
  return index % 2 === 0;
}
}