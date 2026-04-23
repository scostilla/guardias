import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

//Services
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { NoAsistencialService } from 'src/app/services/Configuracion/no-asistencial.service';


//models y dto
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { AsistencialListDto } from 'src/app/dto/Configuracion/asistencial/AsistencialListDto';

//Componentes
import { AsistencialDetailComponent } from '../asistencial-detail/asistencial-detail.component';
import { NoAsistencialDetailComponent } from '../no-asistencial-detail/no-asistencial-detail.component';

//Autenticación
import { TokenService } from 'src/app/services/login/token.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';

@Component({
  selector: 'app-sin-legajo',
  templateUrl: './sin-legajo.component.html',
  styleUrls: ['./sin-legajo.component.css']
})

export class SinLegajoComponent implements OnInit, OnDestroy {

  dniVisible: boolean = false;
  domicilioVisible: boolean = false;
  estadoVisible: boolean = false;
  fechaNacimientoVisible: boolean = false;
  telefonoVisible: boolean = false;
  emailVisible: boolean = false;

  @ViewChild(MatTable) table!: MatTable<Asistencial>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<AsistencialDetailComponent>;
  dialogRefNo!: MatDialogRef<NoAsistencialDetailComponent>;
  displayedColumns: string[] = ['nombre', 'apellido', 'cuil', 'tipo', 'acciones'];
  dataSource!: MatTableDataSource<Asistencial>;
  suscription!: Subscription;
  asistencial!: Asistencial;
  isLoadingLegajos: boolean = true;

  sinSinLegajoMessage: boolean = false;
  efectorNombre: string | null = null;

  //Autenticación
  isLogged = false;
  roles: string[] =[];
  isAutoridad: boolean = false;
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;
  userId: number | null = null;
  nombreUsuario: string = '';
  apellidoUsuario: string = '';
  nombresEfectores: EfectorSummaryDto[] = [];
  usuarioPersona: number | null = null;
  currentRole: string | null = null;
    
  constructor(
    private asistencialService: AsistencialService,
    private noAsistencialService: NoAsistencialService,
    private dialog: MatDialog,
    public dialogNo: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService,
    private location: Location,
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
    // Obtener rol actual
    this.tokenService.currentRole$.subscribe(role => {
      this.currentRole = role;
      this.UserRoles();

      if (!this.currentRole) {
        console.warn('No hay un rol seleccionado actualmente.');
      }
    });
  
    this.listSinLegajos();

    this.suscription = this.asistencialService.refresh$.subscribe(() => {
      this.listSinLegajos();
    });
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const normalizedFilterValue = filterValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
    this.dataSource.filterPredicate = (data: Asistencial, filter: string) => {
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
  
  listSinLegajos(): void {
    this.asistencialService.listAsistencialSinLegajo().subscribe({
      next: (asistenciales) => {
        const asistencialesConTipo = asistenciales.map(item => ({
          ...item,
          tipo: 'Asistencial'
        }));

        this.noAsistencialService.listNoAsistencialSinLegajo().subscribe({
          next: (noAsistenciales) => {
            const noAsistencialesConTipo = noAsistenciales.map(item => ({
              ...item,
              tipo: 'No Asistencial'
            }));

            const mergedData = [...asistencialesConTipo, ...noAsistencialesConTipo];
            console.log('Datos combinados sin legajo:', mergedData);

            if (mergedData.length === 0) {
              this.sinSinLegajoMessage = true;
            } else {
              this.sinSinLegajoMessage = false;
              this.dataSource = new MatTableDataSource<any>(mergedData);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
          },
          error: (err) => {
            console.error('Error al obtener no asistenciales sin legajo:', err);
            this.sinSinLegajoMessage = false;
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener asistenciales sin legajo:', err);
        this.sinSinLegajoMessage = false;
      }
    });
  }
              
  formatCuil(cuil: string): string {
    if (!cuil) return '';
    // Asegúrate de que el CUIL tenga al menos 11 dígitos
    if (cuil.length < 11) return cuil;
  
    return `${cuil.slice(0, 2)}-${cuil.slice(2, 10)}-${cuil.slice(10)}`;
  }
  
  openDetail(row: Asistencial | NoAsistencial): void {
    // Verificamos si el objeto es de tipo Asistencial o NoAsistencial
    if ((row as Asistencial).esAsistencial) {
      // Si es Asistencial, abrir el componente AsistencialDetailComponent
      this.dialogRef = this.dialog.open(AsistencialDetailComponent, {
        width: '600px',
        data: row
      });
    } else {
      // Si es NoAsistencial, abrir el componente NoAsistencialDetailComponent
      this.dialogRefNo = this.dialog.open(NoAsistencialDetailComponent, {
        width: '600px',
        data: row
      });
    }
  
    // Cerrar el diálogo después de que se haya cerrado
    if (this.dialogRef) {
      this.dialogRef.afterClosed().subscribe(() => {
        this.dialogRef.close();
      });
    }
  
    if (this.dialogRefNo) {
      this.dialogRefNo.afterClosed().subscribe(() => {
        this.dialogRefNo.close();
      });
    }
  }
      
  updateAsistencial(row: Asistencial | NoAsistencial): void {
    console.log("en row se envia el objeto", row);
    
    // Si el objeto es Asistencial
    if ((row as Asistencial).esAsistencial) {
      this.router.navigate(['/asistencial-edit'], {
        state: { asistencial: row }
      });
    } 
    // Si el objeto es NoAsistencial
    else {
      this.router.navigate(['/no-asistencial-edit'], {
        state: { noAsistencial: row }
      });
    }
  }

  createAsistencial(): void {
    this.router.navigate(['/asistencial-create']);
  }

  createNoAsistencial(): void {
    this.router.navigate(['/no-asistencial-create']);
  }
    
  // Función para crear un legajo según el tipo (Asistencial o No Asistencial)
  crearLegajo(row: AsistencialListDto | NoAsistencial): void {
    if ((row as Asistencial).esAsistencial) {
      // Si el objeto es de tipo Asistencial
      this.router.navigate(['/legajo-create'], {
        state: { asistencial: row, fromAsistencial: true }
      });
    } else {
      // Si el objeto es de tipo NoAsistencial
      this.router.navigate(['/legajo-create-noasistencial'], {
        state: { noAsistencial: row, fromNoAsistencial: true }
      });
    }
  }
  
  deleteAsistencial(row: Asistencial | NoAsistencial, esAsistencial: boolean): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + row.nombre,
        title: 'Eliminar',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const service = esAsistencial ? this.asistencialService : this.noAsistencialService;
        
        service.delete(row.id!).subscribe({
          next: () => {
            this.toastr.success('Eliminado con éxito', 'ELIMINADO', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });

            const index = this.dataSource.data.findIndex(p => p.id === row.id);
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
              this.dataSource._updateChangeSubscription();
            }
          },
          error: err => {
            console.error('[deleteAsistencial] Error eliminando:', err);
            this.toastr.error(err.message, 'Error al eliminar', {
              timeOut: 6000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
          }
        });
      }
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

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }  
}