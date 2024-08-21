import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { CargaHoraria } from 'src/app/models/Configuracion/CargaHoraria';
import { CargaHorariaService } from 'src/app/services/Configuracion/carga-horaria.service';
import { CargaHorariaCreateComponent } from '../carga-horaria-create/carga-horaria-create.component';

@Component({
  selector: 'app-carga-horaria-edit',
  templateUrl: './carga-horaria-edit.component.html',
  styleUrls: ['./carga-horaria-edit.component.css']
})
export class CargaHorariaEditComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) table!: MatTable<CargaHoraria>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['cantidad', 'acciones'];
  dataSource!: MatTableDataSource<CargaHoraria>;
  subscription!: Subscription;

  constructor(
    private cargaHorariaService: CargaHorariaService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CargaHorariaEditComponent>,
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
   /*  this.listCargaHoraria();

    this.subscription = this.cargaHorariaService.refresh$.subscribe(() => {
      this.listCargaHoraria();
    }); */
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.listCargaHoraria();
  
      this.subscription = this.cargaHorariaService.refresh$.subscribe(() => {
        this.listCargaHoraria();
      });
  });
}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  listCargaHoraria(): void {
    this.cargaHorariaService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openCreate(): void {
    const createDialogRef = this.dialog.open(CargaHorariaCreateComponent, {
      width: '500px',
    });

    createDialogRef.afterClosed().subscribe(result => {
      if (result) {
       const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: '¿Estás seguro de que deseas crear una nueva carga horaria?',
          title: 'Confirmar Creación'
        }
      });

      confirmDialogRef.afterClosed().subscribe(confirmResult => {
        if (confirmResult) {
          this.cargaHorariaService.save(result).subscribe(
            response => {
              this.toastr.success('Carga horaria creada exitosamente', 'Éxito', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
              this.cargaHorariaService.refresh$.next();
            },
            error => {
              this.toastr.error('Error al crear la carga horaria', 'Error', {
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
  
  openEdit(cargaHoraria: CargaHoraria): void {
    const editDialogRef = this.dialog.open(CargaHorariaCreateComponent, {
      width: '500px',
      data: { ...cargaHoraria }
    });

    editDialogRef.afterClosed().subscribe(result => {
      if (result){
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: '¿Estás seguro de que deseas editar la carga horaria?',
            title: 'Confirmar Modificación'
          }
        });

        confirmDialogRef.afterClosed().subscribe(confirmResult => {
          if (confirmResult) {
            if (cargaHoraria.id !== undefined) {
              this.cargaHorariaService.update(cargaHoraria.id, result).subscribe(
                response => {
                  this.toastr.success('Carga horaria actualizada exitosamente', 'Éxito', {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                  });
                  this.cargaHorariaService.refresh$.next();
                },
                error => {
                  this.toastr.error('Error al actualizar la carga horaria', 'Error', {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                  });
                }
              );
            }else{
              this.toastr.error('Error al actualizar la carga horaria', 'Error', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
            }
          } else {
            this.toastr.error('Modificación Cancelada', 'Cancelado', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
          }
        });
      } else {
        this.toastr.error('Modificación Cancelada', 'Cancelado', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    });
  }

  delete(cargaHoraria: CargaHoraria): void {
    if (cargaHoraria.id === undefined) {
      this.toastr.error(' No se puede eliminar la carga Horaria sin ID', 'Error');
      return;
}

const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  data: {
    message: 'Confirmar eliminación de "' + cargaHoraria.cantidad + '"',
    title: 'Eliminar'
  }
});

dialogRef.afterClosed().subscribe(result => {
  if (result) {
    this.cargaHorariaService.delete(cargaHoraria.id!).subscribe(
      response => {
      this.toastr.success('Carga Horaria eliminada exitosamente', 'Éxito', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      this.cargaHorariaService.refresh$.next();
    },
    error => {
      this.toastr.error('Error al eliminar la carga horaria', 'Error', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
    }
  );
}else {
  this.toastr.error('Eliminación Cancelada', 'Cancelado', {
    timeOut: 6000,
    positionClass: 'toast-top-center',
    progressBar: true
  });
}
});
  }

cerrar (): void {
  this.dialogRef.close();
  }
}
