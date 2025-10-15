import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, Subject, tap, throwError } from 'rxjs';
import { PersonBasicPanelDto } from 'src/app/dto/person/PersonBasicPanelDto';
import { NuevoUsuario } from 'src/app/dto/usuario/NuevoUsuario';
import { Usuario } from 'src/app/models/login/Usuario';
import { JwtDTO } from 'src/app/models/login/jwt-dto';
import { LoginUsuario } from 'src/app/models/login/login-usuario';

import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUrl = `${environment.apiUrl}/auth/`;
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public create(nuevoUsuario : NuevoUsuario): Observable<any>{
    console.log("rol que envio", nuevoUsuario);
    return this.httpClient.post<any>(this.authUrl + 'create',nuevoUsuario)
    .pipe(
      tap(() => {
       this._refresh$.next();
      })
    );
  }

  // Verificar si un usuario tiene un legajo activo
  verificarLegajoActivo(idPersona: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.authUrl}legajoActivo/${idPersona}`);
  }
  
  // Verificar si la persona tiene un usuario activo asociado
  verificarUsuarioActivo(idPersona: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.authUrl}usuarioActivo/${idPersona}`);
  }

  // Método para verificar si un nombre de usuario ya existe
  checkUsername(nombreUsuario: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.authUrl}checkUsername/${nombreUsuario}`);
  }

  // Actualizar un usuario
  update(id: number, nuevoUsuario: NuevoUsuario): Observable<any> {
    return this.httpClient.put<any>(`${this.authUrl}update/${id}`, nuevoUsuario)
    .pipe(
      tap(() => {
       this._refresh$.next();
      })
    );
  }
  
  public list(): Observable<Usuario[]> {
    return this.httpClient.get<Usuario[]>(this.authUrl + 'list');
}

  public login(loginUsuario : LoginUsuario): Observable<JwtDTO>{
    /* console.log("console de auth login "+ loginUsuario.nombreUsuario);
    console.log("console de auth login "+ (this.httpClient.post<JwtDTO>(this.authURl + 'login',loginUsuario))); */
    return this.httpClient.post<JwtDTO>(this.authUrl + 'login',loginUsuario);

  }

  public detail(nombreUsuario: string): Observable<Usuario| null> {
    return this.httpClient.get<Usuario>(this.authUrl +`detail/${nombreUsuario}`).pipe(
      catchError((error) => {
        if (error.status === 404) {
          // Retorna null si el usuario no existe
          return of(null);
        }
        return throwError(error);
      })
    );
  }

  public detailPersonBasicPanel(): Observable<PersonBasicPanelDto> {
    return this.httpClient.get<PersonBasicPanelDto>(this.authUrl +`detailPersonBasicPanel`);
  }

  getNombreYApellidoById(id: number): Observable<string> {
        return this.httpClient.get<string>(`${this.authUrl}detailNombreYApellido/${id}`);
  }

  public detailPersonBasicPanelHospital(): Observable<PersonBasicPanelDto> {
    return this.httpClient.get<PersonBasicPanelDto>(this.authUrl +`detailPersonBasicPanel/hospital`);
  }
  
  public detailPersonBasicPanelProfessional(): Observable<PersonBasicPanelDto> {
    return this.httpClient.get<PersonBasicPanelDto>(this.authUrl +`detailPersonBasicPanel/professional`);
  }

}