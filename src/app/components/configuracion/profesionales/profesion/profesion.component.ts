import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Profesion } from 'src/app/models/Profesion';
import { ProfesionService } from 'src/app/services/profesion.service';
import { ProfesionEditComponent } from '../profesion-edit/profesion-edit.component';
import { ProfesionDetailComponent } from '../profesion-detail/profesion-detail.component'; 

@Component({
  selector: 'app-profesion',
  templateUrl: './profesion.component.html',
  styleUrls: ['./profesion.component.css']
})

export class ProfesionComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<Profesion>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<ProfesionDetailComponent>;
  displayedColumns: string[] = ['id', 'nombre', 'asistencial', 'acciones'];
  dataSource!: MatTableDataSource<Profesion>;
  suscription!: Subscription;

  constructor(
    private profesionService: ProfesionService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.cargarProfesion();

    this.suscription = this.profesionService.refresh$.subscribe(() => {
      this.cargarProfesion();
    })

  }

  cargarProfesion(): void {
    this.profesionService.lista().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
      this.suscription.unsubscribe();
      console.log('Observable cerrado.');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  abrirFormulario(profesion?: Profesion): void {
    const esEdicion = profesion != null;
    const dialogRef = this.dialog.open(ProfesionEditComponent, {
      width: '600px',
      data: esEdicion ? profesion : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      if (result) {
        this.toastr.success(esEdicion ? 'Profesión editada con éxito' : 'Profesión creada con éxito', 'EXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        if (esEdicion) {
          const index = this.dataSource.data.findIndex(p => p.id === result.id);
          this.dataSource.data[index] = result;
        } else {
          this.dataSource.data.push(result);
        }
        this.dataSource._updateChangeSubscription();
      } else {
        this.toastr.error('Ocurrió un error al crear o editar la profesión', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }
    });
  }

  abrirDetalle(profesion: Profesion): void {
    this.dialogRef = this.dialog.open(ProfesionDetailComponent, { 
      width: '400px',
      data: profesion
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
    }

  eliminar(profesion: Profesion): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + profesion.nombre,
        title: 'Eliminar',
      },
    });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.profesionService.delete(profesion.id!).subscribe(data => {
        this.toastr.success('Profesión eliminada con éxito', 'ELIMINADA', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

        const index = this.dataSource.data.findIndex(p => p.id === profesion.id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }, err => {
        this.toastr.error(err.message, 'Error, no se pudo eliminar la profesión', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      });
    }
  });
}
}