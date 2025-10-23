import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import 'moment/locale/es';

//Componentes
import { RmensualContrafacturaDetailComponent } from '../rmensual-contrafactura-detail/rmensual-contrafactura-detail.component';
import { FacturaCreateComponent } from '../factura/factura-create/factura-create.component';
import { FacturaCreateFterminoComponent } from '../factura/factura-create-ftermino/factura-create-ftermino.component';
import { FacturaListComponent } from '../factura/factura-list/factura-list.component';
import { DialogConfirmRmensualComponent } from '../dialog-confirm-rmensual/dialog-confirm-rmensual.component';


//Servicios
import { RegistroMensualService } from 'src/app/services/registroMensual.service';
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { DdjjService } from 'src/app/services/ddjj.service';
import { FacturaService } from 'src/app//services/factura.service';

//Models y dto
import { Feriado } from 'src/app/models/Configuracion/Feriado';

import { RegActivListDto } from 'src/app/dto/guardias/RegActivListDto';
import { RegistroMensualListDto } from 'src/app/dto/RegistroMensualListDto';
import { ServicioSummaryDto } from 'src/app/dto/Configuracion/ServicioSummaryDto';
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

@Component({
  selector: 'app-rmensual-contrafactura-fuera-termino',
  templateUrl: './rmensual-contrafactura-fuera-termino.component.html',
  styleUrls: ['./rmensual-contrafactura-fuera-termino.component.css']
})

export class RmensualContrafacturaFueraTerminoComponent implements OnInit, OnDestroy {

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

  dialogRef!: MatDialogRef<RmensualContrafacturaDetailComponent>;
  dialogRefFactura!: MatDialogRef<FacturaCreateComponent>;
  dialogRefFacturaFtermino!: MatDialogRef<FacturaCreateFterminoComponent>;


  selectedServicio?: number | null = null;
  selectedQuincena!: string;
  selectedMonth!: number;
  selectedYear!: number;
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

