import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

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

  constructor(private router: Router, private route: ActivatedRoute) {
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
      this.welcomeMessage = '¡Bienvenido, '+this.nombre+' '+this.apellido+'!';
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
