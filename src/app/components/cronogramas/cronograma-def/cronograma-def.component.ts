import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RmensualCargoyagrupDetailComponent } from 'src/app/components/guardias/rmensual-cargoyagrup-detail/rmensual-cargoyagrup-detail.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { RegistroActividad } from 'src/app/models/RegistroActividad';
import { Person } from 'src/app/models/Configuracion/Person';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { Feriado } from 'src/app/models/Configuracion/Feriado';
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { ServicioSummaryDto } from 'src/app/dto/Configuracion/ServicioSummaryDto';
import { DdjjListDto } from 'src/app/dto/DdjjListDto';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { DdjjService } from 'src/app/services/ddjj.service';
import { ObservacionDdjjService } from 'src/app/services/observacionDdjj.service';
import { RegistroMensualListDto } from 'src/app/dto/RegistroMensualListDto';
import { ObservacionDdjjUltimoDto } from 'src/app/dto/ObservacionDdjjUltimoDto';
import { CronogramaDefinitivoService } from 'src/app/services/Cronogramas/cronogramaDefinitivo.service';
import { CronogramaDefinitivoDto } from 'src/app/dto/Cronogramas/CronogramaDefinitivoDto';
import { CronogramaDefinitivoListDto } from 'src/app/dto/CronogramaDefinitivoListDto';
import { AutoridadImagenDto } from 'src/app/dto/AutoridadImagenDto';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import 'moment/locale/es';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = (pdfFonts as any).vfs;

//Autenticación
import { TokenService } from 'src/app/services/login/token.service';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';

type RegistroMensualConDdjj = RegistroMensualListDto & { ddjjDto?: DdjjListDto };

@Component({
  selector: 'app-cronograma-def',
  templateUrl: './cronograma-def.component.html',
  styleUrls: ['./cronograma-def.component.css']
})

