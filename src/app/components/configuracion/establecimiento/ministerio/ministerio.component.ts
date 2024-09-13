import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Ministerio } from 'src/app/models/Configuracion/Ministerio';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { MinisterioEditComponent } from '../ministerio-edit/ministerio-edit.component';
import { MinisterioDetailComponent } from '../ministerio-detail/ministerio-detail.component'; 

@Component({
  selector: 'app-ministerio',
  templateUrl: './ministerio.component.html',
  styleUrls: ['./ministerio.component.css']
})

export class MinisterioComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<Ministerio>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<MinisterioDetailComponent>;
  displayedColumns: string[] = ['nombre', 'domicilio', 'localidad', 'acciones'];
  dataSource!: MatTableDataSource<Ministerio>;
  suscription!: Subscription;

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
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Ministerio, filter: string) => {
      return this.accentFilter(data.nombre.toLowerCase()).includes(this.accentFilter(filter)) ||
       this.accentFilter(data.localidad.nombre.toLowerCase()).includes(this.accentFilter(filter));
    };
  }

  openFormChanges(ministerio?: Ministerio): void {
    const esEdicion = ministerio != null;
    const dialogRef = this.dialog.open(MinisterioEditComponent, {
      width: '600px',
      data: esEdicion ? ministerio : null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.type === 'save') {
          this.toastr.success(esEdicion ? 'Ministerio editado con éxito' : 'Ministerio creado con éxito', 'EXITO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
  
          if (esEdicion) {
            const index = this.dataSource.data.findIndex(p => p.id === result.data.id);
            if (index !== -1) {
              this.dataSource.data[index] = result.data;
            }
          } else {
            this.dataSource.data.push(result.data);
          }
          this.dataSource._updateChangeSubscription();
        } else if (result.type === 'error') {
          this.toastr.error('Ocurrió un error al crear o editar el ministerio', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        } else if (result.type === 'cancel') {
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