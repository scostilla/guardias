import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { Paises } from '../../../models/paises';
import { PaisesService } from '../../../services/paises.service';
import { ToastrService } from 'ngx-toastr';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';

export interface UserData {
  id?: number;
  codigo: string;
  nacionalidad: string;
  nombre: string;
}

@Component({
  selector: 'app-paises-oficial',
  templateUrl: './paises-oficial.component.html',
  styleUrls: ['./paises-oficial.component.css'],

})
export class PaisesOficialComponent implements OnInit, AfterViewInit  {

  paises: Paises[] = [];
  router: any;
  displayedColumns: string[] = ['id', 'codigo', 'nacionalidad', 'nombre'];
  dataSource: MatTableDataSource<UserData>;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private paisesService: PaisesService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    ) {
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
  }

  cargarPaises(): void {
    this.paisesService.lista().subscribe(
      data => {
        this.paises = data;
      },
      err => {
        console.log(err);
      }
    );
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(PaisesOficialComponent, {
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

    this.paisesService.delete(id).subscribe(
      data=> {
        this.toastr.success('Pais eliminado', 'OK', {
          timeOut: 5000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/'])
      },
      err => {
        this.toastr.error(err.error.mensaje, 'Fail', {
          timeOut: 5000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/lista-pais'])
      }
    );
  } else {
    this.dialog.closeAll();
  }
});
  }

}