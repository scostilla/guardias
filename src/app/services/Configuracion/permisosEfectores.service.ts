import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PermisosEfectoresDto } from "src/app/dto/Configuracion/PermisosEfectoresDto";

@Injectable({
  providedIn: 'root'
})
export class PermisosEfectoresService {

  
  permisosURL = 'http://localhost:8080/permisos/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<PermisosEfectoresDto[]> {
      return this.httpClient.get<PermisosEfectoresDto[]>(this.permisosURL + 'list');
  }

  public listAll(): Observable<PermisosEfectoresDto[]> {
    return this.httpClient.get<PermisosEfectoresDto[]>(this.permisosURL + 'listAll');
}

  public detail(id:number): Observable<PermisosEfectoresDto> {
      return this.httpClient.get<PermisosEfectoresDto>(this.permisosURL + `detail/${id}`);
  }

  getPermisoByPersona(idPersona: number): Observable<PermisosEfectoresDto> {
    return this.httpClient.get<PermisosEfectoresDto>(`${this.permisosURL}/detailAsistencial/${idPersona}`);
  }

  public detailnombre(nombre:string): Observable<PermisosEfectoresDto> {
    return this.httpClient.get<PermisosEfectoresDto>(this.permisosURL + `detailnombre/${nombre}`);
}

public save(permisos:PermisosEfectoresDto): Observable<any> {
  return this.httpClient.post<any>(this.permisosURL + 'create', permisos)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, permisos:PermisosEfectoresDto): Observable<any> {
  return this.httpClient.put<any>(this.permisosURL + `update/${id}`, permisos)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.permisosURL + `delete/${id}`, {});
}

public deleteFisic(id:number): Observable<any> {
  return this.httpClient.put<any>(this.permisosURL + `fisicdelete/${id}`, {});
}

// Verifica si un asistencial tiene permisos asociados a un efector
tienePermisos(idPersona: number, idEfector: number): Observable<boolean> {
  return this.httpClient.get<boolean>(`${this.permisosURL}/tienePermisos/${idPersona}/${idEfector}`);
}

}
