import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Notificacion } from "src/app/models/Notificacion";

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  notificacionesURL = 'http://localhost:8080/notificacion/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public lista(): Observable<Notificacion[]> {
      return this.httpClient.get<Notificacion[]>(this.notificacionesURL + 'lista');
  }

  public detalle(id:number): Observable<Notificacion> {
      return this.httpClient.get<Notificacion>(this.notificacionesURL + `detalle/${id}`);
  }

  public detallenombre(nombre:string): Observable<Notificacion> {
    return this.httpClient.get<Notificacion>(this.notificacionesURL + `detallenombre/${nombre}`);
}

public save(notificaciones:Notificacion): Observable<any> {
  return this.httpClient.post<any>(this.notificacionesURL + 'create', notificaciones)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, notificaciones:Notificacion): Observable<any> {
  return this.httpClient.put<any>(this.notificacionesURL + `update/${id}`, notificaciones)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.delete<any>(this.notificacionesURL + `delete/${id}`);
}

}