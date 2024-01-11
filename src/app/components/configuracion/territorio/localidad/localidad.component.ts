import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Localidad } from 'src/app/models/Localidad';
import { LocalidadService } from 'src/app/services/localidad.service';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataSharingService } from 'src/app/services/DataSharing/data-sharing.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { LocalidadDetailComponent } from '../localidad-detail/localidad-detail.component';
import { LocalidadEditComponent } from '../localidad-edit/localidad-edit.component';
import { LocalidadNewComponent } from '../localidad-new/localidad-new.component';


export interface UserData {
  id: number;
  nombre: string;
  id_departamento: number;
  departamento: string;
}


@Component({
  selector: 'app-localidad',
  templateUrl: './localidad.component.html',
  styleUrls: ['./localidad.component.css']
})

export class LocalidadComponent implements OnInit, AfterViewInit {

  localidads: Localidad[] = [];
  router: any;
  displayedColumns: string[] = ['id', 'nombre', 'departamento', 'actions'];
  dataSource: MatTableDataSource<UserData>;
  suscription?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private localidadService: LocalidadService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public dialogNew: MatDialog,
    public dialogEdit: MatDialog,
    public dialogDetail: MatDialog,
    private http: HttpClient,
    private paginatorLabels: MatPaginatorIntl,
    private dataSharingService: DataSharingService,
    ) {
    paginatorLabels.itemsPerPageLabel = 'Items por pagina';
    paginatorLabels.firstPageLabel = 'Primera Pagina';
    paginatorLabels.nextPageLabel = 'Siguiente';
    paginatorLabels.previousPageLabel = 'Anterior';
      this.dataSource = new MatTableDataSource<UserData>([]);
    }

  ngOnInit() {
    this.cargarLocalidad();

    this.suscription = this.localidadService.refresh$.subscribe(() => {
      this.cargarLocalidad();
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

  cargarLocalidad(): void {
    this.localidadService.lista().subscribe(
      (data: Localidad[]) => {
        const userDataArray: UserData[] = data.map(localidad => ({
          id: localidad.id || 0,
          nombre: localidad.nombre || '',
          id_departamento: localidad.departamento ? localidad.departamento.id || 0 : 0,
          departamento: localidad.departamento ? localidad.departamento.nombre || '' : '',
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
    this.dialog.open(LocalidadComponent, {
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

    this.localidadService.delete(id).subscribe(
      data=> {
        this.toastr.success('localidad eliminada', 'OK', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
        this.cargarLocalidad();
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

  addNewLocalidad() {
    this.dialogNew.open(LocalidadNewComponent, {
      width: '600px',
      disableClose: true,
    });

  }

  addDetailLocalidad(id: number) {
    const dialogDetail = this.dialog.open(LocalidadDetailComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogDetail.afterClosed().subscribe((result) => {
      console.log(this.dataSharingService.getLocalidadFormData());
      this.dataSource.data.push(this.dataSharingService.getLocalidadFormData());
      console.log("id recibido: "+this.dataSharingService.getLocalidadId());
    });
  }


  addEditLocalidad(id: number) {
    const dialogEdit = this.dialog.open(LocalidadEditComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogEdit.afterClosed().subscribe((result) => {
      console.log(this.dataSharingService.getLocalidadFormData());
      this.dataSource.data.push(this.dataSharingService.getLocalidadFormData());
      console.log("id recibido: "+this.dataSharingService.getLocalidadId());
    });
  }

}
