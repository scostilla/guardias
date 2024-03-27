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
import { PersonDetailComponent } from '../person-detail/person-detail.component';
import { PersonEditComponent } from '../person-edit/person-edit.component';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
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
  sexoVisible: boolean = false;
  emailVisible: boolean = false;


  @ViewChild(MatTable) table!: MatTable<Asistencial>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<PersonDetailComponent>;
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'dni', 'domicilio', 'email', 'estado', 'cuil', 'fechaNacimiento', 'sexo', 'telefono', 'tipoGuardia', 'acciones'];
  dataSource!: MatTableDataSource<Asistencial>;
  suscription!: Subscription;
  asistencial!: Asistencial;
  legajos: Legajo[] = [];

  constructor(
    private asistencialService: AsistencialService,
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

  listLegajos(): void {
    this.legajoService.list().subscribe((legajos: Legajo[]) => {
      this.legajos = legajos;
    });
  }

  hayLegajos(asistencial: Asistencial): boolean {
    return this.legajos.some(legajo => legajo.persona.id === asistencial.id);
  }

  verLegajo(): void {
    this.router.navigate(['/legajo-person'], { queryParams: { id: this.asistencial.id } });
  }

  ngOnDestroy(): void {
      this.suscription?.unsubscribe();
  }

  actualizarColumnasVisibles(): void {
    let columnasBase = ['id', 'nombre', 'apellido', 'cuil', 'telefono', 'acciones'];
  
    let columnasVisibles: string[] = [];
  
    columnasBase.forEach(columna => {
      columnasVisibles.push(columna);
      if (columna === 'cuil' && this.dniVisible) {
        columnasVisibles.push('dni');
      }
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
      if (columna === 'telefono' && this.emailVisible) {
        columnasVisibles.push('email');
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
  }

  openDetail(asistencial: Asistencial): void {
    this.dialogRef = this.dialog.open(PersonDetailComponent, { 
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

