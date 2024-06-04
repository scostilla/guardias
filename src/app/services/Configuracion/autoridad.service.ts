import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AutoridadDto } from 'src/app/dto/Configuracion/AutoridadDto';
import { Autoridad } from 'src/app/models/Configuracion/Autoridad';

@Injectable({
    providedIn: 'root'
  })
  export class AutoridadService {
  
    autoridadURL = 'http://localhost:8080/autoridad/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<Autoridad[]> {
        return this.httpClient.get<Autoridad[]>(this.autoridadURL + 'list');
    }
  
    public detail(id:number): Observable<Autoridad> {
        return this.httpClient.get<Autoridad>(this.autoridadURL + `detail/${id}`);
    }
  
  public save(autoridad:AutoridadDto): Observable<any> {
    return this.httpClient.post<any>(this.autoridadURL + 'create', autoridad)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, autoridad:AutoridadDto): Observable<any> {
    return this.httpClient.put<any>(this.autoridadURL + `update/${id}`, autoridad)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.autoridadURL + `delete/${id}`, {});
  }
  
  }