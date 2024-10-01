import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IncisoDto } from 'src/app/dto/Configuracion/IncisoDto';
import { Inciso } from 'src/app/models/Configuracion/Inciso';

@Injectable({
    providedIn: 'root'
  })
  export class IncisoService {
  
    incisoURL = 'http://localhost:8080/inciso/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<Inciso[]> {
        return this.httpClient.get<Inciso[]>(this.incisoURL + 'list');
    }
  
    public detail(id:number): Observable<Inciso> {
        return this.httpClient.get<Inciso>(this.incisoURL + `detail/${id}`);
    }
  
  public save(inciso:IncisoDto): Observable<any> {
    return this.httpClient.post<any>(this.incisoURL + 'create', inciso)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, inciso:IncisoDto): Observable<any> {
    return this.httpClient.put<any>(this.incisoURL + `update/${id}`, inciso)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.incisoURL + `delete/${id}`, {});
  }
  
  }