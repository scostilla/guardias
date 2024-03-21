import { Injectable } from '@angular/core';

const TOKEN_KEY = 'AuthToken'

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  public setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public logOut(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
