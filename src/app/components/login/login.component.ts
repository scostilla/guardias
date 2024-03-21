import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hide = true;

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder, private toastr: ToastrService) {}

  onForgotPassword() {
    this.toastr.info('Sigue las instrucciones enviadas a tu correo para restablecer tu contraseña', 'Restablecer contraseña', {
          timeOut: 6000,
          positionClass: 'toast-top-center',
          progressBar: true
        });
  }

  onSubmit() {
    if (this.loginForm.valid) {

      this.toastr.success('Inicio de sesión exitoso', 'Bienvenido');
    } else {
      this.toastr.error('Datos inválidos', 'Error');
    }
  }
}