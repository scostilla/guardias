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
    const currentRole = this.tokenService.getCurrentRole();
    const currentProfessionalRole = this.tokenService.getCurrentProfessionalRole?.(); // si existe

    // Validación: cualquiera de los roles coincida con los permitidos
    const hasAccess = expectedRoles.includes(currentRole || '') ||
                      expectedRoles.includes(currentProfessionalRole || '');

    if (!hasAccess) {
      this.router.navigate(['/']); // página de acceso denegado
      return false;
    }

    return true; // Permitido
  }

}
