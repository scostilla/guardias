import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      this.toastr.error('Por favor inicia sesión.', 'Acceso denegado', {
        timeOut: 6000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}