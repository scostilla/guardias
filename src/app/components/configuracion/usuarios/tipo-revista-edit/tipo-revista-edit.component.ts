import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { TipoRevista } from "src/app/models/Configuracion/TipoRevista";
import { TipoRevistaService } from 'src/app/services/Configuracion/tipo-revista.service';


@Component({
  selector: 'app-tipo-revista-edit',
  templateUrl: './tipo-revista-edit.component.html',
  styleUrls: ['./tipo-revista-edit.component.css']
})
export class TipoRevistaEditComponent {
  @ViewChild(MatTable) table!: MatTable<TipoRevista>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['nombre', 'acciones'];
  dataSource!: MatTableDataSource<TipoRevista>;
  suscription!: Subscription;


  constructor(
    private tipoRevistaService: TipoRevistaService,
    private dialogRef: MatDialogRef<TipoRevistaEditComponent>,
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
    this.listTipoRevista();

    this.suscription = this.tipoRevistaService.refresh$.subscribe(() => {
      this.listTipoRevista();
    })

  }

  listTipoRevista(): void {
    this.tipoRevistaService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
      this.suscription?.unsubscribe();
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
