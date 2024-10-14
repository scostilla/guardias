import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';
import { NoAsistencialDetailComponent } from '../no-asistencial-detail/no-asistencial-detail.component';
import { Router } from '@angular/router';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { Legajo } from 'src/app/models/Configuracion/Legajo';

@Component({
  selector: 'app-no-asistencial',
  templateUrl: './no-asistencial.component.html',
  styleUrls: ['./no-asistencial.component.css']
})

export class NoAsistencialComponent implements OnInit, OnDestroy {

  dniVisible: boolean = false;
  domicilioVisible: boolean = false;
  estadoVisible: boolean = false;
  fechaNacimientoVisible: boolean = false;
  telefonoVisible: boolean = false;
  emailVisible: boolean = false;

  @ViewChild(MatTable) table!: MatTable<NoAsistencial>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<NoAsistencialDetailComponent>;
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'cuil', 'acciones'];
  dataSource!: MatTableDataSource<NoAsistencial>;
  suscription!: Subscription;
  noAsistencial!: NoAsistencial;
  legajos: Legajo[] = [];
  isLoadingLegajos: boolean = true;

  constructor(
    private noasistencialService: NoAsistencialService,
    private dialog: MatDialog,
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
    this.listNoAsistencial();

    this.suscription = this.noasistencialService.refresh$.subscribe(() => {
      this.listNoAsistencial();
    })

    this.actualizarColumnasVisibles();

  }

  applyFilter(filterValue: string) {
    const normalizedFilterValue = filterValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    this.dataSource.filterPredicate = (data: NoAsistencial, filter: string) => {
      const normalizedData = (data.nombre + ' ' + data.apellido + ' ' + data.cuil)
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return normalizedData.indexOf(normalizedFilterValue) != -1;
    };

    this.dataSource.filter = normalizedFilterValue;
  }

  /* accentFilter(input: string): string {
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
  } */

  listNoAsistencial(): void {
    this.noasistencialService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  listLegajos(): void {
    this.legajoService.list().subscribe((legajos: Legajo[]) => {
      this.legajos = legajos;
      this.isLoadingLegajos = false;
      //   this.dataSource.data = [...this.dataSource.data]; // crea una nueva referencia para el array de datos, lo que hace que la tabla vuelva a renderizarse con los datos actualizados.

    });
  }

  createNoAsistencial(): void {
    this.router.navigate(['/no-asistencial-create']);
  }

  openDetail(noasistencial: NoAsistencial): void {
    this.dialogRef = this.dialog.open(NoAsistencialDetailComponent, {
      width: '600px',
      data: noasistencial
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
  }

  updateNoAsistencial(noAsistencial: NoAsistencial): void {
    console.log("en no asistencial se envia el objeto", noAsistencial);
    this.router.navigate(['/no-asistencial-edit'], {
      state: { noAsistencial }
    });
  }

  deleteNoAsistencial(noasistencial: NoAsistencial): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + noasistencial.nombre,
        title: 'Eliminar',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.noasistencialService.delete(noasistencial.id!).subscribe(data => {
          this.toastr.success('No Asistencial eliminado con éxito', 'ELIMINADO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });

          const index = this.dataSource.data.findIndex(p => p.id === noasistencial.id);
          this.dataSource.data.splice(index, 1);
          this.dataSource._updateChangeSubscription();
        }, err => {
          this.toastr.error(err.message, 'Error, no se pudo eliminar el no asistencial', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        });
      }
    });
  }

  hayLegajos(noAsistencial: NoAsistencial): boolean {

    return this.legajos.some(legajo => legajo.persona.id === noAsistencial.id);
  }

  verLegajo(noAsistencial: NoAsistencial): void {
    if (noAsistencial && noAsistencial.id) {
      //this.router.navigate(['/legajo-person', asistencial.id]);
      this.router.navigate(['/legajo-person'], {
        state: { noAsistencial, fromNoAsistencial: true  }
      });
    } else {
      console.error('El objeto noAsistencial no tiene un id.');
    }
  }

  crearLegajo(noAsistencial: NoAsistencial): void {

    console.log("en noAsistencial se envia el objeto", noAsistencial);
    this.router.navigate(['/legajo-create'], {
      state: { noAsistencial, fromNoAsistencial: true }
    });
  }

  // obtengo el tooltip del botón basado en la existencia de legajos
  getTooltip(noAsistencial: NoAsistencial): string {
    return this.hayLegajos(noAsistencial) ? 'Ver Legajo' : 'Agregar Legajo';
  }

  // Obtener el ícono del botón basado en la existencia de legajos
  getIcon(noAsistencial: NoAsistencial): string {
    return this.hayLegajos(noAsistencial) ? 'playlist_play' : 'playlist_add';
  }

  // Determinar la acción del botón basada en la existencia de legajos
  getButtonAction(noAsistencial: NoAsistencial): void {
    if (this.hayLegajos(noAsistencial)) {
      this.verLegajo(noAsistencial);
    } else {
      this.crearLegajo(noAsistencial);
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

  formatCuil(cuil: string): string {
    if (!cuil) return '';
    // Asegúrate de que el CUIL tenga al menos 11 dígitos
    if (cuil.length < 11) return cuil;
  
    return `${cuil.slice(0, 2)}-${cuil.slice(2, 10)}-${cuil.slice(10)}`;
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

}