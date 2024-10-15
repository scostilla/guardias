import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatPaginator, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { LegajoEditComponent } from '../legajo-edit/legajo-edit.component';
import { LegajoDetailComponent } from '../legajo-detail/legajo-detail.component'; 
import { Revista } from 'src/app/models/Configuracion/Revista';
import { RevistaService } from 'src/app/services/Configuracion/revista.service';
import { RevistaDetailComponent } from '../revista-detail/revista-detail.component';

import { Router } from '@angular/router';


@Component({
  selector: 'app-legajo',
  templateUrl: './legajo.component.html',
  styleUrls: ['./legajo.component.css']
})

export class LegajoComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<Legajo>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRefLegajo!: MatDialogRef<LegajoDetailComponent>;
  dialogRefRevista!: MatDialogRef<RevistaDetailComponent>;
  displayedColumns: string[] = ['persona', 'profesion','udo','actual', 'legal', 'fechaInicio',/* 'fechaFinal',  'matriculaNacional', 'matriculaProvincial', 'cargo', */ 'acciones'];
  dataSource!: MatTableDataSource<Legajo>;
  suscription!: Subscription;
  legajo!: Legajo;
  revistas: Revista[] = [];
  isLoadingRevistas: boolean = true;

  constructor(
    private legajoService: LegajoService,
    private revistaService: RevistaService,
    private dialog: MatDialog,
    private toastr: ToastrService,
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
    this.listLegajos();
    this.listRevistas();

    this.suscription = this.legajoService.refresh$.subscribe(() => {
      this.listLegajos();
    })

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    const normalizeText = (text: string) => {
      return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };
  
    this.dataSource.filterPredicate = (data: Legajo, filter: string) => {
      const actualValue = data.actual ? 'sí' : 'no';
      const legalValue = data.legal ? 'sí' : 'no';
  
      const fechaInicioTimestamp = data.fechaInicio ? new Date(data.fechaInicio).getTime() : null;
  
      const dataStr = normalizeText(
        data.persona?.nombre.toLowerCase() + ' ' +
        data.persona?.apellido.toLowerCase() + ' ' +
        data.profesion?.nombre.toLowerCase() + ' ' +
        data.udo?.nombre.toLowerCase() + ' ' +
        actualValue + ' ' + legalValue
      );
  
      const normalizedFilter = normalizeText(filter);
  
      const filterDate = normalizedFilter.split('/').reverse().join('-');
      const filterTimestamp = Date.parse(filterDate);
  
      if (!isNaN(filterTimestamp)) {
        return fechaInicioTimestamp === filterTimestamp;
      }
  
      return dataStr.indexOf(normalizedFilter) != -1;
    };
  
    this.dataSource.filter = filterValue;
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  listLegajos(): void {
    this.legajoService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  listRevistas(): void {
    this.revistaService.list().subscribe((revistas: Revista[]) => {
      this.revistas = revistas;
      this.isLoadingRevistas = false;
    });
  }

  ngOnDestroy(): void {
      this.suscription?.unsubscribe();
  }

  /* openFormChanges(legajo?: Legajo): void {
    if (legajo && legajo.id) {
      this.router.navigate(['/legajo-edit', legajo.id]);
    } else {
      this.router.navigate(['/legajo-create']);
    }
  } */

    createLegajo(): void {
      this.router.navigate(['/legajo-create']); 
    }

    updateLegajo(legajo: Legajo): void {
      this.router.navigate(['/legajo-edit'], {
        state: {legajo, fromLegajo: true}
      }); 
    }


  /*openFormChanges(legajo?: Legajo): void {
    const esEdicion = legajo != null;
    const dialogRef = this.dialog.open(LegajoEditComponent, {
      width: '600px',
      data: esEdicion ? legajo : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      if (result) {
        this.toastr.success(esEdicion ? 'Legajo editado con éxito' : 'Legajo creado con éxito', 'EXITO', {
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
        this.toastr.error('Ocurrió un error al crear o editar el Legajo', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }
    });
  }*/

  openDetail(legajo: Legajo): void {
    this.dialogRefLegajo = this.dialog.open(LegajoDetailComponent, { 
      width: '600px',
      data: legajo
    });
    this.dialogRefLegajo.afterClosed().subscribe(() => {
      this.dialogRefLegajo.close();
    });
  }
  
  verRevista(legajo: Legajo): void {
    this.dialogRefRevista = this.dialog.open(RevistaDetailComponent, { 
      width: '600px',
      data: { legajoId: legajo.id }
    });
    this.dialogRefRevista.afterClosed().subscribe(() => {
      this.dialogRefRevista.close();
    });
  }

  deleteLegajo(legajo: Legajo): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + legajo.persona?.nombre,
        title: 'Eliminar',
      },
    });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.legajoService.delete(legajo.id!).subscribe(data => {
        this.toastr.success('Legajo eliminado con éxito', 'ELIMINADO', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

        const index = this.dataSource.data.findIndex(p => p.id === legajo.id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }, err => {
        this.toastr.error(err.message, 'Error, no se pudo eliminar el legajo', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      });
    }
  });
}
}