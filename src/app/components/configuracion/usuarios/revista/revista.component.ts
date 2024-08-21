import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Revista } from 'src/app/models/Configuracion/Revista';
import { RevistaService } from 'src/app/services/Configuracion/revista.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { AdicionalEditComponent } from '../adicional-edit/adicional-edit.component';
import { CargaHorariaEditComponent } from '../carga-horaria-edit/carga-horaria-edit.component';
import { CategoriaEditComponent } from '../categoria-edit/categoria-edit.component';
import { RevistaEditComponent } from '../revista-edit/revista-edit.component';
import { TipoRevistaEditComponent } from '../tipo-revista-edit/tipo-revista-edit.component';

@Component({
  selector: 'app-revista',
  templateUrl: './revista.component.html',
  styleUrls: ['./revista.component.css']
})
export class RevistaComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<Revista>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRefTipoRevista!: MatDialogRef<TipoRevistaEditComponent>;
  dialogRefCategoria!: MatDialogRef<CategoriaEditComponent>;
  dialogRefAdicional!: MatDialogRef<AdicionalEditComponent>;
  dialogRefCargaHoraria!: MatDialogRef<CargaHorariaEditComponent>;
  displayedColumns: string[] = ['agrupacion', 'categoria', 'adicional', 'cargaHoraria', 'tipoRevista', 'acciones'];
  dataSource!: MatTableDataSource<Revista>;
  suscription!: Subscription;

  constructor(
    private revistaService: RevistaService,
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
    this.listRevista();
    

    this.suscription = this.revistaService.refresh$.subscribe(() => {
      this.listRevista();
    })

  }

  listRevista(): void {
    this.revistaService.list().subscribe(data => {
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
    this.dataSource.filterPredicate = (data: Revista, filter: string) => {
      return this.accentFilter(data.agrupacion.toLowerCase()).includes(this.accentFilter(filter)) ||
       this.accentFilter(data.tipoRevista.nombre.toLowerCase()).includes(this.accentFilter(filter));
    };
  }

  openFormChanges(revista?: Revista): void {
    const esEdicion = revista != null;
    const dialogRef = this.dialog.open(RevistaEditComponent, {
      width: '600px',
      data: esEdicion ? revista : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      if (result) {
        this.toastr.success(esEdicion ? 'Revista editada con éxito' : 'Revista creada con éxito', 'EXITO', {
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
        this.toastr.error('Ocurrió un error al crear o editar la revista', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }
    });
  }

  openEditTipoRevista(): void {
    this.dialogRefTipoRevista = this.dialog.open(TipoRevistaEditComponent, { 
      width: '600px',
    });
    this.dialogRefTipoRevista.afterClosed().subscribe(() => {
      this.dialogRefTipoRevista.close();
    });
  }

  openEditCategoria(): void {
    this.dialogRefCategoria = this.dialog.open(CategoriaEditComponent, {
      width: '600px',
    });
    this.dialogRefCategoria.afterClosed().subscribe(() => {
      this.dialogRefCategoria.close();
    });
  }

  /* openEditCategoria(categoria?: Categoria): void {
    const esEdicion = categoria != null;
    const dialogRefCategoria = this.dialog.open(CategoriaEditComponent, {
      width: '600px',
      data : esEdicion ? categoria : null
    });
   
    dialogRefCategoria.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result) { 
          this.toastr.success(esEdicion ? 'Categoria editada con éxito' : 'Categoria creada con éxito', 'EXITO', {
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
        }else{
          this.toastr.error('Ocurrió un error al crear o editar la categoria', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
      }
      });
    } */
  
  openEditAdicional(): void {
    this.dialogRefAdicional = this.dialog.open(AdicionalEditComponent, {
      width: '600px',
    });
    this.dialogRefAdicional.afterClosed().subscribe(() => {
      this.dialogRefAdicional.close();
    });
  }

  openEditCargaHoraria(): void {
    this.dialogRefCargaHoraria = this.dialog.open(CargaHorariaEditComponent, {
      width: '600px',
    });
    this.dialogRefCargaHoraria.afterClosed().subscribe(() => {
      this.dialogRefCargaHoraria.close();
    });
  }

  


  deleteRevista(revista: Revista): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + revista.agrupacion,
        title: 'Eliminar',
      },
    });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.revistaService.delete(revista.id!).subscribe(data => {
        this.toastr.success('Revista eliminada con éxito', 'ELIMINADA', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

        const index = this.dataSource.data.findIndex(p => p.id === revista.id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }, err => {
        this.toastr.error(err.message, 'Error, no se pudo eliminar la revista', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      });
    }
  });
}
}
