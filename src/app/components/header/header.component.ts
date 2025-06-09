import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
import { AutoridadService } from 'src/app/services/Configuracion/autoridad.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { TokenService } from 'src/app/services/login/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnDestroy, OnInit {
  private routerSubscription: Subscription;
  showNavBar: boolean = true;
  showConfig: boolean = true;

  pendientesCount: number = 0;
  autoridadesCount: number = 0;
  notificacionesCount: number = 0;
  efectorId: number | null = null;

  //Autentificación
  isLogged = false;
  nombreUsuario = '';
  apellidoUsuario = '';
  roles: string[] =[];
  isAutoridad: boolean = false;
  isAdministrativo: boolean = false;
  isUsuario: boolean = false;
  isDph: boolean = false;
  isSuper: boolean = false;
  currentRole: string | null = null;


  constructor(
    private router: Router, 
    private toastr: ToastrService,
    private cronoService: CronogramaTentativoService,
    private efectorService: EfectorService,
    private autoridadService: AutoridadService,
    private tokenService: TokenService,
    private authService: AuthService
  ) {
      
  this.routerSubscription = this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      this.updateNavBarAndConfigState();  // Actualiza el estado después de la navegación
    }
  });
}

ngOnInit(): void {
  this.updateNavBarAndConfigState();

  this.efectorService.currentEfectorId$.subscribe(id => {
    this.efectorId = id;

    if (this.efectorId != null) {
      this.cronoService.countPendientesByEfector(this.efectorId)
        .subscribe(count => {
          this.pendientesCount = count;
        });
    } else {
      this.pendientesCount = 0;
    }
  });

  this.tokenService.isLogged$.subscribe(isLogged => {
    this.isLogged = isLogged;

    if (isLogged) {
      this.roles = this.tokenService.getAuthorities();

      this.tokenService.currentRole$.subscribe(role => {
        this.currentRole = role;
        this.UserRoles();

        if (this.currentRole === 'ROLE_SUPERUSER') {
          this.actualizarAutoridadesPendientes();
        }
      });

      this.loadUserDetails();
    } else {
      this.nombreUsuario = '';
      this.apellidoUsuario = '';
      this.roles = [];
      this.UserRoles();
    }
  });

  this.cronoService.refresh$.subscribe(() => {
    this.actualizarPendientes();
  });

  this.autoridadService.refresh$.subscribe(() => {
    this.actualizarAutoridadesPendientes();
  });
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

  updateNavBarAndConfigState(): void {
    const url = this.router.url;

    // Actualiza el estado de showNavBar y showConfig basándote en la ruta actual
    this.showNavBar = !(
      url === '/home-page' ||
      url === '/home-profesional' ||
      url === '/registro-actividades-ingreso-profesional' ||
      url === '/registro-actividades-egreso-profesional' ||
      url === '/not-found'
    );

    this.showConfig = !(
      url === '/home-profesional' ||
      url === '/registro-actividades-ingreso-profesional' ||
      url === '/registro-actividades-egreso-profesional' ||
      url === '/not-found'
    );

  }

  private loadUserDetails() {
    // Llamo al servicio para obtener los detalles del usuario
    this.authService.detailPersonBasicPanel().subscribe(
      (response: PersonBasicPanelDto) => {
        this.nombreUsuario = response.nombre;
        this.apellidoUsuario = response.apellido;
      },
      (error) => {
        console.error('Error al obtener detalles del usuario:', error);
      }
    );
  }
  
  private actualizarPendientes(): void {
    const isAutoridadOsuper = this.currentRole === 'ROLE_AUTORIDAD' || this.currentRole === 'ROLE_SUPERUSER';

  if (this.efectorId != null && isAutoridadOsuper) {
      this.cronoService.countPendientesByEfector(this.efectorId).subscribe(count => {
        this.pendientesCount = count;
      });
    } else {
      this.pendientesCount = 0;
    }
  }

  private actualizarAutoridadesPendientes(): void {
    if (this.currentRole === 'ROLE_SUPERUSER') {
      this.autoridadService.countPendientes().subscribe(count => {
        this.autoridadesCount = count;
      });
    } else {
      this.autoridadesCount = 0;
    }
  }

  getTotalBadges(): number {
  const pendientes = this.pendientesCount || 0;
  const autoridades = this.autoridadesCount || 0;
  const notificaciones = this.notificacionesCount || 0;
  return pendientes + autoridades + notificaciones;
}

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onLogOut(): void {
    this.tokenService.logOut();
    this.efectorService.setCurrentEfectorId(null);
    this.isLogged = false;
    this.nombreUsuario = '';
    this.apellidoUsuario = '';
    this.roles = [];
    this.isAdministrativo = false;
    this.isAutoridad = false;
    this.isUsuario = false;
    this.isDph = false;
    this.isSuper = false;
    this.router.navigate(['/login']);
  }
}
