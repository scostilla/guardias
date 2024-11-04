import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PermisosDto } from "src/app/dto/Configuracion/PermisosDto";

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  
    permisosURL = 'http://localhost:8080/permisos/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<PermisosDto[]> {
        return this.httpClient.get<PermisosDto[]>(this.permisosURL + 'list');
    }
  
    public detail(id:number): Observable<PermisosDto> {
        return this.httpClient.get<PermisosDto>(this.permisosURL + `detail/${id}`);
    }

    getByAsistencial(idAsistencial: number): Observable<PermisosDto> {
      return this.httpClient.get<PermisosDto>(`${this.permisosURL}/detailAsistencial/${idAsistencial}`);
    }
  
    public detailnombre(nombre:string): Observable<PermisosDto> {
      return this.httpClient.get<PermisosDto>(this.permisosURL + `detailnombre/${nombre}`);
  }
  
  public save(permisos:PermisosDto): Observable<any> {
    return this.httpClient.post<any>(this.permisosURL + 'create', permisos)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, permisos:PermisosDto): Observable<any> {
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
  
  }
  