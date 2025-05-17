import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { TokenService } from 'src/app/services/login/token.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['expectedRoles']; // roles permitidos
    const currentRole = this.tokenService.getCurrentRole();      // rol del usuario actual

    if (!expectedRoles.includes(currentRole || '')) {
      // Si el rol actual no está permitido, redirige
      this.router.navigate(['/']); // página de acceso denegado
      return false;
    }

    return true; // Permitido
  }
}
