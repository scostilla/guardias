import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Adicional } from "src/app/models/Configuracion/Adicional";
import { AdicionalService } from 'src/app/services/Configuracion/adicional.service';
import { AdicionalCreateComponent } from '../adicional-create/adicional-create.component';
@Component({
  selector: 'app-adicional-edit',
  templateUrl: './adicional-edit.component.html',
  styleUrls: ['./adicional-edit.component.css']
})
export class AdicionalEditComponent implements OnInit, OnDestroy{
  @ViewChild(MatTable) table!: MatTable<Adicional>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  displayedColumns: string[] = ['nombre', 'acciones'];
  dataSource!: MatTableDataSource<Adicional>;
  subscription!: Subscription;

  constructor(
    private adicionalService: AdicionalService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<AdicionalEditComponent>,
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
   /*  this.listAdicional();

    this.subscription = this.adicionalService.refresh$.subscribe(() => {
      this.listAdicional();
    }); */
  }
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.listAdicional();
  
      this.subscription = this.adicionalService.refresh$.subscribe(() => {
        this.listAdicional();
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  listAdicional(): void {
    this.adicionalService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openCreate(): void {
    const createdialogRef = this.dialog.open(AdicionalCreateComponent, {
      width: '500px',
    });

    createdialogRef.afterClosed().subscribe(result => {
      if (result) {
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: '¿Está seguro de que desea crear un nuevo adicional?',
            title: 'Confirmar Creación'
      }
    });

confirmDialogRef.afterClosed().subscribe(confirmResult => {
  if (confirmResult) {
    this.adicionalService.save(result).subscribe(
      response => {
        this.toastr.success('Adicional creado correctamente', 'Éxito', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.adicionalService.refresh$.next();
        },
      error => {
        this.toastr.error('Error al crear el adicional', 'Error',{
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

openEdit(adicional: Adicional): void {
  const editDialogRef = this.dialog.open(AdicionalCreateComponent, {
    width: '500px',
    data: { ...adicional }
  });

  editDialogRef.afterClosed().subscribe(result => {
    if (result ) {
      const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: '¿Está seguro de que desea editar el adicional?',
          title: 'Confirmar Edición'
        }
      });

      confirmDialogRef.afterClosed().subscribe(confirmResult => {
        if (confirmResult) {
          if (adicional.id !== undefined) {
          this.adicionalService.update(adicional.id, result).subscribe(
            response => {
              this.toastr.success('Adicional actualizado exitosamente', 'Éxito',{
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
              this.adicionalService.refresh$.next();
            },
            error => {
              this.toastr.error('Error al actualizar el adicional', 'Error', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
            });
          }
          );
        }else{
          this.toastr.error('Edición Cancelada', 'Cancelado', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
      }else{
        this.toastr.error('Edición Cancelada', 'Cancelado', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    });
}else {
  this.toastr.error('Edición Cancelada', 'Cancelado', {
    timeOut: 6000,
    positionClass: 'toast-top-center',
    progressBar: true
  });
}
  });
}

delete(adicional: Adicional): void {
  if (adicional.id === undefined) {
    this.toastr.error('El adicional no se puede eliminar', 'Error');
    return;
  }

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      message: 'Confirma la eliminación de "' + adicional.nombre + '"',
      title: 'Eliminar'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.adicionalService.delete(adicional.id!).subscribe(
        response => {
          this.toastr.success('Adicional eliminado correctamente', 'Éxito', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.adicionalService.refresh$.next();
        },
        error => {
          this.toastr.error('Error al eliminar el adicional', 'Error', {
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

cerrar (): void {
  this.dialogRef.close();
}
}