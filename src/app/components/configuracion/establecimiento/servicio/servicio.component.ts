import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { Servicio } from "src/app/models/Configuracion/Servicio";
import { ServicioService } from "src/app/services/Configuracion/servicio.service";
import { ServicioDetailComponent } from '../servicio-detail/servicio-detail.component';
import { ServicioEditComponent } from '../servicio-edit/servicio-edit.component';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.css']
})
export class ServicioComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<Servicio>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<ServicioDetailComponent>;
  displayedColumns: string[] = ['descripcion', 'nivel', 'critico', 'acciones'];
  dataSource!: MatTableDataSource<Servicio>;
  suscription!: Subscription;

  constructor(
    private servicioService: ServicioService,
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
    this.listServicios();

    this.suscription = this.servicioService.refresh$.subscribe(() => {
      this.listServicios();
    })
  }

  listServicios(): void {
    this.servicioService.list().subscribe(data => {
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
      this.dataSource.filterPredicate = (data: Servicio, filter: string) => {
        return this.accentFilter(data.descripcion.toLowerCase()).includes(this.accentFilter(filter)) ||
         this.accentFilter(String(data.nivel).toLowerCase()).includes(this.accentFilter(filter));
      };
    }

    openFormChanges(servicio?: Servicio): void {
        const esEdicion = servicio != null;
        const dialogRef = this.dialog.open(ServicioEditComponent, {
          width: '600px',
          data: esEdicion ? servicio : null
        });
      
        dialogRef.afterClosed().subscribe(result => {
          // result expected: { type: 'save'|'error'|'cancel', data?: any }
          if (!result) {
            return; // cerrado sin acción
          }
  
          if (result.type === 'save') {
            // Recargar la lista desde el servidor para asegurar consistencia (paginador/orden)
            this.listServicios();
            this.toastr.success(esEdicion ? 'Servicio editado con éxito' : 'Servicio creado con éxito', 'EXITO', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
          } else if (result.type === 'error') {
            this.toastr.error('Ocurrió un error al crear o editar el servicio', 'Error', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
          }
          // si type === 'cancel' no hacemos nada
        });
      }

      openDetail(servicio: Servicio): void {
        // 🔥 OBTENER DATOS FRESCOS DEL SERVIDOR
        this.servicioService.getById(servicio.id!).subscribe(
          (servicioActualizado) => {
            console.log('🔄 Datos actualizados del servicio:', servicioActualizado);

            this.dialogRef = this.dialog.open(ServicioDetailComponent, { 
              width: '600px',
              data: servicioActualizado // 🔥 USAR DATOS FRESCOS
            });
            
            this.dialogRef.afterClosed().subscribe(() => {
              this.dialogRef.close();
            });
          },
          (error) => {
            console.error('❌ Error al obtener datos actualizados:', error);
            // Fallback: usar datos originales
            this.dialogRef = this.dialog.open(ServicioDetailComponent, { 
              width: '600px',
              data: servicio
            });
            
            this.dialogRef.afterClosed().subscribe(() => {
              this.dialogRef.close();
            });
          }
        );
      }

      deleteServicio(servicio: Servicio): void {
          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
              message: 'Confirma la eliminación de ' + servicio.descripcion,
              title: 'Eliminar',
            },
          });
      
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.servicioService.delete(servicio.id!).subscribe(data => {
              this.toastr.success('Servicio eliminado con éxito', 'ELIMINADO', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });

              const index = this.dataSource.data.findIndex(p => p.id === servicio.id);
              this.dataSource.data.splice(index, 1);
              this.dataSource._updateChangeSubscription();
            }, err => {
              this.toastr.error(err.message, 'Error, no se pudo eliminar el servicio', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
            });
          }
        });
      }
}
