import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LoggedUserService } from 'src/app/services/loggedUser/logged-user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnDestroy, OnInit {
  private routerSubscription: Subscription;
  showNavBar: boolean = true;
  showButtons: boolean = true;
  nombre?: string;
  apellido?: string;
  url?: string;
  showWelcomeMessage = false;
  welcomeMessage = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loggedUserService: LoggedUserService
  ) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.showNavBar = !(event.url === '/' || event.url === '/home-page');
        this.showButtons = !(event.url === '/');
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.nombre = params['nombre'];
      this.apellido = params['apellido'];
      this.url = params['url'];
      this.showWelcomeMessage = params['showWelcomeMessage'];
      this.showNavBar = !params['showWelcomeMessage'];
      if (this.url == '') {
        this.url = 'assets/img/users/generic.jpg';
      }

      /* Ponerlo en la primera pagina app lo mas cerca del index.html o del main.ts */
      if (!this.loggedUserService.nombre) {
        this.loggedUserService.nombre = this.nombre;
        this.loggedUserService.apellido = this.apellido;
        this.loggedUserService.url = this.url;
        console.log("no tiene datos: "+this.loggedUserService);
      } else {
        this.nombre = this.loggedUserService.nombre;
        this.apellido = this.loggedUserService.apellido;
        this.url = this.loggedUserService.url;
        console.log("tiene datos: "+this.loggedUserService);
      }

      this.welcomeMessage =
        '¡Bienvenido, ' + this.nombre + ' ' + this.apellido + '!';
      setTimeout(() => {
        this.showWelcomeMessage = false;
      }, 2000);
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
