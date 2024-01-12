import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Region } from 'src/app/models/Region';
import { RegionService } from 'src/app/services/region.service';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataSharingService } from 'src/app/services/DataSharing/data-sharing.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { RegionDetailComponent } from '../region-detail/region-detail.component';
import { RegionEditComponent } from '../region-edit/region-edit.component';
import { RegionNewComponent } from '../region-new/region-new.component';


export interface UserData {
  id: number;
  nombre: string;

}


@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})

export class RegionComponent implements OnInit, AfterViewInit {

  regiones: Region[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'actions'];
  dataSource: MatTableDataSource<UserData>;
  suscription?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private regionService: RegionService,
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
    this.cargarRegion();

    this.suscription = this.regionService.refresh$.subscribe(() => {
      this.cargarRegion();
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

  cargarRegion(): void {
    this.regionService.lista().subscribe(
      (data: Region[]) => {
        const userDataArray: UserData[] = data.map(region => ({
          id: region.id || 0,
          nombre: region.nombre || '',
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
    this.dialog.open(RegionComponent, {
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

    this.regionService.delete(id).subscribe(
      data=> {
        this.toastr.success('Region eliminada', 'OK', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
        this.cargarRegion();
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

  addNewRegion() {
    this.dialogNew.open(RegionNewComponent, {
      width: '600px',
      disableClose: true,
    });

  }

  addDetailRegion(id: number) {
    const dialogDetail = this.dialog.open(RegionDetailComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogDetail.afterClosed().subscribe((result) => {
      console.log("linea 152: "+this.dataSharingService.getRegionFormData());
      this.dataSource.data.push(this.dataSharingService.getRegionFormData());
      console.log("id recibido: "+this.dataSharingService.getRegionId());
    });
  }


  addEditRegion(id: number) {
    const dialogEdit = this.dialog.open(RegionEditComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogEdit.afterClosed().subscribe((result) => {
      console.log("linea 167: "+this.dataSharingService.getRegionFormData());
      this.dataSource.data.push(this.dataSharingService.getRegionFormData());
      console.log("id recibido: "+this.dataSharingService.getRegionId());
    });
  }

}
