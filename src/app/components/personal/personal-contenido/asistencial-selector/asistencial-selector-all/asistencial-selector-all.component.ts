import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { AsistencialSummaryDto } from 'src/app/dto/Configuracion/asistencial/AsistencialSummaryDto';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';
import { NoAsistencialListDto } from 'src/app/dto/Configuracion/no-asistencial/NoAsistencialListDto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-asistencial-selector-all',
  templateUrl: './asistencial-selector-all.component.html',
  styleUrls: ['./asistencial-selector-all.component.css']
})
export class AsistencialSelectorAllComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['apellido', 'nombre', 'cuil', 'profesion'];
  selectedType: string = 'asistencial'; // Asistencial es seleccionado por defecto

  suscription!: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private asistencialService: AsistencialService,
    private noAsistencialService: NoAsistencialService,
    public dialogRef: MatDialogRef<AsistencialSelectorAllComponent>,
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
      return `${start} - ${end} de ${length}`;
    };
  }

  ngOnInit(): void {

    // Cargar la lista según el tipo seleccionado
    setTimeout(() => {
      this.loadDataByType(this.selectedType);
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onTypeChange(event: any): void {
    this.selectedType = event.value;
    this.loadDataByType(this.selectedType);
  }

  loadDataByType(type: string): void {
    if (type === 'asistencial') {
      this.asistencialService.listSummary().subscribe((data: AsistencialSummaryDto[]) => {
        this.dataSource.data = data;
      });
    } else if (type === 'noAsistencial') {
      this.noAsistencialService.listNoAsistencialSummary().subscribe((data: NoAsistencialListDto[]) => {
        this.dataSource.data = data;
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const apellido = data.apellido ?? '';
      const nombre = data.nombre ?? '';
      const cuil = data.cuil ?? '';
      
      const normalizedData = (nombre + ' ' + apellido + ' ' + cuil)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      return normalizedData.includes(filter);
    };

    this.dataSource.filter = filterValue;
  }

  selectPersona(persona: AsistencialSummaryDto | NoAsistencialListDto): void {
    this.dialogRef.close(persona);
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }  
}