export class CronogramaDefComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<RegistroMensualListDto>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  columnasBase: string[] = ['tipoGuardia', 'apellido', 'nombre', 'acciones', 'totalHoras', 'weekdaysTotal', 'weekendsTotal'];
  columnasFechas: string[] = []; // esto reemplaza el uso directo de `displayedColumns`

  get displayedColumns(): string[] {
    return [
      ...this.columnasBase,
      ...this.columnasFechas
    ];
  }
  dataSource!: MatTableDataSource<RegistroMensualConDdjj>;
  suscription!: Subscription;
  ddjjSeleccionada?: DdjjListDto;
  tablaListaParaMostrar = false;

  

  diasEnMes: moment.Moment[] = [];
  feriados: Feriado[] = [];
  registrosMensuales: RegistroMensualConDdjj[] = [];
  servicios: ServicioSummaryDto[] = []; 

  dialogRef!: MatDialogRef<RmensualCargoyagrupDetailComponent>;
  registrosAgrupadosPorTipoGuardia: { tipoGuardia: string; registros: RegistroMensualConDdjj[] }[] = [];

  selectedServicio?: number | null = null; 
  selectedMonth: number = moment().month() + 1;
  selectedYear: number = moment().year();
  months = moment.months().map((name, value) => ({ value, name }));
  years: number[] = [2023, 2024, 2025];
  selectedMonthYear: string = '';
  mesesDisponibles: { value: string, label: string }[] = [];

  puedeEditarCeldas: boolean = false;
  rangoPermitidoDDJJ: boolean = false;

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
    private ministerioService: HospitalService,
    private efectorService: EfectorService,
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
    // Obtener el ID efector del servicio
    this.efectorId = this.efectorService.getCurrentEfectorId();
      if (this.efectorId) {
        this.loadEfectorName();
          moment.locale('es');
          this.dataSource = new MatTableDataSource<RegistroMensualConDdjj>([]);
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

  convertirMesANombre(numeroMes: number): string {
    const meses = [
      'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
      'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    return meses[numeroMes];
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

  this.tablaListaParaMostrar = false;

  this.cronogramaDefinitivoService.listByAnioMesEfector(anio, mes, idEfector)
    .subscribe({
      next: (cronogramas: CronogramaDefinitivoListDto[]) => {
        // 🔹 Obtenemos todas las DDJJ de todos los cronogramas
        const ddjjs: DdjjListDto[] = cronogramas.flatMap(c => c.ddjjs || []);

        // 🔹 Seleccionamos la primera DDJJ
        this.ddjjSeleccionada = ddjjs.length > 0 ? ddjjs[0] : undefined;

        // 🔹 Generamos registros mensuales incluyendo la referencia a la DDJJ
        this.registrosMensuales = ddjjs.flatMap(ddjj =>
          (ddjj.registrosMensuales || []).map(registro => ({
            ...registro,
            ddjjDto: ddjj
          }))
        );

        // 🔹 Agrupar contrafactura por asistencial
        const contrafacturas = this.registrosMensuales.filter(r => r.ddjjDto?.idTipoGuardia === 4);
        const otros = this.registrosMensuales.filter(r => r.ddjjDto?.idTipoGuardia !== 4);

        const agrupadasContrafacturas: RegistroMensualConDdjj[] = Object.values(
          contrafacturas.reduce((acc, curr) => {
            const key = curr.asistencial.id;
            if (!acc[key]) {
              acc[key] = { ...curr };
              acc[key].registroActividad = [...curr.registroActividad];
            } else {
              acc[key].registroActividad.push(...curr.registroActividad);
              // combinar totales si es necesario
              acc[key].totalHoras.horasLav += curr.totalHoras.horasLav;
              acc[key].totalHoras.horasSdf += curr.totalHoras.horasSdf;
              acc[key].totalHoras.montoLav += curr.totalHoras.montoLav;
              acc[key].totalHoras.montoSdf += curr.totalHoras.montoSdf;
            }
            return acc;
          }, {} as Record<number, RegistroMensualConDdjj>)
        );

        // 🔹 Reunir todos los registros ya agrupados
        this.registrosMensuales = [...otros, ...agrupadasContrafacturas];

        // 🔹 Ordenar por grupo (CARGO + AGRUPACIÓN juntos)
        this.registrosMensuales.sort((a, b) => {
          const grupoA = this.getTipoGuardiaGrupo(a.ddjjDto?.idTipoGuardia);
          const grupoB = this.getTipoGuardiaGrupo(b.ddjjDto?.idTipoGuardia);
          return grupoA - grupoB;
        });

        // ✅ Ya no volver a ordenar por idTipoGuardia aquí

        this.updateTableDataSource();
        this.tablaListaParaMostrar = true;
      },
      error: (err) => {
        console.error("Error cargando cronograma:", err);
        this.registrosMensuales = [];
        this.tablaListaParaMostrar = true;
      }
    });
}



// Métodos para manejar la agrupación por tipo de guardia
shouldShowTipoGuardia(registro: RegistroMensualConDdjj, index: number): boolean {
  if (index === 0) {
    console.log(`[shouldShowTipoGuardia] index 0 → mostrar fila:`, registro);
    return true;
  }

  const prev = this.registrosMensuales[index - 1];

  // 🔹 Unificamos CARGO (1) y AGRUPACIÓN (2) bajo el mismo grupo
  const tipoGuardiaActual = this.getTipoGuardiaGrupo(registro.ddjjDto?.idTipoGuardia);
  const tipoGuardiaPrevio = this.getTipoGuardiaGrupo(prev.ddjjDto?.idTipoGuardia);

  // 🔹 Casos especiales para CONTRAFACTURA (idTipoGuardia = 4)
  if (tipoGuardiaActual === 4) {
    const mostrar = !(registro.asistencial.id === prev.asistencial.id && tipoGuardiaPrevio === 4);
    console.log(`[shouldShowTipoGuardia] index ${index} CONTRAFACTURA → asistencial actual: ${registro.asistencial.id}, previo: ${prev.asistencial.id}, mostrar:`, mostrar);
    return mostrar;
  }

  // 🔹 Para los demás casos (cargo/agrupación unificados o extras)
  const mostrar = tipoGuardiaActual !== tipoGuardiaPrevio;
  console.log(`[shouldShowTipoGuardia] index ${index} tipoGrupo: ${tipoGuardiaActual}, prev tipoGrupo: ${tipoGuardiaPrevio}, mostrar:`, mostrar);
  return mostrar;
}

// 🔹 Helper para agrupar cargo y agrupación en el mismo grupo visual
private getTipoGuardiaGrupo(idTipoGuardia: number | undefined): number {
  if (idTipoGuardia === 1 || idTipoGuardia === 2) return 1; // Grupo “CARGO Y AGRUPACIÓN”
  return idTipoGuardia || 0;
}

getRowspanForTipoGuardia(registro: RegistroMensualConDdjj, index: number): number {
  if (!this.shouldShowTipoGuardia(registro, index)) {
    console.log(`[getRowspanForTipoGuardia] index ${index} → no mostrar, rowspan = 1`);
    return 1;
  }

  const tipoGuardia = registro.ddjjDto?.idTipoGuardia;
  const idAsistencial = registro.asistencial.id;
  let count = 1;

  for (let i = index + 1; i < this.registrosMensuales.length; i++) {
    const next = this.registrosMensuales[i];

    if (tipoGuardia === 4) {
      if (next.ddjjDto?.idTipoGuardia === 4 && next.asistencial.id === idAsistencial) {
        count++;
      } else {
        break;
      }
    } else {
      if (next.ddjjDto?.idTipoGuardia === tipoGuardia) {
        count++;
      } else {
        break;
      }
    }
  }

  console.log(`[getRowspanForTipoGuardia] index ${index}, tipoGuardia: ${tipoGuardia}, asistencial: ${idAsistencial}, rowspan: ${count}`);
  return count;
}

getNombreTipoGuardia(idTipoGuardia: number | undefined): string {
  const tipo = this.getTipoGuardiaGrupo(idTipoGuardia);

  switch (tipo) {
    case 1: return 'CARGO Y AGRUPACIÓN';
    case 3: return 'EXTRA';
    case 4: return 'CONTRAFACTURA';
    default: return 'OTRO';
  }
}
getColorTipoGuardia(idTipoGuardia: number | undefined): string {
  switch (idTipoGuardia) {
    case 1: return '#a883ebff';  // CARGO (violeta)
    case 2: return '#ffb347ff';  // AGRUPACIÓN (naranja)
    case 3: return '#bd6381ff';  // EXTRA
    case 4: return '#b0c0a6ff';  // CONTRAFACTURA
    default: return '#f5f5f5';   // Por defecto
  }
}

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
    this.ddjjSeleccionada = undefined;
    this.puedeEditarCeldas = false;

    this.generarDiasDelMes();
    this.loadRegistrosMensuales();
  }

  getMonthName(mes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

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

  isDetalleClass(date: Date): string {

    if (this.isHoliday(date).isHoliday) {
      return 'holiday';
    }

    if (this.isWeekend(date)) {
      return 'weekend';
    }

    return '';
  }

  calculateTooltip(date: Date, registro: any): string {
    const holiday = this.isHoliday(date);
    if (holiday.isHoliday) {
      return holiday.motivo;
    }
    return '';
  }
  
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
        return '#6126cfff'; // CARGO
      } else if (tipoGuardia.id === 2) {
        return '#FF7F0E'; // REAGRUPACION DE HS
      } else if (tipoGuardia.id === 3) {
        return '#D91E5B'; // EXTRA
      } else if (tipoGuardia.id === 4) {
        return '#A9D08F'; // CONTRAFACTURA
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
        return '#6126cfff'; // CARGO
      } else if (tipoGuardia.id === 2) {
        return '#FF7F0E'; // REAGRUPACION DE HS
      } else if (tipoGuardia.id === 3) {
        return '#D91E5B'; // EXTRA
      } else if (tipoGuardia.id === 4) {
        return '#A9D08F'; // CONTRAFACTURA
      }
    }
    return ''; // Color por defecto
  }

