import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DdjjCargoyagrupCalendarComponent } from '../ddjj-cargoyagrup-calendar/ddjj-cargoyagrup-calendar.component';
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
import { Feriado } from 'src/app/models/Configuracion/Feriado'; 
import { FeriadoService } from 'src/app/services/Configuracion/feriado.service'; 



@Component({
  selector: 'app-ddjj-cargoyagrup',
  templateUrl: './ddjj-cargoyagrup.component.html',
  styleUrls: ['./ddjj-cargoyagrup.component.css']
})

export class DdjjCargoyagrupComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<RegistroMensual>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['apellido', 'nombre',/* 'cuil', 'servicio', 'vinculo', 'categoria', 'fechaIngreso', 'fechaEgreso', 'NovedadPersonal',*/ 'acciones'];
  dataSource!: MatTableDataSource<RegistroMensual>;
  suscription!: Subscription;
  registros!: any[];

  diasEnMes: moment.Moment[] = [];
  feriados: Feriado[] = [];
  registrosMensuales: RegistroMensual[] = [];
  asistentes: any[] = [];
  
  registroActividad!: RegistroActividad;
  dialogRef!: MatDialogRef<DdjjCargoyagrupCalendarComponent>;

  constructor(
    private registroMensualService: RegistroMensualService,
    private asistencialService: AsistencialService,
    private feriadoService: FeriadoService,
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

  asistencialesMap: Map<number, Asistencial> = new Map<number, Asistencial>(); // Mapa para almacenar nombres y apellidos de asistenciales


  ngOnInit(): void {

    moment.locale('es');

    this.feriadoService.list().subscribe((feriados: Feriado[]) => {
      this.feriados = feriados;
    });

    this.generarDiasDelMes();

    this.loadRegistrosMensuales();

    this.suscription = this.registroMensualService.refresh$.subscribe(() => {
      this.loadRegistrosMensuales();
    })
  }

  loadRegistrosMensuales(): void {
    const anio = 2024; // Año fijo
    const mes = 'ENERO'; // Mes fijo
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
    /*console.log('Registros mensuales:', this.registrosMensuales);*/
  }

  loadAsistentesForRegistros(): void {
    const idsAsistentes = this.registrosMensuales.map(registro => registro.idAsistencial);
    this.asistencialService.getByIds(idsAsistentes).subscribe(
      (asistentes: Asistencial[]) => {
        this.asistentes = asistentes;
        // Una vez que se cargan los asistentes, actualiza la tabla
        this.updateTableDataSource();
      },
      error => {
        console.error('Error al cargar los asistentes:', error);
      }
    );
  }

  updateTableDataSource(): void {
    const dataToShow = this.registrosMensuales.map(registro => {
      const asistente = this.asistentes.find(as => as.id === registro.idAsistencial);
      return {
        ...registro,
        asistencial: asistente ? asistente : null
      };
    });
    this.dataSource = new MatTableDataSource<RegistroMensual>(dataToShow);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getLegajoActualId(asistencial: Asistencial): Legajo | undefined {
    const legajoActual = asistencial.legajos.find(legajo => legajo.actual);
    return legajoActual ? legajoActual : undefined;
  } 

  generarDiasDelMes(): void {
    const startOfMonth = moment([2024, 0, 1]); // Enero 2024
    const endOfMonth = startOfMonth.clone().endOf('month');
    let day = startOfMonth;
  
    this.displayedColumns = this.displayedColumns.filter(column => !column.includes('_'));
  
    while(day <= endOfMonth) {
      this.displayedColumns.push(day.format('YYYY_MM_DD'));
      day.add(1, 'day');
    }
  }

  getFechaFromColumnId(columnId: string): Date {
    return moment(columnId, 'YYYY_MM_DD').toDate();
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

openDetail(asistencial: Asistencial): void {
  this.dialogRef = this.dialog.open(DdjjCargoyagrupCalendarComponent, {
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
  /*console.log('Fecha proporcionada:', date);*/
  let output = '';
  const mesDeInteres = 0; // Enero es 0 en JavaScript Date
  const anioDeInteres = 2024;

  // Buscar un registro que coincida con la fecha proporcionada y que esté dentro del mes y año de interés
  const registro = registroActividades.find((actividad) => {
    const ingresoDate = moment(actividad.fechaIngreso);
    const egresoDate = moment(actividad.fechaEgreso);
    return ingresoDate.isSame(date, 'day') &&
           ingresoDate.month() === mesDeInteres &&
           ingresoDate.year() === anioDeInteres ;
  });

  // Si no hay registro, retornar celda vacía
  if (!registro) {
    return '';
  }

  // Si hay fecha de ingreso pero no de egreso, retornar 'Sin egreso'
  for (let actividad of registroActividades) {
    if (actividad.fechaIngreso && !actividad.fechaEgreso) {
      return 'sin egreso';
    }
  }
  
  // Si hay fechas de ingreso y egreso, calcular las horas
  if (registro.fechaIngreso && registro.fechaEgreso) {
    const hoursIn = moment(registro.fechaIngreso + ' ' + registro.horaIngreso, 'YYYY-MM-DD HH:mm:ss');
    const hoursOut = moment(registro.fechaEgreso + ' ' + registro.horaEgreso, 'YYYY-MM-DD HH:mm:ss');
    // Asegurarse de que las horas de ingreso y egreso son válidas
    if (hoursIn.isValid() && hoursOut.isValid()) {
      const diffHours = hoursOut.diff(hoursIn, 'hours', true);
      // Verificar que la diferencia de horas no sea cero
      if (diffHours > 0) {
        // Muestra la diferencia de horas como un número entero
        output = `${Math.round(diffHours)}`; 
        //output = `${diffHours.toFixed(2)}`; // Redondear a dos decimales
      } else {
        output = '0'; // Si la diferencia es cero, mostrar 0.00 hrs
      }
    } else {
      output = 'Datos inválidos'; // Si las horas no son válidas, mostrar mensaje de error
    }
  }

  // Devolver el total de horas o el texto correspondiente
  return output;
}

/*getColor(fecha: Date, tipoGuardia: TipoGuardia): string {
  let fechaMoment = moment(fecha);
  if (fechaMoment.isSame(moment(this.data.fechaIngreso), 'day')) {
    // Verificar que tipoGuardia está definido y tiene una propiedad 'id'
    if (tipoGuardia && tipoGuardia.id) {
      return tipoGuardia.id === 1 ? '#91A8DA' : tipoGuardia.id === 2 ? '#F4AF88' : '';
    }
  }
  return '';
}*/

/* calculateHoursForDate(registroActividades: RegistroActividad[], date: Date): string {
  console.log('Fecha proporcionada:', date);
  let output = '';
  const mesDeInteres = 0; // Enero es 0 en JavaScript Date
  const anioDeInteres = 2024;

  // Buscar un registro que coincida con la fecha proporcionada y que esté dentro del mes y año de interés
  const registro = registroActividades.find((actividad) => {
    const ingresoDate = moment(actividad.fechaIngreso);
    return ingresoDate.isSame(date, 'day') &&
           ingresoDate.month() === mesDeInteres &&
           ingresoDate.year() === anioDeInteres;
  });

  // Si no hay registro, retornar celda vacía
  if (!registro) {
    return '';
  }

  // Si hay fecha de ingreso pero no de egreso, retornar 'Sin egreso'
  if (registro.fechaIngreso && !registro.fechaEgreso) {
    return 'Sin egreso';
  }

  // Si hay fechas de ingreso y egreso, calcular las horas
  if (registro.fechaIngreso && registro.fechaEgreso) {
    const hoursIn = moment(registro.horaIngreso, 'HH:mm:ss');
    const hoursOut = moment(registro.horaEgreso, 'HH:mm:ss');

    console.log('#######  ingreso: '+ hoursIn);

    // Asegurarse de que las horas de ingreso y egreso son válidas
    if (hoursIn.isValid() && hoursOut.isValid()) {
      const diffHours = hoursOut.diff(hoursIn, 'hours', true);
      // Verificar que la diferencia de horas no sea cero
      if (diffHours > 0) {
        output = `${diffHours.toFixed(2)} hrs`; // Redondear a dos decimales
      } else {
        output = '0.00 hrs'; // Si la diferencia es cero, mostrar 0.00 hrs
      }
    } else {
      output = 'Datos inválidos'; // Si las horas no son válidas, mostrar mensaje de error
    }
  }

  // Devolver el total de horas o el texto correspondiente
  return output;
} */

/*calculateHoursForDate(registroActividades: RegistroActividad[], date: Date): number {
  let totalHours = 0;
  
  // Iterar sobre los registros de actividad
  for (let i = 0; i < registroActividades.length; i++) {
    const registro = registroActividades[i];
    const ingresoDate = new Date(registro.fechaIngreso);
    console.log('########## fecha date ' +  date.toDateString());
    console.log('########## fecha ingr ' + ingresoDate.toDateString());
    
    // Verificar si la fecha de ingreso coincide con la fecha proporcionada
    if (
      ingresoDate.toDateString() === date.toDateString() // Comparar las fechas como cadenas de texto en el mismo formato
    ) {
      const hoursIn = moment(registro.horaIngreso, 'HH:mm:ss');
      const hoursOut = moment(registro.horaEgreso, 'HH:mm:ss');
      const diffHours = hoursOut.diff(hoursIn, 'hours', true);
      totalHours += diffHours;
      
      // Si se encuentra un registro que coincide con la fecha, se detiene el bucle
      break;
    }
  }

  // Devolver el total de horas
  return totalHours;
}*/

  /* applyFilter(filterValue: string) {
    const normalizeText = (text: string) => {
      return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };
  
    const normalizedFilterValue = normalizeText(filterValue);
  
    this.dataSource.filterPredicate = (data: RegistroActividad, filter: string) => {
      const dataStr = normalizeText(
        data.asistencial?.nombre + ' ' +
        data.asistencial?.apellido + ' ' +
        data.asistencial?.cuil
      );
      return dataStr.indexOf(normalizedFilterValue) !== -1;
    };
  
    this.dataSource.filter = normalizedFilterValue;
  } */


  /*abrirCalendarioDialog(registro: RegistroActividad) {
    const dialogRef = this.dialog.open(DdjjCargoyagrupCalendarComponent, {
      width: '700px',
      data: {
        fechaIngreso: registro.fechaIngreso,
        horaIngreso: registro.horaIngreso,
        fechaEgreso: registro.fechaEgreso,
        horaEgreso: registro.horaEgreso,
        nombreAsistencial: registro.asistencial.nombre,
        apellidoAsistencial: registro.asistencial.apellido,
        tipoGuardia: registro.tipoGuardia.id
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró');
    });
  }*/

  /* getLegajoActualId(asistencial: Asistencial): number | undefined {
    const legajoActual = asistencial.legajos.find(legajo => legajo.actual);
    return legajoActual ? legajoActual.id : undefined;
  }  

  getTipoRevistaActual(asistencial: Asistencial): string | undefined {
    const legajoActual = asistencial.legajos.find(legajo => legajo.actual);
    return legajoActual ? legajoActual.revista.tipoRevista.nombre : undefined;
  }

  getCategoriaYAdicionalActual(asistencial: Asistencial): string | undefined {
    const legajoActual = asistencial.legajos.find(legajo => legajo.actual);
    if (legajoActual && legajoActual.revista) {
      const categoria = legajoActual.revista.categoria.nombre;
      const adicional = legajoActual.revista.adicional.nombre;
      return categoria +"("+ adicional+")";
    }
    return undefined;
  }

  getNovedadActualDescripcion(asistencial: Asistencial): string | undefined {
    const novedadActual = asistencial.novedadesPersonales.find(novedad => novedad.actual);
    return novedadActual ? novedadActual.descripcion : undefined;
  } */

  /*  today:number = new Date(2023,7,0).getDate();//31
  numberOfMonth: Array<number> = new Array<number>();

  daysOfMonth: Array<Date> = new Array<Date>(); 
  
  constructor(
    public dialogReg: MatDialog,
  ){
    for (var dia = 1; dia <= this.today; dia++) {
      this.numberOfMonth.push(dia);
    }

    for (var di = 1; di <= this.numberOfMonth.length; di++) {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const especificDate = new Date (year,month,di)
      this.daysOfMonth.push(especificDate);
      
    }
  }
  openPopupCalendario(){
    this.dialogReg.open(PopupCalendarioComponent, {
      width: '600px',
      disableClose: true,
    })
  }

  /* today:number = new Date(2023,9,0).getDate();
  dia:number = new Date().getDay();
  numberOfMonth: Array<number> = new Array<number>();
  daysOfMonth: Array<string> = new Array<string>(); */
  /*   constructor(){
      for(let i=1;i<= this.today; i++)
      {
        this.numberOfMonth.push(i)
      } */
  /* 
      for(let i=1;i<= this.today; i++)
      {
        this.numberOfMonth.push(i)
      } */
}
