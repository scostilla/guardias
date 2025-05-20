import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Person } from 'src/app/models/Configuracion/Person';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { AsistencialSummaryDto } from 'src/app/dto/Configuracion/asistencial/AsistencialSummaryDto';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';
import { HabilitacionesGuardiasService } from 'src/app/services/Configuracion/habilitacionesGuardias.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-asistencial-selector-all',
  templateUrl: './asistencial-selector-all.component.html',
  styleUrls: ['./asistencial-selector-all.component.css']
})
export class AsistencialSelectorAllComponent implements OnInit {
  /* @ViewChild(MatTable) table!: MatTable<Asistencial>; */
  @ViewChild(MatTable) table!: MatTable<AsistencialSummaryDto>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Person>([]);
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
    /* this.asistencialService.list().subscribe(data => {
      this.dataSource.data = data;
    }); */

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Método que se ejecuta al cambiar entre Asistencial y NoAsistencial
  onTypeChange(event: any): void {
    this.selectedType = event.value;
    this.loadDataByType(this.selectedType);
  }

  loadDataByType(type: string): void {
    if (type === 'asistencial') {
      this.asistencialService.list().subscribe(data => {
        this.dataSource.data = data;
      });
    } else if (type === 'noAsistencial') {
      this.noAsistencialService.list().subscribe(data => {
        this.dataSource.data = data;
      });
    }
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  
    this.dataSource.filterPredicate = (data: Person, filter: string) => {
      const normalizedData = (data.nombre + ' ' + data.apellido + ' ' + data.cuil)

        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      return normalizedData.indexOf(filter) !== -1;
    };
  
    this.dataSource.filter = filterValue;
  }

   // Selecciona una persona (Asistencial o NoAsistencial)
  selectPersona(persona: Person): void {
    // Verifica que el objeto tenga la estructura correcta
    //console.log('Selected Persona:', persona);
  
    // Cierra el diálogo y pasa el objeto `asistencial` al componente padre
    this.dialogRef.close(persona);
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }  
}