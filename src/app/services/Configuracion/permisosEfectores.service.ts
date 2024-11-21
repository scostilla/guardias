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

  public detail(id:number): Observable<PermisosEfectoresDto> {
      return this.httpClient.get<PermisosEfectoresDto>(this.permisosURL + `detail/${id}`);
  }

  getByAsistencial(idAsistencial: number): Observable<PermisosEfectoresDto> {
    return this.httpClient.get<PermisosEfectoresDto>(`${this.permisosURL}/detailAsistencial/${idAsistencial}`);
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

}
