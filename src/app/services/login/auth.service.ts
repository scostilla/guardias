import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { NuevoUsuario } from 'src/app/dto/usuario/NuevoUsuario';
import { Usuario } from 'src/app/models/login/Usuario';
import { JwtDTO } from 'src/app/models/login/jwt-dto';
import { LoginUsuario } from 'src/app/models/login/login-usuario';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUrl =  'http://localhost:8080/auth/' ;
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  public create(nuevoUsuario : NuevoUsuario): Observable<any>{
    return this.httpClient.post<any>(this.authUrl + 'create',nuevoUsuario);
  }

  public login(loginUsuario : LoginUsuario): Observable<JwtDTO>{
    /* console.log("console de auth login "+ loginUsuario.nombreUsuario);
    console.log("console de auth login "+ (this.httpClient.post<JwtDTO>(this.authURl + 'login',loginUsuario))); */
    return this.httpClient.post<JwtDTO>(this.authUrl + 'login',loginUsuario);

  }

  public detail(nombreUsuario: string): Observable<Usuario> {
    return this.httpClient.get<Usuario>(this.authUrl +`detail/${nombreUsuario}`);
  }

  public detailPersonBasicPanel(): Observable<PersonBasicPanelDto> {
    return this.httpClient.get<PersonBasicPanelDto>(this.authUrl +`detailPersonBasicPanel`);
  }

  public checkUsuario(nuevoUsuario: NuevoUsuario): Observable<Usuario> {
    return this.httpClient.post<Usuario>(this.authUrl + `check`,nuevoUsuario)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

}