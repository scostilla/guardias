import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DdjjCargoyagrupDetailComponent } from '../ddjj-cargoyagrup-detail/ddjj-cargoyagrup-detail.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
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

  /*applyFilter(filterValue: string) {
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
  }*/

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
    console.log(this.selectedYear);
    console.log(this.selectedMonth);
    const mes = moment().month(this.selectedMonth).format('MMMM').toUpperCase();
    console.log(mes);
    const idEfector = 1; // ID de efector fijo

    this.registroMensualService.listByYearMonthAndEfector(anio, mes, idEfector).subscribe(
      (data: RegistroMensual[]) => {
        this.registrosMensuales = data;
        this.loadAsistentesForRegistros();
      },
      error => {
        console.error('Error al cargar los registros mensuales:', error);
      }
    );
  }

  loadAsistentesForRegistros(): void {
    const idsAsistenciales = this.registrosMensuales.map(registro => registro.idAsistencial);
    this.asistencialService.getByIds(idsAsistenciales).subscribe(
      (asistencial: Asistencial[]) => {
        this.asistenciales = asistencial;
        this.updateTableDataSource();
      },
      error => {
        console.error('Error al cargar los asistentes:', error);
      }
    );
  }

  updateTableDataSource(): void {

    if (!this.registrosMensuales || !this.asistenciales) {
      return; // Salir si los datos no están disponibles
    }

    console.log('Registros mensuales:', this.registrosMensuales);
    console.log('Asistenciales:', this.asistenciales);
    console.log('Servicio seleccionado:', this.selectedServicio);


     // Convertir selectedServicio a número si es necesario
     const servicioIdSeleccionado = Number(this.selectedServicio);

    // Filtrar los registros por el servicio seleccionado dentro de RegistroActividad
    const filteredRegistros = this.registrosMensuales.filter(registroMensual =>
      registroMensual.registroActividad.some(registroActividad => {
          console.log('Comparando servicio:', registroActividad.servicio.id, 'con seleccionado:', servicioIdSeleccionado);
          return registroActividad.servicio.id === servicioIdSeleccionado;
      })
  );
  
    console.log('####Registros filtrados:', filteredRegistros);

    // Mapear los registros filtrados para incluir la información asistencial
    const dataToShow = filteredRegistros.map(registro => {
      const asistencial = this.asistenciales.find(as => as.id === registro.idAsistencial);
      return {
        ...registro,
        asistencial: asistencial ? asistencial : null
      };
    });
  
    this.dataSource.data = dataToShow; 
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // Añadir esta línea para asegurarse de que la tabla se actualice visualmente
    this.table.renderRows();
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

  openDetail(asistencial: Asistencial): void {
    this.dialogRef = this.dialog.open(DdjjCargoyagrupDetailComponent, {
      width: '600px',
      data: asistencial
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
    /* const mesDeInteres = this.selectedMonth;
    const anioDeInteres = this.selectedYear; */

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
    
  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

}