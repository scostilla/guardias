import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Ministerio } from 'src/app/models/Ministerio';
import { MinisterioService } from 'src/app/services/ministerio.service';
import { MinisterioEditComponent } from '../ministerio-edit/ministerio-edit.component';
import { MinisterioDetailComponent } from '../ministerio-detail/ministerio-detail.component'; 

@Component({
  selector: 'app-ministerio',
  templateUrl: './ministerio.component.html',
  styleUrls: ['./ministerio.component.css']
})

export class MinisterioComponent implements OnInit, OnDestroy {

  localidadVisible: boolean = false;
  regionVisible: boolean = false;
  idCabeceraVisible: boolean = false;
  idAutoridadVisible: boolean = false;

  @ViewChild(MatTable) table!: MatTable<Ministerio>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<MinisterioDetailComponent>;
  displayedColumns: string[] = ['id', 'nombre', 'domicilio', 'estado', 'telefono', 'localidad', 'region', 'idCabecera', 'idAutoridad', 'acciones'];
  dataSource!: MatTableDataSource<Ministerio>;
  suscription!: Subscription;
  panelOpenState = false;

  constructor(
    private ministerioService: MinisterioService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private paginatorIntl: MatPaginatorIntl
  ) { 
    this.paginatorIntl.itemsPerPageLabel = "Registros por página";
    this.paginatorIntl.nextPageLabel = "Siguiente";
    this.paginatorIntl.previousPageLabel = "Anterior";
    this.paginatorIntl.firstPageLabel = "Primera página";
    this.paginatorIntl.lastPageLabel = "Última página";
    this.paginatorIntl.getRangeLabel = (page, size, length) => {
      const start = page * size + 1;
      const end = Math.min((page + 1) * size, length);
      return `${start} - ${end} de ${length}`; };
  }

  ngOnInit(): void {
    this.listMinisterio();

    this.suscription = this.ministerioService.refresh$.subscribe(() => {
      this.listMinisterio();
    })

    this.actualizarColumnasVisibles();
  }

  listMinisterio(): void {
    this.ministerioService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
      this.suscription?.unsubscribe();
  }

actualizarColumnasVisibles(): void {
  let columnasBase = ['id', 'nombre', 'domicilio', 'telefono', 'estado', 'acciones'];

  let columnasVisibles: string[] = [];

  columnasBase.forEach(columna => {
    columnasVisibles.push(columna);
    if (columna === 'telefono' && this.localidadVisible) {
      columnasVisibles.push('localidad');
    }
    if (columna === 'telefono' && this.regionVisible) {
      columnasVisibles.push('region');
    }
    if (columna === 'telefono' && this.idCabeceraVisible) {
      columnasVisibles.push('idCabecera');
    }
    if (columna === 'telefono' && this.idAutoridadVisible) {
      columnasVisibles.push('idAutoridad');
    }
  });

  this.displayedColumns = columnasVisibles;

  if (this.table) {
    this.table.renderRows();
  }
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
    this.dataSource.filterPredicate = (data: Ministerio, filter: string) => {
      const nombre = this.accentFilter(data.nombre.toLowerCase());
      const domicilio = this.accentFilter(data.domicilio.toLowerCase());
      const localidad = this.accentFilter(data.localidad.nombre.toLowerCase());
      const region = this.accentFilter(data.region.nombre.toLowerCase());
      const estado = data.estado ? 'si' : 'no';
      filter = this.accentFilter(filter.toLowerCase());
      return nombre.includes(filter) || localidad.includes(filter) || region.includes(filter) || estado.includes(filter);
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openFormChanges(ministerio?: Ministerio): void {
    const esEdicion = ministerio != null;
    const dialogRef = this.dialog.open(MinisterioEditComponent, {
      width: '600px',
      data: esEdicion ? ministerio : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      if (result) {
        this.toastr.success(esEdicion ? 'Ministerio editado con éxito' : 'Ministerio creado con éxito', 'EXITO', {
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
        this.toastr.error('Ocurrió un error al crear o editar el ministerio', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }
    });
  }

  openDetail(ministerio: Ministerio): void {
    this.dialogRef = this.dialog.open(MinisterioDetailComponent, { 
      width: '600px',
      data: ministerio
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
    }

  deleteMinisterio(ministerio: Ministerio): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + ministerio.nombre,
        title: 'Eliminar',
      },
    });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.ministerioService.delete(ministerio.id!).subscribe(data => {
        this.toastr.success('Ministerio eliminado con éxito', 'ELIMINADO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

        const index = this.dataSource.data.findIndex(p => p.id === ministerio.id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }, err => {
        this.toastr.error(err.message, 'Error, no se pudo eliminar el ministerio', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      });
    }
  });
}
}