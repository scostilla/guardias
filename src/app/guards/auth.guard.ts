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
    
    if (!isAuthenticated) {
      // Si no está autenticado, redirigir al login
      this.router.navigate(['/login']);
      return false;
    }

    return true; // Si está autenticado, permite la navegación
  }
}