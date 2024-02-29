import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Feriado } from 'src/app/models/Feriado';
import { FeriadoService } from 'src/app/services/feriado.service';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataSharingService } from 'src/app/services/DataSharing/data-sharing.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { FeriadoDetailComponent } from '../feriado-detail/feriado-detail.component';
import { FeriadoEditComponent } from '../feriado-edit/feriado-edit.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


export interface UserData {
  id: number;
  descripcion: string;
  dia: number;
  motivo: string;
  tipo_feriado: string;
  fecha: string;
}


@Component({
  selector: 'app-feriado',
  templateUrl: './feriado.component.html',
  styleUrls: ['./feriado.component.css']
})

export class FeriadoComponent implements OnInit, AfterViewInit {

  feriadoes: Feriado[] = [];
  displayedColumns: string[] = ['id', 'descripcion', 'dia', 'motivo', 'tipo_feriado', 'fecha', 'actions'];
  dataSource: MatTableDataSource<UserData>;
  suscription?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private feriadoService: FeriadoService,
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
    this.cargarFeriado();

    this.suscription = this.feriadoService.refresh$.subscribe(() => {
      this.cargarFeriado();
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

  cargarFeriado(): void {
    this.feriadoService.list().subscribe(
      (data: Feriado[]) => {
        const userDataArray: UserData[] = data.map(feriado => ({
          id: feriado.id || 0,
          descripcion: feriado.descripcion || '',
          dia: feriado.dia || 0,
          motivo: feriado.motivo || '',
          tipo_feriado: feriado.tipo_feriado || '',
          fecha: feriado.fecha || '',
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
    this.dialog.open(FeriadoComponent, {
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

    this.feriadoService.delete(id).subscribe(
      data=> {
        this.toastr.success('feriado eliminado', 'OK', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
        this.cargarFeriado();
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

  addDetailFeriado(id: number) {
    const dialogDetail = this.dialog.open(FeriadoDetailComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogDetail.afterClosed().subscribe((result) => {
      console.log("linea 152: "+this.dataSharingService.getFeriadoFormData());
      this.dataSource.data.push(this.dataSharingService.getFeriadoFormData());
      console.log("id recibido: "+this.dataSharingService.getFeriadoId());
    });
  }


  addEditFeriado(id: number) {
    const dialogEdit = this.dialog.open(FeriadoEditComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogEdit.afterClosed().subscribe((result) => {
      console.log("linea 167: "+this.dataSharingService.getFeriadoFormData());
      this.dataSource.data.push(this.dataSharingService.getFeriadoFormData());
      console.log("id recibido: "+this.dataSharingService.getFeriadoId());
    });
  }

}
