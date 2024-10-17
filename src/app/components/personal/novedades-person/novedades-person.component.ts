import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { NovedadPersonal } from 'src/app/models/personal/NovedadPersonal';
import { NovedadPersonalDto } from 'src/app/dto/personal/NovedadPersonalDto';
import { NovedadPersonalService } from 'src/app/services/personal/novedadPersonal.service';
import { NovedadesPersonEditComponent } from '../novedades-person-edit/novedades-person-edit.component';
import { NovedadesPersonDetailComponent } from '../novedades-person-detail/novedades-person-detail.component';
import { ActivatedRoute } from '@angular/router';

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
  this.asistencialService.currentAsistencial$.subscribe(asistencial => {
    if (asistencial) {
      this.asistencialId = asistencial.id;
      this.listNovedad();
    } else {
      console.error('No hay asistencial seleccionado.');
    }
  });
    this.listNovedad();

    this.suscription = this.novedadPersonalService.refresh$.subscribe(() => {
      this.listNovedad();
    })

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

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  this.dataSource.filter = filterValue;
  this.dataSource.filterPredicate = (data: NovedadPersonal, filter: string) => {
    const descripcion = data.tipoLicencia.toString();
    const fechaInicioString = data.fechaInicio.toISOString().toLowerCase();
    const fechaFinalString = data.fechaFinal.toISOString().toLowerCase();


    // Aplicar el filtro a los valores convertidos
    return this.accentFilter(descripcion).includes(this.accentFilter(filter)) || 
           this.accentFilter(fechaInicioString).includes(this.accentFilter(filter)) || 
           this.accentFilter(fechaFinalString).includes(this.accentFilter(filter));
  };
}

openFormChanges(novedadPersonal?: NovedadPersonal): void {
  const esEdicion = !!novedadPersonal;
  const dialogData = {
    asistencialId: this.asistencialId,
    novedadPersonal: esEdicion ? novedadPersonal : null
  };

  const dialogRef = this.dialog.open(NovedadesPersonEditComponent, {
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