import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { Subscription } from 'rxjs';
import { AsistencialMode } from 'src/app/enums/asistencial-mode';
import { AsistencialSummaryDto } from 'src/app/dto/Configuracion/asistencial/AsistencialSummaryDto';

@Component({
  selector: 'app-asistencial-filtrado-selector',
  templateUrl: './asistencial-filtrado-selector.component.html',
  styleUrls: ['./asistencial-filtrado-selector.component.css']
})
export class AsistencialFiltradoSelectorComponent implements OnInit {

  @ViewChild(MatTable) table!: MatTable<AsistencialSummaryDto>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<AsistencialSummaryDto>([]);
  displayedColumns: string[] = ['apellido', 'nombre'/* , 'cuil' */];

  suscription!: Subscription;
  efectorId: number | null = null;
  efectorNombre: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private asistencialService: AsistencialService,
    public dialogRef: MatDialogRef<AsistencialFiltradoSelectorComponent>,
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

    this.loadAsistenciales();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAsistenciales() {
    // Desestructura los parámetros del objeto 'data'
    const { idEfector, tipoGuardia } = this.data;

    switch (this.data.mode) {
      case AsistencialMode.INGRESO:
        this.asistencialService.listByEfectorAndTG(idEfector, tipoGuardia).subscribe(asistenciales => {
          this.dataSource = new MatTableDataSource(asistenciales);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        break;

      case AsistencialMode.SALIDA:
        console.log("Parámetros enviados al servicio SALIDA:", idEfector, tipoGuardia);
        this.asistencialService.ConPendientes(idEfector, tipoGuardia).subscribe(asistenciales => {
          this.dataSource = new MatTableDataSource(asistenciales);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
        break;

      case AsistencialMode.EDICION:
        // Lógica futura para edición
        break;

      default:
        console.error('Modo no soportado:', this.data.mode);
    }
  }

  /* loadAsistenciales(): void {
    
    // Usamos el nuevo servicio para obtener la lista filtrada
    this.asistencialService.listByEfectorAndTG(this.data.idEfector, this.data.tipoGuardia).subscribe(
      (asistenciales: Asistencial[]) => {
        this.dataSource = new MatTableDataSource(asistenciales);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Error al cargar los asistenciales:', error);
      }
    );
  } */

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    this.dataSource.filterPredicate = (data: AsistencialSummaryDto, filter: string) => {
      const normalizedData = (data.nombre + ' ' + data.apellido /* + ' ' + data.cuil */)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      return normalizedData.indexOf(filter) !== -1;
    };

    this.dataSource.filter = filterValue;
  }

  // Selecciona una persona (Asistencial o NoAsistencial)
  selectAsistencial(asistencial: AsistencialSummaryDto): void {
    // Verifica que el objeto tenga la estructura correcta
    console.log('Selected Persona:', asistencial);

    //*****FABI     aqui debería buscar el registro de actividad con el idAsistencial e idEfector, luego mandarle de regreso ese regActivRegSalidaDto
    //***********


    // Cierra el diálogo y pasa el objeto `asistencial` al componente padre
    this.dialogRef.close(asistencial);
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
    //this.efectorIdSubscription?.unsubscribe();
  }
}