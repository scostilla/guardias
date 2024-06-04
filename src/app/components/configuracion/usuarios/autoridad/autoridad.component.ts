import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Autoridad } from 'src/app/models/Configuracion/Autoridad';
import { AutoridadDetailComponent } from '../autoridad-detail/autoridad-detail.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AutoridadService } from 'src/app/services/Configuracion/autoridad.service';
import { ToastrService } from 'ngx-toastr';
import { AutoridadEditComponent } from '../autoridad-edit/autoridad-edit.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-autoridad',
  templateUrl: './autoridad.component.html',
  styleUrls: ['./autoridad.component.css']
})
export class AutoridadComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<Autoridad>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<AutoridadDetailComponent>;
  displayedColumns: string[] = ['persona', 'nombre', 'fechaInicio', 'fichaFinal', 'esActual', 'esRegional', 'efector', /* 'fechaFinal',  'matriculaNacional', 'matriculaProvincial', 'cargo', */ 'acciones'];
  dataSource!: MatTableDataSource<Autoridad>;
  suscription!: Subscription;

  constructor(
    private autoridadService: AutoridadService,
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
      return `${start} - ${end} de ${length}`;
    };
  }

  ngOnInit(): void {
    this.listAutoridades();
    this.suscription = this.autoridadService.refresh$.subscribe(() => {
      this.listAutoridades();
    })
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    const normalizeText = (text: string) => {
      return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    this.dataSource.filterPredicate = (data: Autoridad, filter: string) => {
      /*  const actualValue = data.actual ? 'sí' : 'no';
       const legalValue = data.legal ? 'sí' : 'no'; */

      const fechaInicioTimestamp = data.fechaInicio ? new Date(data.fechaInicio).getTime() : null;

      const dataStr = normalizeText(
        data.persona?.nombre.toLowerCase() + ' ' +
        data.persona?.apellido.toLowerCase() + ' ' +
        data.efector?.nombre.toLowerCase()
        //actualValue + ' ' + legalValue
      );

      const normalizedFilter = normalizeText(filter);

      const filterDate = normalizedFilter.split('/').reverse().join('-');
      const filterTimestamp = Date.parse(filterDate);

      if (!isNaN(filterTimestamp)) {
        return fechaInicioTimestamp === filterTimestamp;
      }

      return dataStr.indexOf(normalizedFilter) != -1;
    };

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  listAutoridades(): void {
    this.autoridadService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

  openFormChanges(autoridad?: Autoridad): void {
    const esEdicion = autoridad != null;
    const dialogRef = this.dialog.open(AutoridadEditComponent, {
      width: '600px',
      data: esEdicion ? autoridad : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result) {
          this.toastr.success(esEdicion ? 'Autoridad editada con éxito' : 'Autoridad creada con éxito', 'EXITO', {
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
          this.toastr.error('Ocurrió un error al crear o editar la autoridad', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
      }
    });
  }

  openDetail(autoridad: Autoridad): void {
    this.dialogRef = this.dialog.open(AutoridadDetailComponent, {
      width: '600px',
      data: autoridad
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
  }

  deleteAutoridad(autoridad: Autoridad): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de '+ autoridad.persona?.apellido +' ' + autoridad.persona?.nombre,
        title: 'Eliminar',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.autoridadService.delete(autoridad.id!).subscribe(data => {
          this.toastr.success('Autoridad eliminada con éxito', 'ELIMINADO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
  
          const index = this.dataSource.data.findIndex(p => p.id === autoridad.id);
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
        }, err => {
          this.toastr.error(err.message, 'Error, no se pudo eliminar la autoridad', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        });
      }
    });
  }
}
