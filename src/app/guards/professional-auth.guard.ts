import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { TokenService } from '../services/login/token.service';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalAuthGuard implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.tokenService.getProfessionalToken()) {
      // ✅ Hay sesión profesional activa
      return true;
    } else {
      // ❌ No hay sesión, redirigir al login hospitalario
      return this.router.parseUrl('/home-hospital');
    }
  }
}
