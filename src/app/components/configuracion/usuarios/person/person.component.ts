import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { PersonDetailComponent } from '../person-detail/person-detail.component';
import { PersonEditComponent } from '../person-edit/person-edit.component';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { LegajoEditComponent } from '../legajo-edit/legajo-edit.component';
import { NovedadesFormComponent } from '../../../personal/novedades-form/novedades-form.component';
import { DistHorariaComponent } from '../../../personal/dist-horaria/dist-horaria.component';

import { Router } from '@angular/router';


@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})

export class PersonComponent implements OnInit, OnDestroy {

  dniVisible: boolean = false;
  domicilioVisible: boolean = false;
  estadoVisible: boolean = false;
  fechaNacimientoVisible: boolean = false;
  telefonoVisible: boolean = false;
  emailVisible: boolean = false;


  @ViewChild(MatTable) table!: MatTable<Asistencial>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<PersonDetailComponent>;
  displayedColumns: string[] = ['id', 'nombre', 'apellido', /*  'dni', 'domicilio', 'email', 'estado', */'cuil',  /*'fechaNacimiento',  'sexo', 'telefono', 'tipoGuardia', */ 'acciones'];
  dataSource!: MatTableDataSource<Asistencial>;
  suscription!: Subscription;
  asistencial!: Asistencial;
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
  
    this.dataSource.filterPredicate = (data: Asistencial, filter: string) => {
      const normalizedData = (data.nombre + ' ' + data.apellido + ' ' + data.cuil)
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return normalizedData.indexOf(normalizedFilterValue) != -1;
    };
  
    this.dataSource.filter = normalizedFilterValue;
  }
        
  listAsistencial(): void {
    this.asistencialService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  listLegajos(): void {
    this.legajoService.list().subscribe((legajos: Legajo[]) => {
      this.legajos = legajos;
      this.isLoadingLegajos = false;
    });
  }

  hayLegajos(asistencial: Asistencial): boolean {
    return this.legajos.some(legajo => legajo.persona.id === asistencial.id);
  }

  verLegajo(asistencial: Asistencial): void {
    if (asistencial && asistencial.id) {
      this.router.navigate(['/legajo-person', asistencial.id]);
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
  }

  crearLegajo(): void {
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
  }  

  verDistribucion(asistencial: Asistencial): void {
    if (asistencial && asistencial.id) {
      this.router.navigate(['/personal-dh', asistencial.id]);
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
  }

  ngOnDestroy(): void {
      this.suscription?.unsubscribe();
  }

  actualizarColumnasVisibles(): void {
    let columnasBase = ['nombre', 'apellido', 'cuil', 'acciones'];
  
    let columnasVisibles: string[] = [];
  
    columnasBase.forEach(columna => {
      columnasVisibles.push(columna);
      if (columna === 'cuil' && this.dniVisible) {
        columnasVisibles.push('dni');
      }
      /* if (columna === 'apellido' && this.domicilioVisible) {
        columnasVisibles.push('domicilio');
      }
      if (columna === 'apellido' && this.estadoVisible) {
        columnasVisibles.push('estado');
      } 
      if (columna === 'cuil' && this.fechaNacimientoVisible) {
        columnasVisibles.push('fechaNacimiento');
      }*/
      if (columna === 'cuil' && this.telefonoVisible) {
        columnasVisibles.push('telefono');
      }
      /*if (columna === 'telefono' && this.emailVisible) {
        columnasVisibles.push('email');
      } */
    });
  
    this.displayedColumns = columnasVisibles;
  
    if (this.table) {
      this.table.renderRows();
    }
  } 
  
  openFormChanges(asistencial?: Asistencial): void {
    if (asistencial && asistencial.id) {
      this.router.navigate(['/person-edit', asistencial.id]);
    } else {
      this.router.navigate(['/person-edit']);
    }
  }

 /* openFormChanges(asistencial?: Asistencial): void {
    const esEdicion = asistencial != null;
    const dialogRef = this.dialog.open(PersonEditComponent, {
      width: '600px',
      data: esEdicion ? asistencial : null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type === 'save') {
        this.toastr.success(esEdicion ? 'Asistencial editado con éxito' : 'Asistencial creado con éxito', 'EXITO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        if (esEdicion) {
          const index = this.dataSource.data.findIndex(p => p.id === result.data.id);
          this.dataSource.data[index] = result.data;
        } else {
          this.dataSource.data.push(result.data);
        }
        this.dataSource._updateChangeSubscription();
      } else if (result && result.type === 'error') {
        this.toastr.error('Ocurrió un error al crear o editar Asistencial', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      } else if (result && result.type === 'cancel') {
      }
    });
  } */

  openDetail(asistencial: Asistencial): void {
    this.dialogRef = this.dialog.open(PersonDetailComponent, { 
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
    this.router.navigate(['/dist-horaria']);
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
}