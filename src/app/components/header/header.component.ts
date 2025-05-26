import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { CronogramaTentativoService } from 'src/app/services/Cronogramas/cronogramaTentativo.service';
import { EfectorService } from 'src/app/services/Configuracion/efector.service';
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

  // Suscripción al cambio de efector
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

  this.cronoService.refresh$.subscribe(() => {
    this.actualizarPendientes();
  });

  // Resto de lógica de login
  this.tokenService.isLogged$.subscribe(isLogged => {
  this.isLogged = isLogged;

  if (isLogged) {
    this.roles = this.tokenService.getAuthorities();

    this.tokenService.currentRole$.subscribe(role => {
      this.currentRole = role;
      this.UserRoles();
    });

    this.loadUserDetails();
  } else {
    this.nombreUsuario = '';
    this.apellidoUsuario = '';
    this.roles = [];
    this.UserRoles(); // Opcional: para resetear flags de rol
  }
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
      url === '/registro-actividades-ingreso' ||
      url === '/registro-actividades-egreso' ||
      url === '/not-found'
    );

    this.showConfig = !(
      url === '/home-profesional' ||
      url === '/registro-actividades-ingreso' ||
      url === '/registro-actividades-egreso' ||
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
    if (this.efectorId != null) {
      this.cronoService.countPendientesByEfector(this.efectorId).subscribe(count => {
        this.pendientesCount = count;
      });
    } else {
      this.pendientesCount = 0;
    }
  }

  getTotalBadges(): number {
  const pendientes = this.pendientesCount || 0;
  const notificaciones = this.notificacionesCount || 0;
  return pendientes + notificaciones;
}

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onLogOut(): void {
    this.tokenService.logOut();
    this.isLogged = false;
    this.nombreUsuario = '';
    this.apellidoUsuario = '';
    this.roles = [];
    this.isAdministrativo = false;
    this.isUsuario = false;
    this.isDph = false;
    this.isSuper = false;
    this.router.navigate(['/login']);
  }
}
