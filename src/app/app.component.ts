import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'guardias';
  showHeaderFooter = false;

  constructor(private authService: AuthService) {
    this.authService.getAuthenticationStatus().subscribe(
      (isAuthenticated) => {
        this.showHeaderFooter = isAuthenticated;
      }
    );
  }
}