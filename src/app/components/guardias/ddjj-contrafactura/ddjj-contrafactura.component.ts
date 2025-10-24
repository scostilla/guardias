import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import 'moment/locale/es';

//Componentes
import { RmensualContrafacturaDetailComponent } from '../rmensual-contrafactura-detail/rmensual-contrafactura-detail.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { DialogConfirmDdjjComponent } from '../dialog-confirm-ddjj/dialog-confirm-ddjj.component';
import { RegistroActividadesEditComponent } from 'src/app/components/actividades/registro-actividades-edit/registro-actividades-edit.component';
import { DialogHistorialObservacionesComponent } from '../dialog-historial-observaciones/dialog-historial-observaciones.component';

//Services
import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { DdjjService } from 'src/app/services/ddjj.service';
import { ObservacionDdjjService } from 'src/app/services/observacionDdjj.service';
import { CronogramaDefinitivoService } from 'src/app/services/Cronogramas/cronogramaDefinitivo.service';

//Models y dto
import { Feriado } from 'src/app/models/Configuracion/Feriado';
import { NovedadPersonalListDto } from 'src/app/dto/guardias/NovedadPersonalListDto';

import { ServicioSummaryDto } from 'src/app/dto/Configuracion/ServicioSummaryDto';
import { EstadoDdjjDto } from 'src/app/dto/EstadoDdjjDto';
import { ObservacionDdjjDto } from 'src/app/dto/ObservacionDdjjDto';
import { ObservacionDdjjUltimoDto } from 'src/app/dto/ObservacionDdjjUltimoDto';
import { CronogramaDefinitivoDto } from 'src/app/dto/Cronogramas/CronogramaDefinitivoDto';
import { AutoridadImagenDto } from 'src/app/dto/AutoridadImagenDto';
import { DdjjListDto } from 'src/app/dto/DdjjListDto';
import { RegistroMensualListDto } from 'src/app/dto/RegistroMensualListDto';
import { RegActivListDto } from 'src/app/dto/guardias/RegActivListDto';

//Exportar a EXCEL y PDFD
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = (pdfFonts as any).vfs;

//Autenticación
import { TokenService } from 'src/app/services/login/token.service';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';


interface ClasesNovedad {
  [key: string]: string;
}

const clases: ClasesNovedad = {
  'compensatorio': 'novedad-personal-compensatorio',
  'licencia anual ordinaria': 'novedad-personal-lao',
  'licencia por maternidad': 'novedad-personal-maternidad',
  'parte por enfermedad': 'novedad-personal-parte-enfermo',
  'parte por cuidado de familiar enfermo': 'novedad-personal-familiar-enfermo',
  'falta sin aviso': 'novedad-personal-falta-sin-aviso',
  'duelo': 'novedad-personal-duelo'
};

@Component({
  selector: 'app-ddjj-contrafactura',
  templateUrl: './ddjj-contrafactura.component.html',
  styleUrls: ['./ddjj-contrafactura.component.css']
})

export class DdjjContrafacturaComponent implements OnInit, OnDestroy {

  //Tabla
  @ViewChild(MatTable) table!: MatTable<RegistroMensualListDto>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //columnasBase: string[] = ['apellido', 'nombre', 'acciones', 'totalHoras', 'weekdaysTotal', 'weekendsTotal'];
  columnasBase: string[] = ['apellido', 'nombre', 'totalHoras', 'weekdaysTotal', 'weekendsTotal'];
  columnasMontos: string[] = ['cuil', 'factura', 'montoTotal', 'montoLav', 'montoSdf'];
  columnasFechas: string[] = []; // esto reemplaza el uso directo de `displayedColumns`

  mostrarMontos: boolean = false;

  get displayedColumns(): string[] {
    return [
      ...this.columnasBase,
      ...(this.mostrarMontos ? this.columnasMontos : []),
      ...this.columnasFechas
    ];
  }
  dataSource!: MatTableDataSource<RegistroMensualListDto>;
  suscription!: Subscription;
  tablaListaParaMostrar = false;

  private actividadesPorRegistro: Map<number, { [fecha: string]: RegActivListDto[] }> = new Map();
  ddjjs: DdjjListDto[] = [];
  registrosMensuales: RegistroMensualListDto[] = [];

  diasEnMes: moment.Moment[] = [];
  feriados: Feriado[] = [];
  servicios: ServicioSummaryDto[] = []; 

  dialogRef!: MatDialogRef<RmensualContrafacturaDetailComponent>;

  selectedQuincena: string = 'PRIMERA';
  selectedServicio?: number | null = null;
  selectedMonth: number = moment().month() + 1;
  selectedYear: number = moment().year();
  months = moment.months().map((name, value) => ({ value, name }));
  years: number[] = [2023, 2024, 2025];
  selectedMonthYear: string = '';
  mesesDisponibles: { value: string, label: string }[] = [];

  //botones y mensajes
  botonDirectorIcon: 'assignment_return' | 'assignment_late' | 'block' | 'assignment_turned_in' = 'assignment_return';
  evaluacionDdjjCargada = false;
  botonDirectorDeshabilitado: boolean = false;
  mensajeDirector: 'pendiente' | 'pendiente_devuelto' | 'rechazado' | 'aceptado' | 'fuera_rango_tiempo' | 'aceptado_completo_primera' | null = null;

  botonDphIcon: 'assignment_return' | 'assignment_late' | 'assignment_turned_in' | 'block' | 'alarm_add' | 'snooze' = 'assignment_return';
  botonDphDeshabilitado: boolean = false;
  mensajeDph: 'pendiente' | 'pendiente_devuelto' | 'rechazado' | 'aceptado' | 'fuera_rango_tiempo' | 'enviar_dph' | 'ddjj_incompletas' | null = null;
  evaluacionDdjjDphCargada: boolean = false;

  botonDirectorAuthIcon: string = 'assignment_ind';
  botonDirectorAuthDeshabilitado: boolean = true;
  mensajeDirectorAuth: string | null = null;

  botonDphAuthIcon: string = 'assignment_ind';
  botonDphAuthDeshabilitado: boolean = true;
  mensajeDphAuth: string | null = null;
  estadoDphAprobado = false

  ultimaObservacionDirector?: ObservacionDdjjUltimoDto;
  ultimaObservacionDph?: ObservacionDdjjUltimoDto;
  mostrarBotonHistorialDirector = false;
  mostrarBotonHistorialDph = false;

  puedeEditarCeldas: boolean = false;
  rangoPermitidoDDJJ: boolean = false;

  ddjjSeleccionada?: DdjjListDto;
  creacionDDJJ: boolean = false;
  verificandoDdjj: boolean = false;
  mostrarBotonDDJJ: boolean = false;
  efectorId: number | null = null;
  efectorNombre: string | null = null;

  //Autenticación
  roles: string[] = [];
  currentRole: string | null = null;
  userId: number | null = null;
  isAutoridad: boolean = false;
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;

  constructor(
    private dialog: MatDialog,
    private paginatorIntl: MatPaginatorIntl,
    private hospitalService: HospitalService,
    private ministerioService: MinisterioService,
    private efectorService: EfectorService,
    private feriadoService: FeriadoService,
    private ddjjService: DdjjService,
    private observacionDdjjService: ObservacionDdjjService,
    private registroActividadService: RegistroActividadService,
    private cronogramaDefinitivoService: CronogramaDefinitivoService,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    this.paginatorIntl.itemsPerPageLabel = "Registros por página";
    this.paginatorIntl.nextPageLabel = "Siguiente página";
    this.paginatorIntl.previousPageLabel = "Página anterior";
    this.paginatorIntl.firstPageLabel = "Primera página";
    this.paginatorIntl.lastPageLabel = "Última página";
    this.paginatorIntl.getRangeLabel = (page, size, length) => {
      const start = page * size + 1;
      const end = Math.min((page + 1) * size, length);
      return `${start} - ${end} de ${length}`;
    };
  }

