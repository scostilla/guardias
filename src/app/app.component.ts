import { Component } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'guardias';
  showLayout = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        const hiddenRoutes = ['/', '/login'];
        this.showLayout = !hiddenRoutes.includes(currentUrl);
      }
    });
  }
}
