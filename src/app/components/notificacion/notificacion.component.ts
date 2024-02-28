import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Notificacion } from 'src/app/models/Notificacion';
import { NotificacionService } from 'src/app/services/notificacion.service';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataSharingService } from 'src/app/services/DataSharing/data-sharing.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { NotificacionEditComponent } from '../notificacion/notificacion-edit/notificacion-edit.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


export interface UserData {
  id: number;
  categoria: string;
  detalle: string;
  fechanotificacion: Date;
  posicion: number;
  tipo: string;
  url: string;
}


@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})

export class NotificacionComponent implements OnInit, AfterViewInit {

  notificaciones: Notificacion[] = [];
  displayedColumns: string[] = ['id', 'categoria', 'detalle', 'fechanotificacion', 'posicion', 'tipo', 'url', 'actions'];
  dataSource: MatTableDataSource<UserData>;
  suscription?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private notificacionService: NotificacionService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public dialogNew: MatDialog,
    public dialogEdit: MatDialog,
    public dialogDetail: MatDialog,
    private http: HttpClient,
    private paginatorLabels: MatPaginatorIntl,
    private dataSharingService: DataSharingService,
    private router: Router,
    ) {
    paginatorLabels.itemsPerPageLabel = 'Items por pagina';
    paginatorLabels.firstPageLabel = 'Primera Pagina';
    paginatorLabels.nextPageLabel = 'Siguiente';
    paginatorLabels.previousPageLabel = 'Anterior';
      this.dataSource = new MatTableDataSource<UserData>([]);
    }

  ngOnInit() {
    this.cargarNotificaciones();

    this.suscription = this.notificacionService.refresh$.subscribe(() => {
      this.cargarNotificaciones();
    })
  }

  ngOnDestroy(): void{
    this.suscription?.unsubscribe();
    console.log('Observable cerrado');
  }
  
  get<T>(arg0: any) {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarNotificaciones(): void {
    this.notificacionService.list().subscribe(
      (data: Notificacion[]) => {
        const userDataArray: UserData[] = data.map(notificacion => ({
          id: notificacion.id || 0,
          categoria: notificacion.categoria || '',
          detalle: notificacion.detalle || '',
          fechanotificacion: notificacion.fechanotificacion || new Date(),
          posicion: notificacion.posicion || 0,
          tipo: notificacion.tipo || '',
          url: notificacion.url || '',
        }));

        this.dataSource.data = userDataArray;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(NotificacionComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  borrar(id: number, nombre: string) {
    this.dialog
    .open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + nombre,
        title: 'Eliminar',
      },
    })
    .afterClosed()
    .subscribe((confirm: Boolean) => {
      if (confirm) {

    this.notificacionService.delete(id).subscribe(
      data=> {
        this.toastr.success('notificacion eliminado', 'OK', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
        this.cargarNotificaciones();
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
      }
    );
  } else {
    this.dialog.closeAll();
  }
});
  }

  addNewNotificacion() {
    this.dialogNew.open(NotificacionEditComponent, {
      width: '600px',
      disableClose: true,
    });

  }


  addEditNotificacion(id: number) {
    const dialogEdit = this.dialog.open(NotificacionEditComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogEdit.afterClosed().subscribe((result) => {
      console.log("linea 167: "+this.dataSharingService.getNotificacionFormData());
      this.dataSource.data.push(this.dataSharingService.getNotificacionFormData());
      console.log("id recibido: "+this.dataSharingService.getNotificacionId());
    });
  }

}
