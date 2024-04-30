import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Notificacion } from 'src/app/models/Notificacion';
import { NotificacionService } from 'src/app/services/notificacion.service';

import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataSharingService } from 'src/app/services/DataSharing/data-sharing.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NotificacionEditComponent } from '../notificacion/notificacion-edit/notificacion-edit.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { NotificacionDetailComponent } from './notificacion-detail/notificacion-detail.component';


@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})

export class NotificacionComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<NotificacionDetailComponent>;
  displayedColumns: string[] = ['tipo', 'categoria', 'fechaNotificacion', 'detalle', 'url', 'acciones'];
  dataSource!: MatTableDataSource<Notificacion>;
  suscription!: Subscription;
  
  
  constructor(
    private notificacionService: NotificacionService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private paginatorIntl: MatPaginatorIntl,
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

  ngOnInit() {
    this.listNotificacion();

    this.suscription = this.notificacionService.refresh$.subscribe(() => {
      this.listNotificacion();
    })
  }

  listNotificacion(): void {
    this.notificacionService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void{
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
    this.dataSource.filterPredicate = (data: Notificacion, filter: string) => {
      return this.accentFilter(data.tipo.toLowerCase()).includes(this.accentFilter(filter)) || 
      this.accentFilter(data.detalle.toLowerCase()).includes(this.accentFilter(filter)) || 
      this.accentFilter(data.categoria.toLowerCase()).includes(this.accentFilter(filter));
    };
  } 

  openFormChanges(notificacion?: Notificacion): void {
    const esEdicion = notificacion != null;
    const dialogRef = this.dialog.open(NotificacionEditComponent, {
      width: '600px',
      data: esEdicion ? notificacion : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      if (result) {
        this.toastr.success(esEdicion ? 'Notificacion editada con éxito' : 'Provincia creada con éxito', 'EXITO', {
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
        this.toastr.error('Ocurrió un error al crear o editar la notificacion', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }
    });
  }

  openDetail(notificacion: Notificacion): void {
    this.dialogRef = this.dialog.open(NotificacionDetailComponent, { 
      width: '600px',
      data: notificacion
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
    }

  deleteNotificacion(notificacion: Notificacion): void {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          message: 'Confirma la eliminación ',
          title: 'Eliminar',
        },
      });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificacionService.delete(notificacion.id!).subscribe(data => {
          this.toastr.success('Notificacion eliminada con éxito', 'ELIMINADA', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
  
          const index = this.dataSource.data.findIndex(p => p.id === notificacion.id);
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
        }, err => {
          this.toastr.error(err.message, 'Error, no se pudo eliminar la notificacion', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        });
      }
    });
  }

}