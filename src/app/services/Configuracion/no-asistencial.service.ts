import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Noasistencial } from "src/app/models/Configuracion/NoAsistencial";

@Injectable({
  providedIn: 'root'
})
export class NoNoasistencialService {

  
    noasistencialesURL = 'http://localhost:8080/noasistencial/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<Noasistencial[]> {
        return this.httpClient.get<Noasistencial[]>(this.noasistencialesURL + 'list');
    }
  
    public detail(id:number): Observable<Noasistencial> {
        return this.httpClient.get<Noasistencial>(this.noasistencialesURL + `detail/${id}`);
    }
  
    public detailnombre(nombre:string): Observable<Noasistencial> {
      return this.httpClient.get<Noasistencial>(this.noasistencialesURL + `detailnombre/${nombre}`);
  }
  
  public save(nonoasistenciales:Noasistencial): Observable<any> {
    return this.httpClient.post<any>(this.noasistencialesURL + 'create', nonoasistenciales)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, nonoasistenciales:Noasistencial): Observable<any> {
    return this.httpClient.put<any>(this.noasistencialesURL + `update/${id}`, nonoasistenciales)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.noasistencialesURL + `delete/${id}`, {});
  }
  
  }
  