import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Adicional } from 'src/app/models/Configuracion/Adicional';

@Injectable({
    providedIn: 'root'
  })
  export class AdicionalService {
  
    adicionalURL = 'http://localhost:8080/adicional/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<Adicional[]> {
        return this.httpClient.get<Adicional[]>(this.adicionalURL + 'list');
    }
  
    public detail(id:number): Observable<Adicional> {
        return this.httpClient.get<Adicional>(this.adicionalURL + `detail/${id}`);
    }
  
  public save(adicional:Adicional): Observable<any> {
    return this.httpClient.post<any>(this.adicionalURL + 'create', adicional)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, adicional:Adicional): Observable<any> {
    return this.httpClient.put<any>(this.adicionalURL + `update/${id}`, adicional)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.adicionalURL + `delete/${id}`, {});
  }
  
  }