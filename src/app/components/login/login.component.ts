import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username!: string;
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
  }
}

