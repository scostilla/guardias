import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Asistencial } from "src/app/models/Configuracion/Asistencial";

@Injectable({
  providedIn: 'root'
})
export class AsistencialService {

  
    asistencialesURL = 'http://localhost:8080/asistencial/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<Asistencial[]> {
        return this.httpClient.get<Asistencial[]>(this.asistencialesURL + 'list');
    }
  
    public detail(id:number): Observable<Asistencial> {
        return this.httpClient.get<Asistencial>(this.asistencialesURL + `detail/${id}`);
    }
  
    public detailnombre(nombre:string): Observable<Asistencial> {
      return this.httpClient.get<Asistencial>(this.asistencialesURL + `detailnombre/${nombre}`);
  }
  
  public save(asistenciales:Asistencial): Observable<any> {
    return this.httpClient.post<any>(this.asistencialesURL + 'create', asistenciales)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, asistenciales:Asistencial): Observable<any> {
    return this.httpClient.put<any>(this.asistencialesURL + `update/${id}`, asistenciales)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.asistencialesURL + `delete/${id}`, {});
  }
  
  }
  