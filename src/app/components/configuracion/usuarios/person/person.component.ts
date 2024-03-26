import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef  } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';
import {MatPaginator, MatPaginatorIntl, PageEvent} from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Subscription, forkJoin } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { PersonEditComponent } from '../person-edit/person-edit.component';
import { AsistencialEditComponent } from '../asistencial-edit/asistencial-edit.component';
import { AsistencialDetailComponent } from '../asistencial-detail/asistencial-detail.component';
import { NoAsistencialEditComponent } from '../no-asistencial-edit/no-asistencial-edit.component';
import { NoAsistencialDetailComponent } from '../no-asistencial-detail/no-asistencial-detail.component';
import { ComponentType } from '@angular/cdk/portal';


@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'dni', 'email', 'telefono', 'tipo', 'acciones'];
  dataSource = new MatTableDataSource();
  tipoFiltro: string = '';
  subscriptions: { [key: string]: Subscription } = {};


  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private asistencialService: AsistencialService,
    private noAsistencialService: NoAsistencialService,
    private toastr: ToastrService,
    private paginatorIntl: MatPaginatorIntl,
    public dialog: MatDialog
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
    this.subscriptions['asistencial'] = this.asistencialService.refresh$.subscribe(() => {
      this.listPerson();
    });
    this.subscriptions['noAsistencial'] = this.noAsistencialService.refresh$.subscribe(() => {
      this.listPerson();
    });
  }
  
  ngOnDestroy(): void {
    Object.values(this.subscriptions).forEach(subscription => subscription.unsubscribe());
  }

  onTipoChange(newTipo: string) {
    this.tipoFiltro = newTipo;
    this.dataSource.filter = newTipo;
  }

  listPerson(): void {
    forkJoin([
      this.asistencialService.list(),
      this.noAsistencialService.list()
    ]).subscribe(results => {
      const combinedData = [
        ...results[0].map(item => ({ ...item, tipo: 'Asistencial' })),
        ...results[1].map(item => ({ ...item, tipo: 'No Asistencial' }))
      ];
      this.dataSource.data = combinedData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  openDetail(person: any): void {
    if (person.tipo === 'Asistencial') {
      const dialogRefAsistencial = this.dialog.open(AsistencialDetailComponent, {
        width: '600px',
        data: person
      });
      dialogRefAsistencial.afterClosed().subscribe(() => {
      });
    } else if (person.tipo === 'No Asistencial') {
      const dialogRefNoAsistencial = this.dialog.open(NoAsistencialDetailComponent, {
        width: '600px',
        data: person
      });
      dialogRefNoAsistencial.afterClosed().subscribe(() => {
      });
    }
  }
  
  openFormChanges(person: any): void {
    let dialogRef;
    if (person.tipo === 'Asistencial') {
      dialogRef = this.dialog.open(AsistencialEditComponent, {
        width: '600px',
        data: person
      });
    } else if (person.tipo === 'No Asistencial') {
      dialogRef = this.dialog.open(NoAsistencialEditComponent, {
        width: '600px',
        data: person
      });
    }
  
    if (dialogRef) {
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.type === 'save') {
          this.toastr.success('Los cambios en la persona se han guardado con éxito.', 'EXITO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        } else if (result && result.type === 'cancel') {
          this.toastr.info('Se canceló la operación de edición.', 'Información', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        } else {
          this.toastr.error('No se guardaron los cambios de la persona.', 'Error', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });
        }
      });
    }
  }

  openCreate(): void {
    const dialogRef = this.dialog.open(PersonEditComponent, {
      width: '600px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let dialogComponent: ComponentType<any> | null = null;
  
        if (result === 'Asistencial') {
          dialogComponent = AsistencialEditComponent as ComponentType<AsistencialEditComponent>;
        } else if (result === 'No Asistencial') {
          dialogComponent = NoAsistencialEditComponent as ComponentType<NoAsistencialEditComponent>;
        }
  
        if (dialogComponent) {
          const editDialogRef = this.dialog.open(dialogComponent, {
            width: '600px',
            data: {}
          });
  
          editDialogRef.afterClosed().subscribe(editResult => {
            if (editResult && editResult.type === 'save') {
              this.toastr.success('La persona fue creada con éxito.', 'EXITO', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
            } else if (editResult && editResult.type === 'cancel') {
              this.toastr.info('Cancelaste el proceso de creación de una nueva persona.');
            } else {
              this.toastr.error('Hubo un error al crear la persona.', 'Error', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
            }
          });
        }
      } else {
        this.toastr.info('Cancelaste el proceso de creación de una nueva persona.');
      }
    });
  }

  deletePerson(item: any): void {
    const service = item.tipo === 'Asistencial' ? this.asistencialService : this.noAsistencialService;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + item.nombre,
        title: 'Eliminar',
      },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        service.delete(item.id).subscribe(() => {
          
        this.toastr.success('Persona eliminada con éxito', 'ELIMINADA', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
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