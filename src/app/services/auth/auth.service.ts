import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor() {}

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(username: string, password: string): boolean {
    const accessGranted = (username === 'admin' && password === 'admin');
    this.isAuthenticatedSubject.next(accessGranted); // Corregido aquí
    return accessGranted;
  }

  logout(): void {
    this.isAuthenticatedSubject.next(false);
  }

  getAuthenticationStatus(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }
    
  updateAuthenticationStatus(status: boolean): void {
    this.isAuthenticatedSubject.next(status);
  }
}