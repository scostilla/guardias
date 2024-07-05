import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { Usuario } from 'src/app/models/login/Usuario';
import { JwtDTO } from 'src/app/models/login/jwt-dto';
import { LoginUsuario } from 'src/app/models/login/login-usuario';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authURl =  'http://localhost:8080/auth/' ;

  constructor(private httpClient: HttpClient) { }

  public nuevo(nuevoUsuario : Usuario): Observable<any>{
    return this.httpClient.post<any>(this.authURl + 'create',nuevoUsuario);
  }

  public login(loginUsuario : LoginUsuario): Observable<JwtDTO>{
    return this.httpClient.post<JwtDTO>(this.authURl + 'login',loginUsuario);

  }

  public detail(nombreUsuario: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(this.authURl +`detail/${nombreUsuario}`);
  }

  public detailPersonBasicPanel(): Observable<PersonBasicPanelDto> {
    return this.httpClient.get<PersonBasicPanelDto>(this.authURl +`detailPersonBasicPanel`);
  }



}
