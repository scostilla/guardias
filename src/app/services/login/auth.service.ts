import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtDTO } from 'src/app/models/login/jwt-dto';
import { LoginUsuario } from 'src/app/models/login/login-usuario';
import { NuevoUsuario } from 'src/app/models/login/nuevo-usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authURl =  'http://localhost:8080/auth/' ;
  constructor(private httpClient: HttpClient) { }
  public nuevo(nuevoUsuario : NuevoUsuario): Observable<any>{
    return this.httpClient.post<any>(this.authURl + 'nuevo',nuevoUsuario);
  }
  public login(loginUsuario : LoginUsuario): Observable<JwtDTO>{
    console.log("console de auth login "+ loginUsuario.nombreUsuario);
    console.log("console de auth login "+ (this.httpClient.post<JwtDTO>(this.authURl + 'login',loginUsuario)));
    return this.httpClient.post<JwtDTO>(this.authURl + 'login',loginUsuario);

  }
}
