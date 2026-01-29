import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Subscription } from 'rxjs';
import { ServicioSummaryDto } from 'src/app/dto/Configuracion/ServicioSummaryDto';
import { RegActivAsistenciaDto } from 'src/app/dto/RegistroActividad/RegActivAsistenciaDto';
import { RegActivNombresDto } from 'src/app/dto/RegistroActividad/RegActivNombresDto';
import { RegistroMensualListDto } from 'src/app/dto/RegistroMensualListDto';
import { AsistencialMode } from 'src/app/enums/asistencial-mode';
import { Feriado } from 'src/app/models/Configuracion/Feriado';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { TokenService } from 'src/app/services/login/token.service';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { AsistencialFiltradoSelectorComponent } from '../../personal/personal-contenido/asistencial-selector/asistencial-filtrado-selector/asistencial-filtrado-selector.component';
(pdfMake as any).vfs = (pdfFonts as any).vfs;

@Component({
  selector: 'app-registro-actividades-profesionales-public',
  templateUrl: './registro-actividades-profesionales-public.component.html',
  styleUrls: ['./registro-actividades-profesionales-public.component.css']
})
export class RegistroActividadesProfesionalesPublicComponent {
    efectorId: number | null = null;
    efectorNombre: string | null = null;
    initialData: any;
    inputValue: string = '';
    registroForm: FormGroup;
    currentDate: Date = new Date();

    preferidoEfector?: { id: number; nombre: string };

    displayedColumns: string[] = ['asistencial', 'fechaIngreso', 'horaIngreso', 'servicio', 'tipoGuardia'];
      dataSource = new MatTableDataSource<RegActivNombresDto>();
    
      @ViewChild(MatPaginator) paginator!: MatPaginator;
      @ViewChild(MatSort) sort!: MatSort;

        suscription!: Subscription;
        tablaListaParaMostrar = false;
      
        diasEnMes: moment.Moment[] = [];
        feriados: Feriado[] = [];
        registrosMensuales: RegistroMensualListDto[] = [];
        servicios: ServicioSummaryDto[] = []; 
        actividades: RegActivAsistenciaDto[] = [];
        tablaDias: {
          fecha: string,
          entradas: { hora: string, tipoGuardia: string }[],
          salidas: { hora: string, tipoGuardia: string }[]
        }[] = [];
        tablaFilas: {
          fecha: string,
          entrada: string | null,
          salida: string | null,
          tipoGuardia: string,
          servicio?: string,
          // NUEVO: datos para agrupar entre días
          groupKey?: string,
          isGroupStart?: boolean,
          isGroupEnd?: boolean
        }[] = [];

      get uniqueFechas(): string[] {
        // Devuelve las fechas únicas ordenadas
        return Array.from(new Set(this.tablaFilas.map(f => f.fecha))).sort();
      }

      //Autenticación
      isAdministrativo: boolean = false;
      isUsuario: boolean = false;
      isDph: boolean = false;
      isSuper: boolean = false;
      isAutoridad: boolean = false;
      userId: number | null = null;
      currentRole: string | null = null;
      showDetails: boolean = false;
      showTable = false;

      selectedServicio?: number | null = null; 
        selectedMonth: number = moment().month() + 1;
        selectedYear: number = moment().year();
        years: number[] = [];
        mesesDisponibles: { value: number, label: string }[] = [];
        selectedMonthYear: string = '';
        // mesesDisponibles: { value: string, label: string }[] = [];
      

    asistencialCuil: string | null = null;
    asistencialLocked: boolean = false; // nuevo flag para bloquear selector

    // NUEVO: selector de efector por asistencial
    efectoresDisponibles: { id: number; nombre: string }[] = [];
    mostrarSelectorEfector = false;
    selectedEfectorId: number | null = null;

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
            private paginatorIntl: MatPaginatorIntl,
            private hospitalService: HospitalService,
            private ministerioService: MinisterioService,
            private efectorService: EfectorService,
            private feriadoService: FeriadoService,
            private tokenService: TokenService,
            private toastr: ToastrService,
            private sanitizer: DomSanitizer,
            private router: Router,
            private route: ActivatedRoute,
            private registroActividadService: RegistroActividadService
  ) {
      this.currentDate = new Date();
  
      this.registroForm = this.fb.group({
        idAsistencial: ['', Validators.required],
        asistencialDisplay: ['', Validators.required],
        idServicio: ['', Validators.required],
        idEfector: [''],
        fechaIngreso: ['', Validators.required],
        eventStartTime: ['', Validators.required],
        eventEndTime: [{ value: '', disabled: true }, Validators.required]
      });
  
      this.route.data.subscribe(data => {
        this.initialData = data['initialData'];
        if (this.initialData) {
          this.registroForm.patchValue(this.initialData);
          // Si initialData incluye nombre/apellido, intentar setear también la display
          if (this.initialData.nombre || this.initialData.apellido) {
            this.registroForm.patchValue({
              asistencialDisplay: `${this.initialData.apellido || ''} ${this.initialData.nombre || ''}`.trim()
            });
            this.inputValue = this.registroForm.get('asistencialDisplay')?.value || '';
          }
        }
      });
    }