  ngOnInit(): void {
    // Obtener el ID efector
    this.efectorId = this.efectorService.getCurrentEfectorId();
      if (this.efectorId) {
        this.loadEfectorName();
          moment.locale('es');
          this.dataSource = new MatTableDataSource<RegistroMensualListDto>([]);
          this.generarMesesDisponibles();
          this.updateDateAndLoadData();
          this.loadHospitalDetails();
          this.selectedMonthYear = `${this.selectedMonth}-${this.selectedYear}`;
    
        this.feriadoService.list().subscribe((feriados: Feriado[]) => {
          this.feriados = feriados;
    });

      } else {
        this.toastr.warning('No hay un efector seleccionado', 'Advertencia', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      this.router.navigateByUrl('/home-page');
    }
  
    // Obtener rol actual
    this.tokenService.currentRole$.subscribe(role => {
      this.currentRole = role;
      this.UserRoles();

      if (!this.currentRole) {
        console.warn('No hay un rol seleccionado.');
      }
    });

      const userIdFromToken = this.tokenService.getUserIdFromToken();
      this.userId = userIdFromToken !== null ? Number(userIdFromToken) : null;

      this.selectedServicio = null;
  }

  loadEfectorName(): void {
    if (this.efectorId) {
      this.efectorService.getEfectorNombre(this.efectorId).subscribe(
        (efector: EfectorSummaryDto) => {
          this.efectorNombre = efector.nombre;
        },
        (error) => {
          console.error('Error al obtener el efector:', error);
          this.efectorNombre = null;
        }
      );
    }
  }

  UserRoles(): void {
    if (this.currentRole) {
      this.isUsuario = this.currentRole === 'ROLE_USER';
      this.isAdministrativo = this.currentRole === 'ROLE_ADMIN';
      this.isAutoridad = this.currentRole === 'ROLE_AUTORIDAD';
      this.isDph = this.currentRole === 'ROLE_DPH';
      this.isSuper = this.currentRole === 'ROLE_SUPERUSER';
    } else {
      this.isAdministrativo = false;
      this.isAutoridad = false;
      this.isUsuario = false;
      this.isDph = false;
      this.isSuper = false;
    }
  }

  loadHospitalDetails(): void {
    if (!this.efectorId) {
      console.error('No hay efectorId disponible');
      return;
    }

    this.hospitalService.getServiciosActivos(this.efectorId).subscribe(
      (servicios) => {
        this.servicios = servicios.map(s => new ServicioSummaryDto(s.id, s.descripcion));
        if (this.servicios.length > 0) {
        }

        this.loadRegistrosMensuales();
      },
      (error) => {
        console.error('Error al obtener servicios activos del hospital:', error);
      }
    );
  }

  //Manejo de carga de datos en tabla

  loadRegistrosMensuales(): void {
    const anio = this.selectedYear;
    const mes = moment().month(this.selectedMonth - 1).format('MMMM').toUpperCase();
    const idEfector = this.efectorId;
    const quincena = this.selectedQuincena!;

    this.tablaListaParaMostrar = false;

    if (!idEfector) {
      console.error("El ID del hospital no puede ser null");
      return;
    }

    const ddjj$: Observable<DdjjListDto[]> = this.selectedServicio == null
      ? this.ddjjService.listCf(anio, mes, idEfector, quincena)
      : this.ddjjService.listCfAndServicio(anio, mes, idEfector, this.selectedServicio, quincena);

    ddjj$.subscribe({
      next: (ddjjs: DdjjListDto[]) => {
        if (ddjjs.length > 0) {
          // Ordena por id para que la última sea la más nueva
          ddjjs.sort((a, b) => a.id - b.id);

          // Guarda todas para la tabla
          this.ddjjs = ddjjs;

          // Toma la última para procesos de evaluación
          this.ddjjSeleccionada = ddjjs[ddjjs.length - 1];

          // Procesos sobre la última
          this.evaluarEstadoDdjj(this.ddjjSeleccionada);
          this.evaluarEstadoDdjjDph(this.ddjjSeleccionada);
          this.evaluarRespuestaDirectorDdjj(this.ddjjSeleccionada);
          this.evaluarRespuestaDphDdjj(this.ddjjSeleccionada);

          this.cargarUltimaObservacionDirector(); 
          this.cargarUltimaObservacionDph();
          this.validarHistorialBotones(this.ddjjSeleccionada.id!);
        } else {
          this.ddjjs = [];
          this.ddjjSeleccionada = undefined;
          this.ultimaObservacionDirector = undefined;
        }

        // Aplana todos los registrosMensuales de todas las ddjjs
        this.registrosMensuales = ddjjs.flatMap(ddjj =>
          (ddjj.registrosMensuales || []).map(reg => {
            reg.idDdjj = ddjj.id;
            return reg;
          })
        );

        // Mapear actividades
        this.preprocesarActividades();

        // Cargar en el datasource de la tabla
        this.updateTableDataSource();

        this.tablaListaParaMostrar = true;
      },
      error: (err: any) => {
        console.error('Error cargando DDJJ:', err);
        this.ddjjs = [];
        this.registrosMensuales = [];
        this.updateTableDataSource();
        this.tablaListaParaMostrar = true;
      }
    });
  }

  preprocesarActividades(): void {
    this.actividadesPorRegistro.clear();

    this.registrosMensuales.forEach(registro => {
      const mapa: { [fecha: string]: RegActivListDto[] } = {};

      registro.registroActividad.forEach(act => {
        const fechaKey = moment(act.fechaIngreso).format("YYYY-MM-DD");
        if (!mapa[fechaKey]) {
          mapa[fechaKey] = [];
        }
        mapa[fechaKey].push(act);
      });

      this.actividadesPorRegistro.set(registro.id, mapa);
    });
  }

  getActividadesPorFecha(registroId: number, date: Date): RegActivListDto[] {
    const mapa = this.actividadesPorRegistro.get(registroId);
    if (!mapa) return [];
    const key = moment(date).format("YYYY-MM-DD");
    return mapa[key] || [];
  }

  calculateHoursForDate(actividades: RegActivListDto[]): SafeHtml {
    if (!actividades || actividades.length === 0) return this.sanitizer.bypassSecurityTrustHtml('');

    const itemsHtml = actividades.map(act => {
      const hoursIn = moment(`${act.fechaIngreso} ${act.horaIngreso}`, 'YYYY-MM-DD HH:mm:ss');
      const hoursOut = moment(`${act.fechaEgreso} ${act.horaEgreso}`, 'YYYY-MM-DD HH:mm:ss');

      if (!hoursIn.isValid() || !hoursOut.isValid()) return `<span style="color:red;">?</span>`;

      const diffHours = hoursOut.diff(hoursIn, 'hours', true);
      if (diffHours <= 0) return '';

      const rounded = Math.round(diffHours);
      const color = this.getColor(act.tipoGuardia.id);

      return `<span style="color:${color}; margin-right:4px;">${rounded}</span>`;
    });

    return this.sanitizer.bypassSecurityTrustHtml(itemsHtml.join(''));
  }

  getColor(tipoGuardiaId: number): string {
    if (tipoGuardiaId === 4) return '#769264'; // CF
    return '#000'; // Default negro
  }

  generarDiasDelMes(): void {
    const startOfMonth = moment()
      .year(this.selectedYear)
      .month(this.selectedMonth - 1)
      .startOf('month');

    const endOfMonth = startOfMonth.clone().endOf('month');

    let start: moment.Moment;
    let end: moment.Moment;

    if (this.selectedQuincena === 'PRIMERA') {
      start = startOfMonth.clone();
      end = startOfMonth.clone().date(15);
    } else {
      start = startOfMonth.clone().date(16);
      end = endOfMonth.clone();
    }

    let day = start.clone();

    // 🔹 Reiniciamos solo las fechas (igual que antes)
    this.columnasFechas = [];

    while (day <= end) {
      this.columnasFechas.push(day.format('YYYY_MM_DD'));
      day.add(1, 'day');
    }
  }

  updateTableDataSource(): void {
    this.dataSource.data = this.registrosMensuales;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getFechaFromColumnId(columnId: string): Date {
    const [year, month, day] = columnId.split('_').map(Number);
    return new Date(year, month - 1, day);
  }

  isHoliday(date: Date): { isHoliday: boolean, motivo: string } {
    const dateMoment = moment(date).startOf('day');
    const feriadoFound = this.feriados.find(feriado => {
      const feriadoMoment = moment(feriado.fecha).startOf('day');
      return dateMoment.isSame(feriadoMoment);
    });

    return {
      isHoliday: !!feriadoFound,
      motivo: feriadoFound ? feriadoFound.motivo : ''
    };
  }

  isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  isNovedad(dateMoment: moment.Moment, novedades: NovedadPersonalListDto[]): { isNovedad: boolean, tipoLicencia: string } {
    const novedadFound = novedades.find(novedad => {
      const inicioMoment = moment(novedad.fechaInicio).startOf('day');
      const finMoment = moment(novedad.fechaFinal).startOf('day');
      return dateMoment.isBetween(inicioMoment, finMoment, undefined, '[]');
    });

    return {
      isNovedad: !!novedadFound,
      tipoLicencia: novedadFound?.tipoLicencia?.nombre ?? ''
    };
  }
  
  getNovedadCssClass(tipoLicencia: string): string {
    const tipo = tipoLicencia.toLowerCase();
    return clases[tipo] || 'novedad-personal-otros';
  }

  calculateTooltip(date: Date, registro: any): string {
    const dateMoment = moment(date).startOf('day');
    const novedad = this.isNovedad(dateMoment, registro.asistencial.novedadesPersonales);

    if (novedad.isNovedad) return novedad.tipoLicencia;

    const holiday = this.isHoliday(date);
    if (holiday.isHoliday) return holiday.motivo;

    return '';
  }

  getCellInfo(date: Date, registro: any): { clase: string, tooltip: string } {
    const dateMoment = moment(date).startOf('day');
    const novedad = this.isNovedad(dateMoment, registro.asistencial.novedadesPersonales);

    if (novedad.isNovedad) return { clase: this.getNovedadCssClass(novedad.tipoLicencia), tooltip: novedad.tipoLicencia };
    
    const holiday = this.isHoliday(date);
    if (holiday.isHoliday) return { clase: 'holiday', tooltip: holiday.motivo };
    
    if (this.isWeekend(date)) return { clase: 'weekend', tooltip: '' };

    return { clase: '', tooltip: '' };
  }

  //Manejo filtro busqueda en tabla

  accentFilter(input: string): string {
    const acentos = "ÁÉÍÓÚáéíóú";
    const original = "AEIOUaeiou";
    let output = "";
    for (let i = 0; i < input.length; i++) {
      const index = acentos.indexOf(input[i]);
      if (index >= 0) {
        output += original[index];
      } else {
        output += input[i];
      }
    }
    return output;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: RegistroMensualListDto, filter: string) => {
      const nombre = this.accentFilter(data.asistencial.nombre.toLowerCase());
      const apellido = this.accentFilter(data.asistencial.apellido.toLowerCase());

      filter = this.accentFilter(filter.toLowerCase());
      return nombre.includes(filter) || apellido.includes(filter);
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  //Manejo fechas en select

  generarMesesDisponibles(): void {
    const fechaActual = moment(); // hoy
    const mesesPasados = [];

    // mostrar los últimos 6 meses + el actual
    for (let i = 6; i >= 0; i--) {
      const mesAnio = fechaActual.clone().subtract(i, 'months');
      const mes = mesAnio.month() + 1; // de 1 a 12
      const anio = mesAnio.year();

      mesesPasados.push({
        value: `${mes}-${anio}`, // ej: "9-2025"
        label: mesAnio.format('MMMM YYYY').toUpperCase(), // ej: "SEPTIEMBRE 2025"
      });
    }

    this.mesesDisponibles = mesesPasados;

    // Establecer por defecto el mes actual
    this.selectedMonth = fechaActual.month() + 1;
    this.selectedYear = fechaActual.year();
    this.selectedMonthYear = `${this.selectedMonth}-${this.selectedYear}`;
  }

  onMonthYearChange(): void {
  const [mesStr, anioStr] = this.selectedMonthYear.split('-');
  this.selectedMonth = Number(mesStr);
  this.selectedYear = Number(anioStr);

  this.updateDateAndLoadData();
  }

  updateDateAndLoadData(): void {
    this.evaluacionDdjjCargada = false;
    this.evaluacionDdjjDphCargada = false;
    this.ddjjSeleccionada = undefined;

    this.mostrarBotonHistorialDirector = false;
    this.mostrarBotonHistorialDph = false;

    this.mensajeDirector = null;
    this.mensajeDph = null;
    this.mensajeDirectorAuth = null;
    this.mensajeDphAuth = null;

    this.puedeEditarCeldas = false;

    this.calcularFechaLimiteEnvio(this.selectedMonth, this.selectedYear, this.selectedQuincena);

    this.generarDiasDelMes();
    this.loadRegistrosMensuales();
    this.verificarExistenciaDdjj();
  }

  //dar formato

  getMonthName(mes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Si recibe 1 a 12, ajusta para índice 0-11
    if (mes >= 1 && mes <= 12) {
      return meses[mes - 1];
    }
    return '';
  }

  /*convertirMesANombre(numeroMes: number): string {
    const meses = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    return meses[numeroMes];
  }*/

  formatDate(startDate: Date, endDate: Date): string {
    const formattedStartDate = moment(startDate).format('DD/MM/YYYY');
    const formattedEndDate = moment(endDate).format('DD/MM/YYYY');

    if (formattedStartDate === formattedEndDate) {
      return formattedStartDate;
    } else {
      return `${formattedStartDate} - ${formattedEndDate}`;
    }
  }

  formatCuil(cuil?: string): string {
    if (!cuil || cuil.length !== 11) return cuil || '';
    return `${cuil.substring(0,2)}-${cuil.substring(2,10)}-${cuil.substring(10)}`;
  }

  //Mostrar/ocultar
  
  get hayDatosParaMostrar(): boolean {
    return (
      this.tablaListaParaMostrar &&
      this.dataSource &&
      this.dataSource.data &&
      this.dataSource.data.length > 0
    );
  }

  get noHayDatosParaMostrar(): boolean {
    return (
      this.tablaListaParaMostrar &&
      (!this.dataSource?.data?.length || this.dataSource.data.length === 0)
    );
  }

  validarHistorialBotones(ddjjId: number) {
    if (!ddjjId) return;

    this.observacionDdjjService.getObservacionesActivasPorDdjjYTipoDph(ddjjId, false)
      .subscribe({
        next: (data) => this.mostrarBotonHistorialDirector = data.length > 0,
        error: () => this.mostrarBotonHistorialDirector = false
      });

    this.observacionDdjjService.getObservacionesActivasPorDdjjYTipoDph(ddjjId, true)
      .subscribe({
        next: (data) => this.mostrarBotonHistorialDph = data.length > 0,
        error: () => this.mostrarBotonHistorialDph = false
      });
  }

  //Verificaciones para permitir interacciones

private estaEnRango(inicio: Date, fin: Date | null, today: Date = new Date()): boolean {
  if (!fin) {
    // Caso FUERA_DE_TERMINO: solo comparamos que hoy >= inicio
    return today >= inicio;
  }
  return today >= inicio && today <= fin;
}

private getRangoMesSiguiente(): { inicio: Date, fin: Date | null }[] {
  const mes = this.selectedMonth;
  const anio = this.selectedYear;

  // Ajuste para el mes siguiente
  const siguienteMes = mes === 12 ? 1 : mes + 1;
  const siguienteAnio = mes === 12 ? anio + 1 : anio;

  // Primera quincena: 15-20 del mes actual
  const rango1Inicio = new Date(anio, mes - 1, 15);
  const rango1Fin = new Date(anio, mes - 1, 20, 23, 59, 59);

  // Segunda quincena: 1–10 del mes siguiente
  const rango2Inicio = new Date(siguienteAnio, siguienteMes - 1, 1);
  const rango2Fin = new Date(siguienteAnio, siguienteMes - 1, 10, 23, 59, 59);

  // Fuera de término: desde el 11 del mes siguiente en adelante, sin fin
  const rangoFueraDeTerminoInicio = new Date(siguienteAnio, siguienteMes - 1, 11);

  if (this.selectedQuincena === 'PRIMERA') {
    return [{ inicio: rango1Inicio, fin: rango1Fin }];
  } else if (this.selectedQuincena === 'SEGUNDA') {
    return [{ inicio: rango2Inicio, fin: rango2Fin }];
  } else if (this.selectedQuincena === 'FUERA_DE_TERMINO') {
    return [{ inicio: rangoFueraDeTerminoInicio, fin: null }];
  }

  // Por defecto, si no coincide la quincena, devolvemos vacío
  return [];
}

  verificarExistenciaDdjj(): void {
    this.verificandoDdjj = true;

    const today = new Date();
    // Iteramos sobre los rangos válidos
    this.rangoPermitidoDDJJ = this.getRangoMesSiguiente().some(rango =>
      this.estaEnRango(rango.inicio, rango.fin, today)
    );

    this.verificandoDdjj = false;
  }

  getMensajeContadorDdjj(): string | null {
    const today = new Date();

    for (const rango of this.getRangoMesSiguiente()) {
      if (this.estaEnRango(rango.inicio, rango.fin, today)) {
        if (!rango.fin) {
          // Caso FUERA_DE_TERMINO: no hay límite, devolvemos un mensaje genérico
          return 'Fuera de término';
        }

        const diasRestantes = rango.fin.getDate() - today.getDate() + 1;
        return diasRestantes === 1
          ? '¡Es el último día!'
          : `${diasRestantes} días`;
      }
    }

    return null;
  }

  private calcularFechaLimiteEnvio(mes: number, anio: number, quincena: string): Date | null {
    let limite: Date | null;

    switch (quincena) {
      case 'PRIMERA':
        // Día 20 del mes en curso
        limite = new Date(anio, mes - 1, 20, 23, 59, 59);
        break;
      case 'SEGUNDA':
        // Día 10 del mes siguiente
        const siguienteMes = mes === 12 ? 1 : mes + 1;
        const siguienteAnio = mes === 12 ? anio + 1 : anio;
        limite = new Date(siguienteAnio, siguienteMes - 1, 10, 23, 59, 59);
        break;
      case 'FUERA_DE_TERMINO':
        // Sin límite: habilitado desde el 11 del mes siguiente en adelante
        limite = null;
        break;
      default:
        console.warn(`Quincena desconocida: ${quincena}`);
        limite = null;
    }

    return limite;
  }
    
  //Evaluaciones y cambios de estado DDJJ

evaluarEstadoDdjj(ddjj: DdjjListDto): void {
  const estado = ddjj.estadoDdjjDirector;
  const enPosesion = ddjj.enPosesionDirector;
  const fechaLimite = this.calcularFechaLimiteEnvio(this.selectedMonth, this.selectedYear, this.selectedQuincena);
  const hoy = new Date();

  // Fuera de plazo
  if (fechaLimite && hoy > fechaLimite && estado && estado !== 'APROBADO') {
    this.botonDirectorIcon = 'block';
    this.botonDirectorDeshabilitado = true;
    this.mensajeDirector = 'fuera_rango_tiempo';
    this.puedeEditarCeldas = false;
    this.evaluacionDdjjCargada = true;
    return;
  }

  // Pendiente
  if (enPosesion && estado === 'PENDIENTE') {
    this.botonDirectorIcon = 'assignment_late';
    this.botonDirectorDeshabilitado = true;
    this.mensajeDirector = ddjj.idDirector == null ? 'pendiente' : 'pendiente_devuelto';
    this.puedeEditarCeldas = false;
  } 
  // Rechazado
  else if (!enPosesion && estado === 'RECHAZADO') {
    this.botonDirectorIcon = 'assignment_return';
    this.botonDirectorDeshabilitado = false;
    this.mensajeDirector = 'rechazado';
    this.puedeEditarCeldas = true;
  } 
  // Aprobado
  else if (!enPosesion && estado === 'APROBADO') {
    this.botonDirectorIcon = 'assignment_turned_in';
    this.botonDirectorDeshabilitado = true;
    this.puedeEditarCeldas = false;

    if (this.selectedQuincena === 'PRIMERA') {
      this.mensajeDirector = 'aceptado_completo_primera';
    } else {
      this.mensajeDirector = 'aceptado';
    }
  } 
  // Otro estado
  else {
    this.botonDirectorIcon = 'assignment_return';
    this.botonDirectorDeshabilitado = false;
    this.mensajeDirector = null;
  }

  this.evaluacionDdjjCargada = true;
  this.mostrarBotonDDJJ = this.rangoPermitidoDDJJ || estado === 'APROBADO';
}

  evaluarEstadoDdjjDph(ddjj: DdjjListDto): void {
    const estadoDirector = ddjj.estadoDdjjDirector;
    const estadoDph = ddjj.estadoDdjjDirectorDPH;
    const enPosesionDph = ddjj.enPosesionDirectorDPH;

    const fechaLimite = this.calcularFechaLimiteEnvio(this.selectedMonth, this.selectedYear, this.selectedQuincena);
    const hoy = new Date();

    if (fechaLimite && hoy > fechaLimite && estadoDph && estadoDph !== 'APROBADO') {
      console.log('DPH: Ya no se puede cargar, fuera del rango permitido AdminDPH');
      this.botonDphIcon = 'block';
      this.botonDphDeshabilitado = true;
      this.mensajeDph = 'fuera_rango_tiempo';
      this.puedeEditarCeldas = false;
      this.evaluacionDdjjDphCargada = true;
      return;
    }

    console.log('Evaluando estado DPH:', {
      estadoDirector,
      estadoDph,
      enPosesionDph
    });

    if (estadoDirector !== 'APROBADO') {
      console.log('DPH: El director aún no aprobó, se deshabilita');
      this.botonDphIcon = 'snooze';
      this.botonDphDeshabilitado = true;
      this.mensajeDph = null;
      return;
    }

    if (enPosesionDph && estadoDph === 'PENDIENTE') {
      if (this.selectedQuincena === 'SEGUNDA') {
        // ✅ Solo en segunda quincena validamos precondiciones
        this.registroActividadService
          .validarPrecondicionesCronograma(this.efectorId!, this.selectedMonth, this.selectedYear)
          .subscribe({
            next: (precondicionesCumplidas: boolean) => {
              if (precondicionesCumplidas) {
                if (ddjj.idDirectorDPH == null) {
                  console.log('DPH: En posesión DPH y pendiente');
                  this.botonDphIcon = 'assignment_late';
                  this.botonDphDeshabilitado = true;
                  this.mensajeDph = 'pendiente';
                  this.puedeEditarCeldas = false;
                } else {
                  console.log('Caso: en posesión del director y pendiente (devuelta por DPH)');
                  this.botonDphIcon = 'assignment_late';
                  this.botonDphDeshabilitado = true;
                  this.mensajeDph = 'pendiente_devuelto';
                  this.puedeEditarCeldas = false;
                }
              } else {
                console.log('DPH: Faltan ddjj por aprobar. En posesión DPH y pendiente');
                this.botonDphIcon = 'alarm_add';
                this.botonDphDeshabilitado = true;
                this.mensajeDph = 'ddjj_incompletas';
                this.puedeEditarCeldas = false;
              }
            },
            error: () => {
              console.warn('Error al validar precondiciones para DPH');
              this.botonDphIcon = 'assignment_late';
              this.botonDphDeshabilitado = true;
              this.mensajeDph = 'ddjj_incompletas';
              this.puedeEditarCeldas = false;
            }
          });
      } else {
        // ✅ En primera quincena, no validamos precondiciones
        console.log('DPH: En posesión DPH y pendiente (PRIMERA quincena, sin validar precondiciones)');
        this.botonDphIcon = 'assignment_late';
        this.botonDphDeshabilitado = true;
        this.mensajeDph = ddjj.idDirectorDPH == null ? 'pendiente' : 'pendiente_devuelto';
        this.puedeEditarCeldas = false;
      }
    } else if (!enPosesionDph && estadoDph === 'RECHAZADO') {
      console.log('DPH: Rechazado por DPH');
      this.botonDphIcon = 'assignment_return';
      this.botonDphDeshabilitado = false;
      this.mensajeDph = 'rechazado';
      this.puedeEditarCeldas = true;
    } else if (!enPosesionDph && estadoDph === 'APROBADO') {
      console.log('DPH: Aprobado por DPH');
      this.botonDphIcon = 'assignment_turned_in';
      this.botonDphDeshabilitado = true;
      this.mensajeDph = 'aceptado';
      this.puedeEditarCeldas = false;
    } else {
      console.log('DPH: Estado desconocido');
      this.botonDphIcon = 'assignment_return';
      this.botonDphDeshabilitado = true;
      this.mensajeDph = null;
      this.puedeEditarCeldas = false;
    }

    this.evaluacionDdjjDphCargada = true;
    this.mostrarBotonDDJJ = this.rangoPermitidoDDJJ || estadoDph === 'APROBADO';
  }

evaluarRespuestaDirectorDdjj(ddjj: DdjjListDto): void {
  const estado = ddjj.estadoDdjjDirector;
  const enPosesion = ddjj.enPosesionDirector;

  const fechaLimite = this.calcularFechaLimiteEnvio(this.selectedMonth, this.selectedYear, this.selectedQuincena);
  const hoy = new Date();

  // Caso: fuera de plazo
  if (fechaLimite && hoy > fechaLimite && estado && estado !== 'APROBADO') {
    console.log('Hoy:', hoy, ' - Fecha límite:', fechaLimite);
    console.log('Director: Ya no se puede cargar, fuera del rango permitido');
    this.botonDirectorAuthIcon = 'block';
    this.botonDirectorAuthDeshabilitado = true;
    this.mensajeDirectorAuth = 'fuera_rango_tiempo';
    return;
  }

  // Caso: pendiente
  if (enPosesion && estado === 'PENDIENTE') {
    this.botonDirectorAuthIcon = 'assignment_return';
    this.botonDirectorAuthDeshabilitado = false;
    this.mensajeDirectorAuth = 'revision';
  } 
  // Caso: rechazado
  else if (!enPosesion && estado === 'RECHAZADO') {
    this.botonDirectorAuthIcon = 'assignment_late';
    this.botonDirectorAuthDeshabilitado = true;
    this.mensajeDirectorAuth = 'rechazado';
  } 
  // Caso: aprobado
  else if (!enPosesion && estado === 'APROBADO') {
    if (this.selectedQuincena === 'PRIMERA') {
      // Primera quincena: mensaje especial
      this.botonDirectorAuthIcon = 'assignment_turned_in';
      this.botonDirectorAuthDeshabilitado = true;
      this.mensajeDirectorAuth = 'aceptado_completo_primera';
    } else {
      // Segunda quincena: validar precondiciones
      this.registroActividadService
        .validarPrecondicionesCronograma(this.efectorId!, this.selectedMonth, this.selectedYear)
        .subscribe({
          next: (precondicionesCumplidas: boolean) => {
            this.botonDirectorAuthIcon = 'assignment_turned_in';
            this.botonDirectorAuthDeshabilitado = true;
            this.mensajeDirectorAuth = precondicionesCumplidas ? 'aceptado_completo' : 'aceptado';
          },
          error: () => {
            console.warn('Error al validar precondiciones del cronograma.');
            this.botonDirectorAuthIcon = 'assignment_turned_in';
            this.botonDirectorAuthDeshabilitado = true;
            this.mensajeDirectorAuth = null;
          }
        });
    }
  } 
  // Otros casos
  else {
    this.botonDirectorAuthIcon = 'assignment_return';
    this.botonDirectorAuthDeshabilitado = true;
    this.mensajeDirectorAuth = null;
  }
}

  evaluarRespuestaDphDdjj(ddjj: DdjjListDto): void {
    const estado = ddjj.estadoDdjjDirectorDPH;
    const enPosesion = ddjj.enPosesionDirectorDPH;

    this.estadoDphAprobado = (estado === 'APROBADO');

    const fechaLimite = this.calcularFechaLimiteEnvio(this.selectedMonth, this.selectedYear, this.selectedQuincena);
    const hoy = new Date();

    if (fechaLimite && hoy > fechaLimite && estado && estado !== 'APROBADO') {
      console.log('Hoy:', hoy, ' - Fecha límite:', fechaLimite);
      console.log('DPH: Ya no se puede cargar, fuera del rango permitidoDPH');
      this.botonDphAuthIcon = 'block';
      this.botonDphAuthDeshabilitado = true;
      this.mensajeDphAuth = 'fuera_rango_tiempo';
      return; // Salir sin seguir evaluando estados
    }

    // 👉 Si la quincena es PRIMERA, no hacemos la validación en backend
    if (this.selectedQuincena === 'PRIMERA') {
      this.evaluarEstadosDphDdjj(enPosesion, estado);
      return;
    }

    // 👉 Si la quincena es SEGUNDA, sí validamos precondiciones
    this.registroActividadService
      .validarPrecondicionesCronograma(this.efectorId!, this.selectedMonth, this.selectedYear)
      .subscribe({
        next: (precondicionesCumplidas: boolean) => {
          if (!precondicionesCumplidas) {
            this.botonDphAuthIcon = 'assignment_return';
            this.botonDphAuthDeshabilitado = true;
            this.mensajeDphAuth = null;
            return;
          }
          // Lógica original si precondiciones == true
          this.evaluarEstadosDphDdjj(enPosesion, estado);
        },
        error: () => {
          console.warn('Error al validar precondiciones del cronograma.');
          this.botonDphAuthIcon = 'assignment_return';
          this.botonDphAuthDeshabilitado = true;
          this.mensajeDphAuth = null;
        }
      });
  }

  /*** Método lógica de asignación de iconos/estados para evaluarRespuestaDphDdjj */
  private evaluarEstadosDphDdjj(enPosesion: boolean, estado: string | null): void {
    if (enPosesion && estado === 'PENDIENTE') {
      this.botonDphAuthIcon = 'assignment_return';
      this.botonDphAuthDeshabilitado = false;
      this.mensajeDphAuth = 'revision';
    } else if (!enPosesion && (estado === 'RECHAZADO' || estado === 'APROBADO')) {
      this.botonDphAuthIcon = estado === 'RECHAZADO' ? 'assignment_late' : 'assignment_turned_in';
      this.botonDphAuthDeshabilitado = true;
      this.mensajeDphAuth = estado === 'RECHAZADO' ? 'rechazado' : null;
    } else {
      this.botonDphAuthIcon = 'assignment_return';
      this.botonDphAuthDeshabilitado = true;
      this.mensajeDphAuth = null;
    }
  }

  //Manejo de dialogs

  openDetail(registro: RegistroMensualListDto): void {
    const dataToSend = {
      asistencial: registro.asistencial,
    };
    console.log('📤 Enviando al diálogo:', dataToSend);

    this.dialogRef = this.dialog.open(RmensualContrafacturaDetailComponent, {
      width: '600px',
      data: dataToSend
    });
  }

  openEditDialog(id: number): void {
    const dialogRef = this.dialog.open(RegistroActividadesEditComponent, {
      width: '600px',
      data: { id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.loadRegistrosMensuales();
      }
    });
  }

  openDdjjHistorial(destino: 'DIRECTOR_AUTH' | 'DPH_AUTH'): void {
    const tipoDph = destino === 'DPH_AUTH';
    this.dialog.open(DialogHistorialObservacionesComponent, {
      width: '800px',
      data: {
        idDdjj: this.ddjjSeleccionada?.id,
        tipoDph
      }
    });
  }  

  openDdjjConfirm(destino: 'DIRECTOR' | 'DPH'): void {
    const destinatarioTexto = destino === 'DIRECTOR' ? 'el director del hospital' : 'DPH';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmación de pase:',
        message: `
          <p class="negrita">
            ¿Estás seguro que deseas enviar la declaración jurada de todos los servicios para su revisión por <span class="destino">${destinatarioTexto}</span>?
          </p>
          <p class="btnRemove">Esta acción no podrá deshacerse.</p>
        `
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.enviarDdjj(destino);
      }
    });
  }