  facturaExisteMap: { [registroId: number]: boolean } = {};

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
    private facturaService: FacturaService,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute
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
    const fecha = this.registroMensualService.getFecha(); // obtiene último valor
    if (fecha) {
      this.selectedMonth = fecha.mes;
      this.selectedYear = fecha.anio;

      this.inicializarDatos();
    } else {
      // No hay datos: volver al componente anterior
      console.warn('No hay state guardado, se vuelve al listado anterior');
      this.toastr.warning('No se seleccionó un mes/año válido', 'Atención', {
        timeOut: 4000,
        positionClass: 'toast-top-center'
      });
      this.router.navigateByUrl('/rmensual-contrafactura');
    }
  }

  private inicializarDatos(): void {
    this.efectorId = this.efectorService.getCurrentEfectorId();

    if (!this.efectorId) {
      this.toastr.warning('No seleccionaste un efector', 'Advertencia', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      this.router.navigateByUrl('/home-page');
      return;
    }

    // Inicializar datos dependientes de efector
    this.loadEfectorName();
    moment.locale('es');
    this.dataSource = new MatTableDataSource<RegistroMensualListDto>([]);

    // Ahora que tenemos efectorId, podemos cargar registros y hospital
    this.generarDiasDelMes();
    this.loadRegistrosMensuales();
    this.verificarExistenciaDdjj();
    this.loadHospitalDetails();

    this.selectedMonthYear = `${this.selectedMonth}-${this.selectedYear}`;

    this.feriadoService.list().subscribe((feriados: Feriado[]) => {
      this.feriados = feriados;
    });

    // Roles
    this.tokenService.currentRole$.subscribe(role => {
      this.currentRole = role;
      this.UserRoles();
      if (!this.currentRole) {
        console.warn('No hay un rol seleccionado actualmente.');
      }
    });

    this.selectedServicio = null;

    this.suscription = this.facturaService.refresh$.subscribe(() => {
      this.loadRegistrosMensuales();
    });
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
    const idServicio = this.selectedServicio!;

    this.tablaListaParaMostrar = false;

    if (!idEfector) {
      console.error("El ID del hospital no puede ser null");
      return;
    }

    const request$ = this.selectedServicio
      ? this.registroMensualService.listFueraDeTerminoPorServicio(idEfector, mes, anio, idServicio)
      : this.registroMensualService.listFueraDeTermino( idEfector, mes, anio);

    request$.subscribe(data => {
      this.registrosMensuales = data;
      this.preprocesarActividades();
      this.updateTableDataSource();

      this.registrosMensuales.forEach(registro => {
        this.checkFacturaExistente(registro);
      });

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
    if (tipoGuardiaId === 4) {
      return '#769264'; // CF
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
  
  calculateTooltip(date: Date): string {

    const holiday = this.isHoliday(date);
    if (holiday.isHoliday) return holiday.motivo;

    return '';
  }

  getCellInfo(date: Date): { clase: string, tooltip: string } {
    
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

  checkFacturaExistente(registro: RegistroMensualListDto): void {
    const mes = moment().month(this.selectedMonth - 1).format('MMMM').toUpperCase();
    const anio = this.selectedYear;

    this.facturaService.existeFacturaSinQuincena(
      registro.asistencial.id,
      this.efectorId!,
      anio,
      mes
    ).subscribe({
      next: (existe) => {
        this.facturaExisteMap[registro.id] = existe;
      },
      error: (err) => {
        console.error('Error al verificar existencia de factura', err);
        this.facturaExisteMap[registro.id] = false;
      }
    });
  }

  //Verificaciones para permitir interacciones

  private estaEnRango(inicio: Date, today: Date = new Date()): boolean {
    return today >= inicio; // solo verificamos desde esa fecha en adelante
  }

  private getRangosValidos(): { inicio: Date, fin?: Date }[] {
    let mes = this.selectedMonth;
    let anio = this.selectedYear;

    // Calcular mes siguiente
    let siguienteMes = mes === 12 ? 1 : mes + 1;
    let siguienteAnio = mes === 12 ? anio + 1 : anio;

    // Inicio válido: día 11 del mes siguiente
    const inicioValido = new Date(siguienteAnio, siguienteMes - 1, 6);

    return [{ inicio: inicioValido }];
  }

  isHabilitadoBotonDdjj(): boolean {
    const today = new Date();
    return this.getRangosValidos().some(r => this.estaEnRango(r.inicio, today));
  }

  getMensajeContadorDdjj(): string | null {
    const today = new Date();
    const rango = this.getRangosValidos()[0];
    
    if (this.estaEnRango(rango.inicio, today)) {
      return 'Plazo abierto'; // porque desde el 11 en adelante siempre es válido
    }

    return null;
  }

  mostrarMensajeRechazoDdjj(): boolean {
    const today = new Date();
    const rango = this.getRangosValidos()[0];

    // Si todavía no llegó el 11 del mes siguiente => mostrar rechazo
    const vencieronTodos = today < rango.inicio;

    return !this.verificandoDdjj && !this.ddjjYaExiste && vencieronTodos;
  }

  verificarExistenciaDdjj(): void {
    this.verificandoDdjj = true;

    const nombreMes = this.convertirMesANombre(this.selectedMonth - 1);
    const anio = this.selectedYear;
    const efectorId = this.efectorId;
    const quincena = 'FUERA_DE_TERMINO';

    if (!efectorId) {
      console.error('El ID del efector no puede ser null');
      this.verificandoDdjj = false;
      return;
    }

    this.ddjjService.existsDdjjCf(anio, nombreMes, efectorId, quincena).subscribe({
      next: (existe: boolean) => {
        this.ddjjYaExiste = existe;
        const today = new Date();
        const rango = this.getRangosValidos()[0]; // solo hay un inicio

        if (existe) {
          this.botonDDJJIcon = 'assignment_turned_in';
        } else if (today >= rango.inicio) {
          this.botonDDJJIcon = 'assignment_return'; // plazo abierto desde el 11 del mes siguiente
        } else if (today < rango.inicio) {
          this.botonDDJJIcon = 'snooze'; // todavía no comenzó el plazo
        }

        this.verificandoDdjj = false;
      },
      error: (err) => {
        console.error('Error verificando existencia de DDJJ:', err);
        this.ddjjYaExiste = false;
        this.botonDDJJIcon = 'assignment_return'; // fallback
        this.verificandoDdjj = false;
      }
    });
  }

  isHabilitadoBotonDdjjFinal(): boolean {
    return this.isHabilitadoBotonDdjj() && !this.ddjjYaExiste;
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

  openFactura(registro: RegistroMensualListDto): void {
    const dataToSend = {
      asistencial: registro.asistencial,
      idRegistrosMensuales: [registro.id],
      idEfector: this.efectorId,
      mes: moment().month(this.selectedMonth - 1).format('MMMM').toUpperCase(),
      anio: this.selectedYear,
      tipo: 'fuera_de_termino',
    };

    console.log('📦 Datos enviados al FacturaCreateComponent:', dataToSend);


    this.dialogRefFacturaFtermino = this.dialog.open(FacturaCreateFterminoComponent, {
      width: '600px',
      data: dataToSend
    });
  }

  onOpenFacturaClick(registro: RegistroMensualListDto): void {
    if (!this.facturaExisteMap[registro.id]) {
      return;
    }
    this.openFacturaList(registro);
  }

  openFacturaList(registro: RegistroMensualListDto): void {
    const mes = moment().month(this.selectedMonth - 1).format('MMMM').toUpperCase();
    const anio = this.selectedYear;
    const quincena = this.selectedQuincena;

    const dataToSend = {
      asistencial: registro.asistencial,
      idEfector: this.efectorId,
      mes,
      anio,
      quincena
    };

    console.log('🔹 Datos enviados a FacturaListComponent:', dataToSend);

    this.dialog.open(FacturaListComponent, {
      width: '800px',
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
      4,              //idTipoGuardia
      undefined,      // idValorGmi
      undefined,      // idDirector
      undefined,      // idDirectorDPH
      undefined,      // estadoDdjjDirectorDPH
      true,            // enPosesionDirector
      undefined,      // enPosesionDirectorDPH
      null,       //motivoDirector
      null,      //motivoDirectorDPH
      undefined, //idObservacionesDdjj
      undefined, //idCronogramasDefinitivos
      this.selectedQuincena  //quincena
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
    const quincena = this.selectedQuincena;

    worksheet.addRow([`${mesSeleccionado} ${anioSeleccionado}`, `${quincena} QUINCENA`, efectorNombre]).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFADD8E6' }
    };
    worksheet.getRow(1).font = { bold: true };

    const dataColumnHeaders = ['Apellido', 'Nombre', 'Cuil', 'Horas mes', 'Horas L-V', 'Horas S-D-F'];
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

      // Colores por celda (feriado, fin de semana)
      this.displayedColumns.slice(6).forEach((fechaColumna, index) => {
        const fecha = this.getFechaFromColumnId(fechaColumna);
        const { clase } = this.getCellInfo(fecha);
        const cellIndex = dataColumnHeaders.length + index + 1;
        const cell = row.getCell(cellIndex);

        if (clase === 'holiday') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F9CACA' } };
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
    worksheet.addRow(['Referencia:']).font = { bold: true };

    const cell = worksheet.addRow(['Feriado']).getCell(1);
    cell.fill = { 
      type: 'pattern', 
      pattern: 'solid', 
      fgColor: { argb: 'F9CACA' }  // Color para feriado
    };

    // Bordes
    worksheet.eachRow((row) => {
      row.eachCell(cell => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });

    const fileName = `rMensual-Contrafactura_${mesSeleccionado}(${quincena})_${anioSeleccionado}_${efectorNombre}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
  }

  async exportarAPDF() {
    const mesSeleccionado = this.getMonthName(this.selectedMonth);
    const anioSeleccionado = this.selectedYear;
    const efectorNombre = this.efectorNombre;
    const quincena = this.selectedQuincena!;

    // Encabezados
    const headers = [
      'Apellido','Nombre','Cuil',
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
        // Totales verdes
        { text: (registro.totalHoras?.horasLav ?? 0) + (registro.totalHoras?.horasSdf ?? 0), fillColor:'#E2EFDA', alignment:'center' },
        { text: registro.totalHoras?.horasLav ?? 0, fillColor:'#E2EFDA', alignment:'center' },
        { text: registro.totalHoras?.horasSdf ?? 0, fillColor:'#E2EFDA', alignment:'center' }
      ];

      // Celdas de días
      this.displayedColumns.slice(6).forEach(col => {
        const fecha = this.getFechaFromColumnId(col);
        const horas = this.calculateHoursForExcel(registro.id, fecha);
        const { clase } = this.getCellInfo(fecha);

        if (clase === 'holiday') row.push({ text: horas, fillColor: '#F9CACA', bold:true, alignment:'center' });
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
          { text:'Feriados', alignment:'center', fillColor:'#F9CACA', bold:true },
          ...Array(headers.length-1).fill({ text:'' })
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
        { text: `Registro Mensual - Contrafactura - ${efectorNombre} - ${quincena} QUINCENA - ${mesSeleccionado} ${anioSeleccionado}`, style:'header' },
        mainTable,
        referenciasTable
      ],
      styles: { header:{ fontSize:14, bold:true, alignment:'center', margin:[0,0,0,10] } },
      defaultStyle: { fontSize:7 }
    };

    pdfMake.createPdf(docDefinition).download(`rMensual-Contrafactura_${mesSeleccionado}(${quincena})_${anioSeleccionado}_${efectorNombre}.pdf`);
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