import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true; 

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService 
  ) {}

  onForgotPassword() {
    this.toastr.info('Sigue las instrucciones enviadas a tu correo para restablecer tu contraseña', 'Restablecer contraseña', {
      timeOut: 6000,
      positionClass: 'toast-top-center',
      progressBar: true
    });
  }

  onSubmit() {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
  
    if (this.loginForm.valid) {
      const accessGranted = this.authService.login(username, password);
      if (accessGranted) {
        this.authService.updateAuthenticationStatus(true); 
        this.toastr.success('Inicio de sesión exitoso', 'Bienvenido', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
        this.router.navigate(['/home-page']); 
      } else {
        this.toastr.error('El usuario y/o contraseña es incorrecto', 'Datos inválidos', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
      }
    }
  }
}