ngOnInit(): void {
  this.registroForm = this.fb.group({
    idAsistencial: ['', Validators.required],
    asistencialDisplay: ['', Validators.required]
  });

  this.selectedMonth = moment().month() + 1;
  this.selectedYear = moment().year();

  const currentYear = moment().year();
  const startYear = 2025;
  this.years = Array.from(
    { length: Math.max(1, currentYear - startYear + 1) },
    (_, i) => startYear + i
  );

  moment.locale('es');
  this.dataSource = new MatTableDataSource<RegActivNombresDto>([]);

  this.generarMesesDisponibles();

  this.feriadoService.list().subscribe(f => this.feriados = f);

  this.tokenService.currentRole$.subscribe(role => {
    this.currentRole = role;
    this.UserRoles();
  });

  const navState =
    this.router.getCurrentNavigation()?.extras?.state
    || (window as any).history.state;

  if (navState?.asistencial) {
    const a = navState.asistencial;

    const display = `${a.apellido ?? ''} ${a.nombre ?? ''}`.trim();

    this.registroForm.patchValue({
      idAsistencial: a.id,
      asistencialDisplay: display
    });

    this.inputValue = display;
    this.asistencialCuil = a.cuil;
    this.asistencialLocked = true;

    // acá empieza TODO lo relacionado al efector
    this.cargarEfectoresPorAsistencial(a.id);
  }
}

  UserRoles(): void {
    this.isUsuario = this.currentRole === 'ROLE_USER';
    this.isAdministrativo = this.currentRole === 'ROLE_ADMIN';
    this.isAutoridad = this.currentRole === 'ROLE_AUTORIDAD';
    this.isDph = this.currentRole === 'ROLE_DPH';
    this.isSuper = this.currentRole === 'ROLE_SUPERUSER';
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
  
        },
        (error) => {
          console.error('Error al obtener servicios activos del hospital:', error);
        }
      );
    }

    loadEfectorName(): void {
    if (this.efectorId) {
      this.efectorService.getEfectorNombre(this.efectorId).subscribe({
        next: (efector) => this.efectorNombre = efector.nombre,
        error: (err) => {
          console.error('Error al obtener el efector:', err);
          this.efectorNombre = null;
        }
      });
    }
  }

  loadAsistenciaProfesional(): void {
    const idAsistencial = this.registroForm.get('idAsistencial')?.value;
    if (!idAsistencial || !this.efectorId || !this.selectedMonth || !this.selectedYear) {
      this.actividades = [];
      this.tablaFilas = [];
      return;
    }
    this.registroActividadService.listAsistenciaByProfesionalEfectorMesAnio(
      idAsistencial,
      this.efectorId,
      this.selectedMonth,
      this.selectedYear
    ).subscribe({
      next: (data) => {
        this.actividades = data;
        // CAMBIO: extender el tipo para permitir groupKey/isGroupStart/isGroupEnd
        const filas: {
          fecha: string,
          entrada: string | null,
          salida: string | null,
          tipoGuardia: string,
          servicio?: string,
          groupKey?: string,
          isGroupStart?: boolean,
          isGroupEnd?: boolean
        }[] = [];
        data.forEach((act, idx) => {
          const fechaIng = act.fechaIngreso instanceof Date ? act.fechaIngreso.toISOString().slice(0, 10) : act.fechaIngreso;
          const fechaEgr = act.fechaEgreso instanceof Date ? act.fechaEgreso.toISOString().slice(0, 10) : act.fechaEgreso;
          if (fechaIng === fechaEgr) {
            // Entrada y salida en la misma fecha: una sola fila
            filas.push({
              fecha: fechaIng,
              entrada: act.horaIngreso,
              salida: act.horaEgreso,
              tipoGuardia: act.tipoGuardia,
              servicio: act.servicio
            });
          } else {
            const groupKey = `${fechaIng}|${act.horaIngreso}|${fechaEgr}|${act.horaEgreso}|${act.tipoGuardia}|${act.servicio || ''}`;
            // Entrada (inicio)
            filas.push({
              fecha: fechaIng,
              entrada: act.horaIngreso,
              salida: null,
              tipoGuardia: act.tipoGuardia,
              servicio: act.servicio,
              groupKey,
              isGroupStart: true,
              isGroupEnd: false
            });
            // Salida (fin)
            if (act.fechaEgreso && act.horaEgreso) {
              filas.push({
                fecha: fechaEgr,
                entrada: null,
                salida: act.horaEgreso,
                tipoGuardia: act.tipoGuardia,
                servicio: act.servicio,
                groupKey,
                isGroupStart: false,
                isGroupEnd: true
              });
            }
          }
        });
        // Reemplaza el sort solo por fecha por uno que también ordena por hora dentro del mismo día
        this.tablaFilas = filas.sort((a, b) => {
          const cmpFecha = a.fecha.localeCompare(b.fecha);
          if (cmpFecha !== 0) return cmpFecha;
          const horaA = (a.entrada ?? a.salida ?? '');
          const horaB = (b.entrada ?? b.salida ?? '');
          if (horaA && horaB) return horaA.localeCompare(horaB);
          if (horaA) return -1;
          if (horaB) return 1;
          return 0;
        });
      },
      error: (err) => {
        this.actividades = [];
        this.tablaFilas = [];
        this.toastr.error('No se pudo cargar la asistencia', 'Error');
        console.error(err);
      }
    });
  }

  openAsistencialDialog(): void {
      if (this.asistencialLocked) {
      // Bloqueado: no permitir abrir selector
      return;
    }
    console.log("Datos enviados al diálogo:", {
      idEfector: this.efectorId,
      mode: AsistencialMode.INGRESO
    });
    const dialogRef = this.dialog.open(AsistencialFiltradoSelectorComponent, {
      width: '800px',
      disableClose: true,
      data: {
        idEfector: this.efectorId,
        mode: AsistencialMode.INGRESO,
        useDetail: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const display = `${result.apellido || ''} ${result.nombre || ''}`.trim();
        this.inputValue = display;
        this.registroForm.patchValue({ idAsistencial: result.id, asistencialDisplay: display });
        this.asistencialCuil = result.cuil || this.asistencialCuil || null;
        this.loadAsistenciaProfesional();
      }
    }, error => {
      this.toastr.error('Ocurrió un error al abrir el diálogo de Asistencial', 'Error', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      console.error('Error al abrir el diálogo de carga de profesional:', error);
    });
  }

  private setEfectorSelection(id: number | null): void {
    if (!id) return;
    this.efectorId = id;
    this.selectedEfectorId = id;
    const match = this.efectoresDisponibles.find(e => e.id === id);
    if (match) {
      this.efectorNombre = match.nombre;
    } else {
      this.loadEfectorName();
    }
  }

  cargarEfectoresPorAsistencial(idAsistencial: number): void {
    this.registroActividadService.detailAsistencial(idAsistencial).subscribe({
      next: (resp) => {
        const efectores = resp?.efectores ?? [];
        this.efectoresDisponibles = efectores.map((e: any) => ({ id: e.id, nombre: e.nombre }));
        if (this.efectoresDisponibles.length > 1) {
          this.mostrarSelectorEfector = true;
          const preferido = this.efectoresDisponibles.find(e => e.id === this.efectorId) || this.efectoresDisponibles[0];
          this.setEfectorSelection(preferido?.id ?? null);
        } else {
          this.mostrarSelectorEfector = false;
          if (this.efectoresDisponibles.length === 1) {
            this.setEfectorSelection(this.efectoresDisponibles[0].id);
          }
        }
      },
      error: () => {
        this.mostrarSelectorEfector = false;
        this.efectoresDisponibles = [];
      }
    });
  }

  onEfectorChange(id: number): void {
    if (!id) return;

    this.setEfectorSelection(id);
    this.loadAsistenciaProfesional();
  }

  //Manejo fechas en select
  
    generarMesesDisponibles(): void {
      this.mesesDisponibles = [];
      for (let mes = 1; mes <= 12; mes++) {
        const fecha = moment({ year: this.selectedYear, month: mes - 1 });
        this.mesesDisponibles.push({
          value: mes,
          label: fecha.format('MMMM').toUpperCase()
        });
      }
    
    }

  onYearChange(): void {
  const mesActual = Number(this.selectedMonth);
    this.selectedYear = Number(this.selectedYear);
    this.generarMesesDisponibles();
    if (this.mesesDisponibles.some(m => m.value === mesActual)) {
      this.selectedMonth = mesActual;
    } else {
      this.selectedMonth = 1;
    }
    this.loadAsistenciaProfesional();
  }

onMonthChange(): void {
    this.selectedMonth = Number(this.selectedMonth);
    this.loadAsistenciaProfesional();
  }

getFilasPorFecha(fecha: string) {
    return this.tablaFilas.filter(f => f.fecha === fecha);
}

toggleAllDetails(): void {
    this.showDetails = !this.showDetails; // Alterna la visibilidad de los detalles
  }
  
  get diasDelMes(): string[] {
    const dias: string[] = [];
    const fecha = moment({ year: this.selectedYear, month: this.selectedMonth - 1 });
    const diasEnMes = fecha.daysInMonth();
    for (let d = 1; d <= diasEnMes; d++) {
      dias.push(moment({ year: this.selectedYear, month: this.selectedMonth - 1, day: d }).format('DD/MM/YYYY'));
    }
    return dias;
  }

  public formatCuil(cuil: string | null): string {
    if (!cuil) return '';
    // Elimina cualquier caracter no numérico
    const cuilNum = cuil.replace(/[^0-9]/g, '');
    if (cuilNum.length === 11) {
      return `${cuilNum.substring(0,2)}-${cuilNum.substring(2,10)}-${cuilNum.substring(10)}`;
    }
    return cuil; // Si no tiene 11 dígitos, retorna el original
  }

  // Agrega esta función al principio de la clase
  getColorGuardia(tipoGuardia: string): string {
    switch ((tipoGuardia || '').toLowerCase()) {
      case 'cargo': return '#6126cfff';
      case 'extra': return '#D91E5B';
      case 'agrupacion': return '#FF7F0E';
      case 'contrafactura': return '#769264';
      default: return '';
    }
  }

  // Agrupa filas para Excel: combina celdas de tipo de guardia si son iguales en filas consecutivas
  private agruparFilasExcel(filas: any[]) {
    if (filas.length <= 1) return filas.map(f => ({ ...f, tipoGuardiaRowSpan: 1 }));
    const agrupadas: any[] = [];
    let i = 0;
    while (i < filas.length) {
      const tipoActual = filas[i].tipoGuardia;
      let span = 1;
      let j = i + 1;
      // Agrupa todas las filas consecutivas con el mismo tipo de guardia
      while (
        j < filas.length &&
        filas[j].tipoGuardia === tipoActual
      ) {
        span++;
        j++;
      }
      agrupadas.push({
        ...filas[i],
        tipoGuardiaRowSpan: span
      });
      for (let k = i + 1; k < j; k++) {
        agrupadas.push({
          ...filas[k],
          tipoGuardia: '',
          tipoGuardiaRowSpan: 0
        });
      }
      i = j;
    }
    return agrupadas;
  }

  // Reemplaza la función agruparFilasPorRangoGuardia por esta versión mejorada:
  private agruparFilasPorRangoGuardia(filas: any[]) {
    // Agrupa filas consecutivas que forman parte de la misma guardia (entrada/salida cruzando fechas)
    const agrupadas: any[] = [];
    let i = 0;
    while (i < filas.length) {
      const actual = filas[i];
      // Si la fila tiene entrada y salida, es una guardia completa en un solo día
      if (actual.entrada && actual.salida) {
        agrupadas.push({ ...actual, tipoGuardiaRowSpan: 1, mostrarTipoGuardia: true });
        i++;
        continue;
      }
      // Si la fila tiene solo entrada, buscar la salida en la siguiente fila con mismo tipo de guardia y servicio
      if (actual.entrada && !actual.salida) {
        agrupadas.push({ ...actual, tipoGuardiaRowSpan: 1, mostrarTipoGuardia: true });
        i++;
        continue;
      }
      // Fin (solo salida): NO mostrar el tipo (para evitar duplicado)
      if (!actual.entrada && actual.salida) {
        agrupadas.push({ ...actual, tipoGuardiaRowSpan: 1, mostrarTipoGuardia: !actual.isGroupEnd });
        i++;
        continue;
      }
      agrupadas.push({ ...actual, tipoGuardiaRowSpan: 1, mostrarTipoGuardia: true });
      i++;
    }
    return agrupadas;
  }

  async exportarAExcel() {
    const workbook = new ExcelJS.Workbook();
    const nombreHoja = moment({ month: this.selectedMonth - 1 }).format('MMMM').toUpperCase();
    const worksheet = workbook.addWorksheet(nombreHoja);

    // Declarar el Map persistente (fuera del bucle de días)
    const pendingMerge = new Map<string, { col: 'D' | 'H', startRow: number }>();

    // Encabezado principal: NOMBRE, APELLIDO, CUIL, HOSPITAL, SERVICIO, MES, AÑO
    const encabezadoPrincipal = worksheet.addRow(['NOMBRE', 'APELLIDO', 'CUIL', 'HOSPITAL', 'SERVICIO', 'MES', 'AÑO']);
    encabezadoPrincipal.font = { size: 14, bold: true };
    worksheet.addRow([
      this.inputValue.split(' ')[0] || '',
      this.inputValue.split(' ')[1] || '',
      this.formatCuil(this.asistencialCuil),
      this.efectorNombre || '',
      this.tablaFilas[0]?.servicio || '',
      nombreHoja,
      this.selectedYear
    ]);
    worksheet.addRow([]);

    // Encabezado duplicado SIN columna de servicio
    const encabezadoDuplicado = worksheet.addRow(['DIA', 'ENTRADA', 'SALIDA', 'TIPO DE GUARDIA', 'DIA', 'ENTRADA', 'SALIDA', 'TIPO DE GUARDIA']);
    encabezadoDuplicado.font = { size: 14, bold: true };

    // Dividir días en dos bloques
    const fecha = moment({ year: this.selectedYear, month: this.selectedMonth - 1 });
    const diasEnMes = fecha.daysInMonth();
    const diasBloque1 = [];
    const diasBloque2 = [];
    for (let d = 1; d <= diasEnMes; d++) {
      const diaStr = moment({ year: this.selectedYear, month: this.selectedMonth - 1, day: d }).format('DD/MM/YYYY');
      if (d <= 15) diasBloque1.push(diaStr);
      else diasBloque2.push(diaStr);
    }

    // Máximo de filas por bloque
    const maxFilas = Math.max(diasBloque1.length, diasBloque2.length);
    for (let i = 0; i < maxFilas; i++) {
      let filasDia1: any[] = [];
      if (diasBloque1[i]) {
        // CAMBIO: usar la nueva función de agrupación
        filasDia1 = this.agruparFilasPorRangoGuardia(this.getFilasPorFecha(moment(diasBloque1[i], 'DD/MM/YYYY').format('YYYY-MM-DD')));
      }
      let filasDia2: any[] = [];
      if (diasBloque2[i]) {
        filasDia2 = this.agruparFilasPorRangoGuardia(this.getFilasPorFecha(moment(diasBloque2[i], 'DD/MM/YYYY').format('YYYY-MM-DD')));
      }

      // CAMBIO: saber si el día pertenece a un rango (inicio o fin) ANTES de hacer merges dentro del día
      const inGroup1 = filasDia1.some(f => f?.isGroupStart || f?.isGroupEnd);
      const inGroup2 = filasDia2.some(f => f?.isGroupStart || f?.isGroupEnd);

      for (let j = 0; j < 3; j++) {
        let fila1 = ['', '', '', ''];
        let fila2 = ['', '', '', ''];
        let tipoGuardiaRowSpan1 = filasDia1[j]?.tipoGuardiaRowSpan || 1;
        let tipoGuardiaRowSpan2 = filasDia2[j]?.tipoGuardiaRowSpan || 1;
        // Solo mostrar tipo de guardia si mostrarTipoGuardia es true
        if (filasDia1[j]) {
          fila1 = [
            j === 0 ? diasBloque1[i] : '',
            filasDia1[j].entrada || '',
            filasDia1[j].salida || '',
            filasDia1[j].mostrarTipoGuardia ? filasDia1[j].tipoGuardia : ''
          ];
        } else if (j === 0 && diasBloque1[i]) {
          fila1 = [diasBloque1[i], '', '', ''];
        }
        if (filasDia2[j]) {
          fila2 = [
            j === 0 ? diasBloque2[i] : '',
            filasDia2[j].entrada || '',
            filasDia2[j].salida || '',
            filasDia2[j].mostrarTipoGuardia ? filasDia2[j].tipoGuardia : ''
          ];
        } else if (j === 0 && diasBloque2[i]) {
          fila2 = [diasBloque2[i], '', '', ''];
        }
        const row = worksheet.addRow([...fila1, ...fila2]);

        // Colores según tipo de guardia y hora válida
        const horaRegex = /^\d{2}:\d{2}(:\d{2})?$/;

        // NUEVO: tomar el tipo de guardia de la fila fuente (aunque el texto esté oculto)
        const tipoGuardiaVal1 = filasDia1[j]?.tipoGuardia || '';
        const tipoGuardiaVal2 = filasDia2[j]?.tipoGuardia || '';
        const colorHex1 = this.getColorGuardia(tipoGuardiaVal1);
        const colorHex2 = this.getColorGuardia(tipoGuardiaVal2);
        const argb1 = colorHex1 ? ('FF' + colorHex1.replace('#', '')) : null;
        const argb2 = colorHex2 ? ('FF' + colorHex2.replace('#', '')) : null;

        // Bloque 1 (B: entrada, C: salida)
        if (fila1[1] && horaRegex.test(fila1[1]) && argb1) {
          row.getCell(2).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: argb1 }
          };
        }
        if (fila1[2] && horaRegex.test(fila1[2]) && argb1) {
          row.getCell(3).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: argb1 }
          };
        }

        // Bloque 2 (F: entrada, G: salida)
        if (fila2[1] && horaRegex.test(fila2[1]) && argb2) {
          row.getCell(6).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: argb2 }
          };
        }
        if (fila2[2] && horaRegex.test(fila2[2]) && argb2) {
          row.getCell(7).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: argb2 }
          };
        }

        // Mantener merges verticales de tipo dentro del día solo si NO pertenece a rango entre días
        if (filasDia1[j]?.tipoGuardiaRowSpan > 1 && filasDia1[j].mostrarTipoGuardia && fila1[3] && !inGroup1) {
          worksheet.mergeCells(`D${row.number}:D${row.number + filasDia1[j].tipoGuardiaRowSpan - 1}`);
          worksheet.getCell(`D${row.number}`).alignment = { vertical: 'middle', horizontal: 'center' };
        }
        if (filasDia2[j]?.tipoGuardiaRowSpan > 1 && filasDia2[j].mostrarTipoGuardia && fila2[3] && !inGroup2) {
          worksheet.mergeCells(`H${row.number}:H${row.number + filasDia2[j].tipoGuardiaRowSpan - 1}`);
          worksheet.getCell(`H${row.number}`).alignment = { vertical: 'middle', horizontal: 'center' };
        }
      }

      // Primer renglón de las 3 filas que se acaban de añadir para este día
      const baseRow = worksheet.lastRow ? worksheet.lastRow.number - 2 : 1;

      // Merges por día (D/H) condicionados por inGroup para NO duplicar tipo en rangos entre días
      worksheet.mergeCells(`A${baseRow}:A${baseRow+2}`);
      worksheet.getCell(`A${baseRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.mergeCells(`E${baseRow}:E${baseRow+2}`);
      worksheet.getCell(`E${baseRow}`).alignment = { vertical: 'middle', horizontal: 'center' };

      if (filasDia1.length === 1) {
        worksheet.mergeCells(`B${baseRow}:B${baseRow+2}`);
        worksheet.mergeCells(`C${baseRow}:C${baseRow+2}`);
        if (!inGroup1) worksheet.mergeCells(`D${baseRow}:D${baseRow+2}`);
        worksheet.getCell(`B${baseRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`C${baseRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
        if (!inGroup1) worksheet.getCell(`D${baseRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
      }
      if (filasDia2.length === 1) {
        worksheet.mergeCells(`F${baseRow}:F${baseRow+2}`);
        worksheet.mergeCells(`G${baseRow}:G${baseRow+2}`);
        if (!inGroup2) worksheet.mergeCells(`H${baseRow}:H${baseRow+2}`);
        worksheet.getCell(`F${baseRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`G${baseRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
        if (!inGroup2) worksheet.getCell(`H${baseRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
      }
      if (filasDia1.length === 2) {
        worksheet.mergeCells(`B${baseRow+1}:B${baseRow+2}`);
        worksheet.mergeCells(`C${baseRow+1}:C${baseRow+2}`);
        if (!inGroup1) worksheet.mergeCells(`D${baseRow+1}:D${baseRow+2}`);
        worksheet.getCell(`B${baseRow+1}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`C${baseRow+1}`).alignment = { vertical: 'middle', horizontal: 'center' };
        if (!inGroup1) worksheet.getCell(`D${baseRow+1}`).alignment = { vertical: 'middle', horizontal: 'center' };
      }
      if (filasDia2.length === 2) {
        worksheet.mergeCells(`F${baseRow+1}:F${baseRow+2}`);
        worksheet.mergeCells(`G${baseRow+1}:G${baseRow+2}`);
        if (!inGroup2) worksheet.mergeCells(`H${baseRow+1}:H${baseRow+2}`);
        worksheet.getCell(`F${baseRow+1}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`G${baseRow+1}`).alignment = { vertical: 'middle', horizontal: 'center' };
        if (!inGroup2) worksheet.getCell(`H${baseRow+1}`).alignment = { vertical: 'middle', horizontal: 'center' };
      }
      if (filasDia1.length === 0) {
        worksheet.mergeCells(`B${baseRow}:B${baseRow+2}`);
        worksheet.mergeCells(`C${baseRow}:C${baseRow+2}`);
        if (!inGroup1) worksheet.mergeCells(`D${baseRow}:D${baseRow+2}`);
        worksheet.getCell(`B${baseRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`C${baseRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
        if (!inGroup1) worksheet.getCell(`D${baseRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
      }
      if (filasDia2.length === 0) {
        worksheet.mergeCells(`F${baseRow}:F${baseRow+2}`);
        worksheet.mergeCells(`G${baseRow}:G${baseRow+2}`);
        if (!inGroup2) worksheet.mergeCells(`H${baseRow}:H${baseRow+2}`);
        worksheet.getCell(`F${baseRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getCell(`G${baseRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
        if (!inGroup2) worksheet.getCell(`H${baseRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
      }

      // CAMBIO: registrar inicios y cerrar merges al encontrar fin (mismo bloque)
      // BLOQUE 1 => columna D
      if (diasBloque1[i]) {
        // Índices exactos dentro del día (0..2) donde inicia/termina el rango
        const startIdx1 = filasDia1.findIndex(f => f?.isGroupStart);
        const endIdx1   = filasDia1.findIndex(f => f?.isGroupEnd);
        const startKey1 = startIdx1 >= 0 ? filasDia1[startIdx1].groupKey : undefined;
        const endKey1   = endIdx1   >= 0 ? filasDia1[endIdx1].groupKey   : undefined;

        // Guardar inicio del merge en la fila exacta del día
        if (startKey1) {
          const startRow = baseRow + startIdx1; // 0->fila 1 del día, 1->fila 2, 2->fila 3
          pendingMerge.set(startKey1, { col: 'D', startRow });
        }

        // Cerrar merge cuando aparece el fin en este día
        if (endKey1 && pendingMerge.has(endKey1)) {
          const info = pendingMerge.get(endKey1)!;
          // NUEVO: si el día de fin solo tiene salida, extender hasta la 3ra fila del día
          const isOnlySalida1 = filasDia1.length === 1 && !filasDia1[0]?.entrada && !!filasDia1[0]?.salida;
          const endRow = isOnlySalida1 ? (baseRow + 2) : (baseRow + endIdx1);
          if (info.col === 'D') {
            worksheet.mergeCells(`D${info.startRow}:D${endRow}`);
            worksheet.getCell(`D${info.startRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
          }
          pendingMerge.delete(endKey1);
        }
      }

      // BLOQUE 2 => columna H
      if (diasBloque2[i]) {
        const startIdx2 = filasDia2.findIndex(f => f?.isGroupStart);
        const endIdx2   = filasDia2.findIndex(f => f?.isGroupEnd);
        const startKey2 = startIdx2 >= 0 ? filasDia2[startIdx2].groupKey : undefined;
        const endKey2   = endIdx2   >= 0 ? filasDia2[endIdx2].groupKey   : undefined;

        if (startKey2) {
          const startRow = baseRow + startIdx2;
          pendingMerge.set(startKey2, { col: 'H', startRow });
        }
        if (endKey2 && pendingMerge.has(endKey2)) {
          const info = pendingMerge.get(endKey2)!;
          // NUEVO: si el día de fin solo tiene salida, extender hasta la 3ra fila del día
          const isOnlySalida2 = filasDia2.length === 1 && !filasDia2[0]?.entrada && !!filasDia2[0]?.salida;
          const endRow = isOnlySalida2 ? (baseRow + 2) : (baseRow + endIdx2);
          if (info.col === 'H') {
            worksheet.mergeCells(`H${info.startRow}:H${endRow}`);
            worksheet.getCell(`H${info.startRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
          }
          pendingMerge.delete(endKey2);
        }
      }

      // NUEVO: Cruce de bloques 15→16 — combinar solo la columna "TIPO DE GUARDIA" por día
      // Día 15 (bloque 1): inicio con única entrada y fin en bloque 2
      if (diasBloque1[i] && filasDia1.length === 1 && !!filasDia1[0]?.isGroupStart) {
        const gk = filasDia1[0].groupKey;
        const fin = gk ? this.tablaFilas.find(f => f.groupKey === gk && f.isGroupEnd) : undefined;
        const finDia = fin?.fecha ? moment(fin.fecha, 'YYYY-MM-DD').date() : undefined;
        const cruzaABloque2 = finDia !== undefined && finDia >= 16;
        if (cruzaABloque2) {
          worksheet.mergeCells(`D${baseRow}:D${baseRow + 2}`);
          worksheet.getCell(`D${baseRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
        }
      }

      // Día 16 (bloque 2): fin con única salida y comienzo en bloque 1
      if (diasBloque2[i] && filasDia2.length === 1 && !!filasDia2[0]?.isGroupEnd) {
        const gk = filasDia2[0].groupKey;
        const inicio = gk ? this.tablaFilas.find(f => f.groupKey === gk && f.isGroupStart) : undefined;
        const inicioDia = inicio?.fecha ? moment(inicio.fecha, 'YYYY-MM-DD').date() : undefined;
        const vieneDeBloque1 = inicioDia !== undefined && inicioDia <= 15;
        if (vieneDeBloque1) {
          worksheet.mergeCells(`H${baseRow}:H${baseRow + 2}`);
          worksheet.getCell(`H${baseRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
        }
      }
    }

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 4) {
        // ...color de fondo según tipo de guardia...
      }
      // Bordes y alineación originales
      row.eachCell((cell, colNumber) => {
        let aplicarBorde = (rowNumber <= 49 && colNumber >= 1 && colNumber <= 4) || (colNumber >= 5 && colNumber <= 8);
        let topStyle: ExcelJS.BorderStyle = 'thick';
        let bottomStyle: ExcelJS.BorderStyle = 'thick';
        if (rowNumber > 4) {
          const posEnBloque = (rowNumber - 5) % 3;
          if (posEnBloque === 1 || posEnBloque === 2) {
            topStyle = 'thin';
          }
          if (posEnBloque === 0 || posEnBloque === 1) {
            bottomStyle = 'thin';
          }
        }
        if (aplicarBorde) {
          cell.border = {
            top: { style: topStyle },
            left: { style: 'thick' },
            bottom: { style: bottomStyle },
            right: { style: 'thick' }
          };
        } else {
          cell.border = {};
        }
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
    });
    // Ajustar ancho de columnas automáticamente
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      if (column.eachCell) {
        column.eachCell({ includeEmpty: true }, (cell) => {
          const cellValue = cell.value ? cell.value.toString() : '';
          maxLength = Math.max(maxLength, cellValue.length);
        });
      }
      column.width = Math.min(Math.max(maxLength + 4, 12), 40);
    });
    worksheet.getColumn(4).width = 21.22;
    worksheet.getColumn(8).width = 21.22;

    const fileName = `Planilla_asistencia_mes_${nombreHoja}_${this.selectedYear}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
  }

  async exportarAPDF() {
    const nombreHoja = moment({ month: this.selectedMonth - 1 }).format('MMMM').toUpperCase();
    // Encabezado principal: NOMBRE, APELLIDO, CUIL, HOSPITAL, SERVICIO, MES, AÑO
    const encabezadoPrincipal = [
      { text: 'NOMBRE', style: 'header' },
      { text: 'APELLIDO', style: 'header' },
      { text: 'CUIL', style: 'header' },
      { text: 'HOSPITAL', style: 'header' },
      { text: 'SERVICIO', style: 'header' },
      { text: 'MES', style: 'header' },
      { text: 'AÑO', style: 'header' }
    ];
    const datosPrincipal = [
      { text: this.inputValue.split(' ')[0] || '' },
      { text: this.inputValue.split(' ')[1] || '' },
      { text: this.formatCuil(this.asistencialCuil) },
      { text: this.efectorNombre || '' },
      { text: this.tablaFilas[0]?.servicio || '' },
      { text: nombreHoja },
      { text: this.selectedYear }
    ];
    // Encabezado duplicado SIN columna de servicio (8 columnas)
    const encabezadoDuplicado = [
      { text: 'DIA', style: 'header' },
      { text: 'ENTRADA', style: 'header' },
      { text: 'SALIDA', style: 'header' },
      { text: 'TIPO DE GUARDIA', style: 'header' },
      { text: 'DIA', style: 'header' },
      { text: 'ENTRADA', style: 'header' },
      { text: 'SALIDA', style: 'header' },
      { text: 'TIPO DE GUARDIA', style: 'header' }
    ];
    const body: any[] = [];
    body.push(encabezadoPrincipal);
    body.push(datosPrincipal);
    body.push(Array.from({ length: 8 }, () => ({ text: '' })));
    body.push(encabezadoDuplicado);

    // Helpers de saneo
    const ensureCellObj = (cell: any) => {
      if (cell === null) return null;
      if (typeof cell !== 'object' || Array.isArray(cell)) return { text: String(cell ?? '') };
      if (typeof cell.text === 'undefined' || cell.text === null) cell.text = '';
      if (cell.fillColor === '' || typeof cell.fillColor !== 'string') delete cell.fillColor;
      if (typeof cell.rowSpan !== 'number' || !isFinite(cell.rowSpan) || cell.rowSpan < 1) delete cell.rowSpan;
      return cell;
    };

    const normalizeBody = (rows: any[][]) => {
      const spanCountdown = new Array(8).fill(0);
      return rows.map((row, rowIdx) => {
        // asegurar array de 8
        const r = Array.isArray(row) ? row.slice(0, 8) : [];
        while (r.length < 8) r.push({ text: '' });
        // asegurar estructura válida y alinear spans
        for (let c = 0; c < 8; c++) {
          // si columna está cubierta por span previo, debe ser null
          if (spanCountdown[c] > 0) {
            r[c] = null;
            spanCountdown[c]--;
            continue;
          }
          // corregir celdas "null" huérfanas (sin span previo)
          if (r[c] === null) {
            r[c] = { text: '' };
          }
          r[c] = ensureCellObj(r[c]);
          // si esta celda inicia un span, cargar contador
          const rs = r[c] && r[c].rowSpan;
          if (typeof rs === 'number' && rs > 1 && isFinite(rs)) {
            spanCountdown[c] = rs - 1;
          }
        }
        return r;
      });
    };

    // Calcular los días del mes y dividir en dos bloques
    const fecha = moment({ year: this.selectedYear, month: this.selectedMonth - 1 });
    const diasEnMes = fecha.daysInMonth();
    const diasBloque1 = [];
    const diasBloque2 = [];
    for (let d = 1; d <= diasEnMes; d++) {
      const diaStr = moment({ year: this.selectedYear, month: this.selectedMonth - 1, day: d }).format('DD/MM/YYYY');
      if (d <= 15) diasBloque1.push(diaStr);
      else diasBloque2.push(diaStr);
    }
    const maxFilas = Math.max(diasBloque1.length, diasBloque2.length);

    // Declarar el Map persistente (fuera del bucle de días)
    const pendingMerge = new Map<string, { col: 'D' | 'H', startRow: number }>();

    for (let i = 0; i < maxFilas; i++) {
      let filasDia1: any[] = [];
      if (diasBloque1[i]) {
        // CAMBIO: usar la nueva función de agrupación
        filasDia1 = this.agruparFilasPorRangoGuardia(this.getFilasPorFecha(moment(diasBloque1[i], 'DD/MM/YYYY').format('YYYY-MM-DD')));
      }
      let filasDia2: any[] = [];
      if (diasBloque2[i]) {
        filasDia2 = this.agruparFilasPorRangoGuardia(this.getFilasPorFecha(moment(diasBloque2[i], 'DD/MM/YYYY').format('YYYY-MM-DD')));
      }

      // CAMBIO: saber si el día pertenece a un rango (inicio o fin) ANTES de hacer merges dentro del día
      const inGroup1 = filasDia1.some(f => f?.isGroupStart || f?.isGroupEnd);
      const inGroup2 = filasDia2.some(f => f?.isGroupStart || f?.isGroupEnd);

      for (let j = 0; j < 3; j++) {
        let fila1 = ['', '', '', ''];
        let fila2 = ['', '', '', ''];
        let tipoGuardiaRowSpan1 = filasDia1[j]?.tipoGuardiaRowSpan || 1;
        let tipoGuardiaRowSpan2 = filasDia2[j]?.tipoGuardiaRowSpan || 1;
        // Solo mostrar tipo de guardia si mostrarTipoGuardia es true
        if (filasDia1[j]) {
          fila1 = [
            j === 0 ? diasBloque1[i] : '',
            filasDia1[j].entrada || '',
            filasDia1[j].salida || '',
            filasDia1[j].mostrarTipoGuardia ? filasDia1[j].tipoGuardia : ''
          ];
        } else if (j === 0 && diasBloque1[i]) {
          fila1 = [diasBloque1[i], '', '', ''];
        }
        if (filasDia2[j]) {
          fila2 = [
            j === 0 ? diasBloque2[i] : '',
            filasDia2[j].entrada || '',
            filasDia2[j].salida || '',
            filasDia2[j].mostrarTipoGuardia ? filasDia2[j].tipoGuardia : ''
          ];
        } else if (j === 0 && diasBloque2[i]) {
          fila2 = [diasBloque2[i], '', '', ''];
        }
        // Guardar tipo de guardia para color
        const tipoGuardia1 = filasDia1[j]?.tipoGuardia || '';
        const tipoGuardia2 = filasDia2[j]?.tipoGuardia || '';

        // Pintar solo si hay hora válida
        const horaRegex = /^\d{2}:\d{2}(:\d{2})?$/;
        const entradaColor1 = horaRegex.test(fila1[1] || '') && this.getColorGuardia(tipoGuardia1) ? this.getColorGuardia(tipoGuardia1) : undefined;
        const salidaColor1  = horaRegex.test(fila1[2] || '') && this.getColorGuardia(tipoGuardia1) ? this.getColorGuardia(tipoGuardia1) : undefined;
        const entradaColor2 = horaRegex.test(fila2[1] || '') && this.getColorGuardia(tipoGuardia2) ? this.getColorGuardia(tipoGuardia2) : undefined;
        const salidaColor2  = horaRegex.test(fila2[2] || '') && this.getColorGuardia(tipoGuardia2) ? this.getColorGuardia(tipoGuardia2) : undefined;

        let rowPDF: any[] = [
          { text: fila1[0], alignment: 'center' },
          { text: fila1[1], alignment: 'center', ...(entradaColor1 ? { fillColor: entradaColor1 } : {}) },
          { text: fila1[2], alignment: 'center', ...(salidaColor1 ? { fillColor: salidaColor1 } : {}) },
          { text: fila1[3], alignment: 'center' },
          { text: fila2[0], alignment: 'center' },
          { text: fila2[1], alignment: 'center', ...(entradaColor2 ? { fillColor: entradaColor2 } : {}) },
          { text: fila2[2], alignment: 'center', ...(salidaColor2 ? { fillColor: salidaColor2 } : {}) },
          { text: fila2[3], alignment: 'center' }
        ];

        // Validaciones y combinaciones igual que Excel
        if (j === 0) {
          rowPDF[0].rowSpan = 3;
          rowPDF[4].rowSpan = 3;
          if (filasDia1.length === 1 || filasDia1.length === 0) {
            rowPDF[1].rowSpan = 3;
            rowPDF[2].rowSpan = 3;
            rowPDF[3].rowSpan = 3;
          }
          if (filasDia2.length === 1 || filasDia2.length === 0) {
            rowPDF[5].rowSpan = 3;
            rowPDF[6].rowSpan = 3;
            rowPDF[7].rowSpan = 3;
          }
          rowPDF = rowPDF.map(ensureCellObj);
          body.push(rowPDF);
        } else if (j === 1) {
          if (filasDia1.length === 2) {
            rowPDF[1].rowSpan = 2;
            rowPDF[2].rowSpan = 2;
            rowPDF[3].rowSpan = 2;
          } else if (filasDia1.length <= 1) {
            rowPDF[0] = null; rowPDF[1] = null; rowPDF[2] = null; rowPDF[3] = null;
          }
          if (filasDia2.length === 2) {
            rowPDF[5].rowSpan = 2;
            rowPDF[6].rowSpan = 2;
            rowPDF[7].rowSpan = 2;
          } else if (filasDia2.length <= 1) {
            rowPDF[4] = null; rowPDF[5] = null; rowPDF[6] = null; rowPDF[7] = null;
          }
          rowPDF = rowPDF.map(ensureCellObj);
          body.push(rowPDF);
        } else {
          if (filasDia1.length <= 2) {
            rowPDF[0] = null; rowPDF[1] = null; rowPDF[2] = null; rowPDF[3] = null;
          }
          if (filasDia2.length <= 2) {
            rowPDF[4] = null; rowPDF[5] = null; rowPDF[6] = null; rowPDF[7] = null;
          }
          if (rowPDF.every(c => c === null)) {
            rowPDF = Array.from({ length: 8 }, () => ({ text: '', alignment: 'center' }));
          }
          rowPDF = rowPDF.map(ensureCellObj);
          body.push(rowPDF);
        }
      }
    }

    // Normalizar body completo para alinear spans y evitar nulls huérfanos
    const normalizedBody = normalizeBody(body);

    const docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [10, 10, 10, 10],
      content: [
        { text: `Planilla asistencia mes ${nombreHoja} ${this.selectedYear}`, style: 'header' },
        {
          table: { headerRows: 4, widths: Array(8).fill('auto'), body: normalizedBody },
          layout: {
            hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length ? 2 : 0.5),
            vLineWidth: (i: number, node: any) => (i === 0 || i === node.table.widths.length ? 2 : 0.5),
            hLineColor: () => '#000',
            vLineColor: () => '#000',
            paddingLeft: () => 2,
            paddingRight: () => 2,
            paddingTop: () => 2,
            paddingBottom: () => 2
          }
        }
      ],
      styles: { header: { fontSize: 14, bold: true, alignment: 'center', margin: [0, 0, 0, 10] } },
      defaultStyle: { fontSize: 9 }
    };

    pdfMake.createPdf(docDefinition).download(`Planilla_asistencia_mes_${nombreHoja}_${this.selectedYear}.pdf`);
  }
}