import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { TipoRevista } from "src/app/models/Configuracion/TipoRevista";
import { TipoRevistaService } from 'src/app/services/Configuracion/tipo-revista.service';
import { TipoRevistaCreateComponent } from '../tipo-revista-create/tipo-revista-create.component';

@Component({
  selector: 'app-tipo-revista-edit',
  templateUrl: './tipo-revista-edit.component.html',
  styleUrls: ['./tipo-revista-edit.component.css']
})
export class TipoRevistaEditComponent  implements OnInit, OnDestroy{
  @ViewChild(MatTable) table!: MatTable<TipoRevista>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['nombre', 'acciones'];
  dataSource!: MatTableDataSource<TipoRevista>;
  private suscription!: Subscription;

  constructor(
    private tipoRevistaService: TipoRevistaService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<TipoRevistaEditComponent>,
    private toastr: ToastrService,
    private paginatorIntl: MatPaginatorIntl,
    private cd: ChangeDetectorRef
  ) {
    this.paginatorIntl.itemsPerPageLabel = "Registros por página";
    this.paginatorIntl.nextPageLabel = "Siguiente";
    this.paginatorIntl.previousPageLabel = "Anterior";
    this.paginatorIntl.firstPageLabel = "Primera página";
    this.paginatorIntl.lastPageLabel = "Última página";
    this.paginatorIntl.getRangeLabel = (page, size, length) => {
      const start = page * size + 1;
      const end = Math.min((page + 1) * size, length);
      return `${start} - ${end} de ${length}`; 
    };
  }

  ngOnInit(): void {
    /* this.listTipoRevista();

    this.suscription = this.tipoRevistaService.refresh$.subscribe(() => {
      this.listTipoRevista();
    }); */
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.listTipoRevista();

      this.suscription = this.tipoRevistaService.refresh$.subscribe(() => {
        this.listTipoRevista();
      });
    });
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
}

  listTipoRevista(): void {
    this.tipoRevistaService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openCreate(): void {
    const createDialogRef = this.dialog.open(TipoRevistaCreateComponent, {
      width: '500px'
    });

    createDialogRef.afterClosed().subscribe(result => {
      if (result) {
      const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: '¿Estás seguro que deseas crear un nuevo tipo de revista?',
          title: 'Confirmar Creación',
        }
      });

      confirmDialogRef.afterClosed().subscribe(confirmResult => {
        if (confirmResult) {
          this.tipoRevistaService.save(result).subscribe(
            response => {
              this.toastr.success('Tipo de revista creado exitosamente', 'Éxito', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
              this.tipoRevistaService.refresh$.next();
            },
            error => {
              this.toastr.error('Error al crear el tipo revista', 'Error', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
            }
          );
        } else {
          this.toastr.error('Creación Cancelada', 'Cancelado', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
      });
  } else {
    this.toastr.error('Creación Cancelada', 'Cancelado', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
  }
});
  }

  openEdit(tipoRevista: TipoRevista): void {
    const editDialogRef = this.dialog.open(TipoRevistaCreateComponent, {
      width: '500px',
      data: { ...tipoRevista }  
    });
  
    editDialogRef.afterClosed().subscribe(result => {
      if (result) {
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: '¿Estás seguro de que deseas editar el tipo de revista?',
            title: 'Confirmar Modificación'
          }
        });
  
        confirmDialogRef.afterClosed().subscribe(confirmResult => {
          if (confirmResult) {
            if (tipoRevista.id !== undefined) {
            this.tipoRevistaService.update(tipoRevista.id, result).subscribe(
              response => {
                this.toastr.success('Tipo de revista actualizado exitosamente', 'Éxito',{
                  timeOut: 6000,
                  positionClass: 'toast-top-center',
                  progressBar: true
                });
                this.tipoRevistaService.refresh$.next();
              },
              error => {
                this.toastr.error('Error al actualizar tipo de revista', 'Error',{
                  timeOut: 6000,
                  positionClass: 'toast-top-center',
                  progressBar: true
                });
              }
            );
          } else {
            this.toastr.error('ID de tipo de revista no disponible', 'Error',{
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
          }
        } else {
          this.toastr.error('Modificación Cancelada', 'Cancelado',{
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
      });
    }else {
      this.toastr.error('Modificación Cancelada', 'Cancelado',{
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
    }
  });
  }

  delete(tipoRevista: TipoRevista): void {
    if (tipoRevista.id === undefined) {
      this.toastr.error('No se puede eliminar un tipo de revista sin ID', 'Error');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirmar la eliminación de "' + tipoRevista.nombre + '"',
        title: 'Eliminar',
      },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tipoRevistaService.delete(tipoRevista.id!).subscribe(
          response => {
          this.toastr.success('Tipo de revista eliminado con éxito', 'Éxito', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.tipoRevistaService.refresh$.next();
          },
          error => {
            this.toastr.error('Error al eliminar el tipo de revista', 'Error', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
          }
        );
      }else{
        this.toastr.error('Eliminación Cancelada', 'Cancelado', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    });
  }
  
  cerrar(): void {
    this.dialogRef.close();
  }
}
