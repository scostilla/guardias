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

//models y dto
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { NoAsistencial } from 'src/app/models/Configuracion/No-asistencial';
import { AsistencialListDto } from 'src/app/dto/Configuracion/asistencial/AsistencialListDto';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';

//Componentes
import { AsistencialDetailComponent } from '../asistencial-detail/asistencial-detail.component';
import { NoAsistencialDetailComponent } from '../no-asistencial-detail/no-asistencial-detail.component';

//Autenticación
import { TokenService } from 'src/app/services/login/token.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
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

  sinSinEfectorMessage: boolean = false;
  efectorNombre: string | null = null;
  idContraFactura?: number;
  tipoGuardias: TipoGuardia[] = [];

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
    private tipoGuardiaService: TipoGuardiaService,
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
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.roles = this.tokenService.getAuthorities();
  
    // BehaviorSubject para obtener el rol seleccionado
    this.tokenService.currentRole$.subscribe(role => {
      this.currentRole = role;
      this.UserRoles();  // Llamar a la función que determina los roles
     
      // Si currentRole es false (null o vacío), redirige al login
      if (!this.currentRole) {
        this.router.navigateByUrl('');
      }
    });  
    
      const userIdFromToken = this.tokenService.getUserIdFromToken();
      this.userId = userIdFromToken !== null ? Number(userIdFromToken) : null;
      console.log('ID del usuario logeado:',this.userId);
  
      // Obtener detalles del usuario
      this.authService.detailPersonBasicPanel().subscribe(
        (response: PersonBasicPanelDto) => {
          this.usuarioPersona = response.id;
          this.nombreUsuario = response.nombre;
          this.apellidoUsuario = response.apellido;
  
          // Log para mostrar el usuario y los efectores
          console.log('Usuario logueado:', this.nombreUsuario, this.apellidoUsuario, this.usuarioPersona);
        },
        error => {
          console.error('Error al obtener detalles del usuario:', error);
        }
      );
    } else {
      this.isLogged = false;
      console.log('El usuario no está logueado.');
      this.router.navigateByUrl('');
    }
  
    this.listSinEfectors();

    this.suscription = this.asistencialService.refresh$.subscribe(() => {
      this.listSinEfectors();
    });

    // Llamamos al servicio para obtener todos los tipos de guardia
    this.tipoGuardiaService.list().subscribe((guardias: TipoGuardia[]) => {
      this.tipoGuardias = guardias;
  
      // Verificamos si los tipos 'CONTRAFACTURA' y 'PASIVA' están en la lista
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
      this.isUsuario = false;
      this.isDph = false;
      this.isSuper = false;
    }
  }
  
  listSinEfectors(): void {
    this.asistencialService.list().subscribe(data => {
      console.log('Asistenciales:', data); // Verifica los datos recibidos
      const asistenciales = data.map(asistencial => ({
        ...asistencial, 
        tipo: 'Asistencial'
      }));
  
      this.noAsistencialService.list().subscribe(noAsistenciales => {
        console.log('No Asistenciales:', noAsistenciales); // Verifica los datos de no asistenciales
        const noAsistencialesConTipo = noAsistenciales.map(noAsistencial => ({
          ...noAsistencial,
          tipo: 'No Asistencial'
        }));
  
        const mergedData = [...asistenciales, ...noAsistencialesConTipo];
        console.log('Datos combinados:', mergedData); // Verifica los datos combinados
  
        const filteredData = mergedData.filter(item => {
          // Filtra solo aquellos que tienen al menos un legajo activo
          const tieneLegajoActivo = item.legajos.some(legajo => legajo.activo === true);
          
          // Filtra aquellos legajos activos que cumplen con las condiciones de 'esRegional' o 'tipoGuardias'
          const cumpleCondiciones = item.legajos.some(legajo => 
            legajo.activo === true && 
            (legajo.esRegional === true || legajo.tipoGuardias.some(tipo => tipo.id === this.idContraFactura))
          );
          
          return tieneLegajoActivo && cumpleCondiciones;
        });
  
        console.log('Datos filtrados:', filteredData); // Verifica los datos filtrados
  
        if (filteredData.length === 0) {
          this.sinSinEfectorMessage = true;
        } else {
          this.sinSinEfectorMessage = false;
          this.dataSource = new MatTableDataSource<any>(filteredData);
        }
  
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error => {
        console.error('Error al obtener no asistenciales:', error);
        this.sinSinEfectorMessage = false;
      });
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
    

verLegajo(row: AsistencialListDto | NoAsistencial): void {
  if ((row as Asistencial).esAsistencial) {
    // Si el objeto es de tipo Asistencial
    if (row && (row as Asistencial).id) {
      this.router.navigate(['/legajo-person'], {
        state: { asistencial: row, fromAsistencial: true }
      });
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
  } else {
    // Si el objeto es de tipo NoAsistencial
    if (row && (row as NoAsistencial).id) {
      this.router.navigate(['/legajo-person'], {
        state: { noAsistencial: row, fromNoAsistencial: true }
      });
    } else {
      console.error('El objeto no asistencial no tiene un id.');
    }
  }
}

  
  deleteAsistencial(row: Asistencial | NoAsistencial): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'Confirma la eliminación de ' + row.nombre,
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


  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }  
}