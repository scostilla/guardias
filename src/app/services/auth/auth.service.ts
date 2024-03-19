import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usuario y contraseña por defecto para la autenticación básica
  private readonly defaultUser = {
    username: 'usuario',
    password: 'contraseña'
  };

  // Variable para almacenar si el usuario está autenticado
  private isAuthenticated = false;

  constructor() { }

  // Método para verificar las credenciales del usuario
  login(username: string, password: string): boolean {
    if (username === this.defaultUser.username && password === this.defaultUser.password) {
      this.isAuthenticated = true;
      return true;
    } else {
      this.isAuthenticated = false;
      return false;
    }
  }

  // Método para cerrar la sesión del usuario
  logout(): void {
    this.isAuthenticated = false;
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  // Método para verificar si el usuario tiene un rol específico
  // En este ejemplo, todos los usuarios tienen el rol 'user' por defecto
  hasRole(role: string): boolean {
    if (this.isLoggedIn()) {
      // Aquí puedes agregar la lógica para manejar diferentes roles
      // Por ahora, todos los usuarios tienen el rol 'user'
      return role === 'user';
    }
    return false;
  }
}