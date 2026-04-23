import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/services/login/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    const isAuthenticated = !!this.tokenService.getToken();

    // No logueado
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }

    // Impedir ingreso directo a cambio de login
    if (this.tokenService.isPrimerLogueo()) {
      this.router.navigate(['/cambiar-password']);
      return false;
    }

    return true;
  }
}