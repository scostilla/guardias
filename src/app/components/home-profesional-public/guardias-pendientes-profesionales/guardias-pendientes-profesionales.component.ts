import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

// Autenticación
import { TokenService } from 'src/app/services/login/token.service';

// Services
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { HospitalService } from 'src/app/services/Configuracion/hospital.service';

// Models / DTO
import { CronogramaTentativoListAtorizadoDto } from 'src/app/dto/Cronogramas/CronogramaTentativoListAtorizadoDto';

// Componentes
import { CronogramaPendienteDetailComponent } from
  'src/app/components/cronogramas/cronograma-pendiente-detail/cronograma-pendiente-detail.component';
import { CronogramaPendienteEditComponent } from
  'src/app/components/cronogramas/cronograma-pendiente-edit/cronograma-pendiente-edit.component';

@Component({
  selector: 'app-guardias-pendientes-profesionales',
  templateUrl: './guardias-pendientes-profesionales.component.html',
  styleUrls: ['./guardias-pendientes-profesionales.component.css']
})
export class GuardiasPendientesProfesionalesComponent
  implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MatTable) table!: MatTable<CronogramaTentativoListAtorizadoDto>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialogRef!: MatDialogRef<CronogramaPendienteDetailComponent>;

  displayedColumns: string[] = [
    'idEfector',
    'tipoGuardia',
    'fechaIngreso',
    'acciones'
  ];

  dataSource = new MatTableDataSource<CronogramaTentativoListAtorizadoDto>([]);

  cronogramas: CronogramaTentativoListAtorizadoDto[] = [];
  suscription!: Subscription;

  estadoSeleccionado: string = 'PENDIENTE';

  // Roles
  currentRole: string | null = null;
  isAutoridad = false;
  isAdministrativo = false;
  isUsuario = false;
  isDph = false;
  isSuper = false;

  // Datos asistencial
  idAsistencial: number | null = null;
  asistencial: any;

  // UI
  mensajeSinDatos: string | null = null;
  efectoresMap = new Map<number, string>();

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private tokenService: TokenService,
    private cronogramaTentativoService: CronogramaTentativoService,
    private efectorService: EfectorService,
    private hospitalService: HospitalService,
    private location: Location,
    private paginatorIntl: MatPaginatorIntl
  ) {
    // Labels paginator
    this.paginatorIntl.itemsPerPageLabel = 'Registros por página';
    this.paginatorIntl.nextPageLabel = 'Siguiente página';
    this.paginatorIntl.previousPageLabel = 'Página anterior';
    this.paginatorIntl.firstPageLabel = 'Primera página';
    this.paginatorIntl.lastPageLabel = 'Última página';
    this.paginatorIntl.getRangeLabel = (page, size, length) => {
      const start = page * size + 1;
      const end = Math.min((page + 1) * size, length);
      return `${start} - ${end} de ${length}`;
    };
  }

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    // Filtro definido
    this.dataSource.filterPredicate =
      (data: CronogramaTentativoListAtorizadoDto, filter: string) => {
        const texto = this.accentFilter(filter);
        return this.accentFilter(data.tipoGuardia.toLowerCase())
          .includes(texto);
      };

    // Rol actual
    this.tokenService.currentRole$.subscribe(role => {
      this.currentRole = role;
      this.UserRoles();
    });

    const navigationState = history.state;

    if (navigationState?.asistencial) {
      this.asistencial = navigationState.asistencial;
      this.idAsistencial = this.asistencial.id;

      this.listPendientes();

      this.suscription =
        this.cronogramaTentativoService.refresh$
          .subscribe(() => this.listPendientes());

    } else {
      this.router.navigateByUrl('/home-page');
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

  // =========================
  // ROLES
  // =========================

  UserRoles(): void {
    this.isUsuario = this.currentRole === 'ROLE_USER';
    this.isAdministrativo = this.currentRole === 'ROLE_ADMIN';
    this.isAutoridad = this.currentRole === 'ROLE_AUTORIDAD';
    this.isDph = this.currentRole === 'ROLE_DPH';
    this.isSuper = this.currentRole === 'ROLE_SUPERUSER';
  }

  // =========================
  // FILTROS
  // =========================

  accentFilter(input: string): string {
    const acentos = 'ÁÉÍÓÚáéíóú';
    const original = 'AEIOUaeiou';
    let output = '';

    for (let i = 0; i < input.length; i++) {
      const index = acentos.indexOf(input[i]);
      output += index >= 0 ? original[index] : input[i];
    }
    return output;
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  filtrarPorEstado(estado: string): void {
    this.estadoSeleccionado = estado;
    this.listPendientes();
  }

  // =========================
  // DATA
  // =========================

  listPendientes(): void {

    if (!this.idAsistencial) return;

    this.mensajeSinDatos = null;

    this.cronogramaTentativoService
      .listByAsistencialAndAutorizado(
        this.idAsistencial,
        this.estadoSeleccionado
      )
      .subscribe({
        next: (data) => {

          const registros = Array.isArray(data) ? data : [];

          this.cronogramas = registros;
          this.dataSource.data = registros;

          if (registros.length === 0) {
            this.mensajeSinDatos =
              'No hay guardias asignadas en la categoría seleccionada.';
            return;
          }

          const idsEfector = [...new Set(registros.map(c => c.idEfector))];

          idsEfector.forEach(idEfector => {
            if (!this.efectoresMap.has(idEfector)) {
              this.hospitalService.detailNombreAll(idEfector).subscribe({
                next: efector =>
                  this.efectoresMap.set(idEfector, efector?.nombre ?? '—'),
                error: () =>
                  this.efectoresMap.set(idEfector, '—')
              });
            }
          });
        },
        error: () => {
          this.dataSource.data = [];
          this.mensajeSinDatos = 'No se pudieron cargar las guardias.';
        }
      });
  }

  // =========================
  // UI
  // =========================

  goBack(): void {
    this.location.back();
  }

  openDetail(cronograma: CronogramaTentativoListAtorizadoDto): void {
    this.dialogRef = this.dialog.open(
      CronogramaPendienteDetailComponent,
      { width: '600px', data: cronograma }
    );
  }

  openFormChanges(cronograma: CronogramaTentativoListAtorizadoDto): void {
    const dialogRef = this.dialog.open(
      CronogramaPendienteEditComponent,
      { width: '400px', data: cronograma }
    );

    dialogRef.afterClosed().subscribe(ok => {
      if (ok) this.listPendientes();
    });
  }
}
