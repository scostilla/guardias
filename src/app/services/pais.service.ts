import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Pais } from "src/app/models/Pais";

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  paisesURL = 'http://localhost:8080/pais/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public lista(): Observable<Pais[]> {
      return this.httpClient.get<Pais[]>(this.paisesURL + 'lista');
  }

  public detalle(id:number): Observable<Pais> {
      return this.httpClient.get<Pais>(this.paisesURL + `detalle/${id}`);
  }

  public detallenombre(nombre:string): Observable<Pais> {
    return this.httpClient.get<Pais>(this.paisesURL + `detallenombre/${nombre}`);
}

public save(paises:Pais): Observable<any> {
  return this.httpClient.post<any>(this.paisesURL + 'create', paises)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, paises:Pais): Observable<any> {
  return this.httpClient.put<any>(this.paisesURL + `update/${id}`, paises)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.delete<any>(this.paisesURL + `delete/${id}`);
}

}