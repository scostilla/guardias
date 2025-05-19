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
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { CapsService } from 'src/app/services/Configuracion/caps.service';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';

//Models y dto
import { NoAsistencialSummaryDto } from 'src/app/dto/Configuracion/no-asistencial/NoAsistencialSummaryDto';
import { EfectorHospitalDto } from 'src/app/dto/Configuracion/efector/EfectorHospitalDto';
import { EfectorMinisterioDto } from 'src/app/dto/Configuracion/efector/EfectorMinisterioDto';
import { EfectorCapsDto } from 'src/app/dto/Configuracion/efector/EfectorCapsDto';


//Componentes
import { NoAsistencialDetailComponent } from '../no-asistencial-detail/no-asistencial-detail.component';

//Autenticación
import { TokenService } from 'src/app/services/login/token.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
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
  isLoadingLegajos: boolean = true;

  showMessage: boolean = false;
  sinAsistencialMessage: boolean = false;
  efectorId: number | null = null;
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
    private noasistencialService: NoAsistencialService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private legajoService: LegajoService,
    private efectorService: EfectorService,
    private hospitalService: HospitalService,
    private capsService: CapsService,
    private ministerioService: MinisterioService,
    private tokenService: TokenService,
    private authService: AuthService,
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

    // Obtener el ID efector del servicio
    this.efectorId = this.efectorService.getCurrentEfectorId();
    this.loadEfectorName();
    
    // Verificar si el ID efector es válido
    if (this.efectorId === null) {
      this.showMessage = true;
    } else {
      this.listNoAsistencial(this.efectorId);
    }

    this.suscription = this.noasistencialService.refresh$.subscribe(() => {
      this.listNoAsistencial(this.efectorId); // Usar el efectorId actual
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
      this.isUsuario = false;
      this.isDph = false;
      this.isSuper = false;
    }
  }

  //Trae el nombre del efector esta en sesion
  loadEfectorName(): void {
    if (!this.efectorId) {
      this.efectorNombre = null;
      return;
    }
  
    this.hospitalService.detailNombreAll(this.efectorId).subscribe({
      next: (hospital: EfectorHospitalDto) => {
        this.efectorNombre = hospital.nombre;
      },
      error: () => {
        this.ministerioService.detailNombreAll(this.efectorId!).subscribe({
          next: (ministerio: EfectorMinisterioDto) => {
            this.efectorNombre = ministerio.nombre;
          },
          error: () => {
            this.capsService.detailNombreAll(this.efectorId!).subscribe({
              next: (cap: EfectorCapsDto) => {
                this.efectorNombre = cap.nombre;
              },
              error: () => {
                console.error('No se encontró el efector con ID:', this.efectorId);
                this.efectorNombre = null;
              }
            });
          }
        });
      }
    });
  }

listNoAsistencial(efectorId: number | null = null): void {
  // Si no hay un ID de efector, muestra el mensaje
  if (efectorId === null) {
    this.showMessage = true;
    this.sinAsistencialMessage = false;
    this.dataSource = new MatTableDataSource<NoAsistencialSummaryDto>([]); // Limpiar los datos
    return;
  }

  this.noasistencialService.listByEfector(efectorId).subscribe(data => {
    if (data.length === 0) {
      this.showMessage = false;
      this.sinAsistencialMessage = true; // No se encontraron registros
      this.dataSource = new MatTableDataSource<NoAsistencialSummaryDto>([]);
    } else {
      this.showMessage = false;
      this.sinAsistencialMessage = false;
      this.dataSource = new MatTableDataSource<NoAsistencialSummaryDto>(data); // Cargar los datos directamente
    }

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }, error => {
    console.error('Error al obtener no asistenciales:', error);
    this.showMessage = true;
    this.sinAsistencialMessage = false;
    this.dataSource = new MatTableDataSource<NoAsistencialSummaryDto>([]);
  });
}
      
  getCurrentEfectorId(): number | null {
    return this.efectorId;
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
      if (columna === 'cuil' && this.dniVisible) {
        columnasVisibles.push('dni');
      }
      if (columna === 'cuil' && this.telefonoVisible) {
        columnasVisibles.push('telefono');
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