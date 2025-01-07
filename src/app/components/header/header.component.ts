import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
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
  showHeader: boolean = true;

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
    private tokenService: TokenService,
    private authService: AuthService
  ) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavBar = !(event.url === '/home-page' || event.url === '/home-profesional' || event.url === '/registro-actividades-ingreso' || event.url === '/registro-actividades-egreso');
        this.showConfig = !(event.url === '/home-profesional');
        this.showHeader = !(event.url === '/');
      }
    });
  }

  ngOnInit(): void {
  //Autentificación
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.roles = this.tokenService.getAuthorities();

    // BehaviorSubject para obtener el rol seleccionado
    this.tokenService.currentRole$.subscribe(role => {
      this.currentRole = role;
      this.UserRoles();  // Llamar a la función que determina los roles
    });
    
    // Obtener los detalles del usuario directamente después de un login exitoso
      this.loadUserDetails();
    } else {
      this.isLogged = false;
      this.nombreUsuario = '';
      this.apellidoUsuario = '';
      this.roles = [];  // Aseguramos que los roles estén vacíos si no hay token
      this.isAdministrativo = false;
      this.isUsuario = false;
      this.isDph = false;
      this.isSuper = false;
    }

  // Suscribimos a los eventos de la ruta para manejar cambios al navegar
  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      if (this.tokenService.getToken()) {
        this.isLogged = true;
        this.loadUserDetails();
      }
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
    this.router.navigate(['/']);
  }
}
