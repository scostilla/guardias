// registro-diario.component.ts
import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/login/token.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { RegistroActividadService } from 'src/app/services/registroActividad.service';
import { RegActivNombresDto } from 'src/app/dto/RegistroActividad/RegActivNombresDto';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-registro-diario',
  templateUrl: './registro-diario.component.html',
  styleUrls: ['./registro-diario.component.css']
})
export class RegistroDiarioComponent implements OnInit {

  efectorId: number | null = null;
  efectorNombre: string | null = null;
  registrosPendientes: RegActivNombresDto[] = [];

  displayedColumns: string[] = ['asistencial', 'fechaIngreso', 'horaIngreso', 'servicio', 'tipoGuardia'];
  dataSource = new MatTableDataSource<RegActivNombresDto>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //Autenticación
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;
  isAutoridad: boolean = false;
  userId: number | null = null;
  currentRole: string | null = null;

  constructor(
    private tokenService: TokenService,
    private efectorService: EfectorService,
    private toastr: ToastrService,
    private router: Router,
    private registroActividadService: RegistroActividadService
  ) { }

  ngOnInit(): void {
    this.efectorId = this.efectorService.getCurrentEfectorId();
    if (this.efectorId) {
      this.loadEfectorName();
      this.cargarRegistrosPendientesPorEfector(this.efectorId);
    } else {
      this.toastr.warning('No seleccionaste un efector', 'Advertencia', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      this.router.navigateByUrl('/home-page');
    }

    this.tokenService.currentRole$.subscribe(role => {
      this.currentRole = role;
      this.UserRoles();
    });
  }

  UserRoles(): void {
    this.isUsuario = this.currentRole === 'ROLE_USER';
    this.isAdministrativo = this.currentRole === 'ROLE_ADMIN';
    this.isAutoridad = this.currentRole === 'ROLE_AUTORIDAD';
    this.isDph = this.currentRole === 'ROLE_DPH';
    this.isSuper = this.currentRole === 'ROLE_SUPERUSER';
  }

  loadEfectorName(): void {
    if (this.efectorId) {
      this.efectorService.getEfectorNombre(this.efectorId).subscribe({
        next: (efector) => this.efectorNombre = efector.nombre,
        error: (err) => {
          console.error('Error al obtener el efector:', err);
          this.efectorNombre = null;
        }
      });
    }
  }

 cargarRegistrosPendientesPorEfector(idEfector: number): void {
    this.registroActividadService.listRegActivPendienteByEfector(idEfector).subscribe({
      next: (registros) => {
        this.dataSource.data = registros;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: () => {
        this.toastr.error('Error al cargar registros pendientes');
      }
    });
  }
}
