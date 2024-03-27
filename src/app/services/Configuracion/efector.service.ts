import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Efector } from "src/app/models/Configuracion/Efector";

@Injectable({
  providedIn: 'root'
})
export class EfectorService {

  efectoresURL = 'http://localhost:8080/efector/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Efector[]> {
      return this.httpClient.get<Efector[]>(this.efectoresURL + 'list');
  }

  public detail(id:number): Observable<Efector> {
      return this.httpClient.get<Efector>(this.efectoresURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<Efector> {
    return this.httpClient.get<Efector>(this.efectoresURL + `detailnombre/${nombre}`);
}

public save(efectores:Efector): Observable<any> {
  return this.httpClient.post<any>(this.efectoresURL + 'create', efectores)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public update(id:number, efectores:Efector): Observable<any> {
  return this.httpClient.put<any>(this.efectoresURL + `update/${id}`, efectores)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.efectoresURL + `delete/${id}`, {});
}

}
