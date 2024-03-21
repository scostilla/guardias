import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Este sería un ejemplo de cómo podrías manejar los roles y la autenticación
  // En un caso real, aquí integrarías con tu backend y JWT
  private isAuthenticated = false;
  private userRole = 'guest'; // 'user', 'admin'

  constructor() { }

  login(username: string, password: string): boolean {
    if (username === 'user' && password === 'genericPassword') {
      this.isAuthenticated = true;
      this.userRole = 'user'; // asignar el rol según la respuesta del backend
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.userRole = 'guest';
  }

  checkAuthentication(): boolean {
    return this.isAuthenticated;
  }

  getUserRole(): string {
    return this.userRole;
  }
}