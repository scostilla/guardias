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
import { LegajoService } from 'src/app/services/Configuracion/legajo.service';
import { HabilitacionesGuardiasService } from 'src/app/services/Configuracion/habilitacionesGuardias.service';
import { TipoGuardiaService } from 'src/app/services/Configuracion/tipoGuardia.service';

//models y dto
import { Asistencial } from 'src/app/models/Configuracion/Asistencial';
import { Efector } from 'src/app/models/Configuracion/Efector';
import { Hospital } from 'src/app/models/Configuracion/Hospital';
import { Caps } from 'src/app/models/Configuracion/Caps';
import { Ministerio } from 'src/app/models/Configuracion/Ministerio';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { AsistencialListDto } from 'src/app/dto/Configuracion/asistencial/AsistencialListDto';
import { HabilitacionesGuardias } from 'src/app/models/Configuracion/HabilitacionesGuardias';
import { HabilitacionesGuardiasDto } from 'src/app/dto/Configuracion/HabilitacionesGuardiasDto';
import { TipoGuardia } from 'src/app/models/Configuracion/TipoGuardia';

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
  dataSource!: MatTableDataSource<Asistencial>;
  suscription!: Subscription;
  asistencial!: Asistencial;
  legajos: Legajo[] = [];
  habilitacionesGuardias: HabilitacionesGuardias[] = [];
  isLoadingLegajos: boolean = true;

  showMessage: boolean = false;
  sinAsistencialMessage: boolean = false;
  efectorId: number | null = null;
  efectorNombre: string | null = null;

  idContraFactura?: number;
  idPasiva?: number;
  idExtra?: number;
  idCargo?: number;
  idAgrupacion?: number;

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
    private legajoService: LegajoService,
    private tipoGuardiaService: TipoGuardiaService,
    private habilitacionesGuardiasService: HabilitacionesGuardiasService,
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
  
    // Llamar al servicio para obtener los tipos de guardia solo si hay idEfector
    this.tipoGuardiaService.list().subscribe((guardias: TipoGuardia[]) => {
      this.tipoGuardias = guardias;
  
      // Verificamos si los tipos 'CONTRAFACTURA' y 'PASIVA' están en la lista
      this.idContraFactura = this.tipoGuardias.find(t => t.nombre === 'CONTRAFACTURA')?.id;
      this.idPasiva = this.tipoGuardias.find(t => t.nombre === 'PASIVA')?.id;
      this.idExtra = this.tipoGuardias.find(t => t.nombre === 'EXTRA')?.id;
      this.idCargo = this.tipoGuardias.find(t => t.nombre === 'CARGO')?.id;
      this.idAgrupacion = this.tipoGuardias.find(t => t.nombre === 'AGRUPACION')?.id;
    });
  
    // Llamar a listLegajos solo si hay idEfector
    this.listLegajos();
  
    // Llamar a listAsistencial solo si hay idEfector
    this.listAsistencial(this.efectorId);
  
    // Suscripción para refrescar los datos de asistencial
    this.suscription = this.asistencialService.refresh$.subscribe(() => {
      this.listAsistencial(this.efectorId); // Usar el efectorId actual
    });
  
    // Actualizar columnas visibles
    this.actualizarColumnasVisibles();
  }  

  /*ngOnInit(): void {
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

    // Llamamos al servicio para obtener todos los tipos de guardia
    this.tipoGuardiaService.list().subscribe((guardias: TipoGuardia[]) => {
      this.tipoGuardias = guardias;

      // Verificamos si los tipos 'CONTRAFACTURA' y 'PASIVA' están en la lista
      this.idContraFactura = this.tipoGuardias.find(t => t.nombre === 'CONTRAFACTURA')?.id;
      this.idPasiva = this.tipoGuardias.find(t => t.nombre === 'PASIVA')?.id;
      this.idExtra = this.tipoGuardias.find(t => t.nombre === 'EXTRA')?.id;
      this.idCargo = this.tipoGuardias.find(t => t.nombre === 'CARGO')?.id;
      this.idAgrupacion = this.tipoGuardias.find(t => t.nombre === 'AGRUPACION')?.id;

    });

    this.listLegajos();

    // Obtener el ID efector del servicio
    this.efectorId = this.efectorService.getCurrentEfectorId();
    this.loadEfectorName();

    // Verificar si el ID efector es válido
    if (this.efectorId === null) {
      this.showMessage = true;
    } else {
      this.listAsistencial(this.efectorId);
    }

    this.suscription = this.asistencialService.refresh$.subscribe(() => {
      this.listAsistencial(this.efectorId); // Usar el efectorId actual
    });

    this.actualizarColumnasVisibles();
  }
*/

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

  loadEfectorName(): void {
    if (!this.efectorId) {
      this.efectorNombre = null;
      return;
    }
  
    this.hospitalService.getById(this.efectorId).subscribe({
      next: (hospital: Hospital) => {
        this.efectorNombre = hospital.nombre;
      },
      error: () => {
        this.ministerioService.getById(this.efectorId!).subscribe({
          next: (ministerio: Ministerio) => {
            this.efectorNombre = ministerio.nombre;
          },
          error: () => {
            this.capsService.getById(this.efectorId!).subscribe({
              next: (cap: Caps) => {
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
    // Si no hay un ID de efector, muestra el mensaje
    if (efectorId === null) {
      this.showMessage = true;
      this.sinAsistencialMessage = false;
      this.dataSource = new MatTableDataSource<Asistencial>([]);
      return;
    }

    this.asistencialService.list().subscribe(data => {
      // Filtra los datos para mostrar solo aquellos que tienen al menos un legajo activo y un efector asociado,
      // y que no tienen guardias de tipo "Contrafactura" o "Pasiva"
      const filteredData = data.filter(asistencial =>
        // Verifica que tenga al menos un legajo activo y que esté asociado a un efector válido
        asistencial.legajos.some(legajo =>
          legajo.activo === true && // Verifica que el legajo esté activo
          legajo.efectores.some(efector => efector.id === efectorId) && // Verifica que el legajo esté asociado al efector
          // Verifica que el legajo no tenga guardias de tipo Contrafactura o Pasiva
          !legajo.tipoGuardias.some(tipoGuardia => 
            tipoGuardia.id === this.idContraFactura
          )
        )
      );

      // Maneja los mensajes según los resultados
      if (filteredData.length === 0) {
        this.showMessage = false;
        this.sinAsistencialMessage = true;
      } else {
        this.showMessage = false;
        this.sinAsistencialMessage = false;
        this.dataSource = new MatTableDataSource<Asistencial>(filteredData);
      }

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error => {
      console.error('Error al obtener asistenciales:', error);
      this.showMessage = true;
      this.sinAsistencialMessage = false;
    });
  }

  listLegajos(): void {
    this.legajoService.list().subscribe((legajos: Legajo[]) => {
      this.legajos = legajos;
      this.isLoadingLegajos = false;
      //   this.dataSource.data = [...this.dataSource.data]; // crea una nueva referencia para el array de datos, lo que hace que la tabla vuelva a renderizarse con los datos actualizados.

    });
  }

  tipoGuardiaNoPermiteAcciones(legajos: Legajo[]): boolean {
    // Verifica si hay al menos un tipo de guardia asignado
    const tieneGuardias = legajos.some(legajo => legajo.tipoGuardias && legajo.tipoGuardias.length > 0);

    // Si no tiene ningún tipo de guardia, no se permiten acciones
    if (!tieneGuardias) {
      return true;
    }

    // Verifica si las guardias 'cargo', 'agrupacion' y 'extra' cumplen con la lógica específica
    const tieneGuardiasCombinadas = legajos.some(legajo => {
      const tiposGuardias = legajo.tipoGuardias.map(tipo => tipo.id);
  
      // Verifica si tiene guardias de tipo 'cargo' o 'agrupación'
      const tieneCargoOAgrupacion = tiposGuardias.includes(this.idCargo) || tiposGuardias.includes(this.idAgrupacion);
  
    // Si tiene 'extra' o 'pasiva' pero no tiene 'cargo' ni 'agrupacion', no permitir acciones
    const tieneExtraOPasiva = tiposGuardias.includes(this.idExtra) || tiposGuardias.includes(this.idPasiva);
    if (tieneExtraOPasiva && !tieneCargoOAgrupacion) {
      return true; // No se permite acción si 'extra' o 'pasiva' está solo
    }

      // Si no tiene ni 'cargo' ni 'agrupación' ni cumple con las combinaciones, no permitir acciones
      return !tieneCargoOAgrupacion;
    });

    // Si no tiene guardias combinadas de 'cargo' o 'agrupación', no permitir acciones
    return tieneGuardiasCombinadas;
  }

  mostrarBotones(asistencial: AsistencialListDto): boolean {
    const legajosAsistencial = this.legajos.filter(legajo => legajo.persona?.id === asistencial.id);
    return !this.tipoGuardiaNoPermiteAcciones(legajosAsistencial);
  }

  formatCuil(cuil: string): string {
    if (!cuil) return '';
    // Asegúrate de que el CUIL tenga al menos 11 dígitos
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
    console.log("en asistencial se envia el objeto", asistencial);
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

  /*openNovedades() {
    this.dialogNov.open(NovedadesFormComponent, {
      width: '600px',
      disableClose: true,
    })
  }*/

  /*openDistribucion() {
    this.router.navigate(['/dist-horaria']);
  }*/

  verNovedad(asistencial: Asistencial): void {
    if (asistencial && asistencial.id) {
      this.asistencialService.setCurrentAsistencial(asistencial);
      this.router.navigate(['/novedades-person']);
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
  }

  verDistribucion(asistencial: Asistencial): void {
    if (asistencial && asistencial.id) {
      this.asistencialService.setCurrentAsistencial(asistencial);
      this.router.navigate(['/personal-dh']);
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
  }

  hayLegajos(asistencial: AsistencialListDto): boolean {
    return this.legajos.some(legajo => legajo.persona?.id === asistencial.id);
  }

  verLegajo(asistencial: AsistencialListDto): void {
    if (asistencial && asistencial.id) {
      //this.router.navigate(['/legajo-person', asistencial.id]);
      this.router.navigate(['/legajo-person'], {
        state: { asistencial, fromAsistencial: true }
      });
    } else {
      console.error('El objeto asistencial no tiene un id.');
    }
  }

  crearLegajo(asistencial: AsistencialListDto): void {

    console.log("en asistencial se envia el objeto", asistencial);
    this.router.navigate(['/legajo-create'], {
      state: { asistencial, fromAsistencial: true }
    });
  }

  // obtengo el tooltip del botón basado en la existencia de legajos
  getTooltip(asistencial: AsistencialListDto): string {
    return this.hayLegajos(asistencial) ? 'Ver Legajo' : 'Agregar Legajo';
  }

  // Obtener el ícono del botón basado en la existencia de legajos
  getIcon(asistencial: AsistencialListDto): string {
    return this.hayLegajos(asistencial) ? 'playlist_play' : 'playlist_add';
  }

  // Determinar la acción del botón basada en la existencia de legajos
  getButtonAction(asistencial: AsistencialListDto): void {
    if (this.hayLegajos(asistencial)) {
      this.verLegajo(asistencial);
    } else {
      this.crearLegajo(asistencial);
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