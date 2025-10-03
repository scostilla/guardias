import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';

const TOKEN_KEY = 'AuthToken'; // todos los roles (excepto profesional, es decir USER)
const PROFESSIONAL_TOKEN_KEY = 'ProfessionalAuthToken'; // exclusivo de profesionales

// Keys para usuario general
const USERNAME_KEY = 'AuthUserName';
const AUTHORITIES_KEY = 'AuthAuthorities';

// Keys para usuario profesional
const PROFESSIONAL_USERNAME_KEY = 'ProfessionalUserName';
const PROFESSIONAL_AUTHORITIES_KEY = 'ProfessionalAuthorities';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private secretKey = 'Dph*FfLlMmNn99';
  roles: Array<string> = [];
  professionalRoles: Array<string> = [];

  private currentRoleSubject = new BehaviorSubject<string | null>(this.getCurrentRole());
  currentRole$ = this.currentRoleSubject.asObservable();

  private isLoggedSubject = new BehaviorSubject<boolean>(this.getToken() !== null);
  isLogged$ = this.isLoggedSubject.asObservable();

  private isProfessionalLoggedSubject = new BehaviorSubject<boolean>(this.getProfessionalToken() !== null);
  isProfessionalLogged$ = this.isProfessionalLoggedSubject.asObservable();

  constructor() { }

  // ====== TOKEN GENERAL ======
  public setToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    this.isLoggedSubject.next(true);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  // ====== TOKEN PROFESIONAL ======
  public setProfessionalToken(token: string): void {
    window.sessionStorage.removeItem(PROFESSIONAL_TOKEN_KEY);
    window.sessionStorage.setItem(PROFESSIONAL_TOKEN_KEY, token);
    this.isProfessionalLoggedSubject.next(true);
  }

  public getProfessionalToken(): string | null {
    return sessionStorage.getItem(PROFESSIONAL_TOKEN_KEY);
  }

  // ====== MÉTODOS COMUNES (GENERAL) ======
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
  
  // ====== MÉTODOS COMUNES (PROFESIONAL) ======
  public getProfessionalUserIdFromToken(): string | null {
    const token = this.getProfessionalToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  }

  public setProfessionalUserName(userName: string): void {
    window.sessionStorage.removeItem(PROFESSIONAL_USERNAME_KEY);
    window.sessionStorage.setItem(PROFESSIONAL_USERNAME_KEY, userName);
  }

  public getProfessionalUserName(): string {
    return sessionStorage.getItem(PROFESSIONAL_USERNAME_KEY)!;
  }

  public setProfessionalAuthorities(authorities: string[]): void {
    window.sessionStorage.removeItem(PROFESSIONAL_AUTHORITIES_KEY);
    window.sessionStorage.setItem(PROFESSIONAL_AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getProfessionalAuthorities(): string[] {
    this.professionalRoles = [];
    if (sessionStorage.getItem(PROFESSIONAL_AUTHORITIES_KEY)) {
      JSON.parse(sessionStorage.getItem(PROFESSIONAL_AUTHORITIES_KEY)!).forEach((authority: { authority: string; }) => {
        this.professionalRoles.push(authority.authority);
      });
    }
    return this.professionalRoles;
  }

  // ====== Encriptación / Desencriptación ======
  encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // ====== Rol actual ======
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

  getCurrentRole(): string | null {
    const encryptedRole = sessionStorage.getItem('currentRole');
    if (encryptedRole) {
      const decryptedRole = this.decrypt(encryptedRole);
      return decryptedRole;
    }
    return null;
  }

  // ====== Logout ======
  public logOut(): void {
    // Logout completo: hospital / roles + profesional
    window.sessionStorage.clear();
    this.currentRoleSubject.next(null);
    this.isLoggedSubject.next(false);
    this.isProfessionalLoggedSubject.next(false);
  }

  public logOutProfessional(): void {
    // Logout solo del profesional
    window.sessionStorage.removeItem(PROFESSIONAL_TOKEN_KEY);
    window.sessionStorage.removeItem(PROFESSIONAL_USERNAME_KEY);
    window.sessionStorage.removeItem(PROFESSIONAL_AUTHORITIES_KEY);
    this.isProfessionalLoggedSubject.next(false);
  }

  setLoggedState(state: boolean) {
    this.isLoggedSubject.next(state);
  }
}
