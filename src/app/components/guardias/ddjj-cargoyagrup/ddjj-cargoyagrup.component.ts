import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RmensualCargoyagrupDetailComponent } from '../rmensual-cargoyagrup-detail/rmensual-cargoyagrup-detail.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { DialogConfirmDdjjComponent } from '../dialog-confirm-ddjj/dialog-confirm-ddjj.component';
import { RegistroActividadesEditComponent } from 'src/app/components/actividades/registro-actividades-edit/registro-actividades-edit.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription, Observable, firstValueFrom } from 'rxjs';
import { RegistroActividad } from 'src/app/models/RegistroActividad';
import { Person } from 'src/app/models/Configuracion/Person';
import { RegistroMensual } from 'src/app/models/RegistroMensual';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';
import { Feriado } from 'src/app/models/Configuracion/Feriado';
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { ServicioSummaryDto } from 'src/app/dto/Configuracion/ServicioSummaryDto';
import { EstadoDdjjDto } from 'src/app/dto/EstadoDdjjDto';
import { NovedadPersonal } from 'src/app/models/guardias/NovedadPersonal';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { DdjjService } from 'src/app/services/ddjj.service';
import { ObservacionDdjjService } from 'src/app/services/observacionDdjj.service';
import { ObservacionDdjjDto } from 'src/app/dto/ObservacionDdjjDto';
import { ObservacionDdjjUltimoDto } from 'src/app/dto/ObservacionDdjjUltimoDto';
import { DialogHistorialObservacionesComponent } from '../dialog-historial-observaciones/dialog-historial-observaciones.component';
import { Ddjj } from 'src/app/models/Configuracion/Ddjj';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import 'moment/locale/es';
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
  selector: 'app-ddjj-cargoyagrup',
  templateUrl: './ddjj-cargoyagrup.component.html',
  styleUrls: ['./ddjj-cargoyagrup.component.css']
})

