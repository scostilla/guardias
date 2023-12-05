import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaisService } from 'src/app/services/pais.service';
import { ToastrService } from 'ngx-toastr';
import { Pais } from 'src/app/models/pais';

import { HttpClient } from '@angular/common/http';
import {
  MatDialog
} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataSharingService } from 'src/app/services/DataSharing/data-sharing.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { PaisNewComponent } from '../pais-new/pais-new.component';
import { PaisEditComponent } from '../pais-edit/pais-edit.component';
import { PaisDetailComponent } from '../pais-detail/pais-detail.component';


export interface UserData {
  id: number;
  codigo: string;
  nacionalidad: string;
  nombre: string;
}


@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.css']
})

export class PaisComponent implements OnInit, AfterViewInit {

  paises: Pais[] = [];
  router: any;
  displayedColumns: string[] = ['id', 'codigo', 'nacionalidad', 'nombre', 'actions'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private paisService: PaisService,
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
    this.cargarPaises();

  }
  get<T>(arg0: any) {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarPaises(): void {
    this.paisService.lista().subscribe(
      (data: Pais[]) => {
        const userDataArray: UserData[] = data.map(pais => ({
          id: pais.id || 0,
          codigo: pais.codigo || '',
          nacionalidad: pais.nacionalidad || '',
          nombre: pais.nombre || '',
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
    this.dialog.open(PaisComponent, {
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

    this.paisService.delete(id).subscribe(
      data=> {
        this.toastr.success('Pais eliminado', 'OK', {
          timeOut: 5000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/pais'])
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Error', {
          timeOut: 5000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/pais'])
      }
    );
  } else {
    this.dialog.closeAll();
  }
});
  }

  addNewPais() {
    this.dialogNew.open(PaisNewComponent, {
      width: '600px',
      disableClose: true,
    });

  }

  addEditPais(id: number) {
    this.dialogEdit.open(PaisEditComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

  }

  addDetailPais(id: number) {
    const dialogRef = this.dialog.open(PaisDetailComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(this.dataSharingService.getPaisFormData());
      this.dataSource.data.push(this.dataSharingService.getPaisFormData());
      console.log("id recibido: "+this.dataSharingService.getPaisId());
    });
  }

}
