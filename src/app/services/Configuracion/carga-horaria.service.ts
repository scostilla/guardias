import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CargaHoraria } from 'src/app/models/Configuracion/CargaHoraria';

@Injectable({
    providedIn: 'root'
  })
  export class CargaHorariaService {
  
    cargaHorariaURL = 'http://localhost:8080/cargaHoraria/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<CargaHoraria[]> {
        return this.httpClient.get<CargaHoraria[]>(this.cargaHorariaURL + 'list');
    }
  
    public detail(id:number): Observable<CargaHoraria> {
        return this.httpClient.get<CargaHoraria>(this.cargaHorariaURL + `detail/${id}`);
    }
  
  public save(cargaHoraria:CargaHoraria): Observable<any> {
    return this.httpClient.post<any>(this.cargaHorariaURL + 'create', cargaHoraria)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, cargaHoraria:CargaHoraria): Observable<any> {
    return this.httpClient.put<any>(this.cargaHorariaURL + `update/${id}`, cargaHoraria)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.cargaHorariaURL + `delete/${id}`, {});
  }
  
  }