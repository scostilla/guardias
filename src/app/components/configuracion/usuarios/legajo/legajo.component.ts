import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatPaginator, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { LegajoEditComponent } from '../legajo-edit/legajo-edit.component';
import { LegajoDetailComponent } from '../legajo-detail/legajo-detail.component'; 

@Component({
  selector: 'app-legajo',
  templateUrl: './legajo.component.html',
  styleUrls: ['./legajo.component.css']
})

export class LegajoComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<Legajo>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<LegajoDetailComponent>;
  displayedColumns: string[] = ['persona', 'profesion','udo','actual', 'legal', 'fechaInicio',/* 'fechaFinal',  'matriculaNacional', 'matriculaProvincial', 'cargo', */ 'acciones'];
  dataSource!: MatTableDataSource<Legajo>;
  suscription!: Subscription;

  constructor(
    private legajoService: LegajoService,
    private dialog: MatDialog,
    private toastr: ToastrService,
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
    this.listLegajos();

    this.suscription = this.legajoService.refresh$.subscribe(() => {
      this.listLegajos();
    })

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    // Función para normalizar y remover acentos
    const normalizeText = (text: string) => {
      return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };
  
    this.dataSource.filterPredicate = (data: Legajo, filter: string) => {
      // Convertir los valores booleanos a 'sí' o 'no'
      const actualValue = data.actual ? 'sí' : 'no';
      const legalValue = data.legal ? 'sí' : 'no';
  
      // Convertir la fecha de inicio a timestamp para la comparación
      const fechaInicioTimestamp = data.fechaInicio ? new Date(data.fechaInicio).getTime() : null;
  
      // Normalizar los datos para la comparación
      const dataStr = normalizeText(
        data.persona?.nombre.toLowerCase() + ' ' +
        data.persona?.apellido.toLowerCase() + ' ' +
        data.profesion?.nombre.toLowerCase() + ' ' +
        data.udo?.nombre.toLowerCase() + ' ' +
        actualValue + ' ' + legalValue
      );
  
      // Normalizar el valor del filtro
      const normalizedFilter = normalizeText(filter);
  
      // Comprobar si el filtro es una fecha
      const filterDate = normalizedFilter.split('/').reverse().join('-');
      const filterTimestamp = Date.parse(filterDate);
  
      // Si el filtro es un número válido, comparar timestamps
      if (!isNaN(filterTimestamp)) {
        return fechaInicioTimestamp === filterTimestamp;
      }
  
      // Si no es una fecha, realizar la búsqueda normal
      return dataStr.indexOf(normalizedFilter) != -1;
    };
  
    this.dataSource.filter = filterValue;
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  listLegajos(): void {
    this.legajoService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
      this.suscription?.unsubscribe();
  }


  openFormChanges(legajo?: Legajo): void {
    const esEdicion = legajo != null;
    const dialogRef = this.dialog.open(LegajoEditComponent, {
      width: '600px',
      data: esEdicion ? legajo : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      if (result) {
        this.toastr.success(esEdicion ? 'Legajo editado con éxito' : 'Legajo creado con éxito', 'EXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        if (esEdicion) {
          const index = this.dataSource.data.findIndex(p => p.id === result.id);
          this.dataSource.data[index] = result;
        } else {
          this.dataSource.data.push(result);
        }
        this.dataSource._updateChangeSubscription();
      } else {
        this.toastr.error('Ocurrió un error al crear o editar el Legajo', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }
    });
  }

  openDetail(legajo: Legajo): void {
    this.dialogRef = this.dialog.open(LegajoDetailComponent, { 
      width: '600px',
      data: legajo
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
    }

  deleteLegajo(legajo: Legajo): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + legajo.persona?.nombre,
        title: 'Eliminar',
      },
    });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.legajoService.delete(legajo.id!).subscribe(data => {
        this.toastr.success('Legajo eliminado con éxito', 'ELIMINADO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

        const index = this.dataSource.data.findIndex(p => p.id === legajo.id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }, err => {
        this.toastr.error(err.message, 'Error, no se pudo eliminar el legajo', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      });
    }
  });
}
}