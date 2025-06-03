import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DdjjExtraDetailComponent } from '../ddjj-extra-detail/ddjj-extra-detail.component';
import { DialogConfirmDdjjComponent } from '../dialog-confirm-ddjj/dialog-confirm-ddjj.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { RegistroActividad } from 'src/app/models/RegistroActividad';
import { Person } from 'src/app/models/Configuracion/Person';
import { RegistroMensual } from 'src/app/models/RegistroMensual';
import { RegistroMensualService } from 'src/app/services/registroMensual.service';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import * as moment from 'moment';
import 'moment/locale/es';
import { Feriado } from 'src/app/models/Configuracion/Feriado';
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service';
import { ServicioSummaryDto } from 'src/app/dto/Configuracion/ServicioSummaryDto';
import { NovedadPersonal } from 'src/app/models/guardias/NovedadPersonal';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { CapsService } from 'src/app/services/Configuracion/caps.service';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { EfectorHospitalDto } from 'src/app/dto/Configuracion/efector/EfectorHospitalDto';
import { EfectorMinisterioDto } from 'src/app/dto/Configuracion/efector/EfectorMinisterioDto';
import { EfectorCapsDto } from 'src/app/dto/Configuracion/efector/EfectorCapsDto';


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
  selector: 'app-ddjj-extra',
  templateUrl: './ddjj-extra.component.html',
  styleUrls: ['./ddjj-extra.component.css']
})

