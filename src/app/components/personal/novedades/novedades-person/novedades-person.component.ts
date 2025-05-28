import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { NovedadPersonal } from 'src/app/models/personal/NovedadPersonal';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { NovedadesPersonCreateComponent } from '../novedades-person-create/novedades-person-create.component';
import { NovedadesPersonDetailComponent } from '../novedades-person-detail/novedades-person-detail.component';
import { NovedadesPersonEditComponent } from '../novedades-person-edit/novedades-person-edit.component';
import * as moment from 'moment';
@Component({
  selector: 'app-novedades-person',
  templateUrl: './novedades-person.component.html',
  styleUrls: ['./novedades-person.component.css']
})

export class NovedadesPersonComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<NovedadPersonal>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<NovedadesPersonDetailComponent>;
  displayedColumns: string[] = ['tipoLicencia', 'fechaInicio', 'fechaFinal', 'acciones'];
  dataSource!: MatTableDataSource<NovedadPersonal>;
  suscription!: Subscription;
  novedades: NovedadPersonal[] = [];
  asistencialId?: number;
  nombreCompleto: string = '';
  tieneNovedades: boolean = true;

  constructor(
    private novedadPersonalService: NovedadPersonalService,
    private asistencialService: AsistencialService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
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
    // Suscripción para obtener el ID del asistencial
    this.asistencialService.currentAsistencialId$.subscribe(id => {
      if (id === null) {
        console.error('No hay ID de asistencial disponible.');
        this.router.navigate(['personal']);  // Redirigir a la página anterior o deseada
        return;
      }

      // Llamar al servicio para obtener el asistencial completo usando el ID
      this.asistencialService.detail(id).subscribe({
        next: (asistencial) => {
          if (asistencial) {
            this.asistencialId = asistencial.id;  // Asignar el ID del asistencial
            this.listNovedad();  // Llamar al método listNovedad para obtener las novedades
          } else {
            console.error('No se encontró el asistencial con el ID proporcionado.');
            this.router.navigate(['personal']);  // Redirigir si no se encuentra el asistencial
          }
        },
        error: (err) => {
          console.error('Error al obtener el asistencial:', err);
          this.router.navigate(['personal']);  // Redirigir en caso de error
        }
      });
    });

    // Inicialización de novedades, sin esperar a la respuesta inicial
    this.listNovedad();

    // Suscripción para refrescar los datos de novedades
    this.suscription = this.novedadPersonalService.refresh$.subscribe(() => {
      this.listNovedad();  // Volver a cargar novedades cuando se refresque
    });
    
  }

  listNovedad(): void {
    if (this.asistencialId === undefined) {
      this.tieneNovedades = false;
      return;
    }
  
    this.novedadPersonalService.list().subscribe(data => {
      this.novedades = data.filter(novedad => novedad.persona.id === this.asistencialId);
  
      this.tieneNovedades = this.novedades.length > 0;
  
      // Actualiza el dataSource
      this.dataSource = new MatTableDataSource(this.novedades);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  
      // Obtener el asistencial completo
      this.asistencialService.getByIds([this.asistencialId!]).subscribe(asistenciales => {
        const asistencial = asistenciales[0];
        if (asistencial) {
          this.nombreCompleto = `${asistencial.apellido}, ${asistencial.nombre}`;
        }
      });
    });
  }
      
  ngOnDestroy(): void {
      this.suscription?.unsubscribe();
  }

applyFilter(event: Event): void {
  const input = (event.target as HTMLInputElement).value;
  const normalizedFilterValue = this.normalize(input);

  this.dataSource.filterPredicate = (data: NovedadPersonal, filter: string): boolean => {
    const tipoLicencia = data.tipoLicencia?.nombre ?? '';

    const fechaInicioStr = moment(data.fechaInicio).isValid()
      ? moment(data.fechaInicio).format('DD/MM/YYYY')
      : '';
    const fechaFinalStr = moment(data.fechaFinal).isValid()
      ? moment(data.fechaFinal).format('DD/MM/YYYY')
      : '';

    const content = `${tipoLicencia} ${fechaInicioStr} ${fechaFinalStr}`;
    const normalizedContent = this.normalize(content);

    return normalizedContent.includes(filter);
  };

  this.dataSource.filter = normalizedFilterValue;
}

normalize(value: string): string {
  return value
    .normalize('NFD')                      // descompone letras con tilde
    .replace(/[\u0300-\u036f]/g, '')       // remueve los acentos
    .toLowerCase()
    .trim();
}

openFormCreate(novedadPersonal?: NovedadPersonal): void {
  const esEdicion = !!novedadPersonal;
  const dialogData = {
    asistencialId: this.asistencialId,
    novedadPersonal: esEdicion ? novedadPersonal : null
  };

  const dialogRef = this.dialog.open(NovedadesPersonCreateComponent, {
    width: '600px',
    data: dialogData
  });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      if (result) {
        this.toastr.success(esEdicion ? 'Novedad editada con éxito' : 'Novedad creada con éxito', 'EXITO', {
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
        this.toastr.error('Ocurrió un error al crear o editar la Novedad', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }
    });
  }

  openEditForm(novedad: NovedadPersonal): void {
    const dialogRef = this.dialog.open(NovedadesPersonEditComponent, {
      width: '800px',
      disableClose: true,
      data: {
        asistencialId: this.asistencialId,
        novedadPersonal: novedad
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result?.type === 'save') {
        this.toastr.success('Novedad guardada exitosamente', 'Éxito');
      } else if (result?.type === 'error') {
        this.toastr.error('Hubo un error al guardar la novedad', 'Error');
      }
    });
  }

  openDetail(novedadPersonal: NovedadPersonal): void {
    this.dialogRef = this.dialog.open(NovedadesPersonDetailComponent, { 
      width: '600px',
      data: novedadPersonal
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
    }

  deleteNovedadPersonal(novedadPersonal: NovedadPersonal): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + novedadPersonal.id,
        title: 'Eliminar',
      },
    });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.novedadPersonalService.delete(novedadPersonal.id!).subscribe(data => {
        this.toastr.success('Novedad eliminada con éxito', 'ELIMINADO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

        const index = this.dataSource.data.findIndex(p => p.id === novedadPersonal.id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }, err => {
        this.toastr.error(err.message, 'Error, no se pudo eliminar la novedad', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      });
    }
  });
}
}