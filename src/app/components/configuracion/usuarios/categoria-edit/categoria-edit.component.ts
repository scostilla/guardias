import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Categoria } from 'src/app/models/Configuracion/Categoria';
import { CategoriaService } from 'src/app/services/Configuracion/categoria.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { CategoriaCreateComponent } from '../categoria-create/categoria-create.component';

@Component({
  selector: 'app-categoria-edit',
  templateUrl: './categoria-edit.component.html',
  styleUrls: ['./categoria-edit.component.css']
})
export class CategoriaEditComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) table!: MatTable<Categoria>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['nombre', 'acciones'];
  dataSource!: MatTableDataSource<Categoria>;
  private subscription!: Subscription;

  constructor(
    private categoriaService: CategoriaService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CategoriaEditComponent>,
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
     /*  this.listCategoria();

      this.subscription = this.categoriaService.refresh$.subscribe(() => {
      this.listCategoria();
    });  */   
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.listCategoria();
  
      this.subscription = this.categoriaService.refresh$.subscribe(() => {
        this.listCategoria();
      }); 
    });
  }

  listCategoria(): void {
    this.categoriaService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cd.detectChanges(); // Forzar la detección de cambios
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
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
    this.dataSource.filterPredicate = (data: Categoria, filter: string) => {
      return this.accentFilter(data.nombre.toLowerCase()).includes(this.accentFilter(filter));
    };
  }

  openCreate(): void {
    const createDialogRef = this.dialog.open(CategoriaCreateComponent, {
      width: '500px'
    });

    createDialogRef.afterClosed().subscribe(result => {
      if (result) {
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: '¿Estás seguro que deseas crear una nueva categoría?',
            title: 'Confirmar Creación',
          }
        });

        confirmDialogRef.afterClosed().subscribe(confirmResult => {
          if (confirmResult) {
            this.categoriaService.save(result).subscribe(
              response => {
                this.toastr.success('Categoría creada exitosamente', 'Éxito', {
                  timeOut: 6000,
                  positionClass: 'toast-top-center',
                  progressBar: true
                });
                this.categoriaService.refresh$.next(); // Emitir evento de actualización
              },
              error => {
                this.toastr.error('Error al crear la categoría', 'Error', {
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

  openEdit(categoria: Categoria): void {
    const editDialogRef = this.dialog.open(CategoriaCreateComponent, {
      width: '500px',
      data: { ...categoria }
    });

    editDialogRef.afterClosed().subscribe(result => {
      if (result) {
        const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            message: '¿Estás seguro de que deseas guardar los cambios en esta categoría?',
            title: 'Confirmar Modificación',
          }
        });

        confirmDialogRef.afterClosed().subscribe(confirmResult => {
          if (confirmResult) {
            if (categoria.id !== undefined) {
              this.categoriaService.update(categoria.id, result).subscribe(
                response => {
                  this.toastr.success('Categoría actualizada exitosamente', 'Éxito', {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                  });
                  this.categoriaService.refresh$.next(); // Emitir evento de actualización
                },
                error => {
                  this.toastr.error('Error al actualizar la categoría', 'Error', {
                    timeOut: 6000,
                    positionClass: 'toast-top-center',
                    progressBar: true
                  });
                }
              );
            } else {
              this.toastr.error('ID de categoría no disponible', 'Error', {
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

  delete(categoria: Categoria): void {
    if (categoria.id === undefined) {
      this.toastr.error('No se puede eliminar una categoría sin ID', 'Error');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de "' + categoria.nombre + '"',
        title: 'Eliminar',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoriaService.delete(categoria.id!).subscribe(
          response => {
            this.toastr.success('Categoría eliminada exitosamente', 'Éxito', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            this.categoriaService.refresh$.next(); 
          },
          error => {
            if (error.status === 400 && error.error &&error.error.mensaje === 'No se puede eliminar la categoría porque está en uso') {
              this.toastr.error('La Categoria no puede ser eliminada, tiene Revistas asociadas.', 'Error', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
            } else {
            this.toastr.error('Error al eliminar la categoría', 'Error', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
              });
            }
          }
        );
      } else {
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