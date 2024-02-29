import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Region } from 'src/app/models/Region';
import { RegionService } from 'src/app/services/region.service';
import { RegionEditComponent } from '../region-edit/region-edit.component';
import { RegionDetailComponent } from '../region-detail/region-detail.component'; 

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})

export class RegionComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<Region>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<RegionDetailComponent>;
  displayedColumns: string[] = ['id', 'nombre', 'acciones'];
  dataSource!: MatTableDataSource<Region>;
  suscription!: Subscription;

  constructor(
    private regionService: RegionService,
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
    this.listRegiones();

    this.suscription = this.regionService.refresh$.subscribe(() => {
      this.listRegiones();
    })

  }

  listRegiones(): void {
    this.regionService.list().subscribe(data => {
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
    this.dataSource.filterPredicate = (data: Region, filter: string) => {
      const name = this.accentFilter(data.nombre.toLowerCase());
      filter = this.accentFilter(filter.toLowerCase());
      return name.includes(filter);
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openFormChanges(region?: Region): void {
    const esEdicion = region != null;
    const dialogRef = this.dialog.open(RegionEditComponent, {
      width: '600px',
      data: esEdicion ? region : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      if (result) {
        this.toastr.success(esEdicion ? 'Región editada con éxito' : 'Región creada con éxito', 'EXITO', {
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
        this.toastr.error('Ocurrió un error al crear o editar la región', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }
    });
  }

  openDetail(region: Region): void {
    this.dialogRef = this.dialog.open(RegionDetailComponent, { 
      width: '600px',
      data: region
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
    }

  deleteRegiones(region: Region): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + region.nombre,
        title: 'Eliminar',
      },
    });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.regionService.delete(region.id!).subscribe(data => {
        this.toastr.success('Región eliminada con éxito', 'ELIMINADA', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

        const index = this.dataSource.data.findIndex(p => p.id === region.id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }, err => {
        this.toastr.error(err.message, 'Error, no se pudo eliminar la región', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      });
    }
  });
}
}