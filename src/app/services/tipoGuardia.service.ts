import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TipoGuardia } from '../models/Configuracion/TipoGuardia';
import { TipoGuardiaDto } from '../dto/TipoGuardiaDto';

@Injectable({
    providedIn: 'root'
  })
  export class TipoGuardiaService {
  
    tipoGuardiaURL = 'http://localhost:8080/tipoGuardia/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<TipoGuardia[]> {
        return this.httpClient.get<TipoGuardia[]>(this.tipoGuardiaURL + 'list');
    }
  
    public detail(id:number): Observable<TipoGuardia> {
        return this.httpClient.get<TipoGuardia>(this.tipoGuardiaURL + `detail/${id}`);
    }
  
  public save(tipoGuardia:TipoGuardiaDto): Observable<any> {
    return this.httpClient.post<any>(this.tipoGuardiaURL + 'create', tipoGuardia)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, tipoGuardia:TipoGuardiaDto): Observable<any> {
    return this.httpClient.put<any>(this.tipoGuardiaURL + `update/${id}`, tipoGuardia)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.tipoGuardiaURL + `delete/${id}`, {});
  }
  
  }