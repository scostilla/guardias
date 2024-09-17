import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { DistribucionGuardia } from 'src/app/models/personal/DistribucionGuardia';
import { DistribucionGuardiaService } from 'src/app/services/personal/distribucionGuardia.service';
import { PruebaFormComponent } from '../prueba-form/prueba-form.component';

@Component({
  selector: 'app-prueba-territorio',
  templateUrl: './prueba-territorio.component.html',
  styleUrls: ['./prueba-territorio.component.css']
})

export class PruebaTerritorioComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<DistribucionGuardia>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<PruebaFormComponent>;
  displayedColumns: string[] = ['dia', 'cantidadHoras', 'efector', 'tipoGuardia', 'acciones'];
  dataSource!: MatTableDataSource<DistribucionGuardia>;
  suscription!: Subscription;

  constructor(
    private distribucionGuardiaService: DistribucionGuardiaService,
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
    this.listDistribucionGuardia();

    this.suscription = this.distribucionGuardiaService.refresh$.subscribe(() => {
      this.listDistribucionGuardia();
    })

  }

  listDistribucionGuardia(): void {
    this.distribucionGuardiaService.list().subscribe(data => {
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
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: DistribucionGuardia, filter: string) => {
      return this.accentFilter(data.dia.toLowerCase()).includes(this.accentFilter(filter)) ||
       this.accentFilter(data.efector.nombre.toLowerCase()).includes(this.accentFilter(filter));
    };
  }

  openFormChanges(distribucionGuardia?: DistribucionGuardia): void {
    const esEdicion = distribucionGuardia != null;
    const dialogRef = this.dialog.open(PruebaFormComponent, {
      width: '600px',
      data: esEdicion ? distribucionGuardia : null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.type === 'save') {
          this.toastr.success(esEdicion ? 'Hospital editado con éxito' : 'Hospital creado con éxito', 'EXITO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
  
          if (esEdicion) {
            const index = this.dataSource.data.findIndex(p => p.id === result.data.id);
            if (index !== -1) {
              this.dataSource.data[index] = result.data;
            }
          } else {
            this.dataSource.data.push(result.data);
          }
          this.dataSource._updateChangeSubscription();
        } else if (result.type === 'error') {
          this.toastr.error('Ocurrió un error al crear o editar el hospital', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        } else if (result.type === 'cancel') {
        }
      }
    });
  }
  

  openDetail(distribucionGuardia: DistribucionGuardia): void {
    this.dialogRef = this.dialog.open(PruebaFormComponent, { 
      width: '600px',
      data: distribucionGuardia
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
    }

  deleteHospital(distribucionGuardia: DistribucionGuardia): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + distribucionGuardia.dia,
        title: 'Eliminar',
      },
    });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.distribucionGuardiaService.delete(distribucionGuardia.id!).subscribe(data => {
        this.toastr.success('Hospital eliminado con éxito', 'ELIMINADO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

        const index = this.dataSource.data.findIndex(p => p.id === distribucionGuardia.id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }, err => {
        this.toastr.error(err.message, 'Error, no se pudo eliminar el hospital', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      });
    }
  });
}
}