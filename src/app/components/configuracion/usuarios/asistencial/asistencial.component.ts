import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { AsistencialDetailComponent } from '../asistencial-detail/asistencial-detail.component';
import { Router } from '@angular/router';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
//import { NovedadesFormComponent } from 'src/app/components/personal/novedades-form/novedades-form.component';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { AsistencialListDto } from 'src/app/dto/Configuracion/asistencial/AsistencialListDto';

@Component({
  selector: 'app-asistencial',
  templateUrl: './asistencial.component.html',
  styleUrls: ['./asistencial.component.css']
})

export class AsistencialComponent implements OnInit, OnDestroy {

  dniVisible: boolean = false;
  domicilioVisible: boolean = false;
  estadoVisible: boolean = false;
  fechaNacimientoVisible: boolean = false;
  telefonoVisible: boolean = false;
  emailVisible: boolean = false;

  @ViewChild(MatTable) table!: MatTable<Asistencial>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<AsistencialDetailComponent>;
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'cuil', 'acciones'];
  dataSource!: MatTableDataSource<Asistencial>;
  suscription!: Subscription;
  asistencial!: Asistencial;
  legajos: Legajo[] = [];
  isLoadingLegajos: boolean = true;

  showMessage: boolean = false;

  private efectorIdSubscription!: Subscription;
  
  constructor(
    private asistencialService: AsistencialService,
    private dialog: MatDialog,
    public dialogNov: MatDialog,
    public dialogDistrib: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private legajoService: LegajoService,
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
    // Leer el ID del efector del sessionStorage
    const storedEfectorId = sessionStorage.getItem('selectedEfectorId');
    if (storedEfectorId) {
      const efectorId = Number(storedEfectorId);
      this.asistencialService.setCurrentEfectorId(efectorId); // Actualiza el BehaviorSubject
    }
  
    this.listLegajos();
    
    this.efectorIdSubscription = this.asistencialService.currentEfectorId$.subscribe(efectorId => {
      console.log('ID Efector recibido en asistencial:', efectorId);
      if (efectorId !== null) {
        this.listAsistencial(efectorId);
      } else {
        this.listAsistencial(); // Sin filtro si no hay efectorId
      }
    });
  
    this.suscription = this.asistencialService.refresh$.subscribe(() => {
      this.listAsistencial(); // Sin filtro si es necesario
    });    
    this.actualizarColumnasVisibles();
  }
  
  applyFilter(filterValue: string) {
    const normalizedFilterValue = filterValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    this.dataSource.filterPredicate = (data: Asistencial, filter: string) => {
      const normalizedData = (data.nombre + ' ' + data.apellido + ' ' + data.cuil)
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return normalizedData.indexOf(normalizedFilterValue) != -1;
    };

    this.dataSource.filter = normalizedFilterValue;
  }

  listAsistencial(efectorId: number | null = null): void {
    this.asistencialService.list().subscribe(data => {
      if (efectorId === null) {
        this.dataSource = new MatTableDataSource<Asistencial>([]);
        this.showMessage = true; // Muestra el mensaje si efectorId es null
      } else {
        data = data.filter(asistencial => 
          asistencial.legajos.some(legajo => 
            legajo.efectores.some(efector => efector.id === efectorId)
          )
        );
        this.dataSource = new MatTableDataSource<Asistencial>(data);
        this.showMessage = false;
      }
      
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      console.error('Error al obtener asistenciales:', error);
    });
  }
  
  listLegajos(): void {
    this.legajoService.list().subscribe((legajos: Legajo[]) => {
      this.legajos = legajos;
      this.isLoadingLegajos = false;
      //   this.dataSource.data = [...this.dataSource.data]; // crea una nueva referencia para el array de datos, lo que hace que la tabla vuelva a renderizarse con los datos actualizados.

    });
  }

  createAsistencial(): void {
    this.router.navigate(['/asistencial-create']);
  }

  openDetail(asistencial: Asistencial): void {
    this.dialogRef = this.dialog.open(AsistencialDetailComponent, {
      width: '600px',
      data: asistencial
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
  }

  updateAsistencial(asistencial: Asistencial): void {
    console.log("en asistencial se envia el objeto", asistencial);
    this.router.navigate(['/asistencial-edit'], {
      state: { asistencial }
    });
  }

  deleteAsistencial(asistencial: Asistencial): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + asistencial.nombre,
        title: 'Eliminar',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.asistencialService.delete(asistencial.id!).subscribe(data => {
          this.toastr.success('Asistencial eliminado con éxito', 'ELIMINADO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });

          const index = this.dataSource.data.findIndex(p => p.id === asistencial.id);
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
        }, err => {
          this.toastr.error(err.message, 'Error, no se pudo eliminar el asistencial', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        });
      }
    });
  }

  /*openNovedades() {
    this.dialogNov.open(NovedadesFormComponent, {
      width: '600px',
      disableClose: true,
    })
  }*/

  openDistribucion() {
    this.router.navigate(['/dist-horaria']);
  }

  verNovedad(asistencial: Asistencial): void {
    if (asistencial && asistencial.id) {
      this.asistencialService.setCurrentAsistencial(asistencial);
      this.router.navigate(['/novedades-person']);
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
  }

  verDistribucion(asistencial: Asistencial): void {
    if (asistencial && asistencial.id) {
      this.asistencialService.setCurrentAsistencial(asistencial);
      this.router.navigate(['/personal-dh']);
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
  }

  hayLegajos(asistencial: AsistencialListDto): boolean {
    return this.legajos.some(legajo => legajo.persona.id === asistencial.id);
  }

  verLegajo(asistencial: AsistencialListDto): void {
    if (asistencial && asistencial.id) {
      //this.router.navigate(['/legajo-person', asistencial.id]);
      this.router.navigate(['/legajo-person'], {
        state: { asistencial , fromAsistencial: true}
      });
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
  }

  crearLegajo(asistencial: AsistencialListDto): void {

    console.log("en asistencial se envia el objeto", asistencial);
    this.router.navigate(['/legajo-create'], {
      state: { asistencial, fromAsistencial: true }
    });
  }

  // obtengo el tooltip del botón basado en la existencia de legajos
  getTooltip(asistencial: AsistencialListDto): string {
    return this.hayLegajos(asistencial) ? 'Ver Legajo' : 'Agregar Legajo';
  }

  // Obtener el ícono del botón basado en la existencia de legajos
  getIcon(asistencial: AsistencialListDto): string {
    return this.hayLegajos(asistencial) ? 'playlist_play' : 'playlist_add';
  }

  // Determinar la acción del botón basada en la existencia de legajos
  getButtonAction(asistencial: AsistencialListDto): void {
    if (this.hayLegajos(asistencial)) {
      this.verLegajo(asistencial);
    } else {
      this.crearLegajo(asistencial);
    }
  }

  actualizarColumnasVisibles(): void {
    let columnasBase = ['nombre', 'apellido', 'cuil', 'acciones'];

    let columnasVisibles: string[] = [];

    columnasBase.forEach(columna => {
      columnasVisibles.push(columna);
      if (columna === 'cuil' && this.domicilioVisible) {
        columnasVisibles.push('domicilio');
      }
    });

    this.displayedColumns = columnasVisibles;

    if (this.table) {
      this.table.renderRows();
    }
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

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }
}