import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { LoginUsuario } from 'src/app/models/login/login-usuario';
import { SelectorRolesComponent } from './selector-roles/selector-roles.component';
import { AuthService } from 'src/app/services/login/auth.service';
import { TokenService } from 'src/app/services/login/token.service';
import { CambiarPasswordComponent } from './cambiar-password/cambiar-password.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  isLogged = false;
  isLoginFail = false;
  loginUsuario?: LoginUsuario;
  nombreUsuario?: string;
  password?: string;
  roles: string[] = [];
  errMsj?: string;
  
  hide = true; 

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private tokenService: TokenService,
    private authService: AuthService,
  ) {}
  
ngOnInit(): void {
  this.tokenService.isLogged$.subscribe(isLogged => {
    this.isLogged = isLogged;

    if (!isLogged) {
      this.resetLoginForm();
    }
  });
}

onLogin(): void {
  this.loginUsuario = new LoginUsuario(this.nombreUsuario!, this.password!);

  this.authService.login(this.loginUsuario).subscribe(
    data => {
      this.tokenService.setToken(data.jwt.token);
      this.tokenService.setUserName(data.jwt.nombreUsuario);
      this.tokenService.setAuthorities(data.jwt.authorities);
      this.tokenService.setPrimerLogueo(data.primerLogueo);

      // marcar sesión iniciada (una sola vez)
      this.tokenService.setLoggedState(true);

      if (data.primerLogueo === true) {
        this.openCambiarPasswordDialog();
        return;
      }

      this.roles = this.tokenService.getAuthorities();
      this.procesarRoles();
    },
      err => {
        this.isLoginFail = true;

        this.resetPasswordOnly();

        this.toastr.error(
          'Usuario o contraseña incorrectos',
          'Error de autenticación',
          {
            timeOut: 5000,
            positionClass: 'toast-top-center',
            progressBar: true
          }
        ); 
      }
    );
}

  private procesarRoles(): void {
    if (this.roles.length > 1) {
      const rolesPermitidos = this.roles.filter(r => r !== 'ROLE_USER');

      if (rolesPermitidos.length === 1) {
        this.tokenService.setCurrentRole(rolesPermitidos[0]);
        this.redirectUserBasedOnRole(rolesPermitidos[0]);
      } else {
        this.openRoleSelectionDialog();
      }
    } else if (this.roles.length === 1) {
      this.tokenService.setCurrentRole(this.roles[0]);
      this.redirectUserBasedOnRole(this.roles[0]);
    }
  }

  openCambiarPasswordDialog(): void {
    const dialogRef = this.dialog.open(CambiarPasswordComponent, {
      width: '400px',
      disableClose: true,
      data: {
        modo: 'GENERAL',
        redirectTo: '/login'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.toastr.success(
          'Contraseña modificada, ingresa con la nueva contraseña.',
          'Éxito',
          { timeOut: 3000, positionClass: 'toast-top-center' }
        );
      }

      this.tokenService.logOut();
      this.router.navigate(['/login']);
    });
  }

  // Función para abrir el diálogo de selección de rol
  openRoleSelectionDialog(): void {
    const dialogRef = this.dialog.open(SelectorRolesComponent, {
      width: '280px',
      data: { roles: this.roles }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Si el usuario selecciona un rol, lo asignamos y redirigimos
        const selectedRole = result;
        this.tokenService.setCurrentRole(selectedRole);  // Actualizar el rol en el BehaviorSubject
        this.redirectUserBasedOnRole(selectedRole);
      } else {
        // Si el usuario cancela el diálogo, cerramos sesión
        this.tokenService.logOut();
        this.isLogged = false;
        this.router.navigate(['/']); // Redirige a la página de login
      }
    });
  }

  // Redirigir al home según el rol
  redirectUserBasedOnRole(role: string): boolean {
    if (role === 'ROLE_ADMIN' || role === 'ROLE_DPH' || role === 'ROLE_SUPERUSER' || role === 'ROLE_AUTORIDAD') {
      this.router.navigate(['/home-page']);
      return true;
    } else if (role === 'ROLE_HOSPITAL') {
      this.router.navigate(['/home-hospital']);
      return true;
    } else if (role === 'ROLE_USER') {
      this.toastr.error('Acceso no permitido para tu rol de usuario.', 'Error de acceso', {
        timeOut: 5000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      this.tokenService.logOut();
      this.isLogged = false;
      this.router.navigate(['/login']); 
      return false;
    } else {
      this.toastr.error('Rol desconocido. No se puede iniciar sesión.', 'Error', {
        timeOut: 4000,
        positionClass: 'toast-top-center',
        progressBar: true
      });
      this.tokenService.logOut();
      this.router.navigate(['/login']);
      return false;
    }
  }

  onForgotPassword() {
    this.toastr.info('Sigue las instrucciones enviadas a tu correo para restablecer tu contraseña', 'Restablecer contraseña', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
  }

  resetPasswordOnly(): void {
    this.password = '';
  }

  resetLoginForm(): void {
    this.nombreUsuario = '';
    this.password = '';
    this.isLoginFail = false;
    this.errMsj = undefined;
  }

}
