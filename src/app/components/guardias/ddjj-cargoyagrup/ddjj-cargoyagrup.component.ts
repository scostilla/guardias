import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DdjjCargoyagrupCalendarComponent } from '../ddjj-cargoyagrup-calendar/ddjj-cargoyagrup-calendar.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatPaginator, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { RegistroActividad } from 'src/app/models/RegistroActividad';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { Router } from '@angular/router';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { RegistroMensual } from 'src/app/models/RegistroMensual';
import { RegistroMensualService } from 'src/app/services/registroMensual.service';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';



@Component({
  selector: 'app-ddjj-cargoyagrup',
  templateUrl: './ddjj-cargoyagrup.component.html',
  styleUrls: ['./ddjj-cargoyagrup.component.css']
})

export class DdjjCargoyagrupComponent implements OnInit, OnDestroy {


  @ViewChild(MatTable) table!: MatTable<RegistroMensual>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['asistencial', 'cuil', 'servicio', 'vinculo', 'categoria', 'fechaIngreso', 'fechaEgreso', 'NovedadPersonal', 'acciones'];
  dataSource!: MatTableDataSource<RegistroActividad>;
  suscription!: Subscription;
  registroActividad!: RegistroActividad;
  registros!: any[];

  constructor(
    private registroMensualService: RegistroMensualService,
    private asistencialService: AsistencialService,

    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
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

    this.listRegistroMensual();

    this.suscription = this.registroMensualService.refresh$.subscribe(() => {
      this.listRegistroMensual();
    })

  }

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
        
  /*listRegistroMensual(): void {
    const anio = 2024; // Año fijo
    const mes = 'ENERO'; // Mes fijo
    const idEfector = 1; // ID de efector fijo

    this.registroMensualService.listByYearMonthAndEfector(anio,mes,idEfector).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }*/

  listRegistroMensual(): void {
    const anio = 2024; // Año fijo
    const mes = 'ENERO'; // Mes fijo
    const idEfector = 1; // ID de efector fijo
  
    this.registroMensualService.listByYearMonthAndEfector(anio, mes, idEfector).subscribe(data => {
      const asistencialesUnicos = new Map<number, RegistroActividad>();
  
      data.forEach(registroMensual => {
        registroMensual.registroActividad.forEach(registroActividad => {
          if (registroActividad.asistencial.id !== undefined) {
            if (!asistencialesUnicos.has(registroActividad.asistencial.id)) {
              asistencialesUnicos.set(registroActividad.asistencial.id, registroActividad);
            }
          }
        });
      });
  
      const registrosUnicos = Array.from(asistencialesUnicos.values());
  
      this.dataSource = new MatTableDataSource(registrosUnicos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  getNombreAsistencial(idAsistencial: number): string {
    
    let nombreAsistencial = ""; // Valor predeterminado

    this.asistencialService.detail(idAsistencial).subscribe((asistencial: Asistencial) => {
      nombreAsistencial = `${asistencial.nombre} ${asistencial.apellido}`; 
    }, error => {
      console.error("Error al recuperar el asistencial:", error);
    });

    return nombreAsistencial;
  }

  ngOnDestroy(): void {
      this.suscription?.unsubscribe();
  }

  abrirCalendarioDialog(registro: RegistroActividad) {
    const dialogRef = this.dialog.open(DdjjCargoyagrupCalendarComponent, {
      width: '700px',
      data: {
        nombreAsistencial: registro.asistencial.nombre,
        apellidoAsistencial: registro.asistencial.apellido,
        fechaIngreso: registro.fechaIngreso,
        horaIngreso: registro.horaIngreso,
        fechaEgreso: registro.fechaEgreso,
        horaEgreso: registro.horaEgreso,
        tipoGuardia: registro.tipoGuardia.id
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró');
    });
  }

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
