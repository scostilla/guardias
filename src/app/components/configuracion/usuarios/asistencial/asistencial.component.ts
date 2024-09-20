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
import { AsistencialEditComponent } from '../asistencial-edit/asistencial-edit.component';
import { AsistencialDetailComponent } from '../asistencial-detail/asistencial-detail.component'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-asistencial',
  templateUrl: './asistencial.component.html',
  styleUrls: ['./asistencial.component.css']
})

export class AsistencialComponent implements OnInit, OnDestroy {

  domicilioVisible: boolean = false;
  estadoVisible: boolean = false;
  fechaNacimientoVisible: boolean = false;
  sexoVisible: boolean = false;

  @ViewChild(MatTable) table!: MatTable<Asistencial>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<AsistencialDetailComponent>;
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'dni', 'domicilio', 'email', 'estado', 'cuil', 'fechaNacimiento', 'sexo', 'telefono', 'tipoGuardia', 'acciones'];
  dataSource!: MatTableDataSource<Asistencial>;
  suscription!: Subscription;

  constructor(
    private asistencialService: AsistencialService,
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
    this.listAsistencial();

    this.suscription = this.asistencialService.refresh$.subscribe(() => {
      this.listAsistencial();
    })

    this.actualizarColumnasVisibles();

  }

  listAsistencial(): void {
    this.asistencialService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy(): void {
      this.suscription?.unsubscribe();
  }

  actualizarColumnasVisibles(): void {
    let columnasBase = ['id', 'nombre', 'apellido', 'cuil', 'dni', 'email', 'telefono', 'tipoGuardia', 'acciones'];
  
    let columnasVisibles: string[] = [];
  
    columnasBase.forEach(columna => {
      columnasVisibles.push(columna);
      if (columna === 'apellido' && this.domicilioVisible) {
        columnasVisibles.push('domicilio');
      }
      if (columna === 'apellido' && this.estadoVisible) {
        columnasVisibles.push('estado');
      }
      if (columna === 'telefono' && this.fechaNacimientoVisible) {
        columnasVisibles.push('fechaNacimiento');
      }
      if (columna === 'telefono' && this.sexoVisible) {
        columnasVisibles.push('sexo');
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Asistencial, filter: string) => {
      return this.accentFilter(data.nombre.toLowerCase()).includes(this.accentFilter(filter)) || 
      this.accentFilter(data.apellido.toLowerCase()).includes(this.accentFilter(filter)) || 
      this.accentFilter(data.dni.toString().toLowerCase()).includes(this.accentFilter(filter.toString().toLowerCase())) || 
      this.accentFilter(data.domicilio.toLowerCase()).includes(this.accentFilter(filter)) || 
      this.accentFilter(data.cuil.toString().toLowerCase()).includes(this.accentFilter(filter.toString().toLowerCase())) ||
      this.accentFilter(data.fechaNacimiento.toISOString().toLowerCase()).includes(this.accentFilter(filter)) || 
      this.accentFilter(data.sexo.toLowerCase()).includes(this.accentFilter(filter));
    };
  }

  openFormChanges(asistencial?: Asistencial): void {
    const esEdicion = asistencial != null;
    const dialogRef = this.dialog.open(AsistencialEditComponent, {
      width: '600px',
      data: esEdicion ? asistencial : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      if (result) {
        this.toastr.success(esEdicion ? 'Asistencial editado con éxito' : 'Asistencial creado con éxito', 'EXITO', {
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
        this.toastr.error('Ocurrió un error al crear o editar Asistencial', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }
    });
  }

  createAsistencial(): void {
    this.router.navigate(['/asistencial-create']); 
  }

  updateAsistencial(asistencial: Asistencial): void {
    console.log("en asistencial se envia el objeto", asistencial);
    this.router.navigate(['/asistencial-edit'], {
      state: {asistencial}
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