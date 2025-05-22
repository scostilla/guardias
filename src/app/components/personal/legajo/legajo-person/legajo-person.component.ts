import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { LegajoBajaDto } from 'src/app/dto/Configuracion/LegajoBajaDto';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { LegajoDetailComponent } from '../legajo-detail/legajo-detail.component';
import { Router } from '@angular/router';
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';
import { MotivoBajaDialogComponent } from '../motivo-baja-dialog/motivo-baja-dialog.component';

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
  displayedColumns!: string[];
  dataSource!: MatTableDataSource<Legajo>;
  suscription!: Subscription;
  legajos: Legajo[] = [];
  personId?: number;
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
  console.log('📥 Navegación recibida en LegajoPerson:', navigation.extras.state);

  this.fromAsistencial = !!navigation.extras.state['fromAsistencial'];
  this.fromNoAsistencial = !!navigation.extras.state['fromNoAsistencial'];

  if (this.fromAsistencial) {
    const asistencialId = navigation.extras.state['asistencial'];
    if (asistencialId) {
      this.asistencialService.detail(asistencialId).subscribe({
        next: (asistencial: Asistencial) => {
          this.initialData = asistencial;

          // Ahora que tenemos los datos, los usamos aquí
          this.personId = asistencial.id;
          this.nombreCompleto = `${asistencial.nombre} ${asistencial.apellido}`;
          console.log('✅ Asistencial recibido:', asistencial);
          this.listLegajos(this.personId!);
        },
        error: (err) => {
          console.error('❌ Error al obtener el asistencial:', err);
        }
      });
    } else {
      console.warn('⚠️ No se recibió un ID de asistencial válido');
    }
  } else if (this.fromNoAsistencial) {
    const noAsistencial = navigation.extras.state['noAsistencial'] as NoAsistencial;
    this.initialData = noAsistencial;
    this.personId = noAsistencial.id;
    this.nombreCompleto = `${noAsistencial.nombre} ${noAsistencial.apellido}`;
    console.log('✅ No Asistencial recibido:', noAsistencial);
    this.listLegajos(this.personId!);
  }
}
}

ngOnInit(): void {
  if (this.fromAsistencial) {
    this.displayedColumns = ['esAutoridad', 'profesion', 'tipoGuardias', 'fechaInicio', 'acciones'];
  } else if (this.fromNoAsistencial) {
    this.displayedColumns = ['esAutoridad', 'profesion', 'udo', 'fechaInicio', 'acciones'];
  }

  // Ya no necesitas validar initialData aquí, porque ahora se carga de forma asíncrona

  // Suscribirse al refresh$
  this.suscription = this.legajoService.refresh$.subscribe(() => {
    if (this.personId) {
      this.listLegajos(this.personId);
    }
  });
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
    if (this.fromNoAsistencial && this.initialData) {
      const noAsistencial = this.initialData as NoAsistencial;
      this.router.navigate(['/legajo-create-noasistencial'], {
        state: { noAsistencial, fromNoAsistencial: true }
      });
    } else if (this.initialData) {
      const asistencial = this.initialData as Asistencial; // Asumiendo que Asistencial es una interfaz o tipo definido
      this.router.navigate(['/legajo-create'], {
        state: { asistencial, fromAsistencial: true }
      });
    } else {
      this.router.navigate(['/legajo-create']);
    }
  }
    
  updateLegajo(legajo: Legajo): void { 
    let stateData: any = { legajo, fromLegajoPerson: true };
  
    if (this.fromAsistencial) {
      stateData.asistencial = this.initialData as Asistencial; // Si es asistencial
      // Redirige a la ruta de legajo edit asistencial
      this.router.navigate(['/legajo-edit'], { state: stateData });
    } else if (this.fromNoAsistencial) {
      stateData.noAsistencial = this.initialData as NoAsistencial; // Si es no asistencial
      // Redirige a la ruta de legajo edit no asistencial
      this.router.navigate(['/legajo-edit-noasistencial'], { state: stateData });
    } else {
      // Si no se cumple ninguna condición, puedes poner un mensaje de error o hacer otra acción
      console.error('Tipo de legajo desconocido');
    }
  }
  
  goBack(): void {
    //this.location.back();
    window.history.back();
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
      const idPersonaString = data.profesion ? data.profesion.nombre.toString() : '';
      const fechaInicioString = data.fechaInicio ? data.fechaInicio.toISOString().toLowerCase() : '';
  
      // Aplicar el filtro a los valores convertidos
      return this.accentFilter(idPersonaString).includes(this.accentFilter(filter)) ||
        this.accentFilter(fechaInicioString).includes(this.accentFilter(filter));
    };
  }
  
  deleteLegajo(legajo: Legajo): void {
    const dialogRef = this.dialog.open(MotivoBajaDialogComponent, {
      width: '400px',
      data: { legajo: legajo }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Aquí recibimos los datos del formulario del diálogo
        const bajaData = result;
  
        // Asegúrate de que la fecha sea un objeto Date
        let fechaFinal: Date;
        if (bajaData.fechaFinal instanceof Date) {
          fechaFinal = bajaData.fechaFinal; // Si ya es un Date, lo usamos tal cual
        } else {
          // Si la fecha no es un Date, la convertimos a Date desde una cadena, si es necesario
          fechaFinal = new Date(bajaData.fechaFinal);
        }
  
        // Crear el DTO con la fecha como objeto Date
        const legajoBajaDto = new LegajoBajaDto(fechaFinal, bajaData.motivoBaja);
  
        // Llamamos al servicio para eliminar lógicamente y pasamos ambos parámetros
        this.legajoService.delete(legajo.id!, legajoBajaDto).subscribe(
          data => {
            this.toastr.success('Legajo eliminado con éxito', 'ELIMINADO', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
  
            // Actualizamos la tabla
            const index = this.dataSource.data.findIndex(p => p.id === legajo.id);
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
              this.dataSource._updateChangeSubscription();
            }
          },
          err => {
            this.toastr.error(err.message, 'Error, no se pudo eliminar el legajo', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
          }
        );
      }
    });
  }
}