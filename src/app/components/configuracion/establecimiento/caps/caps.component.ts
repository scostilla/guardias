import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Caps } from 'src/app/models/Caps';
import { CapsService } from 'src/app/services/caps.service';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataSharingService } from 'src/app/services/DataSharing/data-sharing.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { CapsDetailComponent } from '../caps-detail/caps-detail.component';
import { CapsEditComponent } from '../caps-edit/caps-edit.component';
import { CapsNewComponent } from '../caps-new/caps-new.component';


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
  selector: 'app-caps',
  templateUrl: './caps.component.html',
  styleUrls: ['./caps.component.css']
})

export class CapsComponent implements OnInit, AfterViewInit {

  capss: Caps[] = [];
  displayedColumns: string[] = ['id', 'domicilio', 'estado', 'idLocalidad', 'idRegion', 'nombre', 'actions'];
  dataSource: MatTableDataSource<UserData>;
  suscription?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private capsService: CapsService,
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
    this.cargarCaps();

    this.suscription = this.capsService.refresh$.subscribe(() => {
      this.cargarCaps();
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

  cargarCaps(): void {
    this.capsService.list().subscribe(
      (data: Caps[]) => {
        const userDataArray: UserData[] = data.map(caps => ({
          id: caps.id || 0,
          domicilio: caps.domicilio || '',
          estado: caps.estado || 0,
          idLocalidad: caps.localidad.id !== undefined ? caps.localidad.id : 0,
          idRegion: caps.region.id !== undefined ? caps.region.id : 0,
          nombre: caps.nombre || '',
          observacion: caps.observacion || '',
          telefono: caps.telefono || 0,
          idCabecera: caps.idCabecera || 0,
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
    this.dialog.open(CapsComponent, {
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

    this.capsService.delete(id).subscribe(
      data=> {
        this.toastr.success('Caps eliminado', 'OK', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
        this.cargarCaps();
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

  addNewCaps() {
    this.dialogNew.open(CapsNewComponent, {
      width: '600px',
      disableClose: true,
    });

  }

  addDetailCaps(id: number) {
    const dialogDetail = this.dialog.open(CapsDetailComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogDetail.afterClosed().subscribe((result) => {
      console.log("linea 152: "+this.dataSharingService.getCapsFormData());
      this.dataSource.data.push(this.dataSharingService.getCapsFormData());
      console.log("id recibido: "+this.dataSharingService.getCapsId());
    });
  }


  addEditCaps(id: number) {
    const dialogEdit = this.dialog.open(CapsEditComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogEdit.afterClosed().subscribe((result) => {
      console.log("linea 167: "+this.dataSharingService.getCapsFormData());
      this.dataSource.data.push(this.dataSharingService.getCapsFormData());
      console.log("id recibido: "+this.dataSharingService.getCapsId());
    });
  }

}
