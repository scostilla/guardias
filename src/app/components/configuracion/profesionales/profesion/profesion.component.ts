import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Profesion } from 'src/app/models/Profesion';
import { ProfesionService } from 'src/app/services/profesion.service';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataSharingService } from 'src/app/services/DataSharing/data-sharing.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { ProfesionDetailComponent } from '../profesion-detail/profesion-detail.component';
import { ProfesionEditComponent } from '../profesion-edit/profesion-edit.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


export interface UserData {
  id: number;
  asistencial: boolean;
  nombre: string;
}


@Component({
  selector: 'app-profesion',
  templateUrl: './profesion.component.html',
  styleUrls: ['./profesion.component.css']
})

export class ProfesionComponent implements OnInit, AfterViewInit {

  profesiones: Profesion[] = [];
  displayedColumns: string[] = ['id', 'asistencial', 'nombre', 'actions'];
  dataSource: MatTableDataSource<UserData>;
  suscription?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator; 
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private profesionService: ProfesionService,
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
    this.cargarProfesiones();

    this.suscription = this.profesionService.refresh$.subscribe(() => {
      this.cargarProfesiones();
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

  cargarProfesiones(): void {
    this.profesionService.lista().subscribe(
      (data: Profesion[]) => {
        const userDataArray: UserData[] = data.map(profesion => ({
          id: profesion.id || 0,
          asistencial: profesion.asistencial,
          nombre: profesion.nombre || '',
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
    this.dialog.open(ProfesionComponent, {
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

    this.profesionService.delete(id).subscribe(
      data=> {
        this.toastr.success('Profesion eliminada', 'OK', {
          timeOut: 6000, positionClass: 'toast-top-center'
        });
        this.cargarProfesiones();
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

  addDetailProfesion(id: number) {
    const dialogDetail = this.dialog.open(ProfesionDetailComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogDetail.afterClosed().subscribe((result) => {
      console.log("linea 152: "+this.dataSharingService.getProfesionFormData());
      this.dataSource.data.push(this.dataSharingService.getProfesionFormData());
      console.log("id recibido: "+this.dataSharingService.getProfesionId());
    });
  }


  addEditProfesion(id: number) {
    const dialogEdit = this.dialog.open(ProfesionEditComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogEdit.afterClosed().subscribe((result) => {
      console.log("linea 167: "+this.dataSharingService.getProfesionFormData());
      this.dataSource.data.push(this.dataSharingService.getProfesionFormData());
      console.log("id recibido: "+this.dataSharingService.getProfesionId());
    });
  }

}
