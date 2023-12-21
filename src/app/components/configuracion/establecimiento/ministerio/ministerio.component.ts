import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Ministerio } from 'src/app/models/Ministerio';
import { MinisterioService } from 'src/app/services/ministerio.service';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataSharingService } from 'src/app/services/DataSharing/data-sharing.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { MinisterioDetailComponent } from '../ministerio-detail/ministerio-detail.component';
import { MinisterioEditComponent } from '../ministerio-edit/ministerio-edit.component';
import { MinisterioNewComponent } from '../ministerio-new/ministerio-new.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


export interface UserData {
  id: number;
  domicilio: string;
  estado: number;
  idLocalidad: number;
  idRegion: number;
  nombre: string;
  observacion: string;
  telefono: number;
  idCabecera: number;

}


@Component({
  selector: 'app-ministerio',
  templateUrl: './ministerio.component.html',
  styleUrls: ['./ministerio.component.css']
})

export class MinisterioComponent implements OnInit, AfterViewInit {

  ministerios: Ministerio[] = [];
  displayedColumns: string[] = ['id', 'domicilio', 'estado', 'idLocalidad', 'idRegion', 'nombre', 'observacion', 'telefono', 'idCabecera', 'actions'];
  dataSource: MatTableDataSource<UserData>;
  suscription?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private ministerioService: MinisterioService,
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
    this.cargarMinisterios();

    this.suscription = this.ministerioService.refresh$.subscribe(() => {
      this.cargarMinisterios();
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

  cargarMinisterios(): void {
    this.ministerioService.lista().subscribe(
      (data: Ministerio[]) => {
        const userDataArray: UserData[] = data.map(ministerio => ({
          id: ministerio.id || 0,
          domicilio: ministerio.domicilio || '',
          estado: ministerio.estado || 0,
          idLocalidad: ministerio.idLocalidad || 0,
          idRegion: ministerio.idRegion || 0,
          nombre: ministerio.nombre || '',
          observacion: ministerio.observacion || '',
          telefono: ministerio.telefono || 0,
          idCabecera: ministerio.idCabecera || 0,
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
    this.dialog.open(MinisterioComponent, {
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

    this.ministerioService.delete(id).subscribe(
      data=> {
        this.toastr.success('Ministerio eliminado', 'OK', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
        this.cargarMinisterios();
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

  addNewMinisterio() {
    this.dialogNew.open(MinisterioNewComponent, {
      width: '600px',
      disableClose: true,
    });

  }

  addDetailMinisterio(id: number) {
    const dialogDetail = this.dialog.open(MinisterioDetailComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogDetail.afterClosed().subscribe((result) => {
      console.log("linea 152: "+this.dataSharingService.getMinisterioFormData());
      this.dataSource.data.push(this.dataSharingService.getMinisterioFormData());
      console.log("id recibido: "+this.dataSharingService.getMinisterioId());
    });
  }


  addEditMinisterio(id: number) {
    const dialogEdit = this.dialog.open(MinisterioEditComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogEdit.afterClosed().subscribe((result) => {
      console.log("linea 167: "+this.dataSharingService.getMinisterioFormData());
      this.dataSource.data.push(this.dataSharingService.getMinisterioFormData());
      console.log("id recibido: "+this.dataSharingService.getMinisterioId());
    });
  }

}
