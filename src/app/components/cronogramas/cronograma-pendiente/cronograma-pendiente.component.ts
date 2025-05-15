import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

//Autenticación
import { TokenService } from 'src/app/services/login/token.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';

//Services
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';

//Models y Dto
import { CronogramaTentativoListAtorizadoDto } from 'src/app/dto/Cronogramas/CronogramaTentativoListAtorizadoDto';
import { EfectorHospitalDto } from 'src/app/dto/Configuracion/efector/EfectorHospitalDto';
import { AsistencialDetailDto } from 'src/app/dto/Configuracion/asistencial/AsistencialDetailDto';

//Componentes
import { CronogramaPendienteDetailComponent } from '../cronograma-pendiente-detail/cronograma-pendiente-detail.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cronograma-pendiente',
  templateUrl: './cronograma-pendiente.component.html',
  styleUrls: ['./cronograma-pendiente.component.css']
})
export class CronogramaPendienteComponent implements OnInit, OnDestroy {
  @ViewChild(MatTable) table!: MatTable<CronogramaTentativoListAtorizadoDto>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<CronogramaPendienteDetailComponent>;
  displayedColumns: string[] = ['asistencial', 'tipoGuardia', 'fechaIngreso', 'acciones'];
  dataSource!: MatTableDataSource<CronogramaTentativoListAtorizadoDto>;
  suscription!: Subscription;
  cronogramas: CronogramaTentativoListAtorizadoDto[] = [];
  estadoSeleccionado: string = 'PENDIENTE';

  efectorId: number | null = null;
  efectorNombre: string | null = null;
  efectorNivel: number | null = null;

  //Autenticación
  isLogged = false;
  roles: string[] =[];
  isAutoridad: boolean = false;
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;
  userId: number | null = null;
  usuarioPersona: number | null = null;
  currentRole: string | null = null;

  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthService,
    private cronogramaTentativoService: CronogramaTentativoService,
    private efectorService: EfectorService,
    private hospitalService: HospitalService,
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
    });
  
      const userIdFromToken = this.tokenService.getUserIdFromToken();
      this.userId = userIdFromToken !== null ? Number(userIdFromToken) : null;
      console.log('ID del usuario logeado:',this.userId);
  
      // Obtener detalles del usuario
      this.authService.detailPersonBasicPanel().subscribe(
        (response: PersonBasicPanelDto) => {
          this.usuarioPersona = response.id;
  
          // Log para mostrar el usuario y los efectores
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

    this.efectorId = this.efectorService.getCurrentEfectorId();
    this.loadEfectorName();

  
    this.listPendientes();
    this.suscription = this.cronogramaTentativoService.refresh$.subscribe(() => {
      this.listPendientes();
    })
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
  if (this.efectorId) {
    this.hospitalService.detailNombreAll(this.efectorId).subscribe(
      (efector: EfectorHospitalDto) => {
        console.log('Respuesta del servicio hospitalService.detailNombreAll:', efector);

        if (efector) {
          this.efectorNombre = efector.nombre;
          this.efectorNivel = efector.nivelComplejidad;
        } else {
          this.handleInvalidEfector();
        }
      },
      (error) => {
        console.error('Error al obtener el efector desde el servicio:', error);
        this.handleInvalidEfector();
      }
    );
  } else {
    this.handleInvalidEfector();
  }
}
    
  private handleInvalidEfector(): void {
    console.error('ID de efector inválido o no encontrado.');
    this.router.navigateByUrl('/home-page');
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
    this.dataSource.filterPredicate = (data: CronogramaTentativoListAtorizadoDto, filter: string) => {
      return this.accentFilter(data.tipoGuardia.toLowerCase()).includes(this.accentFilter(filter)) ||
       this.accentFilter(data.tipoGuardia.toLowerCase()).includes(this.accentFilter(filter));
       ;
    };
  }

  filtrarPorEstado(estado: string): void {
    this.estadoSeleccionado = estado;
    this.listPendientes();
  }

  listPendientes(): void {
    this.cronogramaTentativoService.listByEfectorAndAutorizado(this.efectorId!, this.estadoSeleccionado)
      .subscribe({
        next: (data) => {
          this.cronogramas = data;
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          console.error('Error al obtener cronogramas pendientes:', err);
        }
      });
  }

  updateEstado(cronograma: CronogramaTentativoListAtorizadoDto, nuevoEstado: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Autorización',
        message: `¿Confirma el cambio de estado a "${nuevoEstado}" para el cronograma "${cronograma.asistencial.apellido}", "${cronograma.asistencial.nombre}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cronogramaTentativoService
          .autorizarUpdate(cronograma.id, { autorizado: nuevoEstado })
          .subscribe({
            next: () => {
              this.toastr.success(`Cronograma "${nuevoEstado}"`, 'Autorización', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
            },
            error: () => {
              this.toastr.error('Error al actualizar el estado', 'Autorización', {
                timeOut: 6000,
                positionClass: 'toast-top-center',
                progressBar: true
              });
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

  openDetail(cronograma: CronogramaTentativoListAtorizadoDto): void {
    this.dialogRef = this.dialog.open(CronogramaPendienteDetailComponent, {
      width: '600px',
      data: cronograma
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef.close();
    });
  }

}
