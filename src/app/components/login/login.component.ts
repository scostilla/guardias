import { Component, OnInit } from '@angular/core';
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

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ){}
  
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
        console.log("isLogged " + this.isLogged);
        this.tokenService.setToken(data.token);
        console.log("Token " + data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        console.log("userName " + data.nombreUsuario);
        this.tokenService.setAuthorities(data.authorities);
        console.log("Authorities " + data.authorities);
        this.roles = data.authorities;
        this.toastr.success('Bienvenido ' + data.nombreUsuario, 'OK', {
          timeOut: 3000, positionClass: 'toast-top-center'
        });
        this.router.navigate(['/']);
      },
      err => {
        this.isLogged = false;
        this.isLoginFail = true;
        this.errMsj = err.error.message;
        this.toastr.error(this.errMsj, 'Fail msj', {
          timeOut: 3000,  positionClass: 'toast-top-center',
        });
        //console.log(err.error.message);
      }
    );
  }

  
  /* username!: string;
  password!: string;

  constructor(private authService: AuthService) {}

  // Método para iniciar sesión
  onLogin(): void {
    if (this.authService.login(this.username, this.password)) {
      console.log('Login exitoso');
      // Aquí iría la lógica para redirigir al usuario a la página principal o dashboard
    } else {
      console.log('Credenciales incorrectas');
    }
  } */
}

