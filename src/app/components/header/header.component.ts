import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})

export class HeaderComponent implements OnDestroy {
  private routerSubscription: Subscription;
  showNavBar: boolean = true;
  showButtons: boolean = true;
  nombre?: string;
  apellido?: string;
  url?: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.showNavBar = !(event.url === '/' || event.url === '/home-page');
        this.showButtons= !(event.url === '/');
      }
    });
  }

  ngOnInit(): void {
    // Acceder a los parámetros de consulta
    this.route.queryParams.subscribe(params => {
      this.nombre = params['nombre'];
      this.apellido = params['apellido'];
      this.url = params['url'];
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
