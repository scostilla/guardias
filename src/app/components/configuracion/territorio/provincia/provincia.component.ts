import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Provincia } from 'src/app/models/Provincia';
import { ProvinciaService } from 'src/app/services/provincia.service';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataSharingService } from 'src/app/services/DataSharing/data-sharing.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { ProvinciaDetailComponent } from '../provincia-detail/provincia-detail.component';
import { ProvinciaEditComponent } from '../provincia-edit/provincia-edit.component';
import { ProvinciaNewComponent } from '../provincia-new/provincia-new.component';

export interface UserData {
  id: number;
  gentilicio: string;
  nombre: string;
  id_pais: number;
  pais: String;
}

@Component({
  selector: 'app-provincia',
  templateUrl: './provincia.component.html',
  styleUrls: ['./provincia.component.css'],
})
export class ProvinciaComponent implements OnInit, AfterViewInit {
  provincias: Provincia[] = [];
  router: any;
  displayedColumns: string[] = [
    'id',
    'gentilicio',
    'nombre',
    'pais',
    'actions',
  ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private provinciaService: ProvinciaService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public dialogNew: MatDialog,
    public dialogEdit: MatDialog,
    public dialogDetail: MatDialog,
    private http: HttpClient,
    private paginatorLabels: MatPaginatorIntl,
    private dataSharingService: DataSharingService
  ) {
    paginatorLabels.itemsPerPageLabel = 'Items por pagina';
    paginatorLabels.firstPageLabel = 'Primera Pagina';
    paginatorLabels.nextPageLabel = 'Siguiente';
    paginatorLabels.previousPageLabel = 'Anterior';
    this.dataSource = new MatTableDataSource<UserData>([]);
  }

  ngOnInit() {
    this.cargarProvincias();
  }
  get<T>(arg0: any) {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarProvincias(): void {
    this.provinciaService.lista().subscribe(
      (data: Provincia[]) => {
        const userDataArray: UserData[] = data.map((provincia) => ({
          id: provincia.id || 0,
          gentilicio: provincia.gentilicio || '',
          nombre: provincia.nombre || '',
          id_pais: provincia.pais.id !== undefined ? provincia.pais.id : 0,
          pais: provincia.pais.nombre !== undefined ? provincia.pais.nombre : '',
        }));

        console.log(userDataArray);
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

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(ProvinciaComponent, {
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
          this.provinciaService.delete(id).subscribe(
            (data) => {
              this.toastr.success('Provincia eliminada', 'OK', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
              });
              this.router.navigate(['/provincia']);
            },
            (err) => {
              this.toastr.error(err.error.mensaje, 'Error', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
              });
              this.router.navigate(['/provincia']);
            }
          );
        } else {
          this.dialog.closeAll();
        }
      });
  }

  addNewProvincia() {
    this.dialogNew.open(ProvinciaNewComponent, {
      width: '600px',
      disableClose: true,
    });
  }

  addDetailProvincia(id: number) {
    const dialogDetail = this.dialog.open(ProvinciaDetailComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogDetail.afterClosed().subscribe((result) => {
      console.log(this.dataSharingService.getProvinciaFormData());
      this.dataSource.data.push(this.dataSharingService.getProvinciaFormData());
      console.log('id recibido: ' + this.dataSharingService.getProvinciaId());
    });
  }

  addEditProvincia(id: number) {
    const dialogEdit = this.dialog.open(ProvinciaEditComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogEdit.afterClosed().subscribe((result) => {
      console.log(this.dataSharingService.getProvinciaFormData());
      this.dataSource.data.push(this.dataSharingService.getProvinciaFormData());
      console.log('id recibido: ' + this.dataSharingService.getProvinciaId());
    });
  }
}
