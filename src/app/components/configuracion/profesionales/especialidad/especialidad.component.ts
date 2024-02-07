import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Especialidad } from 'src/app/models/Especialidad';
import { EspecialidadService } from 'src/app/services/especialidad.service';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataSharingService } from 'src/app/services/DataSharing/data-sharing.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { EspecialidadDetailComponent } from '../especialidad-detail/especialidad-detail.component';
import { EspecialidadEditComponent } from '../especialidad-edit/especialidad-edit.component';

export interface UserData {
  id: number;
  esPasiva: boolean;
  nombre: string;
  idProfesion: number;
  profesion: String;
}

@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.component.html',
  styleUrls: ['./especialidad.component.css'],
})
export class EspecialidadComponent implements OnInit, AfterViewInit {
  provincias: Especialidad[] = [];
  router: any;
  displayedColumns: string[] = [ 'id', 'esPasiva', 'nombre', 'profesion', 'actions',];
  dataSource: MatTableDataSource<UserData>;
  suscription?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private especialidadService: EspecialidadService,
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
    this.cargarEspecialidad();

    this.suscription = this.especialidadService.refresh$.subscribe(() => {
      this.cargarEspecialidad();
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

  cargarEspecialidad(): void {
    this.especialidadService.lista().subscribe(
      (data: Especialidad[]) => {
        const userDataArray: UserData[] = data.map((especialidad) => ({
          id: especialidad.id || 0,
          esPasiva: especialidad.esPasiva,
          nombre: especialidad.nombre || '',
          idProfesion: especialidad.profesion ? especialidad.profesion.id || 0 : 0,
          profesion: especialidad.profesion ? especialidad.profesion.nombre || '' : '',
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

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(EspecialidadComponent, {
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
          this.especialidadService.delete(id).subscribe(
            (data) => {
              this.toastr.success('Especialidad eliminada', 'OK', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
              });
              this.cargarEspecialidad();
            },
            (err) => {
              this.toastr.error(err.error.mensaje, 'Error', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
              });
            }
          );
        } else {
          this.dialog.closeAll();
        }
      });
  }

  addDetailEspecialidad(id: number) {
    const dialogDetail = this.dialog.open(EspecialidadDetailComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogDetail.afterClosed().subscribe((result) => {
      console.log("linea 158: "+this.dataSharingService.getEspecialidadFormData());
      this.dataSource.data.push(this.dataSharingService.getEspecialidadFormData());
      console.log('id recibido: ' + this.dataSharingService.getEspecialidadId());
    });
  }

  addEditEspecialidad(id: number) {
    const dialogEdit = this.dialog.open(EspecialidadEditComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogEdit.afterClosed().subscribe((result) => {
      console.log(this.dataSharingService.getEspecialidadFormData());
      this.dataSource.data.push(this.dataSharingService.getEspecialidadFormData());
      console.log('id recibido: ' + this.dataSharingService.getEspecialidadId());
    });
  }
}
