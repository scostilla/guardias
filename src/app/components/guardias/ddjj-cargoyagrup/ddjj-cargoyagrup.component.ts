import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DdjjCargoyagrupCalendarComponent } from '../ddjj-cargoyagrup-calendar/ddjj-cargoyagrup-calendar.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatPaginator, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { RegistroActividad } from 'src/app/models/RegistroActividad';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import * as moment from 'moment';



@Component({
  selector: 'app-ddjj-cargoyagrup',
  templateUrl: './ddjj-cargoyagrup.component.html',
  styleUrls: ['./ddjj-cargoyagrup.component.css']
})

export class DdjjCargoyagrupComponent implements OnInit, OnDestroy {

  positionOptions: TooltipPosition[] = ['after', 'before', 'above', 'below', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);
  diasEnMes: moment.Moment[] = [];

  @ViewChild(MatTable) table!: MatTable<RegistroActividad>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['asistencial', 'acciones'];
  dataSource!: MatTableDataSource<RegistroActividad>;
  suscription!: Subscription;
  registroActividad!: RegistroActividad;
  dialogRef!: MatDialogRef<DdjjCargoyagrupCalendarComponent>;


  constructor(
    private registroActividadService: RegistroActividadService,
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
      return `${start} - ${end} de ${length}`; };
     }

  ngOnInit(): void {
    this.generarDiasDelMes();

    this.listRegistroActividad();

    this.suscription = this.registroActividadService.refresh$.subscribe(() => {
      this.listRegistroActividad();
    })

  }

  applyFilter(filterValue: string) {
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
  }
        
  listRegistroActividad(): void {
    this.registroActividadService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  ngOnDestroy(): void {
      this.suscription?.unsubscribe();
  }

  generarDiasDelMes(): void {
    const startOfMonth = moment([2024, 4, 1]); // Mayo 2024
    const endOfMonth = startOfMonth.clone().endOf('month');
    let day = startOfMonth;

    while(day <= endOfMonth) {
      this.displayedColumns.push(day.format('YYYY_MM_DD'));
      day.add(1, 'day');
    }
  }

  getFechaFromColumnId(columnId: string): Date {
    return moment(columnId, 'YYYY_MM_DD').toDate();
  }

  openDetail(registroActividad: RegistroActividad): void {
    this.dialogRef = this.dialog.open(DdjjCargoyagrupCalendarComponent, { 
      width: '600px',
      data: registroActividad
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
    }


   /*calcularTotalHoras(fecha: moment.Moment, data: RegistroActividad): string {
    if (data.fechaEgreso && data.horaEgreso) {
      const inicio = moment(data.fechaIngreso + 'T' + data.horaIngreso);
      const fin = moment(data.fechaEgreso + 'T' + data.horaEgreso);
      const duracion = fin.diff(inicio, 'hours', true);
  
      return Math.round(duracion).toString();
    } else {
      return "Falta Egreso";
    }
  }

 getColor(fecha: moment.Moment, data: RegistroActividad): string {
    if (fecha.isSame(data.fechaIngreso, 'day')) {
      return data.tipoGuardia === 1 ? '#91A8DA' : data.tipoGuardia === 2 ? '#F4AF88' : '';
    }
    return '';
  }*/


  abrirCalendarioDialog(registro: RegistroActividad) {
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
  }

  getLegajoActualId(asistencial: Asistencial): number | undefined {
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
  }

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
