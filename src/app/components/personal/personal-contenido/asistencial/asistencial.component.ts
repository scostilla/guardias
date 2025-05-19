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
import { AsistencialService } from 'src/app/services/Configuracion/asistencial.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';
import { CapsService } from 'src/app/services/Configuracion/caps.service';
import { MinisterioService } from 'src/app/services/Configuracion/ministerio.service';

//models y dto
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { AsistencialListDto } from 'src/app/dto/Configuracion/asistencial/AsistencialListDto';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';
import { AsistencialEfectorRegistroActividadDto } from 'src/app/dto/Configuracion/asistencial/AsistencialEfectorRegistroActividadDto';
import { EfectorHospitalDto } from 'src/app/dto/Configuracion/efector/EfectorHospitalDto';
import { EfectorMinisterioDto } from 'src/app/dto/Configuracion/efector/EfectorMinisterioDto';
import { EfectorCapsDto } from 'src/app/dto/Configuracion/efector/EfectorCapsDto';

//Componentes
import { AsistencialDetailComponent } from '../asistencial-detail/asistencial-detail.component';

//Autenticación
import { TokenService } from 'src/app/services/login/token.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { EfectorSummaryDto } from 'src/app/dto/efector/EfectorSummaryDto';

@Component({
  selector: 'app-asistencial',
  templateUrl: './asistencial.component.html',
  styleUrls: ['./asistencial.component.css']
})

export class AsistencialComponent implements OnInit, OnDestroy {

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
  displayedColumns: string[] = ['nombre', 'apellido', 'cuil', 'acciones'];
  dataSource!: MatTableDataSource<AsistencialEfectorRegistroActividadDto>;
  suscription!: Subscription;
  asistencial!: Asistencial;
  legajos: Legajo[] = [];
  isLoadingLegajos: boolean = true;

  showMessage: boolean = false;
  sinAsistencialMessage: boolean = false;
  efectorId: number | null = null;
  efectorNombre: string | null = null;

  //Autenticación
  isLogged = false;
  roles: string[] = [];
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
  tipoGuardias: TipoGuardia[] = [];
  currentRole: string | null = null;

  private efectorIdSubscription!: Subscription;

  constructor(
    private asistencialService: AsistencialService,
    private efectorService: EfectorService,
    private hospitalService: HospitalService,
    private capsService: CapsService,
    private ministerioService: MinisterioService,
    private dialog: MatDialog,
    public dialogNov: MatDialog,
    public dialogDistrib: MatDialog,
    private toastr: ToastrService,
    private router: Router,
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
    // Verificar si hay un idEfector antes de hacer cualquier otra cosa
    this.efectorId = this.efectorService.getCurrentEfectorId();
    this.loadEfectorName();
  
    if (this.efectorId === null) {
      // Si no hay idEfector, redirigir a /home-page con un mensaje
      this.toastr.warning('No seleccionaste un efector', 'Advertencia', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      this.router.navigateByUrl('/home-page');
      return; // Detener ejecución del código
    }
  
    // Continuar solo si existe un idEfector
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
      console.log('ID del usuario logeado:', this.userId);
  
      // Obtener detalles del usuario
      this.authService.detailPersonBasicPanel().subscribe(
        (response: PersonBasicPanelDto) => {
          this.usuarioPersona = response.id;
          this.nombreUsuario = response.nombre;
          this.apellidoUsuario = response.apellido;

          // Log para mostrar el usuario
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
    
    // Llamar a listAsistencial solo si hay idEfector
    this.listAsistencial(this.efectorId);
  
    // Suscripción para refrescar los datos de asistencial
    this.suscription = this.asistencialService.refresh$.subscribe(() => {
      this.listAsistencial(this.efectorId); // Usar el efectorId actual
    });
  
    // Actualizar columnas visibles
    this.actualizarColumnasVisibles();
  }  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const normalizedFilterValue = filterValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  
    this.dataSource.filterPredicate = (data: AsistencialEfectorRegistroActividadDto, filter: string) => {
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

  listAsistencial(efectorId: number | null = null): void {
    if (efectorId === null) {
      this.showMessage = true;
      this.sinAsistencialMessage = false;
      this.dataSource = new MatTableDataSource<AsistencialEfectorRegistroActividadDto>([]);
      return;
    }
  
    this.asistencialService.listAsistencialByEfector(efectorId).subscribe({
      next: (data: AsistencialEfectorRegistroActividadDto[]) => {
        // Filtro adicional: eliminar asistenciales que tengan guardias de tipo "Contrafactura"
        const filteredData = data.filter(asistencial =>
          !asistencial.nombresTiposGuardias.includes('CONTRAFACTURA')
        );
  
        if (filteredData.length === 0) {
          this.showMessage = false;
          this.sinAsistencialMessage = true;
          this.dataSource = new MatTableDataSource<AsistencialEfectorRegistroActividadDto>([]);
        } else {
          this.showMessage = false;
          this.sinAsistencialMessage = false;
          this.dataSource = new MatTableDataSource<AsistencialEfectorRegistroActividadDto>(filteredData);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        console.error('Error al obtener asistenciales:', err);
        this.showMessage = true;
        this.sinAsistencialMessage = false;
        this.dataSource = new MatTableDataSource<AsistencialEfectorRegistroActividadDto>([]);
      }
    });
  }
  
  mostrarBotones(asistencial: AsistencialEfectorRegistroActividadDto): boolean {
    return asistencial.nombresTiposGuardias.includes('CARGO') ||
           asistencial.nombresTiposGuardias.includes('AGRUPACIÓN');
  }

  formatCuil(cuil: string): string {
    if (!cuil) return '';
    // el CUIL debe tener al menos 11 dígitos
    if (cuil.length < 11) return cuil;

    return `${cuil.slice(0, 2)}-${cuil.slice(2, 10)}-${cuil.slice(10)}`;
  }

  createAsistencial(): void {
    this.router.navigate(['/asistencial-create']);
  }

  openDetail(asistencial: Asistencial): void {
    this.dialogRef = this.dialog.open(AsistencialDetailComponent, {
      width: '600px',
      data: asistencial
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
  }

  updateAsistencial(asistencial: Asistencial): void {
    this.router.navigate(['/asistencial-edit'], {
      state: { asistencial }
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

  verNovedad(asistencial: AsistencialEfectorRegistroActividadDto): void {
    if (asistencial && asistencial.id) {
      this.asistencialService.setCurrentAsistencialId(asistencial.id);
      this.router.navigate(['/novedades-person']);
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
  }

  verDistribucion(asistencial: AsistencialEfectorRegistroActividadDto): void {
    if (asistencial && asistencial.id) {
      this.asistencialService.setCurrentAsistencialId(asistencial.id);  // Envía solo el ID
      this.router.navigate(['/personal-dh']);
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
  }
  
  verLegajo(asistencial: AsistencialListDto): void {
    if (asistencial && asistencial.id) {
      this.router.navigate(['/legajo-person'], {
        state: { asistencial, fromAsistencial: true }
      });
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
  }

  actualizarColumnasVisibles(): void {
    let columnasBase = ['nombre', 'apellido', 'cuil', 'acciones'];

    let columnasVisibles: string[] = [];

    columnasBase.forEach(columna => {
      columnasVisibles.push(columna);
      if (columna === 'cuil' && this.domicilioVisible) {
        columnasVisibles.push('domicilio');
      }
    });

    this.displayedColumns = columnasVisibles;

    if (this.table) {
      this.table.renderRows();
    }
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
    this.efectorIdSubscription?.unsubscribe();
  }
}