export class DdjjCargoyagrupComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<RegistroMensual>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  mostrarMontos: boolean = false;

  columnasBase: string[] = ['apellido', 'nombre', 'acciones', 'totalHoras', 'weekdaysTotal', 'weekendsTotal'];
  columnasMontos: string[] = ['montoTotal', 'montoLav', 'montoSdf'];
  columnasFechas: string[] = []; // esto reemplaza el uso directo de `displayedColumns`

  get displayedColumns(): string[] {
    return [
      ...this.columnasBase,
      ...(this.mostrarMontos ? this.columnasMontos : []),
      ...this.columnasFechas
    ];
  }
  dataSource!: MatTableDataSource<RegistroMensual>;
  suscription!: Subscription;
  ddjjSeleccionada?: Ddjj;
  tablaListaParaMostrar = false;

  diasEnMes: moment.Moment[] = [];
  feriados: Feriado[] = [];
  registrosMensuales: RegistroMensual[] = [];
  servicios: ServicioSummaryDto[] = []; 

  dialogRef!: MatDialogRef<RmensualCargoyagrupDetailComponent>;

  selectedServicio?: number | null = null; 
  selectedMonth: number = moment().month() + 1;
  selectedYear: number = moment().year();
  months = moment.months().map((name, value) => ({ value, name }));
  years: number[] = [2023, 2024, 2025];
  selectedMonthYear: string = '';
  mesesDisponibles: { value: string, label: string }[] = [];

  botonDirectorIcon: 'assignment_ind' | 'assignment_late' | 'block' | 'assignment_turned_in' = 'assignment_ind';
  evaluacionDdjjCargada = false;
  botonDirectorDeshabilitado: boolean = false;
  mensajeDirector: 'pendiente' | 'pendiente_devuelto' | 'rechazado' | 'aceptado' | 'fuera_rango_tiempo' | null = null;

  botonDphIcon: 'assignment' | 'assignment_late' | 'assignment_turned_in' | 'block' | 'snooze' = 'assignment';
  botonDphDeshabilitado: boolean = false;
  mensajeDph: 'pendiente' | 'pendiente_devuelto' | 'rechazado' | 'aceptado' | 'fuera_rango_tiempo' | null = null;
  evaluacionDdjjDphCargada: boolean = false;

  botonDirectorAuthIcon: string = 'assignment_ind';
  botonDirectorAuthDeshabilitado: boolean = true;
  mensajeDirectorAuth: string | null = null;

  botonDphAuthIcon: string = 'assignment_ind';
  botonDphAuthDeshabilitado: boolean = true;
  mensajeDphAuth: string | null = null;

  puedeEditarCeldas: boolean = false;

  ultimaObservacionDirector?: ObservacionDdjjUltimoDto;
  ultimaObservacionDph?: ObservacionDdjjUltimoDto;
  mostrarBotonHistorialDirector = false;
  mostrarBotonHistorialDph = false;

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
    private feriadoService: FeriadoService,
    private dialog: MatDialog,
    private paginatorIntl: MatPaginatorIntl,
    private hospitalService: HospitalService,
    private efectorService: EfectorService,
    private novedadPersonalService: NovedadPersonalService,
    private ddjjService: DdjjService,
    private observacionDdjjService: ObservacionDdjjService,
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
    // Obtener el ID efector del servicio
    this.efectorId = this.efectorService.getCurrentEfectorId();
      if (this.efectorId) {
        this.loadEfectorName();
          moment.locale('es');
          this.dataSource = new MatTableDataSource<RegistroMensual>([]);
          this.generarMesesDisponibles();
          this.updateDateAndLoadData();
          this.loadHospitalDetails();
          this.selectedMonthYear = `${this.selectedMonth}-${this.selectedYear}`;
    
        this.feriadoService.list().subscribe((feriados: Feriado[]) => {
          this.feriados = feriados;
    });

      } else {
        this.toastr.warning('No seleccionaste un efector', 'Advertencia', {
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
        console.warn('No hay un rol seleccionado actualmente.');
      }
    });

      const userIdFromToken = this.tokenService.getUserIdFromToken();
      this.userId = userIdFromToken !== null ? Number(userIdFromToken) : null;

      this.selectedServicio = null;
  }

  //trae el nombre del efector esta en sesion
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

  // Roles a usar
  UserRoles(): void {
    if (this.currentRole) {
      this.isUsuario = this.currentRole === 'ROLE_USER';
      this.isAdministrativo = this.currentRole === 'ROLE_ADMIN';
      this.isAutoridad = this.currentRole === 'ROLE_AUTORIDAD';
      this.isDph = this.currentRole === 'ROLE_DPH';
      this.isSuper = this.currentRole === 'ROLE_SUPERUSER';
    } else {
      // Si no hay rol seleccionado, todos como false
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

    console.log('Llamando a getServiciosActivos con efectorId:', this.efectorId);

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

verificarExistenciaDdjj(): void {
  this.verificandoDdjj = true;

  const today = new Date();
  let mes = this.selectedMonth; // Mes actual seleccionado
  let anioEvaluado = this.selectedYear;

  // Ajustar si el mes es diciembre
  if (mes === 12) {
    mes = 1;
    anioEvaluado += 1;
  } else {
    mes += 1;
  }

  // Crear rango del 1 al 10 del mes siguiente
  const inicio = new Date(anioEvaluado, mes - 1, 1); // Día 1 del mes siguiente
  const fin = new Date(anioEvaluado, mes - 1, 24, 23, 59, 59); // Día 10 inclusive

  this.mostrarBotonDDJJ = (today >= inicio && today <= fin);
  this.verificandoDdjj = false;
}

private calcularFechaLimiteEnvio(mes: number, anio: number): Date {
  if (mes === 12) {
    mes = 1;
    anio += 1;
  } else {
    mes += 1;
  }
  return new Date(anio, mes - 1, 24, 23, 59, 59);
}

evaluarEstadoDdjj(ddjj: Ddjj): void {
  console.log('Evaluando DDJJ:', {
    id: ddjj.id,
    estadoDdjjDirector: ddjj.estadoDdjjDirector,
    enPosesionDirector: ddjj.enPosesionDirector,
    estadoDdjjDirectorDPH: ddjj.estadoDdjjDirectorDPH,
    enPosesionDirectorDPH: ddjj.enPosesionDirectorDPH
  });

  const estado = ddjj.estadoDdjjDirector;
  const enPosesion = ddjj.enPosesionDirector;

  const fechaLimite = this.calcularFechaLimiteEnvio(this.selectedMonth, this.selectedYear);
  const hoy = new Date();

  if (hoy > fechaLimite && estado !== 'APROBADO') {
    console.log('Hoy:', hoy, ' - Fecha límite:', fechaLimite);
    console.log('DPH: Ya no se puede cargar, fuera del rango permitido');
    this.botonDirectorIcon = 'block';
    this.botonDirectorDeshabilitado = true;
    this.mensajeDirector = 'fuera_rango_tiempo';
    this.puedeEditarCeldas = false;
    this.evaluacionDdjjCargada = true;
    return; // Salir sin seguir evaluando estados
  }

if (enPosesion && estado === 'PENDIENTE') {
  if (ddjj.director == null) {
    console.log('Caso: en posesión del director y pendiente (nunca revisada)');
    this.botonDirectorIcon = 'assignment_late';
    this.botonDirectorDeshabilitado = true;
    this.mensajeDirector = 'pendiente';
    this.puedeEditarCeldas = false;
  } else {
    console.log('Caso: en posesión del director y pendiente (devuelta por DPH)');
    this.botonDirectorIcon = 'assignment_late';
    this.botonDirectorDeshabilitado = true;
    this.mensajeDirector = 'pendiente_devuelto';
    this.puedeEditarCeldas = false;
  }
  } else if (!enPosesion && estado === 'RECHAZADO') {
    console.log('Caso: rechazado por el director');
    this.botonDirectorIcon = 'assignment_ind';
    this.botonDirectorDeshabilitado = false;
    this.mensajeDirector = 'rechazado';
    this.puedeEditarCeldas = true;

  } else if (!enPosesion && estado === 'APROBADO') {
    console.log('Caso: aprobado por el director');
    this.botonDirectorIcon = 'assignment_turned_in';
    this.botonDirectorDeshabilitado = true;
    this.mensajeDirector = 'aceptado';
    this.puedeEditarCeldas = false;
  } else {
    console.log('Caso: estado desconocido o no manejado explícitamente');
    this.botonDirectorIcon = 'assignment_ind';
    this.botonDirectorDeshabilitado = false;
    this.mensajeDirector = null;
  }

  // 👇 Esto garantiza que el botón sólo se renderice después de evaluación
  this.evaluacionDdjjCargada = true;
}

evaluarEstadoDdjjDph(ddjj: Ddjj): void {
  const estadoDirector = ddjj.estadoDdjjDirector;
  const estadoDph = ddjj.estadoDdjjDirectorDPH;
  const enPosesionDph = ddjj.enPosesionDirectorDPH;

  const fechaLimite = this.calcularFechaLimiteEnvio(this.selectedMonth + 1, this.selectedYear);
  const hoy = new Date();

  if (hoy > fechaLimite && estadoDph && estadoDph !== 'APROBADO') {
    console.log('DPH: Ya no se puede cargar, fuera del rango permitido');
    this.botonDphIcon = 'block';
    this.botonDphDeshabilitado = true;
    this.mensajeDph = 'fuera_rango_tiempo';
    this.puedeEditarCeldas = false;
    this.evaluacionDdjjDphCargada = true;
    return; // Salir sin seguir evaluando estados
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
  } else if (enPosesionDph && estadoDph === 'PENDIENTE') {
  if (ddjj.directorDPH == null) {
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
  } else if (!enPosesionDph && estadoDph === 'RECHAZADO') {
    console.log('DPH: Rechazado por DPH');
    this.botonDphIcon = 'assignment';
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
    this.botonDphIcon = 'assignment';
    this.botonDphDeshabilitado = false;
    this.mensajeDph = null;
    this.puedeEditarCeldas = false;
  }

  this.evaluacionDdjjDphCargada = true;
}

evaluarRespuestaDirectorDdjj(ddjj: Ddjj): void {
  const estado = ddjj.estadoDdjjDirector;
  const enPosesion = ddjj.enPosesionDirector;

  const fechaLimite = this.calcularFechaLimiteEnvio(this.selectedMonth, this.selectedYear);
  const hoy = new Date();

  if (hoy > fechaLimite && estado && estado !== 'APROBADO') {
    console.log('Hoy:', hoy, ' - Fecha límite:', fechaLimite);
    console.log('DPH: Ya no se puede cargar, fuera del rango permitido');
    this.botonDirectorAuthIcon = 'block';
    this.botonDirectorAuthDeshabilitado = true;
    this.mensajeDirectorAuth = 'fuera_rango_tiempo';
    return; // Salir sin seguir evaluando estados
  }

  if (enPosesion && estado === 'PENDIENTE') {
    this.botonDirectorAuthIcon = 'assignment_ind';
    this.botonDirectorAuthDeshabilitado = false;
    this.mensajeDirectorAuth = 'revision';
  } else if (!enPosesion && (estado === 'RECHAZADO' || estado === 'APROBADO')) {
    this.botonDirectorAuthIcon = estado === 'RECHAZADO' ? 'assignment_late' : 'assignment_turned_in';
    this.botonDirectorAuthDeshabilitado = true;
    this.mensajeDirectorAuth = estado === 'RECHAZADO' ? 'rechazado' : null;
  } else {
    this.botonDirectorAuthIcon = 'assignment_ind';
    this.botonDirectorAuthDeshabilitado = true;
    this.mensajeDirectorAuth = null;
  }
}

evaluarRespuestaDphDdjj(ddjj: Ddjj): void {
  const estado = ddjj.estadoDdjjDirectorDPH;
  const enPosesion = ddjj.enPosesionDirectorDPH;

  const fechaLimite = this.calcularFechaLimiteEnvio(this.selectedMonth, this.selectedYear);
  const hoy = new Date();

  if (hoy > fechaLimite && estado && estado !== 'APROBADO') {
    console.log('Hoy:', hoy, ' - Fecha límite:', fechaLimite);
    console.log('DPH: Ya no se puede cargar, fuera del rango permitido');
    this.botonDphAuthIcon = 'block';
    this.botonDphAuthDeshabilitado = true;
    this.mensajeDphAuth = 'fuera_rango_tiempo';
    return; // Salir sin seguir evaluando estados
  }

  if (enPosesion && estado === 'PENDIENTE') {
    this.botonDphAuthIcon = 'assignment';
    this.botonDphAuthDeshabilitado = false;
    this.mensajeDphAuth = 'revision';
  } else if (!enPosesion && (estado === 'RECHAZADO' || estado === 'APROBADO')) {
    this.botonDphAuthIcon = estado === 'RECHAZADO' ? 'assignment_late' : 'assignment_turned_in';
    this.botonDphAuthDeshabilitado = true;
    this.mensajeDphAuth = estado === 'RECHAZADO' ? 'rechazado' : null;
  } else {
    this.botonDphAuthIcon = 'assignment';
    this.botonDphAuthDeshabilitado = true;
    this.mensajeDphAuth = null;
  }
}

  getMensajeContadorDdjj(): string | null {
    const today = new Date();
    let mes = this.selectedMonth;
    let anio = this.selectedYear;

    if (mes === 12) {
      mes = 1;
      anio += 1;
    } else {
      mes += 1;
    }

    const inicio = new Date(anio, mes - 1, 1);
    const fin = new Date(anio, mes - 1, 24, 23, 59, 59);

    if (today >= inicio && today <= fin) {
      const diasRestantes = 24 - today.getDate() + 1;

      if (diasRestantes >= 1 && diasRestantes <= 24) {
        return `${diasRestantes} ${diasRestantes === 1 ? 'día' : 'días'}`;
      }
    }

    return null;
  }

  convertirMesANombre(numeroMes: number): string {
    const meses = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    return meses[numeroMes];
  }

validarHistorialBotones() {
  if (!this.ddjjSeleccionada?.id) return;

  this.observacionDdjjService.getObservacionesActivasPorDdjjYTipoDph(this.ddjjSeleccionada.id, false)
    .subscribe({
      next: (data) => this.mostrarBotonHistorialDirector = data.length > 0,
      error: () => this.mostrarBotonHistorialDirector = false
    });

  this.observacionDdjjService.getObservacionesActivasPorDdjjYTipoDph(this.ddjjSeleccionada.id, true)
    .subscribe({
      next: (data) => this.mostrarBotonHistorialDph = data.length > 0,
      error: () => this.mostrarBotonHistorialDph = false
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
  
generarDiasDelMes(): void {
  const startOfMonth = moment().year(this.selectedYear).month(this.selectedMonth - 1).startOf('month');
  const endOfMonth = startOfMonth.clone().endOf('month');
  let day = startOfMonth.clone();

  this.columnasFechas = [];

  while (day <= endOfMonth) {
    this.columnasFechas.push(day.format('YYYY_MM_DD'));
    day.add(1, 'day');
  }
}

  updateTableDataSource(): void {
    this.dataSource.data = this.registrosMensuales;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

loadRegistrosMensuales(): void {
  const anio = this.selectedYear;
  const mes = moment().month(this.selectedMonth - 1).format('MMMM').toUpperCase();
  const idEfector = this.efectorId;

  if (!idEfector) {
    console.error("El ID del hospital no puede ser null");
    return;
  }

  const ddjj$: Observable<Ddjj[]> = this.selectedServicio == null
    ? this.ddjjService.listDdjjCargoyAgrup(anio, mes, idEfector)
    : this.ddjjService.listDdjjCargoyAgrupAndServicio(anio, mes, idEfector, this.selectedServicio);

  this.tablaListaParaMostrar = false;

  ddjj$.subscribe({
    next: (ddjjs: Ddjj[]) => {
      if (ddjjs.length > 0) {
        const primeraDdjj = ddjjs[0];
        this.ddjjSeleccionada = primeraDdjj; // 👈 esto es clave
        this.evaluarEstadoDdjj(primeraDdjj);
        this.evaluarEstadoDdjjDph(primeraDdjj);
        this.evaluarRespuestaDirectorDdjj(primeraDdjj);
        this.evaluarRespuestaDphDdjj(primeraDdjj);

        this.cargarUltimaObservacionDirector(); 
        this.cargarUltimaObservacionDph();
        this.validarHistorialBotones();
      } else {
        this.ddjjSeleccionada = undefined;
        this.ultimaObservacionDirector = undefined;
      }

      this.registrosMensuales = ddjjs.flatMap(ddjj =>
        (ddjj.registrosMensuales || []).map(reg => {
          reg.ddjj = ddjj;
          return reg;
        })
      );

      this.updateTableDataSource();
      this.tablaListaParaMostrar = true;
    },
    error: (err: any) => {
      console.error('Error cargando DDJJ:', err);
      this.registrosMensuales = [];
      this.updateTableDataSource();
      this.tablaListaParaMostrar = true;
    }
  });
}

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

  generarMesesDisponibles(): void {
    const fechaActual = moment(); // hoy
    const mesesPasados = [];

    for (let i = 6; i >= 0; i--) {
      const mesAnio = fechaActual.clone().subtract(i, 'months');
      const mes = mesAnio.month() + 1; // de 1 a 12
      const anio = mesAnio.year();

      mesesPasados.push({
        value: `${mes}-${anio}`, // ej: "5-2025"
        label: mesAnio.format('MMMM YYYY').toUpperCase(), // ej: "MAYO 2025"
      });
    }

    this.mesesDisponibles = mesesPasados;

    // Establecer por defecto el mes y año actuales (en formato humano)
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

    this.mensajeDirector = null;
    this.mensajeDph = null;
    this.mensajeDirectorAuth = null;
    this.mensajeDphAuth = null;

    this.puedeEditarCeldas = false;

    this.calcularFechaLimiteEnvio(this.selectedMonth, this.selectedYear);

    this.generarDiasDelMes();
    this.loadRegistrosMensuales();
    this.verificarExistenciaDdjj();
  }

  getMonthName(mes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Si recibe 1 a 12, ajustamos para índice 0-11
    if (mes >= 1 && mes <= 12) {
      return meses[mes - 1];
    }
    return '';
  }

  getFechaFromColumnId(columnId: string): Date {
    return moment(columnId, 'YYYY_MM_DD').toDate();
  }

  openDetail(asistencial: Person, selectedMonth: number, selectedYear: number): void {
    const dataToSend = {
      asistencial,
      month: selectedMonth,
      year: selectedYear
    };

    this.dialogRef = this.dialog.open(RmensualCargoyagrupDetailComponent, {
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

getRegistroIdForFecha(actividades: RegistroActividad[], fecha: Date): number | null {
  const fechaBuscada = this.formatDateOnly(fecha);
  
  const actividad = actividades.find(act => 
    this.formatDateOnly(new Date(act.fechaIngreso)) === fechaBuscada
  );

  return actividad?.id ?? null;
}

private formatDateOnly(date: Date): string {
  return date.toISOString().split('T')[0]; // devuelve 'YYYY-MM-DD'
}

onCeldaClick(actividades: RegistroActividad[], fecha: Date): void {
  if (!this.puedeEditarCeldas) return;

  const id = this.getRegistroIdForFecha(actividades, fecha);
  if (id != null) {
    this.openEditDialog(id);
  }
}

enviarDdjj(destino: 'DIRECTOR' | 'DPH'): void {
  if (!this.ddjjSeleccionada) {
    this.toastr.error('No hay DDJJ seleccionada para enviar.', 'Error');
    return;
  }

  const estadoDto: EstadoDdjjDto = new EstadoDdjjDto(
    this.ddjjSeleccionada.id!,
    destino === 'DIRECTOR' ? this.ddjjSeleccionada.director?.id : undefined,
    destino === 'DPH' ? this.ddjjSeleccionada.directorDPH?.id : undefined,
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

openDdjjRespuesta(destino: 'DIRECTOR_AUTH' | 'DPH_AUTH'): void {
  if (!this.ddjjSeleccionada) {
    this.toastr.error('No hay DDJJ seleccionada.', 'Error');
    return;
  }

  const dialogRef = this.dialog.open(DialogConfirmDdjjComponent, {
    width: '400px',
    data: {
      destino: destino,
      title: 'Confirmar o rechazar DDJJ'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (!result) return;

    const aprobado = result.estado === 'APROBADO';
    const motivo = result.motivo?.trim() || '';
    const ddjj = this.ddjjSeleccionada!;
    const fechaHora = new Date();
    const fecha = fechaHora.toISOString().split('T')[0]; // "2025-07-22"
    const hora = fechaHora.toTimeString().split(' ')[0]; // "17:42:08"
    const user = this.userId!;

    // 👉 Crear observación si hay motivo y es un rechazo
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

       console.log('Observación a enviar:', {
    motivo: observacion.motivo,
    tipoDph: observacion.tipoDph,
    idUsuario: observacion.idUsuario,
    idDdjj: observacion.idDdjj,
    activo: observacion.activo,
    fecha: fecha,
    hora: hora,
  });

      this.observacionDdjjService.save(observacion).subscribe({
        next: () => {
          console.log('Observación guardada con éxito.');
        },
        error: () => {
          this.toastr.warning('No se pudo guardar la observación.', 'Atención');
        }
      });
    }

    // 👉 Preparar DTO para actualizar estado
    const estadoDto = new EstadoDdjjDto(
      ddjj.id!,
      destino === 'DIRECTOR_AUTH' ? ddjj.director?.id ?? user : undefined,
      destino === 'DPH_AUTH' ? ddjj.directorDPH?.id ?? user : undefined,

      // Estado director
      destino === 'DIRECTOR_AUTH' ? result.estado : ddjj.estadoDdjjDirector!,

      // Estado DPH
      destino === 'DIRECTOR_AUTH' && aprobado ? 'PENDIENTE' :
      destino === 'DPH_AUTH' ? result.estado : ddjj.estadoDdjjDirectorDPH!,

      // enPosesionDirector
      destino === 'DIRECTOR_AUTH' ? false : ddjj.enPosesionDirector!,

      // enPosesionDPH
      destino === 'DIRECTOR_AUTH' && aprobado ? true :
      destino === 'DPH_AUTH' ? false : ddjj.enPosesionDirectorDPH!,

      // Motivos (ya no usamos estos si está rechazado, pero se deben llenar igual)
      destino === 'DIRECTOR_AUTH' ? '' : ddjj.motivoDirector!,
      destino === 'DPH_AUTH' ? '' : ddjj.motivoDirectorDPH!
    );

    console.log('EstadoDdjjDto enviado:', estadoDto);

    this.ddjjService.cambiarEstado(estadoDto).subscribe({
      next: () => {
        this.toastr.success('La respuesta fue enviada correctamente.', 'Enviada', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.loadRegistrosMensuales();
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

isNovedad(date: Date, novedades: NovedadPersonal[]): { isNovedad: boolean, tipoLicencia: string } {
  const dateMoment = moment(date).startOf('day');

  const novedadFound = novedades.find(novedad => {
    const inicioMoment = moment(novedad.fechaInicio).startOf('day');
    const finMoment = moment(novedad.fechaFinal).startOf('day');
    
    const isBetween = dateMoment.isBetween(inicioMoment, finMoment, undefined, '[]');
        
    return isBetween;
  });

  return {
    isNovedad: !!novedadFound,
    tipoLicencia: novedadFound ? novedadFound.tipoLicencia.nombre : ''
  };
}
  
  getNovedadCssClass(tipoLicencia: string): string {
    const tipo = tipoLicencia.toLowerCase();
    return clases[tipo] || 'novedad-personal-otros';
  }

  isNovedadClass(date: Date, registro: any): string {
    const { isNovedad, tipoLicencia } = this.isNovedad(date, registro.asistencial.novedadesPersonales);

    if (isNovedad) {
      return this.getNovedadCssClass(tipoLicencia);
    }

    if (this.isHoliday(date).isHoliday) {
      return 'holiday';
    }

    if (this.isWeekend(date)) {
      return 'weekend';
    }

    return '';
  }

  calculateTooltip(date: Date, registro: any): string {
    const novedad = this.isNovedad(date, registro.asistencial.novedadesPersonales);
    if (novedad.isNovedad) {
      return novedad.tipoLicencia;
    } else {
      const holiday = this.isHoliday(date);
      if (holiday.isHoliday) {
        return holiday.motivo;
      }
    }
    return '';
  }

/*formatDecimalHours(decimalHours: number): string {
  if (!decimalHours || decimalHours <= 0) return '';
  
  let hours = Math.floor(decimalHours);
  let minutes = Math.round((decimalHours - hours) * 60);

  if (minutes === 60) {
    hours += 1;
    minutes = 0;
  }

  const paddedMinutes = minutes.toString().padStart(2, '0');
  return `${hours}:${paddedMinutes} hs`;
}*/
  
calculateHoursForDate(registroActividades: RegistroActividad[], date: Date): SafeHtml {
  const registro = registroActividades.find((actividad) => {
    const ingresoDate = moment(actividad.fechaIngreso);
    return ingresoDate.isSame(date, 'day');
  });

  if (!registro) return this.sanitizer.bypassSecurityTrustHtml('');

  for (let actividad of registroActividades) {
    if (actividad.fechaIngreso && !actividad.fechaEgreso) {
      return this.sanitizer.bypassSecurityTrustHtml('sin egreso');
    }
  }

  if (registro.fechaIngreso && registro.fechaEgreso) {
    const hoursIn = moment(registro.fechaIngreso + ' ' + registro.horaIngreso, 'YYYY-MM-DD HH:mm:ss');
    const hoursOut = moment(registro.fechaEgreso + ' ' + registro.horaEgreso, 'YYYY-MM-DD HH:mm:ss');

    if (hoursIn.isValid() && hoursOut.isValid()) {
      const diffHours = hoursOut.diff(hoursIn, 'hours', true);

      if (diffHours > 0) {
        const color = diffHours < 4 ? '#FF0000' : this.getColor(registro.tipoGuardia!);
        const rounded = diffHours % 1 > 0.5 ? Math.ceil(diffHours) : Math.floor(diffHours);
        const html = `<span style="color: ${color};">${rounded}</span>`;
        return this.sanitizer.bypassSecurityTrustHtml(html);
      } else {
        return this.sanitizer.bypassSecurityTrustHtml('');
      }
    } else {
      return this.sanitizer.bypassSecurityTrustHtml('Datos inválidos');
    }
  }

  return this.sanitizer.bypassSecurityTrustHtml('');
}

  getColor(tipoGuardia: TipoGuardia): string {
    if (tipoGuardia && tipoGuardia.id) {
      if (tipoGuardia.id === 1) {
        return '#91A8DA'; // Color para CARGO
      } else if (tipoGuardia.id === 2) {
        return '#eb7430'; // Color para REAGRUPACION DE HS
      }
    }
    return ''; // Color por defecto
  }
  
  calculateHoursColor(registroActividad: RegistroActividad[], date: Date): string {
    const registro = registroActividad.find((actividad) => {
      const ingresoDate = moment(actividad.fechaIngreso);
      return ingresoDate.isSame(date, 'day');
    });

    if (!registro) {
      return '';
    }

    const tipoGuardia = registro.tipoGuardia;
    if (tipoGuardia && tipoGuardia.id) {
      if (tipoGuardia.id === 1) {
        return '#91A8DA'; // Color para CARGO
      } else if (tipoGuardia.id === 2) {
        return '#eb7430'; // Color para REAGRUPACION DE HS
      }
    }
    return ''; // Color por defecto
  }

  /*getPlainHourDifference(registroActividades: RegistroActividad[], date: Date): number {
  const registro = registroActividades.find((actividad) => {
    const ingresoDate = moment(actividad.fechaIngreso);
    return ingresoDate.isSame(date, 'day');
  });

  if (!registro || !registro.fechaIngreso || !registro.fechaEgreso) return 0;

  const hoursIn = moment(registro.fechaIngreso + ' ' + registro.horaIngreso, 'YYYY-MM-DD HH:mm:ss');
  const hoursOut = moment(registro.fechaEgreso + ' ' + registro.horaEgreso, 'YYYY-MM-DD HH:mm:ss');

  if (!hoursIn.isValid() || !hoursOut.isValid()) return 0;

  const diffHours = hoursOut.diff(hoursIn, 'hours', true);
  return diffHours > 0 ? diffHours : 0;
}

calculateTotalHoursForRow(registroActividades: RegistroActividad[], mesDeInteres: number, anioDeInteres: number): string {
  let totalHours = 0;
  for (let day = 1; day <= moment({ year: anioDeInteres, month: mesDeInteres }).daysInMonth(); day++) {
    const date = new Date(anioDeInteres, mesDeInteres, day);
    totalHours += this.getPlainHourDifference(registroActividades, date);
  }
  return this.formatDecimalHours(totalHours);
}

calculateWeekdaysTotal(registroActividades: RegistroActividad[], mesDeInteres: number, anioDeInteres: number): string {
  let totalWeekdaysHours = 0;
  const daysInMonth = moment({ year: anioDeInteres, month: mesDeInteres }).daysInMonth();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(anioDeInteres, mesDeInteres, day);
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      totalWeekdaysHours += this.getPlainHourDifference(registroActividades, date);
    }
  }
  return this.formatDecimalHours(totalWeekdaysHours);
}

calculateWeekendsTotal(registroActividades: RegistroActividad[], mesDeInteres: number, anioDeInteres: number): string {
  let totalWeekendsHours = 0;
  const daysInMonth = moment({ year: anioDeInteres, month: mesDeInteres }).daysInMonth();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(anioDeInteres, mesDeInteres, day);
    if (date.getDay() === 0 || date.getDay() === 6) {
      totalWeekendsHours += this.getPlainHourDifference(registroActividades, date);
    }
  }
  return this.formatDecimalHours(totalWeekendsHours);
}*/

calculateHoursForExcel(registroActividades: RegistroActividad[], date: Date): string { 
  const registro = registroActividades.find((actividad) => {
    const ingresoDate = moment(actividad.fechaIngreso);
    return ingresoDate.isSame(date, 'day');
  });

  if (!registro) return '';

  for (let actividad of registroActividades) {
    if (actividad.fechaIngreso && !actividad.fechaEgreso) {
      return 'sin egreso';
    }
  }

  if (registro.fechaIngreso && registro.fechaEgreso) {
    const hoursIn = moment(`${registro.fechaIngreso} ${registro.horaIngreso}`, 'YYYY-MM-DD HH:mm:ss');
    const hoursOut = moment(`${registro.fechaEgreso} ${registro.horaEgreso}`, 'YYYY-MM-DD HH:mm:ss');

    if (hoursIn.isValid() && hoursOut.isValid()) {
      const diffHours = hoursOut.diff(hoursIn, 'hours', true);

      if (diffHours > 0) {
        const redondeado = diffHours % 1 > 0.5 ? Math.ceil(diffHours) : Math.floor(diffHours);
        return redondeado.toString();
      } else {
        return '0';
      }
    } else {
      return 'Datos inválidos';
    }
  }

  return '';
}

//aqui decia actual en vez de activo, revisar si corresponde
getLegajoActualId(asistencial: Person): Legajo | undefined {
  const legajoActual = asistencial.legajos.find(legajo => legajo.activo && !legajo.esAutoridad);
  return legajoActual ? legajoActual : undefined;
}

getNovedades(asistencial: Person): Observable<NovedadPersonal[]> {
  const idAsistencial = asistencial.id!;
  const mes = Number(this.selectedMonth) + 1;
  const anio = this.selectedYear;

  console.log('[getNovedades] Solicitando novedades para:', {
    idAsistencial,
    mes,
    anio
  });

  const observable = this.novedadPersonalService.getNovedadesActivasPorPersonaYFecha(
    idAsistencial,
    mes,
    anio
  );

  // Loguear lo que llega desde el backend
  observable.subscribe({
    next: (novedades) => {
      console.log(`[getNovedades] Novedades recibidas para ${idAsistencial}:`, novedades);
    },
    error: (err) => {
      console.error(`[getNovedades] Error para ${idAsistencial}:`, err);
    }
  });

  return observable;
}

formatDate(startDate: Date, endDate: Date): string {
  const formattedStartDate = moment(startDate).format('DD/MM/YYYY');
  const formattedEndDate = moment(endDate).format('DD/MM/YYYY');

  if (formattedStartDate === formattedEndDate) {
    return formattedStartDate;
  } else {
    return `${formattedStartDate} - ${formattedEndDate}`;
  }
}

async exportarAExcel() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Datos');

  const mesSeleccionado = this.getMonthName(this.selectedMonth);
  const anioSeleccionado = this.selectedYear;

  worksheet.addRow([`${mesSeleccionado} ${anioSeleccionado}`]).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFADD8E6' }
  };
  worksheet.getRow(1).font = { bold: true };

  const dataColumnHeaders = ['Apellido', 'Nombre', 'Cuil', 'Vinculos_Laborales', 'Categoria', 'Novedades', 'Total mes', 'Total L-V', 'Total S-D-F'];
  const formattedColumnTitles = this.displayedColumns.slice(6).map(columnTitle => {
    return moment(columnTitle, 'YYYY_MM_DD').format('ddd DD');
  });
  const combinedHeaders = [...dataColumnHeaders, ...formattedColumnTitles];
  worksheet.addRow(combinedHeaders).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFFFF00' }
  };
  worksheet.getRow(2).font = { bold: true };

  // Recorrer con for...of para usar await
  for (const registro of this.dataSource.data) {
    // Esperar las novedades
    const novedades: NovedadPersonal[] = await firstValueFrom(
      this.getNovedades(registro.asistencial)
    );

    const exportData: any = {
      Apellido: registro.asistencial.apellido,
      Nombre: registro.asistencial.nombre,
      Cuil: registro.asistencial.cuil,
      Vinculos_Laborales: this.getLegajoActualId(registro.asistencial)?.revista?.tipoRevista?.nombre || '-',
      Categoria: this.getLegajoActualId(registro.asistencial)?.revista?.categoria?.nombre + '(' + this.getLegajoActualId(registro.asistencial)?.revista?.adicional?.nombre + ')' || '',
      Novedades: novedades.length > 0
        ? novedades.map(novedad => `${novedad.tipoLicencia.nombre} (${this.formatDate(novedad.fechaInicio, novedad.fechaFinal)})`).join('; ')
        : '-'
    };

    const totalMes = (registro.totalHoras?.horasLav ?? 0) + (registro.totalHoras?.horasSdf ?? 0);
    const totalLV = registro.totalHoras?.horasLav ?? 0;
    const totalSD = registro.totalHoras?.horasSdf ?? 0;

    exportData['Total mes'] = totalMes;
    exportData['Total L-V'] = totalLV;
    exportData['Total S-D-F'] = totalSD;

    this.displayedColumns.slice(6).forEach((fechaColumna: string, index: number) => {
      exportData[combinedHeaders[dataColumnHeaders.length + index]] = this.calculateHoursForExcel(registro.registroActividad, this.getFechaFromColumnId(fechaColumna));
    });

    worksheet.addRow(Object.values(exportData));
    const row = worksheet.lastRow!;

    this.displayedColumns.slice(6).forEach((fechaColumna: string, index: number) => {
      const date = this.getFechaFromColumnId(fechaColumna);
      const isHoliday = this.isHoliday(date).isHoliday;

      if (isHoliday) {
        const cellIndex = dataColumnHeaders.length + index + 1;
        const cell = row.getCell(cellIndex);
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'd4c2cd' }
        };
        cell.font = { color: { argb: '000000' } };
      }
    });
  }

  const fileName = `DDJJ-Cargo-y-Agrupacion_${mesSeleccionado}_${anioSeleccionado}_sinAprobacion.xlsx`;

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, colNumber) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, fileName);
}

async exportarAPDF(textoAdicional: string = '', imagenBase64: string = '', nombreArchivo: string = 'exportacion.pdf') {
  const mesSeleccionado = this.getMonthName(this.selectedMonth);
  const anioSeleccionado = this.selectedYear;

  const headers = [
    'Apellido', 'Nombre', 'Cuil', 'Vinculos_Laborales', 'Categoria', 'Novedades', 'Total mes', 'Total L-V', 'Total S-D-F',
    ...this.displayedColumns.slice(6).map(columnTitle => moment(columnTitle, 'YYYY_MM_DD').format('ddd DD'))
  ];

  const body: any[] = [headers];

  for (const registro of this.dataSource.data) {
    const novedades: NovedadPersonal[] = await firstValueFrom(this.getNovedades(registro.asistencial));
    const row = [];

    row.push(registro.asistencial.apellido);
    row.push(registro.asistencial.nombre);
    row.push(registro.asistencial.cuil);
    row.push(this.getLegajoActualId(registro.asistencial)?.revista?.tipoRevista?.nombre || '-');
    row.push(this.getLegajoActualId(registro.asistencial)?.revista?.categoria?.nombre + '(' + this.getLegajoActualId(registro.asistencial)?.revista?.adicional?.nombre + ')' || '');

    const novedadesString = novedades.length > 0
      ? novedades.map(n => `${n.tipoLicencia.nombre} (${this.formatDate(n.fechaInicio, n.fechaFinal)})`).join('; ')
      : '-';
    row.push(novedadesString);

    row.push((registro.totalHoras?.horasLav ?? 0) + (registro.totalHoras?.horasSdf ?? 0));
    row.push(registro.totalHoras?.horasLav ?? 0);
    row.push(registro.totalHoras?.horasSdf ?? 0);
    //row.push(registro.totalHoras?.montoTotal ?? 0);
    //row.push(registro.totalHoras?.montoLav ?? 0);
    //row.push(registro.totalHoras?.montoSdf ?? 0);

    this.displayedColumns.slice(6).forEach(fechaColumna => {
      const fecha = this.getFechaFromColumnId(fechaColumna);
      const horas = this.calculateHoursForExcel(registro.registroActividad, fecha);
      const { isHoliday } = this.isHoliday(fecha);

      if (isHoliday) {
        row.push({
          text: horas,
          fillColor: '#F9CACA',
          color: 'red',
          bold: true,
          alignment: 'center'
        });
      } else {
        row.push(horas);
      }
    });

    body.push(row);
  }

  const content: any[] = [
    { text: `DDJJ - Cargo y Agrupación - ${mesSeleccionado} ${anioSeleccionado}`, style: 'header' },
    {
      table: {
        headerRows: 1,
        widths: headers.map(() => 'auto'),
        body
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => '#000000',
        vLineColor: () => '#000000'
      }
    }
  ];

  // Agrega texto e imagen si se proporcionan
  if (textoAdicional || imagenBase64) {
    content.push(
      { text: textoAdicional, margin: [0, 20, 0, 5], fontSize: 8 },
      { image: imagenBase64, width: 200 }  // Ajusta tamaño según necesidad
    );
  }

  const docDefinition: any = {
    pageSize: 'A3',
    pageOrientation: 'landscape',
    pageMargins: [10, 10, 10, 10],
    content,
    styles: {
      header: {
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10]
      }
    },
    defaultStyle: {
      fontSize: 7
    }
  };

  pdfMake.createPdf(docDefinition).download(`DDJJ-Cargo-y-Agrupacion_${mesSeleccionado}_${anioSeleccionado}_${nombreArchivo}.pdf`);
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

/*async onExportarAPDF() {
  try {
    await this.exportarAPDF();
  } catch (error) {
    console.error('Error exportando a PDF:', error);
  }
}*/

async onExportarConHospital() {
  const texto = 'Texto para exportación de hospitales. El director del hospital aprobó esta Declaración Jurada; -';
  const imagen = await this.getBase64FromUrl('assets/img/firma_arias.png');
   const nombreArchivo = 'AprobadoHospital';
    try {
    await this.exportarAPDF(texto, imagen, nombreArchivo);
  } catch (error) {
    console.error('Error exportando a PDF:', error);
  }
}

async onExportarConDPH() {
  const texto = 'Texto para exportación de DPH. CORRESPONDE EL PAGO DE GUARDIAS DEL CARGO EFECTIVAMENTE CUMPLIDAS (PROFESIONALES 24 HS. Y J-2) Y BONO DE GUARDIAS COVID- SEGÚN RESOLUCIÓN  N° 516-S/2023  -  PARA AQUELLOS AGENTES QUE SE ENCUENTREN GOZANDO DE L.A.O., LIC. POR MATERNIDAD; -';
  const imagen = await this.getBase64FromUrl('assets/img/firma_arias.png');
  const nombreArchivo = 'AprobadoDPH';
    try {
    await this.exportarAPDF(texto, imagen, nombreArchivo);
  } catch (error) {
    console.error('Error exportando a PDF:', error);
  }
}

async onExportarLimpio() {
    const nombreArchivo = 'SinAprobar';
    try {
    await this.exportarAPDF(undefined, undefined, nombreArchivo);
  } catch (error) {
    console.error('Error exportando a PDF:', error);
  }
}

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
    this.dataSource.filterPredicate = (data: RegistroMensual, filter: string) => {
      const nombre = this.accentFilter(data.asistencial.nombre.toLowerCase());
      const apellido = this.accentFilter(data.asistencial.apellido.toLowerCase());

      filter = this.accentFilter(filter.toLowerCase());
      return nombre.includes(filter) || apellido.includes(filter);
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

}