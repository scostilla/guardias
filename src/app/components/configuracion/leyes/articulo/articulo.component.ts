import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { Articulo } from 'src/app/models/Configuracion/Articulo';
import { ArticuloService } from 'src/app/services/Configuracion/articulo.service';
import { ArticuloDetailComponent } from '../articulo-detail/articulo-detail.component';


@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css']
})
export class ArticuloComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<Articulo>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRefArticulo!: MatDialogRef<ArticuloDetailComponent>;
  displayedColumns: string[] = ['numero','denominacion', 'acciones'];
  dataSource!: MatTableDataSource<Articulo>;
  suscription!: Subscription;
  

  constructor(
    private articuloService: ArticuloService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private paginatorIntl: MatPaginatorIntl,
  
  ) { 
    this.paginatorIntl.itemsPerPageLabel = "Registros por página";
    this.paginatorIntl.nextPageLabel = "Siguiente";
    this.paginatorIntl.previousPageLabel = "Anterior";
    this.paginatorIntl.firstPageLabel = "Primera página";
    this.paginatorIntl.lastPageLabel = "Última página";
    this.paginatorIntl.getRangeLabel = (page, size, length) => {
      const start = page * size + 1;
      const end = Math.min((page + 1) * size, length);
      return `${start} - ${end} de ${length}`;
    };
  }

  ngOnInit(): void {
    this.listArticulo();

    this.suscription = this.articuloService.refresh$.subscribe(() => {
      this.listArticulo();
    })

  }

  listArticulo(): void {
    this.articuloService.list().subscribe(data => {
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
  apllyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Articulo, filter: string) => {
      return this.accentFilter(data.denominacion).toLowerCase().includes(this.accentFilter(filter)) ||
      this.accentFilter(data.numero).toLowerCase().includes(this.accentFilter(filter));
  } ;
}

/* openFormChancges(articulo?: Articulo): void {
  const esEdicion = articulo != null;
  const dialogRef = this.dialog.open(ArticuloEditComponent, {
    width: '600px',
    data: esEdicion ? articulo : null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if (result.type === 'save') {
        this.toastr.success(esEdicion ? 'Artículo actualizado' : 'Artículo creado', 'EXITO',{
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        
        if (esEdicion) {
          const index = this.dataSource.data.findIndex(p => p.id === result.data.id);
          if (index !== -1) {
            this.dataSource.data[index] = result.data;
          }
      }else {
        this.dataSource.data.push(result.data);
      }

      this.dataSource._updateChangeSubscription();
    } else if (result.type === 'error') {
      this.toastr.error('Error al guardar', 'ERROR', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
    }else if (result.type ==='cancel') {

    }

  }
});
} */

openDetail(articulo: Articulo): void {
  this.dialogRefArticulo = this.dialog.open(ArticuloDetailComponent, { 
    width: '600px',
    data: articulo
  });
  this.dialogRefArticulo.afterClosed().subscribe(() => {
    this.dialogRefArticulo.close();
  });
  }
      
}
