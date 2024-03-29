import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Cargo } from "src/app/models/Configuracion/Cargo";

@Injectable({
  providedIn: 'root'
})
export class CargoService {

  
    cargosURL = 'http://localhost:8080/cargo/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<Cargo[]> {
      return this.httpClient.get<Cargo[]>(this.cargosURL + 'list')
    }  
    
    public detail(id:number): Observable<Cargo> {
        return this.httpClient.get<Cargo>(this.cargosURL + `detail/${id}`);
    }
  
    public detailnombre(nombre:string): Observable<Cargo> {
      return this.httpClient.get<Cargo>(this.cargosURL + `detailnombre/${nombre}`);
  }
  
  public save(cargos:Cargo): Observable<any> {
    return this.httpClient.post<any>(this.cargosURL + 'create', cargos)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, cargos:Cargo): Observable<any> {
    return this.httpClient.put<any>(this.cargosURL + `update/${id}`, cargos)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.cargosURL + `delete/${id}`, {})
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }

  }
  
  