export class DdjjExtraComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<RegistroMensual>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['apellido', 'nombre', 'acciones', 'totalHoras', 'weekdaysTotal', 'weekendsTotal'];
  dataSource!: MatTableDataSource<RegistroMensual>;
  suscription!: Subscription;

  diasEnMes: moment.Moment[] = [];
  feriados: Feriado[] = [];
  registrosMensuales: RegistroMensual[] = [];
  servicios: ServicioSummaryDto[] = []; 

  dialogRef!: MatDialogRef<DdjjExtraDetailComponent>;

  selectedServicio?: number | null = null; 
  selectedMonth: number = moment().month();
  selectedYear: number = moment().year();
  months = moment.months().map((name, value) => ({ value, name }));
  years: number[] = [2023, 2024, 2025];

  botonDph = true;
  revisandoDPH: boolean = false;
  efectorId: number | null = null;
  efectorNombre: string | null = null;

  private efectorIdSubscription!: Subscription;

  constructor(
    private registroMensualService: RegistroMensualService,
    private feriadoService: FeriadoService,
    private dialog: MatDialog,
    private paginatorIntl: MatPaginatorIntl,
    private hospitalService: HospitalService,
    private capsService: CapsService,
    private ministerioService: MinisterioService,
    private efectorService: EfectorService,
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
    moment.locale('es');

    this.dataSource = new MatTableDataSource<RegistroMensual>([]);
    
    this.generarDiasDelMes();
    
    this.feriadoService.list().subscribe((feriados: Feriado[]) => {
      this.feriados = feriados;
    });

    this.efectorId = this.efectorService.getCurrentEfectorId();
      if (this.efectorId) {
        this.loadEfectorName(); 
        this.loadHospitalDetails();
      } else {
        this.handleInvalidEfector();
      }
      this.selectedServicio = null;
  }

  //trae el nombre del efector esta en sesion
  loadEfectorName(): void { 
    if (this.efectorId) {
      this.hospitalService.detailNombreAll(this.efectorId).subscribe((efector: EfectorHospitalDto | null) => {

        if (efector) {
          this.efectorNombre = efector.nombre;
        } else {
            console.error('ID de efector inválido o no encontrado.');
            this.router.navigateByUrl('/home-page');
        }
      });
    } else {
        console.error('ID de efector inválido o no encontrado.');
        this.router.navigateByUrl('/home-page');
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
        console.log('Servicios recibidos del backend:', servicios);

        this.servicios = servicios.map(s => new ServicioSummaryDto(s.id, s.descripcion));

        console.log('Servicios mapeados:', this.servicios);

        if (this.servicios.length > 0) {
        }

        this.loadRegistrosMensuales();
      },
      (error) => {
        console.error('Error al obtener servicios activos del hospital:', error);
      }
    );
  }

  private handleInvalidEfector(): void {
    console.error('ID de efector inválido o no encontrado.');
    this.router.navigateByUrl('/home-page');
  }


  generarDiasDelMes(): void {
    const startOfMonth = moment().year(this.selectedYear).month(this.selectedMonth).startOf('month');
    const endOfMonth = startOfMonth.clone().endOf('month');
    let day = startOfMonth;

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

loadRegistrosMensuales(): void {
  const anio = this.selectedYear;
  const mes = moment().month(this.selectedMonth).format('MMMM').toUpperCase();
  const idEfector = this.efectorId;

  if (idEfector === null) {
    console.error("El ID del hospital no puede ser null");
    return;
  }

  if (this.selectedServicio == null) {
    // Todos los servicios
    this.registroMensualService
      .listByYearMonthEfectorAndTipoGuardiaExtra(anio, mes, idEfector)
      .subscribe(data => {
        this.registrosMensuales = data;
        this.updateTableDataSource(); // Mostrar todos
      });
  } else {
    // Servicio específico
    this.registroMensualService
      .listByYearMonthEfectorAndTipoGuardiaExtraService(anio, mes, idEfector, this.selectedServicio)
      .subscribe(data => {
        this.registrosMensuales = data;
        this.updateTableDataSource(); // Mostrar filtrado
      });
  }
}

  updateDateAndLoadData(): void {

    this.generarDiasDelMes();
    this.loadRegistrosMensuales();
  }

  filterDataByDate(month: number, year: number): RegistroMensual[] {
    // Filtra los datos según el mes y año proporcionados
    return this.registrosMensuales.filter(registro => {
      // Convertir el mes a formato numérico
    const monthNumber = moment().month(registro.mes).month();
    return monthNumber === month && registro.anio === year;
    });
  }

  loadData() {
    this.registrosMensuales = this.filterDataByDate(this.selectedMonth, this.selectedYear);
    this.updateTableDataSource();
  }

  getMonthName(monthIndex: number): string {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return monthNames[monthIndex];
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

  console.log('🧾 Datos enviados al dialog:', dataToSend);

  this.dialogRef = this.dialog.open(DdjjExtraDetailComponent, {
    width: '600px',
    data: dataToSend
  });
}

  openDdjjConfirm(): void {
    const dialogRef = this.dialog.open(DialogConfirmDdjjComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.revisandoDPH = true;
        this.botonDph = false;
      }
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
  
  calculateHoursForDate(registroActividades: RegistroActividad[], date: Date): string { 
    let output = '';

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
      const hoursIn = moment(registro.fechaIngreso + ' ' + registro.horaIngreso, 'YYYY-MM-DD HH:mm:ss');
      const hoursOut = moment(registro.fechaEgreso + ' ' + registro.horaEgreso, 'YYYY-MM-DD HH:mm:ss');

      if (hoursIn.isValid() && hoursOut.isValid()) {
        const diffHours = hoursOut.diff(hoursIn, 'hours', true);

        if (diffHours > 0) {
          // Color fijo para todos los tipos de guardia
          const color = '#fcc932';
          output = `<span style="color: ${color};">${Math.round(diffHours)}</span>`;
        } else {
          output = '0';
        }
      } else {
        output = 'Datos inválidos';
      }
    }

    return output;
  }
  
  calculateHoursColor(registroActividad: RegistroActividad[], date: Date): string {
    const registro = registroActividad.find((actividad) => {
      const ingresoDate = moment(actividad.fechaIngreso);
      return ingresoDate.isSame(date, 'day');
    });

    // Si hay un registro en la fecha, usar el color fijo
    return registro ? '#fcc932' : '';
  }

  calculateTotalHoursForRow(registroActividades: RegistroActividad[], mesDeInteres: number, anioDeInteres: number): number {
    let totalHours = 0;
    // Iterar sobre cada día del mes de interés
    for (let day = 1; day <= moment({ year: anioDeInteres, month: mesDeInteres }).daysInMonth(); day++) {
      const date = new Date(anioDeInteres, mesDeInteres, day);
      const hoursForDate = this.calculateHoursForDate(registroActividades, date);
      // Asegurarse de que el resultado es un número y sumarlo al total
      const hoursNumber = parseFloat(hoursForDate.replace(/<[^>]*>/g, '')); // Eliminar etiquetas HTML
      if (!isNaN(hoursNumber)) {
        totalHours += hoursNumber;
      }
    }
    return totalHours;
  }

  calculateWeekdaysTotal(registroActividades: RegistroActividad[], mesDeInteres: number, anioDeInteres: number): number {
    let totalWeekdaysHours = 0;
    const daysInMonth = moment({ year: anioDeInteres, month: mesDeInteres }).daysInMonth();

    // Iterar sobre cada día del mes de interés
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(anioDeInteres, mesDeInteres, day);
      if (date.getDay() !== 0 && date.getDay() !== 6) { // Si el día no es sábado ni domingo
        const hoursForDate = this.calculateHoursForDate(registroActividades, date);
        // Asegurarse de que el resultado es un número y sumarlo al total de horas de días laborales
        const hoursNumber = parseFloat(hoursForDate.replace(/<[^>]*>/g, '')); // Eliminar etiquetas HTML
        if (!isNaN(hoursNumber)) {
          totalWeekdaysHours += hoursNumber;
        }
      }
    }
    return totalWeekdaysHours;
}

