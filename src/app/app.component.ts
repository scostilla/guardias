import { Component } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { TokenService } from 'src/app/services/login/token.service';
import { IdleTimeout } from 'src/app/services/login/idleTimeout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'guardias';
  showLayout = true;

  constructor(
    private router: Router,
    private idleTimeout: IdleTimeout,
    private tokenService: TokenService
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        const hiddenRoutes = ['/', '/login'];
        this.showLayout = !hiddenRoutes.includes(currentUrl);
      }
    });
  }

  ngOnInit(): void {
  if (this.tokenService.getToken()) {
    this.idleTimeout.startWatching();
  }

  this.tokenService.isLogged$.subscribe(logged => {
    if (!logged) {
      // Opcional: redirect to login
    }
  });
}
}