  //Manejo observaciones y acceso a modificar regActividad

  cargarUltimaObservacionDirector(): void {
    if (!this.ddjjSeleccionada?.id) return;

    this.observacionDdjjService.getUltimaObservacionPorDdjjYTipoDph(this.ddjjSeleccionada.id, false)
      .subscribe({
        next: (obs) => {
          this.ultimaObservacionDirector = obs;
        },
        error: () => {
          this.ultimaObservacionDirector = undefined;
        }
      });
  }

  cargarUltimaObservacionDph(): void {
    if (!this.ddjjSeleccionada?.id) return;

    this.observacionDdjjService.getUltimaObservacionPorDdjjYTipoDph(this.ddjjSeleccionada.id, true)
      .subscribe({
        next: (obs) => {
          this.ultimaObservacionDph = obs;
        },
        error: () => {
          this.ultimaObservacionDph = undefined;
        }
      });
  }

  getRegistroIdForFecha(actividades: RegActivListDto[], fecha: Date): number | null {
    const fechaBuscada = this.formatDateOnly(fecha);
    
    const actividad = actividades.find(act => 
      this.formatDateOnly(new Date(act.fechaIngreso)) === fechaBuscada
    );

    return actividad?.id ?? null;
  }

  private formatDateOnly(date: Date): string {
    return date.toISOString().split('T')[0]; // devuelve 'YYYY-MM-DD'
  }

