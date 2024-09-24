import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { AsistencialDetailComponent } from '../asistencial-detail/asistencial-detail.component';
import { Router } from '@angular/router';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { LegajoEditComponent } from '../legajo-edit/legajo-edit.component';
import { NovedadesPersonEditComponent } from 'src/app/components/personal/novedades-person-edit/novedades-person-edit.component';
import { Legajo } from 'src/app/models/Configuracion/Legajo';

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
    this.listLegajos();
    this.listAsistencial();

    this.suscription = this.asistencialService.refresh$.subscribe(() => {
      this.listAsistencial();
    })

    this.actualizarColumnasVisibles();

  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
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

  actualizarColumnasVisibles(): void {
    let columnasBase = ['nombre', 'apellido', 'cuil', 'acciones'];

    let columnasVisibles: string[] = [];

    columnasBase.forEach(columna => {
      columnasVisibles.push(columna);
      if (columna === 'cuil' && this.domicilioVisible) {
        columnasVisibles.push('domicilio');
      }
      /* if (columna === 'apellido' && this.estadoVisible) {
        columnasVisibles.push('estado');
      }
      if (columna === 'telefono' && this.fechaNacimientoVisible) {
        columnasVisibles.push('fechaNacimiento');
      }
      if (columna === 'telefono' && this.sexoVisible) {
        columnasVisibles.push('sexo');
      } */
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

  openFormChanges(asistencial?: Asistencial): void {
    if (asistencial && asistencial.id) {
      this.router.navigate(['/asistencial-edit', asistencial.id]);
    } else {
      this.router.navigate(['/asistencial-create']);
    }
  }

  createAsistencial(): void {
    this.router.navigate(['/asistencial-create']);
  }

  updateAsistencial(asistencial: Asistencial): void {
    console.log("en asistencial se envia el objeto", asistencial);
    this.router.navigate(['/asistencial-edit'], {
      state: { asistencial }
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

  openNovedades() {
    this.dialogNov.open(NovedadesPersonEditComponent, {
      width: '600px',
      disableClose: true,
    })
  }

  openDistribucion() {
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