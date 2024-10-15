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

  isLogged = false;
  nombreUsuario = '';
  apellidoUsuario = '';

  constructor(
    private router: Router, 
    private toastr: ToastrService,
    private tokenService: TokenService,
    private authService: AuthService // Asegúrate de inyectar el servicio
  ) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavBar = !(event.url === '/home-page' || event.url === '/home-profesional');
        this.showConfig = !(event.url === '/home-profesional');
        this.showHeader = !(event.url === '/');
      }
    });
  }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;

      // Obtener los detalles del usuario
      this.authService.detailPersonBasicPanel().subscribe(
        (response: PersonBasicPanelDto) => {
          this.nombreUsuario = response.nombre;
          this.apellidoUsuario = response.apellido;
          console.log('Usuario en el header:', this.nombreUsuario, this.apellidoUsuario);
        },
        (error) => {
          console.error('Error al obtener detalles del usuario:', error);
        }
      );
    } else {
      this.isLogged = false;
      this.nombreUsuario = '';
      this.apellidoUsuario = '';
    }
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  onLogOut(): void {
    this.tokenService.logOut();
    this.router.navigate(['/']);
  }
}
