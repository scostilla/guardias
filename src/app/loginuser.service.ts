import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class LoginuserService {

  private baseUrl="http://localhost:8080/auth/login"
  
  constructor(private httpClient: HttpClient) { }

  loginUser(user: Usuario):Observable<object> {
  
    console.log(user.password)
    return this.httpClient.post(`${this.baseUrl}`,user);
  }
}
