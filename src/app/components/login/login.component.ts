import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { LoginUsuario } from 'src/app/models/login/login-usuario';
import { SelectorRolesComponent } from './selector-roles/selector-roles.component';
import { AuthService } from 'src/app/services/login/auth.service';
import { TokenService } from 'src/app/services/login/token.service';

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
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();

      const currentRole = this.tokenService.getCurrentRole();

      if (currentRole) {
        // Si ya hay un rol seleccionado: redirigir directamente
        this.redirectUserBasedOnRole(currentRole);
      } else if (this.roles.length > 1) {
        // Si hay varios roles y aún no se seleccionó ninguno: abrir diálogo
        this.openRoleSelectionDialog();
      } else if (this.roles.length === 1) {
        // Solo hay un rol, se asigna automáticamente
        const selectedRole = this.roles[0];
        this.tokenService.setCurrentRole(selectedRole);
        this.redirectUserBasedOnRole(selectedRole);
      }
    }
    
  }

  onLogin(): void {
    this.loginUsuario = new LoginUsuario(this.nombreUsuario!, this.password!);
    console.log("Usuario " + this.nombreUsuario);
    console.log("pass " + this.password);

    this.authService.login(this.loginUsuario).subscribe(
      data => {
        // Guardamos token, usuario y roles
        this.isLogged = true;
        this.isLoginFail = false;
        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        this.tokenService.setAuthorities(data.authorities);
        this.roles = this.tokenService.getAuthorities();

        this.tokenService.setLoggedState(true);

        if (this.roles.length > 1) {
          // Filtramos ROLE_USER
          const rolesPermitidos = this.roles.filter(r => r !== 'ROLE_USER');

          if (rolesPermitidos.length === 1) {
            // Solo hay un rol permitido, asignamos automáticamente
            const selectedRole = rolesPermitidos[0];
            this.tokenService.setCurrentRole(selectedRole);

            const permitido = this.redirectUserBasedOnRole(selectedRole);
            if (permitido) {
              this.toastr.success(data.nombreUsuario, 'Bienvenido', {
                timeOut: 3000,
                positionClass: 'toast-top-center'
              });
            }
          } else if (rolesPermitidos.length > 1) {
            // Hay varios roles permitidos, abrimos diálogo para elegir
            this.openRoleSelectionDialog();
          } else {
            // Solo tenía ROLE_USER → bloqueamos login
            this.toastr.error('Acceso no permitido para este tipo de usuario.', 'Error de acceso', {
              timeOut: 5000,
              positionClass: 'toast-top-center',
              progressBar: true
            });
            this.tokenService.logOut();
            this.isLogged = false;
            this.router.navigate(['/login']); 
          }
        } else if (this.roles.length === 1) {
          // Solo un rol total, verificamos si no es ROLE_USER
          const selectedRole = this.roles[0];
          this.tokenService.setCurrentRole(selectedRole);

          const permitido = this.redirectUserBasedOnRole(selectedRole);
          if (permitido) {
            this.toastr.success(data.nombreUsuario, 'Bienvenido', {
              timeOut: 3000,
              positionClass: 'toast-top-center'
            });
          }
        }
      },
      err => {
        this.isLogged = false;
        this.isLoginFail = true;
        this.errMsj = err.error.message;
        this.toastr.error(err.message, 'Error, usuario y/o contraseña incorrecto.', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    );
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

}
