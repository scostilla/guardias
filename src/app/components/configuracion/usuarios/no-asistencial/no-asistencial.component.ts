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
  displayedColumns: string[] = ['id', 'nombre', 'apellido', /*'dni', 'domicilio', 'email', 'estado', */ 'cuil', /*'fechaNacimiento', 'sexo', 'telefono', 'descripcion', */ 'acciones'];
  dataSource!: MatTableDataSource<NoAsistencial>;
  suscription!: Subscription;

  constructor(
    private noasistencialService: NoAsistencialService,
    private dialog: MatDialog,
    private toastr: ToastrService,
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
    this.listNoAsistencial();

    this.suscription = this.noasistencialService.refresh$.subscribe(() => {
      this.listNoAsistencial();
    })

    this.actualizarColumnasVisibles();

  }

  listNoAsistencial(): void {
    this.noasistencialService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
      this.suscription?.unsubscribe();
  }

  actualizarColumnasVisibles(): void {
    let columnasBase = ['id', 'nombre', 'apellido', 'cuil', 'acciones'];
  
    let columnasVisibles: string[] = [];
  
    columnasBase.forEach(columna => {
      columnasVisibles.push(columna);
      if (columna === 'cuil' && this.dniVisible) {
        columnasVisibles.push('dni');
      }
      /*if (columna === 'apellido' && this.domicilioVisible) {
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
      }
      if (columna === 'telefono' && this.descripcionVisible) {
        columnasVisibles.push('descripcion');
      }*/
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: NoAsistencial, filter: string) => {
      return this.accentFilter(data.nombre.toLowerCase()).includes(this.accentFilter(filter)) || 
      this.accentFilter(data.apellido.toLowerCase()).includes(this.accentFilter(filter)) || 
      this.accentFilter(data.cuil.toString().toLowerCase()).includes(this.accentFilter(filter.toString().toLowerCase()))
    };
  }

  openFormChanges(noasistencial?: NoAsistencial): void {
    const esEdicion = noasistencial != null;
    const dialogRef = this.dialog.open(NoAsistencialEditComponent, {
      width: '600px',
      data: esEdicion ? noasistencial : null
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.type === 'save') {
        this.toastr.success(esEdicion ? 'No Asistencial editado con éxito' : 'No Asistencial creado con éxito', 'EXITO', {
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
        this.toastr.error('Ocurrió un error al crear o editar No Asistencial', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      } else if (result && result.type === 'cancel') {
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
}