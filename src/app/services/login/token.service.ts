import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';

const TOKEN_KEY = 'AuthToken';
const USERNAME_KEY = 'AuthUserName';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private secretKey = 'Dph*FfLlMmNn99';
  roles: Array<string> = [];

  private currentRoleSubject = new BehaviorSubject<string | null>(this.getCurrentRole());
  currentRole$ = this.currentRoleSubject.asObservable();

  constructor() { }

  public setToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  /*  El token JWT esta compuesto por tres partes separadas por puntos (.), y el método token.split('.')[1] extraerá el payload (la segunda parte), que es el que contiene la información del usuario, incluido el ID. */
  public getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
}


  public setUserName(userName: string): void {
    window.sessionStorage.removeItem(USERNAME_KEY);
    window.sessionStorage.setItem(USERNAME_KEY, userName);
  }

  public getUserName(): string {
    return sessionStorage.getItem(USERNAME_KEY)!;
  }
  
  public setAuthorities(authorities: string[]): void {
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[] {
    this.roles = [];

    if (sessionStorage.getItem(AUTHORITIES_KEY)) {
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)!).forEach((authority: { authority: string; }) => {
        this.roles.push(authority.authority);
      });
    }
    return this.roles;
  }
  
  // Métodos de encriptación y desencriptación
  encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Establecer el rol actual
  setCurrentRole(role: string | null): void {
    if (role !== null) {
      const encryptedRole = this.encrypt(role);
      sessionStorage.setItem('currentRole', encryptedRole);
      this.currentRoleSubject.next(role);
    } else {
      sessionStorage.removeItem('currentRole');
      this.currentRoleSubject.next(null);
    }
  }

  // Obtener el rol actual
  getCurrentRole(): string | null {
    const encryptedRole = sessionStorage.getItem('currentRole');
    if (encryptedRole) {
      const decryptedRole = this.decrypt(encryptedRole);
      return decryptedRole;
    }
    return null;
  }

  public logOut(): void {
    window.sessionStorage.clear();
    this.currentRoleSubject.next(null);
    this.isLoggedSubject.next(false);
  }

private isLoggedSubject = new BehaviorSubject<boolean>(this.getToken() !== null);
isLogged$ = this.isLoggedSubject.asObservable();

setLoggedState(state: boolean) {
  this.isLoggedSubject.next(state);
}

}