  onCeldaClick(actividades: RegActivListDto[], fecha: Date): void {
    if (!this.puedeEditarCeldas || !(this.isAdministrativo || this.isSuper)) return;

    const id = this.getRegistroIdForFecha(actividades, fecha);
    if (id != null) {
      this.openEditDialog(id);
    }
  }

  //metodos para cambios de estado

  enviarDdjj(destino: 'DIRECTOR' | 'DPH'): void {
    if (!this.ddjjSeleccionada) {
      this.toastr.error('No hay DDJJ seleccionada para enviar.', 'Error');
      return;
    }

    const estadoDto: EstadoDdjjDto = new EstadoDdjjDto(
      this.ddjjSeleccionada.id!,
      destino === 'DIRECTOR' ? this.ddjjSeleccionada.idDirector : undefined,
      destino === 'DPH' ? this.ddjjSeleccionada.idDirectorDPH : undefined,
      destino === 'DIRECTOR' ? 'PENDIENTE' : this.ddjjSeleccionada.estadoDdjjDirector!,
      destino === 'DPH' ? 'PENDIENTE' : this.ddjjSeleccionada.estadoDdjjDirectorDPH!,
      destino === 'DIRECTOR',
      destino === 'DPH',
      this.ddjjSeleccionada.motivoDirector || '',
      this.ddjjSeleccionada.motivoDirectorDPH || ''
    );

    console.log('Enviando EstadoDdjjDto:', estadoDto);

    this.ddjjService.cambiarEstado(estadoDto).subscribe({
      next: () => {
        this.toastr.success('La DDJJ fue enviada con éxito.', 'Enviada', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.loadRegistrosMensuales();
      },
      error: () => {
        this.toastr.error('Ocurrió un error al enviar la DDJJ.', 'Error', {
          timeOut: 8000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    });
  }

  enviarDdjjRespuesta(destino: 'DIRECTOR_AUTH' | 'DPH_AUTH'): void {
    if (!this.ddjjSeleccionada) {
      this.toastr.error('No hay DDJJ seleccionada.', 'Error');
      return;
    }

    const dialogRef = this.dialog.open(DialogConfirmDdjjComponent, {
      width: '400px',
      data: { destino, title: 'Confirmar o rechazar DDJJ' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const aprobado = result.estado === 'APROBADO';
      const motivo = result.motivo?.trim() || '';
      const ddjj = this.ddjjSeleccionada!;
      const fechaHora = new Date();
      const fecha = fechaHora.toISOString().split('T')[0];
      const hora = fechaHora.toTimeString().split(' ')[0];
      const user = this.userId!;

      if (!aprobado && motivo) {
        const observacion = new ObservacionDdjjDto(
          motivo,
          destino === 'DPH_AUTH',
          user,
          ddjj.id!,
          true,
          fecha,
          hora
        );

        this.observacionDdjjService.save(observacion).subscribe({
          next: () => console.log('Observación guardada con éxito.'),
          error: () => this.toastr.warning('No se pudo guardar la observación.', 'Atención')
        });
      }

      const estadoDto = new EstadoDdjjDto(
        ddjj.id!,
        destino === 'DIRECTOR_AUTH' ? ddjj.idDirector ?? user : undefined,
        destino === 'DPH_AUTH' ? ddjj.idDirectorDPH ?? user : undefined,
        destino === 'DIRECTOR_AUTH' ? result.estado : ddjj.estadoDdjjDirector!,
        destino === 'DIRECTOR_AUTH' && aprobado ? 'PENDIENTE' :
        destino === 'DPH_AUTH' ? result.estado : ddjj.estadoDdjjDirectorDPH!,
        destino === 'DIRECTOR_AUTH' ? false : ddjj.enPosesionDirector!,
        destino === 'DIRECTOR_AUTH' && aprobado ? true :
        destino === 'DPH_AUTH' ? false : ddjj.enPosesionDirectorDPH!,
        destino === 'DIRECTOR_AUTH' ? '' : ddjj.motivoDirector!,
        destino === 'DPH_AUTH' ? '' : ddjj.motivoDirectorDPH!
      );

      this.ddjjService.cambiarEstado(estadoDto).subscribe({
        next: () => {
          this.toastr.success('La respuesta fue enviada correctamente.', 'Enviada', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });

          this.loadRegistrosMensuales();

          // Solo en caso de DIRECTOR y si fue aprobado
          if (destino === 'DIRECTOR_AUTH' && aprobado) {
            if (this.selectedQuincena === 'SEGUNDA') {
              console.log('Validando precondiciones para segunda quincena...');
              this.registroActividadService
                .validarPrecondicionesCronograma(this.efectorId!, this.selectedMonth, this.selectedYear)
                .subscribe({
                  next: (estaCompleto: boolean) => this.crearCronogramaSiCompleto(estaCompleto),
                  error: () => console.error('Error al validar precondiciones')
                });
            } else {
              // Primera quincena, pasar directo al siguiente paso
              this.crearCronogramaSiCompleto(true);
            }
          }
        },
        error: () => {
          this.toastr.error('Ocurrió un error al guardar la respuesta.', 'Error', {
            timeOut: 5000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
      });
    });
  }

  // Método para crear cronograma si corresponde
  private crearCronogramaSiCompleto(estaCompleto: boolean): void {
    if (!estaCompleto) return;

    const mes = this.selectedMonth;
    const anio = this.selectedYear;
    const quincena = this.selectedQuincena;

    // Elegir servicio según la quincena
    const obtenerDdjj$ =
      quincena === 'PRIMERA'
        ? this.registroActividadService.obtenerDdjjCfAprobadas(this.efectorId!, mes, anio)
        : this.registroActividadService.obtenerDdjjAprobadas(this.efectorId!, mes, anio);

    obtenerDdjj$.subscribe({
      next: (ids: number[]) => {
        const mesNombre = moment().month(mes - 1).format('MMMM').toUpperCase();

        const cronogramaDto = new CronogramaDefinitivoDto(
          mesNombre,
          anio,
          true,
          this.efectorId!,
          ids,
          quincena,
        );

        console.log('Datos enviados a cronogramaDefinitivoService.save:', cronogramaDto);

        this.cronogramaDefinitivoService.save(cronogramaDto).subscribe({
          next: () => this.toastr.success('Se creó el cronograma definitivo.', 'Éxito'),
          error: () => this.toastr.warning('Error al crear el cronograma definitivo.', 'Atención')
        });
      },
      error: () => console.error('Error obteniendo DDJJ aprobadas')
    });
  }

  //Exportaciones a EXCEL y PDF

  calculateHoursForExcel(registroActividades: RegActivListDto[], date: Date): number | string {
    if (!registroActividades || registroActividades.length === 0) {
      return '';
    }

    // Filtramos todas las actividades que caen en la fecha indicada
    const registrosDelDia = registroActividades.filter((actividad) =>
      moment(actividad.fechaIngreso).isSame(date, 'day')
    );

    if (registrosDelDia.length === 0) return '';

    // Verificamos si alguna está "sin egreso"
    const sinEgreso = registrosDelDia.some(
      (actividad) => actividad.fechaIngreso && !actividad.fechaEgreso
    );
    if (sinEgreso) return 'sin egreso';

    // Calculamos las horas de todas las actividades del día
    let totalHoras = 0;
    for (let actividad of registrosDelDia) {
      if (actividad.fechaIngreso && actividad.fechaEgreso) {
        const hoursIn = moment(`${actividad.fechaIngreso} ${actividad.horaIngreso}`, 'YYYY-MM-DD HH:mm:ss');
        const hoursOut = moment(`${actividad.fechaEgreso} ${actividad.horaEgreso}`, 'YYYY-MM-DD HH:mm:ss');

        if (hoursIn.isValid() && hoursOut.isValid()) {
          const diffHours = hoursOut.diff(hoursIn, 'hours', true);
          if (diffHours > 0) {
            const redondeado = diffHours % 1 > 0.5 ? Math.ceil(diffHours) : Math.floor(diffHours);
            totalHoras += redondeado;
          }
        }
      }
    }

    return totalHoras > 0 ? totalHoras : '';
  }

  async exportarAExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    const mesSeleccionado = this.getMonthName(this.selectedMonth);
    const anioSeleccionado = this.selectedYear;
    const efectorNombre = this.efectorNombre;
    const quincena = this.selectedQuincena;

    // Encabezado
    worksheet.addRow([`${mesSeleccionado} ${anioSeleccionado}`, `${quincena} QUINCENA`, efectorNombre]).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFADD8E6' } // Azul claro
    };
    worksheet.getRow(1).font = { bold: true };

    // Columnas
    const dataColumnHeaders = [
      'Apellido', 'Nombre', 'Cuil',
      'Horas mes', 'Horas L-V', 'Horas S-D-F',
      'Monto total', 'Monto L-V', 'Monto S-D-F',
      'Facturas'
    ];
    const formattedColumnTitles = this.displayedColumns.slice(6).map(columnTitle =>
      moment(columnTitle, 'YYYY_MM_DD').format('ddd DD')
    );
    const combinedHeaders = [...dataColumnHeaders, ...formattedColumnTitles];
    worksheet.addRow(combinedHeaders).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' } // Amarillo claro
    };
    worksheet.getRow(2).font = { bold: true };

    // Filas
    for (const registro of this.dataSource.data) {
      const exportData: Record<string, string | number> = {
        Apellido: registro.asistencial.apellido,
        Nombre: registro.asistencial.nombre,
        Cuil: this.formatCuil(registro.asistencial.cuil),
      };

      const totalMes = (registro.totalHoras?.horasLav ?? 0) + (registro.totalHoras?.horasSdf ?? 0);
      exportData['Horas mes'] = totalMes;
      exportData['Horas L-V'] = registro.totalHoras?.horasLav ?? 0;
      exportData['Horas S-D-F'] = registro.totalHoras?.horasSdf ?? 0;
      exportData['Monto total'] = registro.totalHoras?.montoTotal ?? 0;
      exportData['Monto L-V'] = registro.totalHoras?.montoLav ?? 0;
      exportData['Monto S-D-F'] = registro.totalHoras?.montoSdf ?? 0;

      // --- Facturas ---
      if (registro.facturas && registro.facturas.length > 0) {
        exportData['Facturas'] = registro.facturas
          .map(f => `${f.tipo || 0}-${f.puntoVenta || 0}-${f.numeroFactura || 0}`)
          .join('; ');
      }

      // --- Días ---
      this.displayedColumns.slice(6).forEach((fechaColumna: string, index: number) => {
        const fecha = this.getFechaFromColumnId(fechaColumna);
        const horas = this.calculateHoursForExcel(registro.registroActividad, fecha);
        exportData[combinedHeaders[dataColumnHeaders.length + index]] = horas;
      });

      worksheet.addRow(Object.values(exportData));
      const row = worksheet.lastRow!;

      // Estilo por día
      this.displayedColumns.slice(6).forEach((fechaColumna: string, index: number) => {
        const fecha = this.getFechaFromColumnId(fechaColumna);
        const { clase } = this.getCellInfo(fecha, registro);
        const cellIndex = dataColumnHeaders.length + index + 1;
        const cell = row.getCell(cellIndex);

        if (clase === 'holiday') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F9CACA' } }; // Rojo feriado
        } else if (clase === 'weekend') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E0E0E0' } }; // Gris finde
        }
      });

      // Totales verdes (horas y montos)
      ['Horas mes', 'Horas L-V', 'Horas S-D-F', 'Monto total', 'Monto L-V', 'Monto S-D-F', 'Facturas'].forEach(headerName => {
        const colIndex = combinedHeaders.indexOf(headerName) + 1;
        if (colIndex > 0) {
          const cell = row.getCell(colIndex);
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E2EFDA' } };
        }
      });
    }

    // Bordes
    worksheet.eachRow((row) => {
      row.eachCell(cell => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });

    const fileName = `DDJJ-Contrafactura_${mesSeleccionado}(${quincena})_${anioSeleccionado}_${efectorNombre}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
  }

  async exportarAPDF(
    textoAdicional: string = '',
    selloBase64: string = '',
    firmaBase64: string = '',
    autoridadDto?: AutoridadImagenDto,
    nombreArchivo: string = 'exportacion.pdf'
  ) {
    const mesSeleccionado = this.getMonthName(this.selectedMonth);
    const anioSeleccionado = this.selectedYear;
    const efectorNombre = this.efectorNombre;
    const quincena = this.selectedQuincena!;

    const headers = [
      'Apellido', 'Nombre', 'Cuil',
      'Horas mes', 'Horas L-V', 'Horas S-D-F',
      'Factura N°', 'Monto total', 'Monto L-V', 'Monto S-D-F',
      ...this.displayedColumns.slice(6).map(col => moment(col,'YYYY_MM_DD').format('ddd DD'))
    ];

    const body: any[] = [headers];

    for (const registro of this.dataSource.data) {
      const facturaTexto = (registro.facturas || [])
        .map(f => `${f.tipo || 0}-${f.puntoVenta || 0}-${f.numeroFactura || 0}`)
        .join('\n');

      const row: any[] = [
        registro.asistencial.apellido,
        registro.asistencial.nombre,
        this.formatCuil(registro.asistencial.cuil),
        { text: (registro.totalHoras?.horasLav ?? 0) + (registro.totalHoras?.horasSdf ?? 0), fillColor:'#E2EFDA', alignment:'center' },
        { text: registro.totalHoras?.horasLav ?? 0, fillColor:'#E2EFDA', alignment:'center' },
        { text: registro.totalHoras?.horasSdf ?? 0, fillColor:'#E2EFDA', alignment:'center' },
        { text: facturaTexto, fillColor:'#C5E0B3', alignment:'center' }, 
        { text: registro.totalHoras?.montoTotal ?? 0, fillColor:'#C5E0B3', alignment:'center' },
        { text: registro.totalHoras?.montoLav ?? 0, fillColor:'#C5E0B3', alignment:'center' },
        { text: registro.totalHoras?.montoSdf ?? 0, fillColor:'#C5E0B3', alignment:'center' },
      ];

      this.displayedColumns.slice(6).forEach(fechaColumna => {
        const fecha = this.getFechaFromColumnId(fechaColumna);
        const horas = this.calculateHoursForExcel(registro.registroActividad, fecha);
        const { clase } = this.getCellInfo(fecha, registro);
        if (clase === 'holiday') {
          row.push({ text: horas, fillColor: '#F9CACA', bold:true, alignment:'center' });
        } else if (clase === 'weekend') {
          row.push({ text: horas, fillColor: '#E0E0E0', alignment:'center' });
        } else {
          row.push({ text: horas, alignment:'center' });
        }
      });

      body.push(row);
    }

    const content: any[] = [
      { text: `DDJJ - Contrafactura - ${efectorNombre} - ${quincena} QUINCENA - ${mesSeleccionado} ${anioSeleccionado}`, style:'header' },
      {
        table: { headerRows: 1, widths: headers.map(() => 'auto'), body },
        layout: { hLineWidth:()=>0.5, vLineWidth:()=>0.5, hLineColor:()=> '#000', vLineColor:()=> '#000' }
      }
    ];

    // Sección de texto adicional, sello y firma
    if (textoAdicional || selloBase64 || firmaBase64 || autoridadDto) { 
      content.push({
        alignment:'center',
        margin:[0,20,0,0],
        stack:[
          { text:textoAdicional, fontSize:8 },
          {
            columns:[
              {
                width:'50%',
                stack:[
                  firmaBase64 ? { image:firmaBase64, width:120, alignment:'right' } : {},
                  autoridadDto?.personaName ? { text:autoridadDto.personaName, alignment:'right', bold:true } : {},
                  autoridadDto?.cargo ? { text:autoridadDto.cargo, alignment:'right', fontSize:8 } : {}
                ]
              },
              {
                width:'50%',
                stack:[ selloBase64 ? { image:selloBase64, width:120, alignment:'left' } : {} ]
              }
            ],
            columnGap:20,
            margin:[0,40,0,0]
          }
        ]
      });
    }

    const docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [10, 10, 10, 10],
      content,
      styles: { header:{ fontSize:14, bold:true, alignment:'center', margin:[0,0,0,10] } },
      defaultStyle: { fontSize:7 }
    };

    pdfMake.createPdf(docDefinition).download(
      `DDJJ-Contrafactura_${mesSeleccionado}(${quincena})_${anioSeleccionado}_${efectorNombre}_${nombreArchivo}.pdf`
    );
  }

  getBase64FromUrl(url: string): Promise<string> {
    return fetch(url)
      .then(response => response.blob())
      .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));
  }

  async onExportarAExcel() {
    try {
      await this.exportarAExcel();
    } catch (error) {
      console.error('Error exportando a Excel:', error);
    }
  }

  async onExportarConHospital() {
    const textoAdicional = 'APROBACIÓN DE LA DDJJ POR PARTE DEL DIRECTOR DEL HOSPITAL PARA SU PASE A DPH.-';
    const nombreArchivo = 'AprobadoHospital';
    const ddjj = this.ddjjSeleccionada!;

    try {
      // 1. Obtener sello del hospital
      const imagenesHospital = await this.hospitalService.listImages(this.efectorId!).toPromise();
      const selloUrl = imagenesHospital?.currentImage ? '/assets' + imagenesHospital.currentImage : null;

      if (!selloUrl) {
        console.warn('No se encontró la imagen actual del sello del hospital.');
        return;
      }
      const selloBase64 = await this.getBase64FromUrl(selloUrl);

      // 2. Obtener firma de autoridad
      const autoridadDto = await this.ddjjService.getAutoridadImageUrl(ddjj.idDirector).toPromise();

      if (!autoridadDto) {
        console.warn('No se encontró firma de autoridad.');
        return;
      }
      const firmaUrl = autoridadDto?.url ? '/assets' + autoridadDto.url : undefined;
      const firmaBase64 = firmaUrl ? await this.getBase64FromUrl(firmaUrl) : undefined;
      // 3. Llamar a exportarAPDF con texto, imágenes y datos
      await this.exportarAPDF(textoAdicional, selloBase64, firmaBase64, autoridadDto, nombreArchivo);
    } catch (error) {
      console.error('Error exportando a PDF con sello y firma:', error);
    }
  }

  async onExportarConDPH() {
    const textoAdicional = 'CORRESPONDE EL PAGO DE GUARDIAS CONTRAFACTURA EFECTIVAMENTE CUMPLIDAS (PROFESIONALES 24 HS. Y J-2) Y BONO DE GUARDIAS COVID- SEGÚN RESOLUCIÓN  N° 516-S/2023  -  PARA AQUELLOS AGENTES QUE SE ENCUENTREN GOZANDO DE L.A.O., LIC. POR MATERNIDAD.-';
    const nombreArchivo = 'AprobadoDPH';
    const ddjj = this.ddjjSeleccionada!;

    try {
      // 1. Obtener sello del ministerio
      const imagenesMinisterio = await this.ministerioService.getImageByUserId(ddjj.idDirectorDPH).toPromise();
      const selloUrl = imagenesMinisterio?.url ? '/assets' + imagenesMinisterio.url : null;

      if (!selloUrl) {
        console.warn('No se encontró la imagen actual del sello del hospital.');
        return;
      }
      const selloBase64 = await this.getBase64FromUrl(selloUrl);

      // 2. Obtener firma de autoridad
      const autoridadDto = await this.ddjjService.getAutoridadImageUrl(ddjj.idDirectorDPH).toPromise();

      if (!autoridadDto) {
        console.warn('No se encontró firma de autoridad.');
        return;
      }
      const firmaUrl = autoridadDto?.url ? '/assets' + autoridadDto.url : undefined;
      const firmaBase64 = firmaUrl ? await this.getBase64FromUrl(firmaUrl) : undefined;
      // 3. Llamar a exportarAPDF con texto, imágenes y datos
      await this.exportarAPDF(textoAdicional, selloBase64, firmaBase64, autoridadDto, nombreArchivo);
    } catch (error) {
      console.error('Error exportando a PDF con sello y firma:', error);
    }
  }

  async onExportarLimpio() {
      const nombreArchivo = 'SinAprobar';
      try {
      await this.exportarAPDF(undefined, undefined, undefined, undefined, nombreArchivo);
    } catch (error) {
      console.error('Error exportando a PDF:', error);
    }
  }

  //destroy

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

}