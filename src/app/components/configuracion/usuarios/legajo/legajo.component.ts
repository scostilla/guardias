import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatPaginator, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { LegajoEditComponent } from '../legajo-edit/legajo-edit.component';
import { LegajoDetailComponent } from '../legajo-detail/legajo-detail.component'; 

@Component({
  selector: 'app-legajo',
  templateUrl: './legajo.component.html',
  styleUrls: ['./legajo.component.css']
})

export class LegajoComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<Legajo>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<LegajoDetailComponent>;
  displayedColumns: string[] = ['id', 'persona', 'actual', 'fechaFinal', 'fechaInicio', 'profesion', 'udo', 'cargo', 'acciones'];
  dataSource!: MatTableDataSource<Legajo>;
  suscription!: Subscription;

  constructor(
    private legajoService: LegajoService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private paginatorIntl: MatPaginatorIntl
    ) { 
    this.paginatorIntl.itemsPerPageLabel = "Registros por página";
    this.paginatorIntl.nextPageLabel = "Siguiente página";
    this.paginatorIntl.previousPageLabel = "Página anterior";
    this.paginatorIntl.firstPageLabel = "Primera página";
    this.paginatorIntl.lastPageLabel = "Última página";
    this.paginatorIntl.getRangeLabel = (page, size, length) => {
      const start = page * size + 1;
      const end = Math.min((page + 1) * size, length);
      return `${start} - ${end} de ${length}`; };
     }

  ngOnInit(): void {
    this.listLegajos();

    this.suscription = this.legajoService.refresh$.subscribe(() => {
      this.listLegajos();
    })

  }

  listLegajos(): void {
    this.legajoService.list().subscribe(data => {
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
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  this.dataSource.filter = filterValue;
  this.dataSource.filterPredicate = (data: Legajo, filter: string) => {
    const actualString = data.actual ? 'si' : 'no';
    const idPersonaString = data.profesion.nombre.toString();
    const fechaFinalString = data.fechaFinal.toISOString().toLowerCase();

    return this.accentFilter(actualString).includes(this.accentFilter(filter)) || 
           this.accentFilter(idPersonaString).includes(this.accentFilter(filter)) || 
           this.accentFilter(fechaFinalString).includes(this.accentFilter(filter));
  };
}
  openFormChanges(legajo?: Legajo): void {
    const esEdicion = legajo != null;
    const dialogRef = this.dialog.open(LegajoEditComponent, {
      width: '600px',
      data: esEdicion ? legajo : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.type === 'save') {
        this.toastr.success(esEdicion ? 'Legajo editado con éxito' : 'Legajo creado con éxito', 'EXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        if (esEdicion) {
          const index = this.dataSource.data.findIndex(p => p.id === result.data.id);
          this.dataSource.data[index] = result.data;
        } else {
          this.dataSource.data.push(result.data);
        }
        this.dataSource._updateChangeSubscription();
      } else if (result !== undefined && result.type === 'error') {
        this.toastr.error('Ocurrió un error al crear o editar el Legajo', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    });
  }

  openDetail(legajo: Legajo): void {
    this.dialogRef = this.dialog.open(LegajoDetailComponent, { 
      width: '600px',
      data: legajo
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
    }

  deleteLegajo(legajo: Legajo): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + legajo.id,
        title: 'Eliminar',
      },
    });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.legajoService.delete(legajo.id!).subscribe(data => {
        this.toastr.success('Legajo eliminado con éxito', 'ELIMINADO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

        const index = this.dataSource.data.findIndex(p => p.id === legajo.id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }, err => {
        this.toastr.error(err.message, 'Error, no se pudo eliminar el legajo', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      });
    }
  });
}
}