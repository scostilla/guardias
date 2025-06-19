import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

//Services
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';

//Models y dto
import { NoAsistencialSummaryDto } from 'src/app/dto/Configuracion/no-asistencial/NoAsistencialSummaryDto';


//Componentes
import { NoAsistencialDetailComponent } from '../no-asistencial-detail/no-asistencial-detail.component';

//Autenticación
import { TokenService } from 'src/app/services/login/token.service';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';

@Component({
  selector: 'app-no-asistencial',
  templateUrl: './no-asistencial.component.html',
  styleUrls: ['./no-asistencial.component.css']
})

export class NoAsistencialComponent implements OnInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<NoAsistencialSummaryDto>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dniVisible: boolean = false;
  domicilioVisible: boolean = false;
  estadoVisible: boolean = false;
  fechaNacimientoVisible: boolean = false;
  telefonoVisible: boolean = false;
  emailVisible: boolean = false;

  dialogRef!: MatDialogRef<NoAsistencialDetailComponent>;
  displayedColumns: string[] = ['nombre', 'apellido', 'cuil', 'acciones'];
  dataSource!: MatTableDataSource<NoAsistencialSummaryDto>;
  suscription!: Subscription;
  noAsistencial!: NoAsistencialSummaryDto;

  sinAsistencialMessage: boolean = false;
  efectorId: number | null = null;
  efectorNombre: string | null = null;

  //Autenticación
  roles: string[] =[];
  isAutoridad: boolean = false;
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;
  currentRole: string | null = null;
  

  constructor(
    private noasistencialService: NoAsistencialService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private efectorService: EfectorService,
    private tokenService: TokenService,
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
    // Obtener el ID efector del servicio
    this.efectorId = this.efectorService.getCurrentEfectorId();
      if (this.efectorId) {
        this.loadEfectorName();
        this.listNoAsistencial(this.efectorId);
      } else {
        this.toastr.warning('No seleccionaste un efector', 'Advertencia', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      this.router.navigateByUrl('/home-page');
    }
  
    // Obtener rol actual
    this.tokenService.currentRole$.subscribe(role => {
      this.currentRole = role;
      this.UserRoles();

      if (!this.currentRole) {
        console.warn('No hay un rol seleccionado actualmente.');
      }
    });
    
    this.suscription = this.noasistencialService.refresh$.subscribe(() => {
      this.listNoAsistencial(this.efectorId!); 
    });

    this.actualizarColumnasVisibles();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const normalizedFilterValue = filterValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    this.dataSource.filterPredicate = (data: NoAsistencialSummaryDto, filter: string) => {
      const normalizedData = (data.nombre + ' ' + data.apellido + ' ' + data.cuil)
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      return normalizedData.indexOf(normalizedFilterValue) !== -1;
    };

    this.dataSource.filter = normalizedFilterValue;
  }

  // Roles a usar
  UserRoles(): void {
    if (this.currentRole) {
      this.isUsuario = this.currentRole === 'ROLE_USER';
      this.isAdministrativo = this.currentRole === 'ROLE_ADMIN';
      this.isAutoridad = this.currentRole === 'ROLE_AUTORIDAD';
      this.isDph = this.currentRole === 'ROLE_DPH';
      this.isSuper = this.currentRole === 'ROLE_SUPERUSER';
    } else {
      // Si no hay rol seleccionado, todos como false
      this.isAdministrativo = false;
      this.isAutoridad = false;
      this.isUsuario = false;
      this.isDph = false;
      this.isSuper = false;
    }
  }

  //trae el nombre del efector esta en sesion
  loadEfectorName(): void {
    if (this.efectorId) {
      this.efectorService.getEfectorNombre(this.efectorId).subscribe(
        (efector: EfectorSummaryDto) => {
          // traigo nombre del efector
          this.efectorNombre = efector.nombre;
        },
        (error) => {
          console.error('Error al obtener el efector:', error);
          this.efectorNombre = null;
        }
      );
    }
  }


  listNoAsistencial(efectorId: number): void {
    this.noasistencialService.listByEfector(efectorId).subscribe(data => {
      if (data.length === 0) {
        this.sinAsistencialMessage = true; // No se encontraron registros
        this.dataSource = new MatTableDataSource<NoAsistencialSummaryDto>([]);
      } else {
        this.sinAsistencialMessage = false;
        this.dataSource = new MatTableDataSource<NoAsistencialSummaryDto>(data); // Cargar los datos directamente
      }

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      console.error('Error al obtener no asistenciales:', error);
      this.sinAsistencialMessage = true;
      this.dataSource = new MatTableDataSource<NoAsistencialSummaryDto>([]);
    });
  }
        
  createNoAsistencial(): void {
    this.router.navigate(['/no-asistencial-create']);
  }

  openDetail(noasistencial: NoAsistencialSummaryDto): void {
    this.dialogRef = this.dialog.open(NoAsistencialDetailComponent, {
      width: '600px',
      data: noasistencial
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
  }

  updateNoAsistencial(noAsistencial: NoAsistencialSummaryDto): void {
    console.log("en no asistencial se envia el objeto", noAsistencial);
    this.router.navigate(['/no-asistencial-edit'], {
      state: { noAsistencial }
    });
  }

  deleteNoAsistencial(noasistencial: NoAsistencialSummaryDto): void {
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

  verLegajo(noAsistencial: NoAsistencialSummaryDto): void {
    if (noAsistencial && noAsistencial.id) {
      this.router.navigate(['/legajo-person'], {
        state: { noAsistencial, fromNoAsistencial: true  }
      });
    } else {
      console.error('El objeto noAsistencial no tiene un id.');
    }
  }

  crearLegajo(noAsistencial: NoAsistencialSummaryDto): void {

    console.log("en noAsistencial se envia el objeto", noAsistencial);
    this.router.navigate(['/legajo-create-noasistencial'], {
      state: { noAsistencial, fromNoAsistencial: true }
    });
  }

  actualizarColumnasVisibles(): void {
    let columnasBase = ['nombre', 'apellido', 'cuil', 'acciones'];

    let columnasVisibles: string[] = [];

    columnasBase.forEach(columna => {
      columnasVisibles.push(columna);
      if (columna === 'apellido' && this.dniVisible) {
        columnasVisibles.push('dni');
      }
      if (columna === 'cuil' && this.telefonoVisible) {
        columnasVisibles.push('telefono');
      }
      if (columna === 'cuil' && this.emailVisible) {
        columnasVisibles.push('email');
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