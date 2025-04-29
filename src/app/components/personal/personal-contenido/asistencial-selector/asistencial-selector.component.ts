import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { AsistencialSummaryDto } from 'src/app/dto/Configuracion/asistencial/AsistencialSummaryDto';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { HabilitacionesGuardiasService } from 'src/app/services/Configuracion/habilitacionesGuardias.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-asistencial-selector',
  templateUrl: './asistencial-selector.component.html',
  styleUrls: ['./asistencial-selector.component.css']
})
export class AsistencialSelectorComponent implements OnInit {
  /* @ViewChild(MatTable) table!: MatTable<Asistencial>; */
  @ViewChild(MatTable) table!: MatTable<AsistencialSummaryDto>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<AsistencialSummaryDto>([]);
  displayedColumns: string[] = ['apellido', 'nombre', 'cuil', 'profesion'];
  //selectedType: string = 'asistencial'; // Asistencial es seleccionado por defecto

  suscription!: Subscription;
  efectorId: number | null = null;
  efectorNombre: string | null = null;

  private efectorIdSubscription!: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private asistencialService: AsistencialService,
    private noAsistencialService: NoAsistencialService,
    private habilitacionesGuardiasService: HabilitacionesGuardiasService,
    public dialogRef: MatDialogRef<AsistencialSelectorComponent>,
    private efectorService: EfectorService,
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
    /*setTimeout(() => {
      this.loadDataByType(this.selectedType);
    });*/
    /* this.asistencialService.list().subscribe(data => {
      this.dataSource.data = data;
    }); */
    this.loadAsistenciales();

    this.efectorId = this.efectorService.getCurrentEfectorId();
    this.loadEfectorName();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /*/ Método que se ejecuta al cambiar entre Asistencial y NoAsistencial
  onTypeChange(event: any): void {
    this.selectedType = event.value;
    this.loadDataByType(this.selectedType);
  }*/

    /*// Cargar la lista de asistenciales o noAsistenciales según el tipo
  loadAsistenciales(): void {
    const { idEfector, tipoGuardia } = this.data;
      this.asistencialService.listByEfectorAndTG(idEfector, tipoGuardia).subscribe(data => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
  */

  loadAsistenciales(): void {
  const { idEfector, tipoGuardia } = this.data;

  if (tipoGuardia === 'CONTRAFACTURA' || tipoGuardia === 'EXTRA') {
    this.habilitacionesGuardiasService.listAsistencialesByEfectorAndTG(idEfector, tipoGuardia).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      console.error('Error al cargar asistenciales para CONTRAFACTURA:', error);
    });
  } else {
    this.asistencialService.listByEfectorAndTG(idEfector, tipoGuardia).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      console.error('Error al cargar asistenciales:', error);
    });
  }
}


    
  //trae el nombre del efector esta en sesion que filtra lo mostrado
  loadEfectorName(): void {
    if (this.efectorId) {
      this.efectorService.getEfectorTipo(this.efectorId).subscribe(
        (efector: Efector) => {
          // traigo nombre del efector
          this.efectorNombre = efector.nombre;
        },
        (error) => {
          console.error('Error al obtener el efector:', error);
          this.efectorNombre = null;
        }
      );
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  
    this.dataSource.filterPredicate = (data: AsistencialSummaryDto, filter: string) => {
      //const normalizedData = (data.nombre + ' ' + data.apellido + ' ' + data.cuil)
      const normalizedData = (data.nombre + ' ' + data.apellido)

        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      return normalizedData.indexOf(filter) !== -1;
    };
  
    this.dataSource.filter = filterValue;
  }

   // Selecciona una persona (Asistencial o NoAsistencial)
  selectPersona(persona: AsistencialSummaryDto): void {
    // Verifica que el objeto tenga la estructura correcta
    console.log('Selected Persona:', persona);
  
    // Cierra el diálogo y pasa el objeto `asistencial` al componente padre
    this.dialogRef.close(persona);
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
    this.efectorIdSubscription?.unsubscribe();
  }  
}