calculateHoursForExcel(registroActividades: RegistroActividad[], date: Date): number | string {
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
        return redondeado; // devuelve como número
      } else {
        return 0;
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

formatDate(startDate: Date, endDate: Date): string {
  const formattedStartDate = moment(startDate).format('DD/MM/YYYY');
  const formattedEndDate = moment(endDate).format('DD/MM/YYYY');

  if (formattedStartDate === formattedEndDate) {
    return formattedStartDate;
  } else {
    return `${formattedStartDate} - ${formattedEndDate}`;
  }
}

/*async exportarAExcel() {
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

  const dataColumnHeaders = ['Tipo', 'Apellido', 'Nombre', 'Cuil', 'Vinculos_Laborales', 'Categoria', 
                           'Total mes', 'Total L-V', 'Total S-D-F'];
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

  const totalMesIndex = combinedHeaders.indexOf('Total mes') + 1;
  const totalLvIndex = combinedHeaders.indexOf('Total L-V') + 1;
  const totalSdfIndex = combinedHeaders.indexOf('Total S-D-F') + 1;

  for (const registro of this.dataSource.data) {
    const exportData: any = {
      Tipo: this.getNombreTipoGuardia(registro.ddjj?.tipoGuardia),
      Apellido: registro.asistencial.apellido,
      Nombre: registro.asistencial.nombre,
      Cuil: registro.asistencial.cuil,
      Vinculos_Laborales: this.getLegajoActualId(registro.asistencial)?.revista?.tipoRevista?.nombre || '-',
      Categoria: this.getLegajoActualId(registro.asistencial)?.revista?.categoria?.nombre + 
                (this.getLegajoActualId(registro.asistencial)?.revista?.adicional?.nombre ? 
                 `(${this.getLegajoActualId(registro.asistencial)?.revista?.adicional?.nombre})` : '') || '',
      'Total mes': (registro.totalHoras?.horasLav ?? 0) + (registro.totalHoras?.horasSdf ?? 0),
      'Total L-V': registro.totalHoras?.horasLav ?? 0,
      'Total S-D-F': registro.totalHoras?.horasSdf ?? 0,
    };

    // Horas por día
    this.displayedColumns.slice(6).forEach((fechaColumna: string, index: number) => {
      exportData[combinedHeaders[dataColumnHeaders.length + index]] = 
        this.calculateHoursForExcel(registro.registroActividad, this.getFechaFromColumnId(fechaColumna));
    });

    const row = worksheet.addRow(Object.values(exportData));
    
    // Colorear celda de tipo de guardia según el tipo
    const tipoGuardiaId = registro.ddjj?.tipoGuardia?.id;
    if (tipoGuardiaId) {
      row.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: this.getColorTipoGuardia(tipoGuardiaId).replace('#', '') }
      };
    }

    // Colorear totales (verde claro)
    [totalMesIndex, totalLvIndex, totalSdfIndex].forEach(colIndex => {
      row.getCell(colIndex).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE2EFDA' }
      };
    });

    // Colorear feriados (rojo) y fines de semana (gris)
    this.displayedColumns.slice(6).forEach((fechaColumna: string, index: number) => {
      const date = this.getFechaFromColumnId(fechaColumna);
      const isHoliday = this.isHoliday(date).isHoliday;
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const cellIndex = dataColumnHeaders.length + index + 1;

      if (isHoliday) {
        row.getCell(cellIndex).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD4C2CD' }
        };
      } else if (isWeekend) {
        row.getCell(cellIndex).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF0F0F0' }
        };
      }
    });
  }

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

  const fileName = `CronogramaDefinitivo-Cargo-y-Agrupacion_${mesSeleccionado}_${anioSeleccionado}_${efectorNombre}.xlsx`;
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, fileName);
}

async exportarAPDF(textoAdicional: string = '', selloBase64: string = '', firmaBase64: string = '', autoridadDto?: AutoridadImagenDto, nombreArchivo: string = 'exportacion.pdf') {
  const mesSeleccionado = this.getMonthName(this.selectedMonth);
  const anioSeleccionado = this.selectedYear;
  const efectorNombre = this.efectorNombre;

  const headers = [
    'Tipo', 'Apellido', 'Nombre', 'Cuil', 'Vinculos Laborales', 'Categoria', 
    'Total mes', 'Total L-V', 'Total S-D-F',
    ...this.displayedColumns.slice(6).map(columnTitle => 
      moment(columnTitle, 'YYYY_MM_DD').format('ddd DD'))
  ];

  const body: any[] = [headers];

  // Datos
  for (const registro of this.dataSource.data) {
    const row = [];
    
    // Tipo de guardia con color
    const tipoGuardiaId = registro.ddjj?.tipoGuardia?.id;
    row.push({
      text: this.getNombreTipoGuardia(registro.ddjj?.tipoGuardia),
      fillColor: tipoGuardiaId ? this.getColorTipoGuardia(tipoGuardiaId) : '#f5f5f5',
      alignment: 'center'
    });

    row.push(registro.asistencial.apellido);
    row.push(registro.asistencial.nombre);
    row.push(registro.asistencial.cuil);
    row.push(this.getLegajoActualId(registro.asistencial)?.revista?.tipoRevista?.nombre || '-');
    const legajo = this.getLegajoActualId(registro.asistencial);
    const categoria = legajo?.revista?.categoria?.nombre || '';
    const adicional = legajo?.revista?.adicional?.nombre ? ` (${legajo.revista.adicional.nombre})` : '';
    row.push(categoria + adicional);
    row.push({
      text: (registro.totalHoras?.horasLav ?? 0) + (registro.totalHoras?.horasSdf ?? 0),
      fillColor: '#E2EFDA',
      alignment: 'center'
    });
    row.push({
      text: (registro.totalHoras?.horasLav ?? 0),
      fillColor: '#E2EFDA',
      alignment: 'center'
    });
    row.push({
      text: (registro.totalHoras?.horasSdf ?? 0),
      fillColor: '#E2EFDA',
      alignment: 'center'
    });

    // Horas por día (feriados y fines de semana)
    this.displayedColumns.slice(6).forEach(fechaColumna => {
      const fecha = this.getFechaFromColumnId(fechaColumna);
      const horas = this.calculateHoursForExcel(registro.registroActividad, fecha);
      const { isHoliday } = this.isHoliday(fecha);
      const isWeekend = fecha.getDay() === 0 || fecha.getDay() === 6;

      if (isHoliday) {
        row.push({
          text: horas,
          fillColor: '#F9CACA',
          bold: true,
          alignment: 'center'
        });
      } else if (isWeekend) {
        row.push({
          text: horas,
          fillColor: '#F0F0F0',
          alignment: 'center'
        });
      } else {
        row.push(horas);
      }
    });

    body.push(row);
  }

  const content: any[] = [
    { 
      text: `Cronograma Definitivo - Cargo y Agrupación - ${mesSeleccionado} ${anioSeleccionado} - ${efectorNombre}`, 
      style: 'header' 
    },
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

  // Pie de página (sello, firma, texto)
  if (textoAdicional || selloBase64 || firmaBase64 || autoridadDto) {
    content.push({
      alignment: 'center',
      margin: [0, 20, 0, 0],
      stack: [
        { text: textoAdicional, fontSize: 8 },
        {
          columns: [
            {
              width: '50%',
              stack: [
                firmaBase64 ? { image: firmaBase64, width: 120, alignment: 'right' } : {},
                autoridadDto?.personaName ? 
                  { text: autoridadDto.personaName, alignment: 'right', bold: true } : {},
                autoridadDto?.cargo ? 
                  { text: autoridadDto.cargo, alignment: 'right', fontSize: 8 } : {}
              ]
            },
            {
              width: '50%',
              stack: [
                selloBase64 ? { image: selloBase64, width: 120, alignment: 'left' } : {}
              ]
            }
          ],
          columnGap: 20,
          margin: [0, 40, 0, 0]
        }
      ]
    });
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

  pdfMake.createPdf(docDefinition).download(
    `CronogramaDefinitivo-Cargo-y-Agrupacion_${mesSeleccionado}_${anioSeleccionado}_${efectorNombre}.pdf`
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
  const textoAdicional = 'APROBACIÓN DEL CRONOGRAMA DEFINITIVO POR PARTE DEL DIRECTOR DEL HOSPITAL.-';
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
    const autoridadDto = await this.ddjjService.getAutoridadImageUrl(ddjj.director!.id!).toPromise();

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
}*/

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
    this.dataSource.filterPredicate = (data: RegistroMensualConDdjj, filter: string) => {
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