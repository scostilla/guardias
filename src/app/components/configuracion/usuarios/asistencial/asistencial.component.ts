import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatPaginator, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { NovedadesFormComponent } from '../../../personal/novedades-form/novedades-form.component';
import { DistHorariaComponent } from '../../../personal/dist-horaria/dist-horaria.component';

import { Router } from '@angular/router';
import { AsistencialListDto } from 'src/app/dto/Configuracion/asistencial/AsistencialListDto';
import { AsistencialCreateComponent } from '../asistencial-create/asistencial-create.component';
import { AsistencialEditComponent } from '../asistencial-edit/asistencial-edit.component';
import { AsistencialDetailComponent } from '../asistencial-detail/asistencial-detail.component';
import { LegajoCreateComponent } from '../legajo-create/legajo-create.component';

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
  displayedColumns: string[] = ['nombre', 'apellido', 'cuil', 'acciones'];
  dataSource!: MatTableDataSource<AsistencialListDto>;
  suscription!: Subscription;
  asistencial!: AsistencialListDto;
  legajos: Legajo[] = [];
  isLoadingLegajos: boolean = true;

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
      return `${start} - ${end} de ${length}`; };
     }

  ngOnInit(): void {
    this.listLegajos();

    this.listAsistencial();

    this.suscription = this.asistencialService.refresh$.subscribe(() => {
      this.listAsistencial();
    })

    this.actualizarColumnasVisibles();

  }

  applyFilter(filterValue: string) {
    const normalizedFilterValue = filterValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
    this.dataSource.filterPredicate = (data: AsistencialListDto, filter: string) => {
      const normalizedData = (data.nombre + ' ' + data.apellido + ' ' + data.cuil)
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return normalizedData.indexOf(normalizedFilterValue) != -1;
    };
  
    this.dataSource.filter = normalizedFilterValue;
  }

  listAsistencial(): void {
    this.asistencialService.listDtos().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  listLegajos(): void {
    this.isLoadingLegajos = true;
    this.legajoService.list().subscribe((legajos: Legajo[]) => {
      this.legajos = legajos;
      this.isLoadingLegajos = false;
      this.dataSource.data = [...this.dataSource.data]; // crea una nueva referencia para el array de datos, lo que hace que la tabla vuelva a renderizarse con los datos actualizados.
    });
    /* this.legajoService.list().subscribe((legajos: Legajo[]) => {
      this.legajos = legajos;
      this.isLoadingLegajos = false;
      //Forzar la actualización de la tabla
      this.dataSource.data = [...this.dataSource.data]; // crea una nueva referencia para el array de datos, lo que hace que la tabla vuelva a renderizarse con los datos actualizados.
    
    }); */
  }

  verDistribucion(asistencial: Asistencial): void {
    if (asistencial && asistencial.id) {
      this.router.navigate(['/personal-dh', asistencial.id]);
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
  }

  actualizarColumnasVisibles(): void {
    let columnasBase = ['nombre', 'apellido', 'cuil', 'acciones'];
  
    let columnasVisibles: string[] = [];
  
    columnasBase.forEach(columna => {
      columnasVisibles.push(columna);
      if (columna === 'cuil' && this.dniVisible) {
        columnasVisibles.push('dni');
      }
      if (columna === 'cuil' && this.telefonoVisible) {
        columnasVisibles.push('telefono');
      }
    });
    this.displayedColumns = columnasVisibles;
  
    if (this.table) {
      this.table.renderRows();
    }
  }  

  editAsistencial(asistencial?: Asistencial): void {
    const esEdicion = asistencial != null;
    const dialogRef = this.dialog.open(AsistencialEditComponent, {
      width: '600px',
      data: asistencial
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result) {
          this.toastr.success('Asistencial editado con éxito', 'EXITO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          const index = this.dataSource.data.findIndex(p => p.id === result.id);
          this.dataSource.data[index] = result;
          this.dataSource._updateChangeSubscription();
        } else {
          this.toastr.error('Ocurrió un error al editar el asistencial', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
      }
    });
  }

  createAsistencial(): void {
    const dialogRef = this.dialog.open(AsistencialCreateComponent, {
      width: '600px',
      data: null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result) {
          this.toastr.success('Asistencial creado con éxito', 'EXITO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.dataSource.data.push(result);
          this.dataSource._updateChangeSubscription();
        } else {
          this.toastr.error('Ocurrió un error al crear el asistencial', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
      }
    });
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

  openNovedades(){
    this.dialogNov.open(NovedadesFormComponent, {
      width: '600px',
      disableClose: true,
    })
  }

  openDistribucion(){
    this.dialogDistrib.open(DistHorariaComponent, {
      width: '600px',
      disableClose: true,
    })
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

hayLegajos(asistencial: AsistencialListDto): boolean {
  return this.legajos.some(legajo => legajo.persona.id === asistencial.id);
}

verLegajo(asistencial: AsistencialListDto): void {
  if (asistencial && asistencial.id) {
    this.router.navigate(['/legajo-person', asistencial.id]);
  } else {
    console.error('El objeto asistencial no tiene un id.');
  }
}

crearLegajo(asistencial: AsistencialListDto): void {
  const dialogRef = this.dialog.open(LegajoCreateComponent, {
    width: '600px',
    data: {
      tipoPersona: 'Asistencial',
      persona: asistencial } // Envío la persona al componente
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result !== undefined) {
      if (result) {
        this.toastr.success('Legajo creado con éxito', 'EXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        // Actualizar la lista de legajos y la tabla
      this.listLegajos();
        /* this.dataSource.data.push(result);
        this.dataSource._updateChangeSubscription(); */
      } else {
        this.toastr.error('No se creó el Legajo', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }
  });
}  
/* crearLegajo(): void {
    const dialogRef = this.dialog.open(LegajoEditComponent, {
      width: '600px',
      data: null 
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result) {
          this.toastr.success('Legajo creado con éxito', 'EXITO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.dataSource.data.push(result);
          this.dataSource._updateChangeSubscription();
        } else {
          this.toastr.error('No se creó el Legajo', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
      }
    });
  }   */


ngOnDestroy(): void {
  this.suscription?.unsubscribe();
}
}