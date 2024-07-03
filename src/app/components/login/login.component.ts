import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginUsuario } from 'src/app/models/login/login-usuario';
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

    private tokenService: TokenService,
    private authService: AuthService,
  ) {}
  
  ngOnInit(): void {
    /* comprobar si estoy logeado */
    if(this.tokenService.getToken()){
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
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
        this.roles = data.authorities;
        this.toastr.success('Bienvenido ' + data.nombreUsuario, 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/home-page']);

        /* aqui debería de tomar los datos de person? */
      },
      err => {
        this.isLogged = false;
        this.isLoginFail = true;
        this.errMsj = err.error.message;
        /* debería mostrarme el mensaje "campos mal puestos.. ver porque no lo hace"*/
        console.log('Mensaje de error: '+ this.errMsj);
        this.toastr.error(this.errMsj, 'Fail msj', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        
      }
    );
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