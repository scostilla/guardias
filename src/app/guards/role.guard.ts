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
    const deniedRoles: string[] = route.data['deniedRoles']; // roles no permitidos

    const currentRole = this.tokenService.getCurrentRole();
    const currentProfessionalRole = this.tokenService.getCurrentProfessionalRole?.(); // si existe

  // Si hay deniedRoles, y alguno coincide con los roles actuales → acceso denegado
  if (deniedRoles && (
      deniedRoles.includes(currentRole || '') ||
      deniedRoles.includes(currentProfessionalRole || '')
    )) {
    this.router.navigate(['/']); // o una página específica tipo /acceso-denegado
    return false;
  }

  // Si hay expectedRoles, y ninguno coincide → acceso denegado
  if (expectedRoles && expectedRoles.length > 0) {
    const hasAccess = expectedRoles.includes(currentRole || '') ||
                      expectedRoles.includes(currentProfessionalRole || '');
    if (!hasAccess) {
      this.router.navigate(['/']);
      return false;
    }
  }

  return true; // acceso permitido
}
}
