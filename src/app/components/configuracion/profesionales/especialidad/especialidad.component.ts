import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Especialidad } from 'src/app/models/Configuracion/Especialidad';
import { EspecialidadService } from 'src/app/services/Configuracion/especialidad.service';
import { EspecialidadEditComponent } from '../especialidad-edit/especialidad-edit.component';
import { EspecialidadDetailComponent } from '../especialidad-detail/especialidad-detail.component'; 

@Component({
  selector: 'app-especialidad',
  templateUrl: './especialidad.component.html',
  styleUrls: ['./especialidad.component.css']
})

export class EspecialidadComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<Especialidad>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<EspecialidadDetailComponent>;
  displayedColumns: string[] = ['nombre', 'esPasiva', 'profesion', 'acciones'];
  dataSource!: MatTableDataSource<Especialidad>;
  suscription!: Subscription;

  constructor(
    private especialidadService: EspecialidadService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private paginatorIntl: MatPaginatorIntl
  ) { 
    this.paginatorIntl.itemsPerPageLabel = "Registros por página";
    this.paginatorIntl.nextPageLabel = "Siguiente";
    this.paginatorIntl.previousPageLabel = "Anterior";
    this.paginatorIntl.firstPageLabel = "Primera página";
    this.paginatorIntl.lastPageLabel = "Última página";
    this.paginatorIntl.getRangeLabel = (page, size, length) => {
      const start = page * size + 1;
      const end = Math.min((page + 1) * size, length);
      return `${start} - ${end} de ${length}`; };
  }

  ngOnInit(): void {
    this.listEspecialidad();

    this.suscription = this.especialidadService.refresh$.subscribe(() => {
      this.listEspecialidad();
    })

  }

  listEspecialidad(): void {
    this.especialidadService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
      this.suscription?.unsubscribe();
  }

  accentFilter(input: string): string {
    const acentos = "ÁÉÍÓÚáéíóú";
    const original = "AEIOUaeiou";
    let output = "";
    for (let i = 0; i < input.length; i++) {
      const index = acentos.indexOf(input[i]);
      if (index >= 0) {
        output += original[index];
      } else {
        output += input[i];
      }
    }
    return output;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: Especialidad, filter: string) => {
      const name = this.accentFilter(data.nombre.toLowerCase());
      const profesion = this.accentFilter(data.profesion.nombre.toLowerCase());
      const esPasiva = data.esPasiva ? 'si' : 'no';
      filter = this.accentFilter(filter.toLowerCase());
      return name.includes(filter) || profesion.includes(filter) || esPasiva.includes(filter);
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openFormChanges(especialidad?: Especialidad): void {
    const esEdicion = especialidad != null;
    const dialogRef = this.dialog.open(EspecialidadEditComponent, {
      width: '600px',
      data: esEdicion ? especialidad : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      if (result) {
        this.toastr.success(esEdicion ? 'Especialidad editada con éxito' : 'Especialidad creada con éxito', 'EXITO', {
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
        this.toastr.error('Ocurrió un error al crear o editar la especialidad', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }
    });
  }

  openDetail(especialidad: Especialidad): void {
    this.dialogRef = this.dialog.open(EspecialidadDetailComponent, { 
      width: '600px',
      data: especialidad
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
    }

  deleteEspecialidad(especialidad: Especialidad): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + especialidad.nombre,
        title: 'Eliminar',
      },
    });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.especialidadService.delete(especialidad.id!).subscribe(data => {
        this.toastr.success('Especialidad eliminada con éxito', 'ELIMINADA', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

        const index = this.dataSource.data.findIndex(p => p.id === especialidad.id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }, err => {
        this.toastr.error(err.message, 'Error, no se pudo eliminar la especialidad', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      });
    }
  });
}
}