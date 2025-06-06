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
import { TipoGuardiaService } from 'src/app/services/Configuracion/tipoGuardia.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';


//models y dto
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { AsistencialListDto } from 'src/app/dto/Configuracion/asistencial/AsistencialListDto';
import { NoAsistencialListDto } from 'src/app/dto/Configuracion/no-asistencial/NoAsistencialListDto';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';

//Componentes
import { AsistencialDetailComponent } from '../asistencial-detail/asistencial-detail.component';
import { NoAsistencialDetailComponent } from '../no-asistencial-detail/no-asistencial-detail.component';

//Autenticación
import { TokenService } from 'src/app/services/login/token.service';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';

@Component({
  selector: 'app-autoridad-list',
  templateUrl: './autoridad-list.component.html',
  styleUrls: ['./autoridad-list.component.css']
})

export class AutoridadListComponent implements OnInit, OnDestroy {

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

  sinAutoridadMessage: boolean = false;
  efectorNombre: string | null = null;
  idContraFactura?: number;
  tipoGuardias: TipoGuardia[] = [];
  efectorId: number | null = null;


  //Autenticación
  roles: string[] =[];
  isAutoridad: boolean = false;
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;
  currentRole: string | null = null;
    
  constructor(
    private asistencialService: AsistencialService,
    private noAsistencialService: NoAsistencialService,
    private tipoGuardiaService: TipoGuardiaService,
    private efectorService: EfectorService,
    private dialog: MatDialog,
    public dialogNo: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private tokenService: TokenService,
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
    // Obtener el ID efector del servicio
    this.efectorId = this.efectorService.getCurrentEfectorId();
      if (this.efectorId) {
        this.loadEfectorName();
        this.listAutoridades();
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
    
    this.suscription = this.asistencialService.refresh$.subscribe(() => {
      this.listAutoridades();
    });

    // Llamo al servicio para obtener todos los tipos de guardia
    this.tipoGuardiaService.list().subscribe((guardias: TipoGuardia[]) => {
      this.tipoGuardias = guardias;
  
      // Verifico si los tipos 'CONTRAFACTURA' y 'PASIVA' están en la lista
      this.idContraFactura = this.tipoGuardias.find(t => t.nombre === 'CONTRAFACTURA')?.id;
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

  private handleInvalidEfector(): void {
    console.error('ID de efector inválido o no encontrado.');
    this.router.navigateByUrl('/home-page');
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
  
listAutoridades(): void {
  this.asistencialService.listAutoridadesByEfector(this.efectorId!).subscribe({
    next: (asistenciales) => {
      const asistencialesConTipo = asistenciales.map(item => ({
        ...item,
        tipo: 'Asistencial'
      }));

      this.noAsistencialService.listAutoridadesByEfector(this.efectorId!).subscribe({
        next: (noAsistenciales) => {
          const noAsistencialesConTipo = noAsistenciales.map(item => ({
            ...item,
            tipo: 'No Asistencial'
          }));

          const mergedData = [...asistencialesConTipo, ...noAsistencialesConTipo];
          console.log('Autoridades combinadas:', mergedData);

          if (mergedData.length === 0) {
            this.sinAutoridadMessage = true;
          } else {
            this.sinAutoridadMessage = false;
            this.dataSource = new MatTableDataSource<any>(mergedData);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        },
        error: (err) => {
          console.error('Error al obtener autoridades no asistenciales:', err);
          this.sinAutoridadMessage = false;
        }
      });
    },
    error: (err) => {
      console.error('Error al obtener autoridades asistenciales:', err);
      this.sinAutoridadMessage = false;
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
    

verLegajo(row: AsistencialListDto | NoAsistencialListDto): void {
  if ((row as Asistencial).esAsistencial) {
    // Si el objeto es de tipo Asistencial
    if (row && (row as Asistencial).id) {
      this.router.navigate(['/legajo-person'], {
        state: { asistencial: row.id, fromAsistencial: true }
      });
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
  } else {
    // Si el objeto es de tipo NoAsistencial
    if (row && (row as NoAsistencial).id) {
      this.router.navigate(['/legajo-person'], {
        state: { noAsistencial: row.id, fromNoAsistencial: true }
      });
    } else {
      console.error('El objeto no asistencial no tiene un id.');
    }
  }
}

  
  deleteAsistencial(row: Asistencial | NoAsistencial): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + row.apellido + ', ' + row.nombre,
        title: 'Eliminar',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.asistencialService.delete(row.id!).subscribe(data => {
          this.toastr.success('Eliminado con éxito', 'ELIMINADO', {
            timeOut: 6000,
            positionClass: 'toast-top-center',
            progressBar: true
          });

          const index = this.dataSource.data.findIndex(p => p.id === row.id);
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