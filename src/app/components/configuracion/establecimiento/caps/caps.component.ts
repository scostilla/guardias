import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Caps } from 'src/app/models/Configuracion/Caps';
import { CapsService } from 'src/app/services/Configuracion/caps.service';
import { CapsEditComponent } from '../caps-edit/caps-edit.component';
import { CapsDetailComponent } from '../caps-detail/caps-detail.component'; 

@Component({
  selector: 'app-caps',
  templateUrl: './caps.component.html',
  styleUrls: ['./caps.component.css']
})

export class CapsComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<Caps>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<CapsDetailComponent>;
  displayedColumns: string[] = ['nombre', 'domicilio', 'localidad', 'acciones'];
  dataSource!: MatTableDataSource<Caps>;
  suscription!: Subscription;

  constructor(
    private capsService: CapsService,
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
    this.listCaps();

    this.suscription = this.capsService.refresh$.subscribe(() => {
      this.listCaps();
    })

  }

  listCaps(): void {
    this.capsService.list().subscribe(data => {
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
    this.dataSource.filterPredicate = (data: Caps, filter: string) => {
      return this.accentFilter(data.nombre.toLowerCase()).includes(this.accentFilter(filter)) ||
       this.accentFilter(data.localidad.nombre.toLowerCase()).includes(this.accentFilter(filter));
    };
  }

  openFormChanges(caps?: Caps): void {
    const esEdicion = caps != null;
    const dialogRef = this.dialog.open(CapsEditComponent, {
      width: '600px',
      data: esEdicion ? caps : null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.type === 'save') {
          this.toastr.success(esEdicion ? 'Caps editado con éxito' : 'Caps creado con éxito', 'EXITO', {
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
          this.toastr.error('Ocurrió un error al crear o editar el caps', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        } else if (result.type === 'cancel') {
        }
      }
    });
  }
  

  openDetail(caps: Caps): void {
    this.dialogRef = this.dialog.open(CapsDetailComponent, { 
      width: '600px',
      data: caps
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
    }

  deleteCaps(caps: Caps): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + caps.nombre,
        title: 'Eliminar',
      },
    });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.capsService.delete(caps.id!).subscribe(data => {
        this.toastr.success('Caps eliminado con éxito', 'ELIMINADO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

        const index = this.dataSource.data.findIndex(p => p.id === caps.id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }, err => {
        this.toastr.error(err.message, 'Error, no se pudo eliminar el caps', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      });
    }
  });
}
}