calculateWeekendsTotal(registroActividades: RegistroActividad[], mesDeInteres: number, anioDeInteres: number): number {
    let totalWeekendsHours = 0;
    const daysInMonth = moment({ year: anioDeInteres, month: mesDeInteres }).daysInMonth();

    // Iterar sobre cada día del mes de interés
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(anioDeInteres, mesDeInteres, day);
      if (date.getDay() === 0 || date.getDay() === 6) { // Si el día es sábado o domingo
        const hoursForDate = this.calculateHoursForDate(registroActividades, date);
        // Asegurarse de que el resultado es un número y sumarlo al total de horas de fines de semana
        const hoursNumber = parseFloat(hoursForDate.replace(/<[^>]*>/g, '')); // Eliminar etiquetas HTML
        if (!isNaN(hoursNumber)) {
          totalWeekendsHours += hoursNumber;
        }
      }
    }
    return totalWeekendsHours;
}

calculateHoursForExcel(registroActividades: RegistroActividad[], date: Date): string {
  let output = '';

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
  // Si hay fechas de ingreso y egreso, calcular las horas
  if (registro.fechaIngreso && registro.fechaEgreso) {
    const hoursIn = moment(registro.fechaIngreso + ' ' + registro.horaIngreso, 'YYYY-MM-DD HH:mm:ss');
    const hoursOut = moment(registro.fechaEgreso + ' ' + registro.horaEgreso, 'YYYY-MM-DD HH:mm:ss');

    if (hoursIn.isValid() && hoursOut.isValid()) {
      const diffHours = hoursOut.diff(hoursIn, 'hours', true);

      if (diffHours > 0) {
        // Muestra la diferencia de horas como un número entero
        output = `${Math.round(diffHours)}`;
      } else {
        output = '0';
      }
    } else {
      output = 'Datos inválidos';
    }
  }
  return output;
}

//aqui decia actual en vez de activo, revisar si corresponde
getLegajoActualId(asistencial: Person): Legajo | undefined {
  const legajoActual = asistencial.legajos.find(legajo => legajo.activo);
  return legajoActual ? legajoActual : undefined;
}

getNovedades(asistencial: Person): NovedadPersonal[] {
  return asistencial.novedadesPersonales;
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

exportarAExcel() {
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

  const dataColumnHeaders = ['Apellido', 'Nombre', 'Cuil', 'Vinculos_Laborales', 'Categoria', 'Novedades', 'Total mes', 'Total L-V', 'Total S-D'];
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

  this.dataSource.data.forEach((registro: RegistroMensual) => {
    const exportData: any = {
      Apellido: registro.asistencial.apellido,
      Nombre: registro.asistencial.nombre,
      Cuil: registro.asistencial.cuil,
      Vinculos_Laborales: this.getLegajoActualId(registro.asistencial)?.revista?.tipoRevista?.nombre || '-',
      Categoria: this.getLegajoActualId(registro.asistencial)?.revista?.categoria?.nombre + '(' + this.getLegajoActualId(registro.asistencial)?.revista?.adicional?.nombre + ')' || '',
    };

    const novedades = this.getNovedades(registro.asistencial);
    const novedadesString = novedades.map((novedad: NovedadPersonal) => `${novedad.tipoLicencia.nombre} (${this.formatDate(novedad.fechaInicio, novedad.fechaFinal)})`).join('; ');

    exportData['Novedades'] = novedadesString || '-';

    const totalMes = this.calculateTotalHoursForRow(registro.registroActividad, this.selectedMonth, this.selectedYear);
    const totalLV = this.calculateWeekdaysTotal(registro.registroActividad, this.selectedMonth, this.selectedYear);
    const totalSD = this.calculateWeekendsTotal(registro.registroActividad, this.selectedMonth, this.selectedYear);

    exportData['Total mes'] = totalMes;
    exportData['Total L-V'] = totalLV;
    exportData['Total S-D'] = totalSD;

    this.displayedColumns.slice(6).forEach((fechaColumna: string, index: number) => {
      exportData[combinedHeaders[dataColumnHeaders.length + index]] = this.calculateHoursForExcel(registro.registroActividad, this.getFechaFromColumnId(fechaColumna));
    });

    worksheet.addRow(Object.values(exportData));
  });

  const fileName = `ddjj-Extra_${mesSeleccionado}_${anioSeleccionado}.xlsx`;

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

  workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, fileName);
  });
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
    this.efectorIdSubscription?.unsubscribe();
  }

}