import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { LegajoDetailComponent } from '../legajo-detail/legajo-detail.component';
import { Router } from '@angular/router';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';

@Component({
  selector: 'app-legajo-person',
  templateUrl: './legajo-person.component.html',
  styleUrls: ['./legajo-person.component.css']
})

export class LegajoPersonComponent implements OnInit, OnDestroy, AfterViewInit {

  fromAsistencial: boolean = false;
  fromNoAsistencial: boolean = false;

  @ViewChild(MatTable) table!: MatTable<Legajo>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<LegajoDetailComponent>;
  displayedColumns: string[] = ['profesion', 'udo', 'fechaInicio', 'actual', 'fechaFinal', 'acciones'];
  dataSource!: MatTableDataSource<Legajo>;
  suscription!: Subscription;
  legajos: Legajo[] = [];
  personId?: number;
  //noAsistencialId?: number;
  nombreCompleto: string = '';
  initialData: Asistencial | NoAsistencial | undefined;

  constructor(
    private legajoService: LegajoService,
    private asistencialService: AsistencialService,
    private noAsistencialService: NoAsistencialService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private paginatorIntl: MatPaginatorIntl,
    private router: Router,
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

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      console.log('Navegación recibida en LegajoPerson:', navigation.extras.state); // Log de la navegación
      this.fromAsistencial = !!navigation.extras.state['fromAsistencial'];
      this.fromNoAsistencial = !!navigation.extras.state['fromNoAsistencial'];
  
      if (this.fromAsistencial) {
        this.initialData = navigation.extras.state['asistencial'] as Asistencial;
      } else if (this.fromNoAsistencial) {
        this.initialData = navigation.extras.state['noAsistencial'] as NoAsistencial;
      }
    }
  }

  ngOnInit(): void {

    // Si recibo un asistencial
    if (this.initialData) {
      this.personId = this.initialData.id;
      this.nombreCompleto = `${this.initialData.nombre} ${this.initialData.apellido}`;
      this.listLegajos(this.personId!);
    }

    // Suscribirse al refresh$
    this.suscription = this.legajoService.refresh$.subscribe(() => {
      if (this.personId) {
        this.listLegajos(this.personId);
      }
    })
  }

  ngAfterViewInit(): void {
    // Inicializa paginador y sort
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

// validar el fromAsistencial fromNoAsistencial
  listLegajos(personId: number): void {

    if (this.fromAsistencial) {
      this.asistencialService.getLegajosByAsistencial(personId).subscribe({
        next: (data) => {
          this.legajos = data;
          this.dataSource = new MatTableDataSource(this.legajos);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          this.toastr.error('Error al cargar legajos', 'ERROR', { timeOut: 3000 });
        }
      });
    } else if (this.fromNoAsistencial) {
      this.noAsistencialService.getLegajosByNoAsistencial(personId).subscribe({
        next: (data) => {
          this.legajos = data;
          this.dataSource = new MatTableDataSource(this.legajos);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          this.toastr.error('Error al cargar legajos', 'ERROR', { timeOut: 3000 });
        }
      });
    }


    
  }

  openDetail(legajo: Legajo): void {
    this.dialogRef = this.dialog.open(LegajoDetailComponent, {
      width: '600px',
      data: legajo
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
  }

  createLegajo(): void {

    if (this.initialData) {
      const asistencialSend = this.initialData.id;
      this.router.navigate(['/legajo-create'], {
        state: { asistencialSend, fromAsistencial: true }
      });
    } else {
      this.router.navigate(['/legajo-create']);
    }

  }

  updateLegajo(legajo: Legajo): void {
    let stateData: any = { legajo, fromLegajoPerson: true };
  
    if (this.fromAsistencial) {
      stateData.asistencial = this.initialData as Asistencial; // Si es asistencial
    } else if (this.fromNoAsistencial) {
      stateData.noAsistencial = this.initialData as NoAsistencial; // Si es no asistencial
    }
  
    this.router.navigate(['/legajo-edit'], {
      state: stateData
    });
  }

  goBack(): void {
    if (this.fromAsistencial) {
      this.router.navigate(['/personal']);
    } else if (this.fromNoAsistencial) {
      this.router.navigate(['/personal-no-asistencial']);
    } else {
      this.router.navigate(['/personal']); // Redirige a personal por defecto si no hay información
    }
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
    this.dataSource.filterPredicate = (data: Legajo, filter: string) => {
      const actualString = data.actual ? 'si' : 'no';
      const idPersonaString = data.profesion.nombre.toString();
      const fechaFinalString = data.fechaFinal.toISOString().toLowerCase();

      // Aplicar el filtro a los valores convertidos
      return this.accentFilter(actualString).includes(this.accentFilter(filter)) ||
        this.accentFilter(idPersonaString).includes(this.accentFilter(filter)) ||
        this.accentFilter(fechaFinalString).includes(this.accentFilter(filter));
    };
  }





  /*  openFormChanges(legajo?: Legajo): void {
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
   } */



  deleteLegajo(legajo: Legajo): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + legajo.id,
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