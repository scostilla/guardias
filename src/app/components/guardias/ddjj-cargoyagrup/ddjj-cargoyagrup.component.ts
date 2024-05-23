import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DdjjCargoyagrupDetailComponent } from '../ddjj-cargoyagrup-detail/ddjj-cargoyagrup-detail.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Observable, Subscription, catchError, of, tap } from 'rxjs';
import { RegistroActividad } from 'src/app/models/RegistroActividad';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { RegistroMensual } from 'src/app/models/RegistroMensual';
import { RegistroMensualService } from 'src/app/services/registroMensual.service';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import * as moment from 'moment';
import 'moment/locale/es';
import { Feriado } from 'src/app/models/Configuracion/Feriado';
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { Servicio } from 'src/app/models/Configuracion/Servicio';
import { ServicioService } from 'src/app/services/Configuracion/servicio.service';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-ddjj-cargoyagrup',
  templateUrl: './ddjj-cargoyagrup.component.html',
  styleUrls: ['./ddjj-cargoyagrup.component.css']
})

export class DdjjCargoyagrupComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<RegistroMensual>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['apellido', 'nombre', 'acciones', 'totalHoras'];
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

  constructor(
    private registroMensualService: RegistroMensualService,
    private asistencialService: AsistencialService,
    private feriadoService: FeriadoService,
    private servicioService: ServicioService, 
    private dialog: MatDialog,
    private paginatorIntl: MatPaginatorIntl
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

    this.listServicio();

    this.feriadoService.list().subscribe((feriados: Feriado[]) => {
      this.feriados = feriados;
    });

    this.generarDiasDelMes();

    this.loadRegistrosMensuales();

    this.suscription = this.registroMensualService.refresh$.subscribe(() => {
      this.loadRegistrosMensuales();
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

  //puse el filtro que funciona en ESPECIALIDAD
  /*applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: RegistroMensual, filter: string) => {
      const nombre = this.accentFilter(data.asistencial.nombre.toLowerCase());
      const apellido = this.accentFilter(data.asistencial.apellido.toLowerCase());
      
      filter = this.accentFilter(filter.toLowerCase());
      return nombre.includes(filter) || apellido.includes(filter) ;
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }*/

  applyFilter(filterValue: string) {
    const normalizeText = (text: string) => {
      return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };
  
    const normalizedFilterValue = normalizeText(filterValue);
  
    this.dataSource.filterPredicate = (data: RegistroMensual, filter: string) => {
      const dataStr = normalizeText(
        data.asistencial?.nombre + ' ' +
        data.asistencial?.apellido + ' '
      );
      return dataStr.indexOf(normalizedFilterValue) !== -1;
    };
  
    this.dataSource.filter = normalizedFilterValue;
  } 

  listServicio(): void {
    this.servicioService.list().subscribe(data => {
      this.servicios = data;
      if (this.servicios.length > 0) {
        this.selectedServicio = this.servicios[0].id; 
      }
      this.updateTableDataSource(); // Llama a updateTableDataSource sin importar si hay servicios o no
    }, error => {
      console.log(error);
    });
  }
//AQUI
  updateDateAndLoadData(): void {

    this.generarDiasDelMes();
    this.loadRegistrosMensuales();
    this.updateTableDataSource();
    this.loadData();
  }

  updateService(): void {
    this.updateTableDataSource();
  }

  loadData(){
    this.registrosMensuales = this.filterDataByDate(this.selectedMonth, this.selectedYear);
    this.dataSource = new MatTableDataSource(this.registrosMensuales);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  filterDataByDate(month: number, year: number): RegistroMensual[] {
    // Filtra los datos según el mes y año proporcionados
    return this.registrosMensuales.filter(registro => {
      // Convertir el mes a formato numérico
    const monthNumber = moment().month(registro.mes).month();
    return monthNumber === month && registro.anio === year;
    });
  }

  getMonthName(monthIndex: number): string {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return monthNames[monthIndex];
  }

  loadRegistrosMensuales(): void {
    const anio = this.selectedYear;
    const mes = moment().month(this.selectedMonth).format('MMMM').toUpperCase();
    const idEfector = 1; // ID de efector fijo

    this.registroMensualService.listByYearMonthEfectorAndTipoGuardiaCargoReagrupacion(anio, mes, idEfector).subscribe( data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  updateTableDataSource(): void {
     // Convertir selectedServicio a número si es necesario
     const servicioIdSeleccionado = Number(this.selectedServicio);

    // Filtrar los registros por el servicio seleccionado dentro de RegistroActividad
    const filteredRegistros = this.registrosMensuales.filter(registroMensual =>
      registroMensual.registroActividad.some(registroActividad => {
          console.log('Comparando servicio:', registroActividad.servicio.id, 'con seleccionado:', servicioIdSeleccionado);
          return registroActividad.servicio.id === servicioIdSeleccionado;
      })
  );
  }

  getLegajoActualId(asistencial: Asistencial): Legajo | undefined {
    const legajoActual = asistencial.legajos.find(legajo => legajo.actual);
    return legajoActual ? legajoActual : undefined;
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

  getFechaFromColumnId(columnId: string): Date {
    return moment(columnId, 'YYYY_MM_DD').toDate();
  }

  openDetail(asistencial: Asistencial, selectedMonth: number, selectedYear: number): void {
    this.dialogRef = this.dialog.open(DdjjCargoyagrupDetailComponent, {
      width: '600px',
      data:{ 
        asistencial,
        month: selectedMonth,
        year: selectedYear
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
      if (tipoGuardia.id === 1) {
        return '#91A8DA'; // Color para CARGO
      } else if (tipoGuardia.id === 2) {
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

  exportarAExcel() {
    const dataToExport = this.dataSource.data.map((registro: RegistroMensual) => {
      return {
        Apellido: registro.asistencial.apellido,
        Nombre: registro.asistencial.nombre,
        Cuil: registro.asistencial.cuil,
        VínculoLaboral: registro.asistencial.nombre,
        /*TotalHoras: registro.totalHoras*/
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'MiHojaDeCalculo');
    XLSX.writeFile(wb, 'mi-archivo-excel.xlsx');
  }
    
  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

}