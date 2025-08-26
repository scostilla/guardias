import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import 'moment/locale/es';

//Compoanentes
import { RmensualCargoyagrupDetailComponent } from '../rmensual-cargoyagrup-detail/rmensual-cargoyagrup-detail.component';
import { DialogConfirmRmensualComponent } from '../dialog-confirm-rmensual/dialog-confirm-rmensual.component';


//Servicios
import { RegistroMensualService } from 'src/app/services/registroMensual.service';
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { DdjjService } from 'src/app/services/ddjj.service';

//Models y dto
import { Feriado } from 'src/app/models/Configuracion/Feriado';

import { RegActivListDto } from 'src/app/dto/guardias/RegActivListDto';
import { RegistroMensualListDto } from 'src/app/dto/RegistroMensualListDto';
import { ServicioSummaryDto } from 'src/app/dto/Configuracion/ServicioSummaryDto';
import { NovedadPersonalListDto } from 'src/app/dto/guardias/NovedadPersonalListDto';
import { DdjjDto } from 'src/app/dto/DdjjDto';

//Exportaciones a EXCEL y PDF
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
  selector: 'app-rmensual-extra',
  templateUrl: './rmensual-extra.component.html',
  styleUrls: ['./rmensual-extra.component.css']
})

export class RmensualExtraComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<RegistroMensualListDto>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['apellido', 'nombre', 'acciones', 'totalHoras', 'weekdaysTotal', 'weekendsTotal'];
  dataSource!: MatTableDataSource<RegistroMensualListDto>;
  suscription!: Subscription;
  tablaListaParaMostrar = false;

  private actividadesPorRegistro: Map<number, { [fecha: string]: RegActivListDto[] }> = new Map();
  registrosMensuales: RegistroMensualListDto[] = [];

  diasEnMes: moment.Moment[] = [];
  feriados: Feriado[] = [];
  servicios: ServicioSummaryDto[] = []; 

  dialogRef!: MatDialogRef<RmensualCargoyagrupDetailComponent>;

  selectedServicio?: number | null = null; 
  selectedMonth: number = moment().month() + 1;
  selectedYear: number = moment().year();
  months = moment.months().map((name, value) => ({ value, name }));
  years: number[] = [2023, 2024, 2025];
  selectedMonthYear: string = '';
  mesesDisponibles: { value: string, label: string }[] = [];

  botonDDJJIcon: 'snooze' | 'assignment_return' | 'assignment_turned_in' | 'assignment_late' = 'assignment_return';
  creacionDDJJ: boolean = false;
  verificandoDdjj: boolean = false;
  ddjjYaExiste: boolean = false;
  efectorId: number | null = null;
  efectorNombre: string | null = null;

  //Autenticación
  roles: string[] = [];
  currentRole: string | null = null;
  isAutoridad: boolean = false;
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;

  constructor(
    private registroMensualService: RegistroMensualService,
    private feriadoService: FeriadoService,
    private dialog: MatDialog,
    private paginatorIntl: MatPaginatorIntl,
    private hospitalService: HospitalService,
    private efectorService: EfectorService,
    private ddjjService: DdjjService,
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

    this.tablaListaParaMostrar = false;

    if (!idEfector) {
      console.error("El ID del hospital no puede ser null");
      return;
    }

    const request$ = this.selectedServicio
      ? this.registroMensualService.listExtraAndServicio(anio, mes, idEfector, this.selectedServicio)
      : this.registroMensualService.listExtra(anio, mes, idEfector);

    request$.subscribe(data => {
      this.registrosMensuales = data;
      this.preprocesarActividades();
      this.updateTableDataSource();
      this.tablaListaParaMostrar = true;
    });
  }

  // Preprocesar actividades para acceso rápido
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

  // Obtener lista de actividades de un registro en una fecha dada
  getActividadesPorFecha(registroId: number, date: Date): RegActivListDto[] {
    const mapa = this.actividadesPorRegistro.get(registroId);
    if (!mapa) return [];
    const key = moment(date).format("YYYY-MM-DD");
    return mapa[key] || [];
  }

  // Mostrar horas (con color) de todas las guardias de un día
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

  // Colores por tipo de guardia
  getColor(tipoGuardiaId: number): string {
    if (tipoGuardiaId === 3) {
      return '#fcc932'; // EXTRA
    }
    return '#000'; // Default negro
  }

  generarDiasDelMes(): void {
    const startOfMonth = moment().year(this.selectedYear).month(this.selectedMonth - 1).startOf('month');
    const endOfMonth = startOfMonth.clone().endOf('month');
    let day = startOfMonth.clone();

    this.displayedColumns = this.displayedColumns.filter(column => !column.includes('_'));

    while (day <= endOfMonth) {
      this.displayedColumns.push(day.format('YYYY_MM_DD'));
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

  isNovedadClass(date: Date, registro: any): string {
    const dateMoment = moment(date).startOf('day');
    
    // Verificar novedad
    const { isNovedad, tipoLicencia } = this.isNovedad(dateMoment, registro.asistencial.novedadesPersonales);
    if (isNovedad) return this.getNovedadCssClass(tipoLicencia);

    // Verificar feriado
    if (this.isHoliday(date).isHoliday) return 'holiday';

    // Verificar fin de semana
    if (this.isWeekend(date)) return 'weekend';

    // Default
    return '';
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

  this.selectedServicio = null;

  this.updateDateAndLoadData();
  }

  updateDateAndLoadData(): void {
    this.generarDiasDelMes();
    this.loadRegistrosMensuales();
    this.verificarExistenciaDdjj();
  }

  //Dar formato
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

  convertirMesANombre(numeroMes: number): string {
    const meses = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    return meses[numeroMes];
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

  //Verificaciones para permitir interacciones

  private estaEnRango(inicio: Date, fin: Date, today: Date = new Date()): boolean {
    return today >= inicio && today <= fin;
  }

  private getRangoMesSiguiente(): { inicio: Date, fin: Date } {
    let mes = this.selectedMonth;
    let anio = this.selectedYear;

    if (mes === 12) {
      mes = 1;
      anio += 1;
    } else {
      mes += 1;
    }

    const inicio = new Date(anio, mes - 1, 1);
    const fin = new Date(anio, mes - 1, 26, 23, 59, 59);

    return { inicio, fin };
  }

  isHabilitadoBotonDdjj(): boolean {
    const today = new Date();
    const { inicio, fin } = this.getRangoMesSiguiente();
    return this.estaEnRango(inicio, fin, today);
  }

  getMensajeContadorDdjj(): string | null {
    const today = new Date();
    const { inicio, fin } = this.getRangoMesSiguiente();

    if (this.estaEnRango(inicio, fin, today)) {
      const diasRestantes = fin.getDate() - today.getDate() + 1;

      if (diasRestantes === 1) {
        return 'Es el último día';
      }

      return `${diasRestantes} ${diasRestantes === 1 ? 'día' : 'días'}`;
    }

    return null;
  }

  verificarExistenciaDdjj(): void {
    this.verificandoDdjj = true;

    const nombreMes = this.convertirMesANombre(this.selectedMonth - 1);
    const anio = this.selectedYear;
    const efectorId = this.efectorId;
    const tipoGuardiaId = 3;

    if (!efectorId) {
      console.error('El ID del efector no puede ser null');
      this.verificandoDdjj = false;
      return;
    }

    this.ddjjService.existsDdjj(anio, nombreMes, efectorId, tipoGuardiaId).subscribe({
      next: (existe: boolean) => {
        this.ddjjYaExiste = existe;
        const today = new Date();
        const { inicio, fin } = this.getRangoMesSiguiente();

        if (existe) {
          this.botonDDJJIcon = 'assignment_turned_in';
        } else if (today < inicio) {
          this.botonDDJJIcon = 'snooze';
        } else if (this.estaEnRango(inicio, fin, today)) {
          this.botonDDJJIcon = 'assignment_return';
        } else {
          this.botonDDJJIcon = 'assignment_late';
        }

        this.verificandoDdjj = false;
      },
      error: (err) => {
        console.error('Error verificando existencia de DDJJ:', err);
        this.ddjjYaExiste = false;
        this.botonDDJJIcon = 'assignment_return';
        this.verificandoDdjj = false;
      }
    });
  }

  isHabilitadoBotonDdjjFinal(): boolean {
    return this.isHabilitadoBotonDdjj() && !this.ddjjYaExiste;
  }

  mostrarMensajeRechazoDdjj(): boolean {
    const today = new Date();
    const { fin } = this.getRangoMesSiguiente();

    return !this.verificandoDdjj && !this.ddjjYaExiste && today > fin;
  }
  
  //Manejo de dialogs

  openDetail(registro: RegistroMensualListDto): void {
    const dataToSend = {
      asistencial: registro.asistencial,
      registroActividad: registro.registroActividad,
      novedades: registro.asistencial?.novedadesPersonales ?? [],
    };
    console.log('📤 Enviando al diálogo:', dataToSend);

    this.dialogRef = this.dialog.open(RmensualCargoyagrupDetailComponent, {
      width: '600px',
      data: dataToSend
    });
  }

  openDdjjConfirm(): void {
    const dialogRef = this.dialog.open(DialogConfirmRmensualComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.creacionDDJJ = true;

        this.crearDdjjDesdeRegistros();
      }
    });
  }

  //Creacion de ddjj y pase a director

  crearDdjjDesdeRegistros(): void {
    const mes = moment().month(this.selectedMonth -1).format('MMMM').toUpperCase();
    const anio = this.selectedYear;

    if (this.efectorId == null) {
      console.error('El ID del efector no puede ser nulo');
      this.toastr.error('El ID del efector no puede ser nulo');
      return;
    }
    const idEfector = this.efectorId;

    if (!this.registrosMensuales || this.registrosMensuales.length === 0) {
      console.warn('No hay registros mensuales para crear la DDJJ');
      this.toastr.warning('No hay registros mensuales para crear la DDJJ');
      return;
    }

    const idRegistrosMensuales = this.registrosMensuales
    .filter(reg => reg.id !== undefined && reg.id !== null)
    .map(reg => reg.id as number);

    const totalHoras = this.registrosMensuales[0].totalHoras;
    const subtotal = totalHoras?.horasLav ?? 0;
    const total = (totalHoras?.horasLav ?? 0) + (totalHoras?.horasSdf ?? 0);

    const ddjj = new DdjjDto(
      mes,
      anio,
      true, // activo
      subtotal,
      total,
      idEfector,
      idRegistrosMensuales,
      'PENDIENTE',
      3,              //idTipoGuardia
      undefined,      // idValorGmi
      undefined,      // idDirector
      undefined,      // idDirectorDPH
      undefined,      // estadoDdjjDirectorDPH
      true,            // enPosesionDirector
      undefined,      // enPosesionDirectorDPH
      null,       //motivoDirector
      null,      //motivoDirectorDPH
    );

    console.log('DTO a enviar creacion (DdjjDto):', ddjj);


    this.ddjjService.create(ddjj).subscribe({
      next: () => {
        this.toastr.success('DDJJ creada y enviada al Director con éxito', 'Éxito', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
        this.loadRegistrosMensuales();
        this.verificarExistenciaDdjj();
      },
      error: (err) => {
        console.error('Error al crear DDJJ:', err);
        this.toastr.error('Error al crear la DDJJ. Intente nuevamente.', 'Error', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      }
    });
  }

  //Exportaciones a EXCEL y PDF

  calculateHoursForExcel(registroId: number, date: Date): number | string {
    const actividades = this.getActividadesPorFecha(registroId, date);
    if (!actividades || actividades.length === 0) return '';

    let horasTotales = 0;

    for (const act of actividades) {
      if (act.fechaIngreso && !act.fechaEgreso) {
        return 'sin egreso';
      }

      if (act.fechaIngreso && act.fechaEgreso) {
        const hoursIn = moment(`${act.fechaIngreso} ${act.horaIngreso}`, 'YYYY-MM-DD HH:mm:ss');
        const hoursOut = moment(`${act.fechaEgreso} ${act.horaEgreso}`, 'YYYY-MM-DD HH:mm:ss');

        if (!hoursIn.isValid() || !hoursOut.isValid()) return 'Datos inválidos';

        const diff = hoursOut.diff(hoursIn, 'hours', true);
        horasTotales += diff > 0 ? Math.round(diff) : 0;
      }
    }

    return horasTotales > 0 ? horasTotales : '';
  }

  async exportarAExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos');

    const mesSeleccionado = this.getMonthName(this.selectedMonth);
    const anioSeleccionado = this.selectedYear;
    const efectorNombre = this.efectorNombre;

    worksheet.addRow([`${mesSeleccionado} ${anioSeleccionado}`, efectorNombre]).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFADD8E6' }
    };
    worksheet.getRow(1).font = { bold: true };

    const dataColumnHeaders = ['Apellido', 'Nombre', 'Cuil', 'Vinculos_Laborales', 'Categoria', 'Novedades', 'Horas mes', 'Horas L-V', 'Horas S-D-F'];
    const formattedColumnTitles = this.displayedColumns.slice(6).map(columnTitle =>
      moment(columnTitle, 'YYYY_MM_DD').format('ddd DD')
    );
    const combinedHeaders = [...dataColumnHeaders, ...formattedColumnTitles];
    worksheet.addRow(combinedHeaders).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' }
    };
    worksheet.getRow(2).font = { bold: true };

    for (const registro of this.dataSource.data) {
      const exportData: Record<string, string | number> = {
        Apellido: registro.asistencial.apellido,
        Nombre: registro.asistencial.nombre,
        Cuil: registro.asistencial.cuil,
        Vinculos_Laborales: registro.asistencial.legajos[0]?.revista?.tipoRevista?.nombre || '-',
        Categoria: (registro.asistencial.legajos[0]?.revista?.categoria?.nombre || '-') +
                  ' (' + (registro.asistencial.legajos[0]?.revista?.adicional?.nombre || '-') + ')',
        Novedades: registro.asistencial.novedadesPersonales?.length > 0
          ? registro.asistencial.novedadesPersonales.map(nov => `${nov.tipoLicencia?.nombre ?? '-'}`).join('; ')
          : '-'
      };

      const totalMes = (registro.totalHoras?.horasLav ?? 0) + (registro.totalHoras?.horasSdf ?? 0);
      exportData['Horas mes'] = totalMes;
      exportData['Horas L-V'] = registro.totalHoras?.horasLav ?? 0;
      exportData['Horas S-D-F'] = registro.totalHoras?.horasSdf ?? 0;

      this.displayedColumns.slice(6).forEach((fechaColumna: string, index: number) => {
        const fecha = this.getFechaFromColumnId(fechaColumna);
        const horas = this.calculateHoursForExcel(registro.id, fecha);
        exportData[combinedHeaders[dataColumnHeaders.length + index]] = horas;
      });

      worksheet.addRow(Object.values(exportData));
      const row = worksheet.lastRow!;

      // Aplicar estilos de celda según feriado, fin de semana o novedad
      this.displayedColumns.slice(6).forEach((fechaColumna: string, index: number) => {
        const fecha = this.getFechaFromColumnId(fechaColumna);
        const { clase } = this.getCellInfo(fecha, registro);
        const cellIndex = dataColumnHeaders.length + index + 1;
        const cell = row.getCell(cellIndex);

        if (clase === 'holiday') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F9CACA' } };
        } else if (clase.startsWith('novedad-personal')) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D4F1F9' } };
        } else if (clase === 'weekend') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E0E0E0' } };
        }
      });

      // Aplicar fondo a las 3 celdas de horas
      ['Horas mes', 'Horas L-V', 'Horas S-D-F'].forEach((key, i) => {
        const cell = row.getCell(dataColumnHeaders.indexOf(key) + 1);
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E2EFDA' } };
      });
    }

    // Agregar fila vacía y referencia de colores
    worksheet.addRow([]);
    const referenciaRow = worksheet.addRow(['Referencia:']);
    referenciaRow.font = { bold: true };
    ['Feriado', 'Novedades'].forEach((texto, i) => {
      const cell = worksheet.addRow([texto]).getCell(1);
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: texto === 'Feriado' ? 'F9CACA' : 'D4F1F9' } };
    });

    // Bordes
    worksheet.eachRow((row) => {
      row.eachCell(cell => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });

    const fileName = `rMensual-Extra_${mesSeleccionado}_${anioSeleccionado}_${efectorNombre}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
  }

  async exportarAPDF() {
    const mesSeleccionado = this.getMonthName(this.selectedMonth);
    const anioSeleccionado = this.selectedYear;
    const efectorNombre = this.efectorNombre;

    // Encabezados
    const headers = [
      'Apellido','Nombre','Cuil','Vinculos Laborales','Categoria','Novedades',
      'Horas mes','Horas L-V','Horas S-D-F',
      ...this.displayedColumns.slice(6).map(col => moment(col,'YYYY_MM_DD').format('ddd DD'))
    ];

    const body: any[] = [headers];

    // Filas de datos
    for (const registro of this.dataSource.data) {
      const row: any[] = [
        registro.asistencial.apellido,
        registro.asistencial.nombre,
        registro.asistencial.cuil,
        registro.asistencial.legajos?.[0]?.revista?.tipoRevista?.nombre ?? '-',
        registro.asistencial.legajos?.[0]?.revista
          ? `${registro.asistencial.legajos[0].revista.categoria?.nombre ?? ''} (${registro.asistencial.legajos[0].revista.adicional?.nombre ?? ''})`
          : '-',
        registro.asistencial.novedadesPersonales?.length > 0
          ? registro.asistencial.novedadesPersonales
              .map(nov => `${nov.tipoLicencia?.nombre ?? '-'} (${this.formatDate(nov.fechaInicio, nov.fechaFinal)})`)
              .join('; ')
          : '-',
        // Totales verdes
        { text: (registro.totalHoras?.horasLav ?? 0) + (registro.totalHoras?.horasSdf ?? 0), fillColor:'#E2EFDA', alignment:'center' },
        { text: registro.totalHoras?.horasLav ?? 0, fillColor:'#E2EFDA', alignment:'center' },
        { text: registro.totalHoras?.horasSdf ?? 0, fillColor:'#E2EFDA', alignment:'center' }
      ];

      // Celdas de días
      this.displayedColumns.slice(6).forEach(col => {
        const fecha = this.getFechaFromColumnId(col);
        const horas = this.calculateHoursForExcel(registro.id, fecha);
        const { clase } = this.getCellInfo(fecha, registro);

        if (clase === 'holiday') row.push({ text: horas, fillColor: '#F9CACA', bold:true, alignment:'center' });
        else if (clase.startsWith('novedad-personal')) row.push({ text: horas, fillColor: '#A8EFFF', alignment:'center' });
        else if (clase === 'weekend') row.push({ text: horas, fillColor: '#E0E0E0', alignment:'center' });
        else row.push({ text: horas, alignment:'center' });
      });

      body.push(row);
    }

    // Tabla principal
    const mainTable = {
      table: { headerRows:1, widths: headers.map(() => 'auto'), body },
      layout: { hLineWidth:()=>0.5, vLineWidth:()=>0.5, hLineColor:()=> '#000000', vLineColor:()=> '#000000' }
    };

    // Tabla de referencias al final sin bordes
    const referenciasTable = {
      table: {
        widths: headers.map(() => 'auto'),
        body: [
          [
            { text: 'Feriados', alignment: 'center', fillColor: '#F9CACA', bold: true },
            { text: 'Novedades', alignment: 'center', fillColor: '#A8EFFF', bold: true },
            ...Array(headers.length - 2).fill({ text: '' })
          ]
        ]
      },
      layout: 'noBorders',
      margin: [0, 10, 0, 0] // espacio entre tabla y referencias
    };

    // Definición del PDF
    const docDefinition: any = {
      pageSize: 'A3',
      pageOrientation: 'landscape',
      pageMargins: [10,10,10,10],
      content: [
        { text: `Registro Mensual - Extra - ${efectorNombre} - ${mesSeleccionado} ${anioSeleccionado}`, style:'header' },
        mainTable,
        referenciasTable
      ],
      styles: { header:{ fontSize:14, bold:true, alignment:'center', margin:[0,0,0,10] } },
      defaultStyle: { fontSize:7 }
    };

    pdfMake.createPdf(docDefinition).download(`rMensual-Extra_${mesSeleccionado}_${anioSeleccionado}_${efectorNombre}.pdf`);
  }

  async onExportarAExcel() {
    try {
      await this.exportarAExcel();
    } catch (error) {
      console.error('Error exportando a Excel:', error);
    }
  }

  async onExportarAPDF() {
    try {
      await this.exportarAPDF();
    } catch (error) {
      console.error('Error exportando a PDF:', error);
    }
  }

  //destroy

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

}