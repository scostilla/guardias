import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DdjjCargoyagrupDetailComponent } from '../ddjj-cargoyagrup-detail/ddjj-cargoyagrup-detail.component';
import { DialogConfirmDdjjComponent } from '../dialog-confirm-ddjj/dialog-confirm-ddjj.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { RegistroActividad } from 'src/app/models/RegistroActividad';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { RegistroMensual } from 'src/app/models/RegistroMensual';
import { RegistroMensualService } from 'src/app/services/registroMensual.service';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import * as moment from 'moment';
import 'moment/locale/es';
import { Feriado } from 'src/app/models/Configuracion/Feriado';
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { ServicioService } from 'src/app/services/Configuracion/servicio.service';
import { NovedadPersonal } from 'src/app/models/guardias/NovedadPersonal';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ActivatedRoute } from '@angular/router';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';

interface ClasesNovedad {
  Compensatorio: string;
  'L.A.O.': string;
  Maternidad: string;
  'Parte de enfermo': string;
  'Familiar enfermo': string;
  'Falta sin aviso': string;
  [key: string]: string;
}

const clases: ClasesNovedad = {
  Compensatorio: 'novedad-personal-compensatorio',
  'L.A.O.': 'novedad-personal-lao',
  Maternidad: 'novedad-personal-maternidad',
  'Parte de enfermo': 'novedad-personal-parte-enfermo',
  'Familiar enfermo': 'novedad-personal-familiar-enfermo',
  'Falta sin aviso': 'novedad-personal-falta-sin-aviso'
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

  displayedColumns: string[] = ['apellido', 'nombre', 'acciones', 'totalHoras', 'weekdaysTotal', 'weekendsTotal'];
  dataSource!: MatTableDataSource<RegistroMensual>;
  suscription!: Subscription;

  diasEnMes: moment.Moment[] = [];
  feriados: Feriado[] = [];
  registrosMensuales: RegistroMensual[] = [];
  asistenciales: any[] = [];
  servicios: Servicio[] = []; 

  dialogRef!: MatDialogRef<DdjjCargoyagrupDetailComponent>;

  selectedServicio?: number | null = null; 
  selectedMonth: number = moment().month();
  selectedYear: number = moment().year();
  months = moment.months().map((name, value) => ({ value, name }));
  years: number[] = [2023, 2024];

  selectedHospitalId: number | null = null;
  selectedHospitalNombre: string = '';
  botonDph = true;
  revisandoDPH: boolean = false;

  constructor(
    private registroMensualService: RegistroMensualService,
    private feriadoService: FeriadoService,
    private servicioService: ServicioService, 
    private dialog: MatDialog,
    private paginatorIntl: MatPaginatorIntl,
    private hospitalService: HospitalService,
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
    moment.locale('es');

    this.dataSource = new MatTableDataSource<RegistroMensual>([]);
    
    this.generarDiasDelMes();
    
    this.feriadoService.list().subscribe((feriados: Feriado[]) => {
      this.feriados = feriados;
    });

    this.obtenerParametroRuta();
  }

  obtenerParametroRuta(){
    // Obtener el parámetro de la ruta
    this.route.queryParams.subscribe(params => {
      this.selectedHospitalId = params['hospital'] ? +params['hospital'] : null;
      if (this.selectedHospitalId) {
        this.loadHospitalDetails(this.selectedHospitalId);
      }
    });
  }

  loadHospitalDetails(hospitalId: number) {
    this.hospitalService.getById(hospitalId).subscribe(hospital => {
      this.selectedHospitalNombre = hospital.nombre;
      this.servicios = hospital.servicios;
      if (this.servicios.length > 0) {
        this.selectedServicio = this.servicios[0].id;
      }
      this.loadRegistrosMensuales(); // Llama aquí después de obtener los servicios
    }, error => {
      console.log(error);
    });
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

    if (this.selectedServicio !== null && this.selectedServicio !== undefined) {
      const servicioIdSeleccionado = Number(this.selectedServicio);

      // Filtrar los registros por el servicio seleccionado dentro de RegistroActividad
      const filteredRegistros = this.registrosMensuales.filter(registroMensual =>
        registroMensual.registroActividad.some(registroActividad =>
          registroActividad.servicio.id === servicioIdSeleccionado
        )
      );
      this.dataSource.data = filteredRegistros;
    } else {
      this.dataSource.data = this.registrosMensuales;
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadRegistrosMensuales(): void {
    const anio = this.selectedYear;
    const mes = moment().month(this.selectedMonth).format('MMMM').toUpperCase();
    const idEfector = this.selectedHospitalId;
    
    console.log("id del efector que se usa para cargar reg mensuales ES: "+ idEfector);

    if (idEfector === null) {
      console.error("El ID del hospital no puede ser null");
      return; // ver de que manera manejar si sucede que sea null
    }

    this.registroMensualService.listByYearMonthEfectorAndTipoGuardiaCargoReagrupacion(anio, mes, idEfector).subscribe(data => {
      this.registrosMensuales = data;
      this.updateTableDataSource(); // Filtrar los datos después de cargarlos
    });
  }

  updateDateAndLoadData(): void {

    this.generarDiasDelMes();
    this.loadRegistrosMensuales();
  }

  listServicio(): void {
    this.servicioService.list().subscribe(data => {
      this.servicios = data;
      if (this.servicios.length > 0) {
        this.selectedServicio = this.servicios[0].id;
      }
      this.updateDateAndLoadData();
    }, error => {
      console.log(error);
    });
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

  openDetail(asistencial: Asistencial, selectedMonth: number, selectedYear: number): void {
    this.dialogRef = this.dialog.open(DdjjCargoyagrupDetailComponent, {
      width: '600px',
      data: {
        asistencial,
        month: selectedMonth,
        year: selectedYear
      }
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

  isNovedad(date: Date, novedades: NovedadPersonal[]): { isNovedad: boolean, descripcion: string } {
    const dateMoment = moment(date).startOf('day');
    const novedadFound = novedades.find(novedad => {
      const inicioMoment = moment(novedad.fechaInicio).startOf('day');
      const finMoment = moment(novedad.fechaFinal).startOf('day');
      return dateMoment.isBetween(inicioMoment, finMoment, undefined, '[]');
    });
  
    return {
      isNovedad: !!novedadFound,
      descripcion: novedadFound ? novedadFound.descripcion : ''
    };
  }
  
  getNovedadCssClass(descripcion: string): string {
    return clases[descripcion] || '';
  }

  isNovedadClass(date: Date, registro: any): string {
    const novedad = this.isNovedad(date, registro.asistencial.novedadesPersonales);
    if (novedad.isNovedad) {
      return this.getNovedadCssClass(novedad.descripcion);
    } else {
      const holiday = this.isHoliday(date);
      if (holiday.isHoliday) {
        return 'holiday';
      } else if (this.isWeekend(date)) {
        return 'weekend';
      }
    }
    return '';
  }

  calculateTooltip(date: Date, registro: any): string {
    const novedad = this.isNovedad(date, registro.asistencial.novedadesPersonales);
    if (novedad.isNovedad) {
      return novedad.descripcion;
    } else {
      const holiday = this.isHoliday(date);
      if (holiday.isHoliday) {
        return holiday.motivo;
      }
    }
    return '';
  }
  
  /*isNovedad(date: Date, novedades: NovedadPersonal[]): { isNovedad: boolean, descripcion: string, idNovedad: number } {
    const dateMoment = moment(date).startOf('day');
    const novedadFound = novedades.find(novedad => {
      const inicioMoment = moment(novedad.fechaInicio).startOf('day');
      const finMoment = moment(novedad.fechaFinal).startOf('day');
      return dateMoment.isBetween(inicioMoment, finMoment, undefined, '[]');
    });
  
    return {
      isNovedad: !!novedadFound,
      descripcion: novedadFound ? novedadFound.descripcion : '',
      idNovedad: novedadFound?.id ?? 0 
    };
  }*/

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
    // Si hay fechas de ingreso y egreso, calcular las horas
    if (registro.fechaIngreso && registro.fechaEgreso) {
      const hoursIn = moment(registro.fechaIngreso + ' ' + registro.horaIngreso, 'YYYY-MM-DD HH:mm:ss');
      const hoursOut = moment(registro.fechaEgreso + ' ' + registro.horaEgreso, 'YYYY-MM-DD HH:mm:ss');

      if (hoursIn.isValid() && hoursOut.isValid()) {
        const diffHours = hoursOut.diff(hoursIn, 'hours', true);

        if (diffHours > 0) {
          // Obtener el color de la fuente según el tipoGuardia
          const color = this.getColor(registro.tipoGuardia);
          console.log("COLOR que trae " + color)
          // Muestra la diferencia de horas como un número entero con el color de la fuente correspondiente
          output = `<span style="color: ${color};">${Math.round(diffHours)}</span>`;
          //output = `${diffHours.toFixed(2)}`; // Redondear a dos decimales
        } else {
          output = '0';
        }
      } else {
        output = 'Datos inválidos';
      }
    }
    return output;
  }

  getColor(tipoGuardia: TipoGuardia): string {
    if (tipoGuardia && tipoGuardia.id) {
      console.log("id de guardia: " + tipoGuardia.nombre)
      if (tipoGuardia.nombre === "CARGO") {
        console.log("PASOO: " + tipoGuardia.nombre)
        return '#91A8DA'; // Color para CARGO
      } else if (tipoGuardia.nombre === "AGRUPACION") {
        return '#F4AF88'; // Color para REAGRUPACION DE HS
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
        return '#F4AF88'; // Color para REAGRUPACION DE HS
      }
    }
    return ''; // Color por defecto
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

getLegajoActualId(asistencial: Asistencial): Legajo | undefined {
  const legajoActual = asistencial.legajos.find(legajo => legajo.actual);
  return legajoActual ? legajoActual : undefined;
}

getNovedades(asistencial: Asistencial): NovedadPersonal[] {
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
    const novedadesString = novedades.map((novedad: NovedadPersonal) => `${novedad.descripcion} (${this.formatDate(novedad.fechaInicio, novedad.fechaFinal)})`).join('; ');

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

  const fileName = `ddjj-Cargo-y-Agrupacion_${mesSeleccionado}_${anioSeleccionado}.xlsx`;

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
  }

}