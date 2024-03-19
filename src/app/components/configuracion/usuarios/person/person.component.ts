import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatPaginator, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Person } from 'src/app/models/Configuracion/Person';
import { PersonService } from 'src/app/services/Configuracion/person.service';
import { PersonEditComponent } from '../person-edit/person-edit.component';
import { PersonDetailComponent } from '../person-detail/person-detail.component'; 

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})

export class PersonComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<Person>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<PersonDetailComponent>;
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'dni', 'cuil', 'fechaNacimiento', 'sexo', 'acciones'];
  dataSource!: MatTableDataSource<Person>;
  suscription!: Subscription;
  tipo?: string;

  constructor(
    private personService: PersonService,
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
    this.listPerson();

    this.suscription = this.personService.refresh$.subscribe(() => {
      this.listPerson();
    })

  }

  listPerson(): void {
    this.personService.list().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: Person, filter: string) => {
      return this.accentFilter(data.nombre.toLowerCase()).includes(this.accentFilter(filter)) || 
      this.accentFilter(data.apellido.toLowerCase()).includes(this.accentFilter(filter)) || 
      this.accentFilter(data.dni.toString().toLowerCase()).includes(this.accentFilter(filter.toString().toLowerCase())) || 
      this.accentFilter(data.cuil.toString().toLowerCase()).includes(this.accentFilter(filter.toString().toLowerCase())) ||
      this.accentFilter(data.fechaNacimiento.toISOString().toLowerCase()).includes(this.accentFilter(filter)) || 
      this.accentFilter(data.sexo.toLowerCase()).includes(this.accentFilter(filter));
    };
  }

  openFormChanges(person?: Person): void {
    const esEdicion = person != null;
    const dialogRef = this.dialog.open(PersonEditComponent, {
      width: '600px',
      data: esEdicion ? person : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
      if (result) {
        this.toastr.success(esEdicion ? 'Persona editada con éxito' : 'Persona creada con éxito', 'EXITO', {
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
        this.toastr.error('Ocurrió un error al crear o editar la Persona', 'Error', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }
    });
  }

  openDetail(person: Person): void {
    this.dialogRef = this.dialog.open(PersonDetailComponent, { 
      width: '600px',
      data: person
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
    }

  deletePerson(person: Person): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + person.nombre,
        title: 'Eliminar',
      },
    });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.personService.delete(person.id!).subscribe(data => {
        this.toastr.success('Persona eliminada con éxito', 'ELIMINADA', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });

        const index = this.dataSource.data.findIndex(p => p.id === person.id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      }, err => {
        this.toastr.error(err.message, 'Error, no se pudo eliminar la persona', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      });
    }
  });
}
}