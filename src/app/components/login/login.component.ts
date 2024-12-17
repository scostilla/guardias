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
  roles: string[] =[];
  errMsj?: string;
  
  hide = true; 

  /* loginForm: FormGroup = this.fb.group({
    nombreUsuario: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
 */
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private tokenService: TokenService,
    private authService: AuthService,
  ) {}
  
  ngOnInit(): void {
    if(this.tokenService.getToken()){
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
      console.log("roless" + this.roles);
    }
  }

  onLogin(): void {
    this.loginUsuario = new LoginUsuario(this.nombreUsuario!, this.password!);
    console.log("Usuario " + this.nombreUsuario);
    console.log("pass " + this.password);
    this.authService.login(this.loginUsuario).subscribe(
      data => {

        this.isLogged = true;
        this.isLoginFail = false;
        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        this.tokenService.setAuthorities(data.authorities);
        this.roles = this.tokenService.getAuthorities();


        // Verificamos los roles disponibles
        if (this.roles.length === 1) {
          // Si solo tiene un rol, lo asignamos directamente
          const selectedRole = this.roles[0];  // Asumimos que hay solo un rol
          this.tokenService.setCurrentRole(selectedRole);  // Aquí actualizas el BehaviorSubject
          this.router.navigate([`/home-page`]);

        } else if (this.roles.length > 1) {
          // Si tiene más de un rol, mostramos el diálogo para elegir el rol
          this.openRoleSelectionDialog();
        }

        this.toastr.success(data.nombreUsuario, 'Bienvenido', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
    
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
        if (selectedRole === 'ROLE_ADMIN' || selectedRole === 'ROLE_DPH' || selectedRole === 'ROLE_SUPERUSER') {
          this.router.navigate(['/home-page']);
        } else if (selectedRole === 'ROLE_USER') {
          this.router.navigate(['/home-profesional']);
        }
      } else {
        // Si el usuario cancela el diálogo, cerramos sesión
        this.tokenService.logOut();
        this.isLogged = false;
        this.router.navigate(['/']); // Redirige a la página de login
      }
    });
  }

  onForgotPassword() {
    this.toastr.info('Sigue las instrucciones enviadas a tu correo para restablecer tu contraseña', 'Restablecer contraseña', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
  }

  onSubmit() {
    this.toastr.success('Inicio de sesión exitoso', 'Bienvenido', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
    this.router.navigate(['/home-page']);
  }
}