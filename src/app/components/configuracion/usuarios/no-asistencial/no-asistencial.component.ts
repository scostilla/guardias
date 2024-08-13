import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatPaginator, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';
import { NoAsistencialEditComponent } from '../no-asistencial-edit/no-asistencial-edit.component';
import { NoAsistencialDetailComponent } from '../no-asistencial-detail/no-asistencial-detail.component'; 
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { LegajoCreateComponent } from '../legajo-create/legajo-create.component';
import { Router } from '@angular/router';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { NoAsistencialListDto } from 'src/app/dto/Configuracion/noAsistencial/NoAsistencialListDto';
import { NoAsistencialCreateComponent } from '../no-asistencial-create/no-asistencial-create.component';

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
  descripcionVisible: boolean = false;

  @ViewChild(MatTable) table!: MatTable<NoAsistencial>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<NoAsistencialDetailComponent>;
  displayedColumns: string[] = ['nombre', 'apellido', 'cuil',  'acciones'];
  dataSource!: MatTableDataSource<NoAsistencialListDto>;
  suscription!: Subscription;
  legajos: Legajo[] = [];
  isLoadingLegajos: boolean = true;
  //noasiasistencial!: NoAsistencialListDto;

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
      return `${start} - ${end} de ${length}`; };
     }

  ngOnInit(): void {
    this.listLegajos();
    this.listNoAsistencial();

    this.suscription = this.noasistencialService.refresh$.subscribe(() => {
      this.listNoAsistencial();
    })

    this.actualizarColumnasVisibles();

  }

  listNoAsistencial(): void {
    this.noasistencialService.listDtos().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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
      if (columna === 'cuil' && this.telefonoVisible) {
        columnasVisibles.push('telefono');
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

  applyFilter(filterValue: string) {
    const normalizedFilterValue = filterValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
    this.dataSource.filterPredicate = (data: NoAsistencialListDto, filter: string) => {
      const normalizedData = (data.nombre + ' ' + data.apellido + ' ' + data.cuil)
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return normalizedData.indexOf(normalizedFilterValue) != -1;
    };
  
    this.dataSource.filter = normalizedFilterValue;
  }

  /* applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: NoAsistencial, filter: string) => {
      return this.accentFilter(data.nombre.toLowerCase()).includes(this.accentFilter(filter)) || 
      this.accentFilter(data.apellido.toLowerCase()).includes(this.accentFilter(filter)) || 
      this.accentFilter(data.cuil.toString().toLowerCase()).includes(this.accentFilter(filter.toString().toLowerCase()))
    };
  } */

  createNoAsistencial(): void {
    const dialogRef = this.dialog.open(NoAsistencialCreateComponent, {
      width: '600px',
      data: null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result) {
          this.toastr.success('No Asistencial creado con éxito', 'EXITO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
          this.dataSource.data.push(result);
          this.dataSource._updateChangeSubscription();
        } else {
          this.toastr.error('Ocurrió un error al crear el No Asistencial', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
      }
    });
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

    editNoAsistencial(noAsistencial?: NoAsistencial): void {
      const esEdicion = noAsistencial != null;
      const dialogRef = this.dialog.open(NoAsistencialEditComponent, {
        width: '600px',
        data: noAsistencial
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

hayLegajos(noAsistencial: NoAsistencial): boolean {
  return this.legajos.some(legajo => legajo.persona.id === noAsistencial.id);
}

verLegajo(noAsistencial: NoAsistencial): void {
  if (noAsistencial && noAsistencial.id) {
    this.router.navigate(['/legajo-person', noAsistencial.id]);
  } else {
    console.error('El objeto no asistencial no tiene un id.');
  }
}

listLegajos(): void {
  this.isLoadingLegajos = true;
  this.legajoService.list().subscribe((legajos: Legajo[]) => {
    this.legajos = legajos;
    this.isLoadingLegajos = false;
    this.dataSource.data = [...this.dataSource.data]; // crea una nueva referencia para el array de datos, lo que hace que la tabla vuelva a renderizarse con los datos actualizados.
  });
}

crearLegajo(noAsistencial: NoAsistencial): void {
  const dialogRef = this.dialog.open(LegajoCreateComponent, {
    width: '600px',
    data: {noAsistencial } // Envío la persona al componente
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

}