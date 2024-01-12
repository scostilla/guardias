import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Departamento } from 'src/app/models/Departamento';
import { DepartamentoService } from 'src/app/services/departamento.service';

import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { DataSharingService } from 'src/app/services/DataSharing/data-sharing.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { DepartamentoDetailComponent } from '../departamento-detail/departamento-detail.component';
import { DepartamentoEditComponent } from '../departamento-edit/departamento-edit.component';
import { DepartamentoNewComponent } from '../departamento-new/departamento-new.component';

export interface UserData {
  id: number;
  codigoPostal: string;
  nombre: string;
  id_provincia: number;
  provincia: String;
}

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css'],
})
export class DepartamentoComponent implements OnInit, AfterViewInit {
  provincias: Departamento[] = [];
  router: any;
  displayedColumns: string[] = [
    'id',
    'codigoPostal',
    'nombre',
    'provincia',
    'actions',
  ];
  dataSource: MatTableDataSource<UserData>;
  suscription?: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private departamentoService: DepartamentoService,
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
    this.cargarDepartamento();

    this.suscription = this.departamentoService.refresh$.subscribe(() => {
      this.cargarDepartamento();
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

  cargarDepartamento(): void {
    this.departamentoService.lista().subscribe(
      (data: Departamento[]) => {
        const userDataArray: UserData[] = data.map((departamento) => ({
          id: departamento.id || 0,
          codigoPostal: departamento.codigoPostal || '',
          nombre: departamento.nombre || '',
          id_provincia: departamento.provincia ? departamento.provincia.id || 0 : 0,
          provincia: departamento.provincia ? departamento.provincia.nombre || '' : '',
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
    this.dialog.open(DepartamentoComponent, {
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
          this.departamentoService.delete(id).subscribe(
            (data) => {
              this.toastr.success('Departamento eliminado', 'OK', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
              });
              this.cargarDepartamento();
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

  addNewDepartamento() {
    this.dialogNew.open(DepartamentoNewComponent, {
      width: '600px',
      disableClose: true,
    });
  }

  addDetailDepartamento(id: number) {
    const dialogDetail = this.dialog.open(DepartamentoDetailComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogDetail.afterClosed().subscribe((result) => {
      console.log("linea 158: "+this.dataSharingService.getDepartamentoFormData());
      this.dataSource.data.push(this.dataSharingService.getDepartamentoFormData());
      console.log('id recibido: ' + this.dataSharingService.getDepartamentoId());
    });
  }

  addEditDepartamento(id: number) {
    const dialogEdit = this.dialog.open(DepartamentoEditComponent, {
      width: '600px',
      disableClose: true,
      data: { id: id },
    });

    dialogEdit.afterClosed().subscribe((result) => {
      console.log(this.dataSharingService.getDepartamentoFormData());
      this.dataSource.data.push(this.dataSharingService.getDepartamentoFormData());
      console.log('id recibido: ' + this.dataSharingService.getDepartamentoId());
    });
  }
}