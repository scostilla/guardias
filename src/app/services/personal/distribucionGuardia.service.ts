import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DistribucionGuardia } from "src/app/models/personal/DistribucionGuardia";

@Injectable({
  providedIn: 'root'
})
export class DistribucionGuardiaService {

  distribucionGuardiasURL = 'http://localhost:8080/distribucionGuardia/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<DistribucionGuardia[]> {
      return this.httpClient.get<DistribucionGuardia[]>(this.distribucionGuardiasURL + 'list');
  }

  public detail(id:number): Observable<DistribucionGuardia> {
      return this.httpClient.get<DistribucionGuardia>(this.distribucionGuardiasURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<DistribucionGuardia> {
    return this.httpClient.get<DistribucionGuardia>(this.distribucionGuardiasURL + `detailnombre/${nombre}`);
}

public save(distribucionGuardiaes:DistribucionGuardia): Observable<any> {
  return this.httpClient.post<any>(this.distribucionGuardiasURL + 'create', distribucionGuardiaes)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, distribucionGuardiaes:DistribucionGuardia): Observable<any> {
  return this.httpClient.put<any>(this.distribucionGuardiasURL + `update/${id}`, distribucionGuardiaes)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.distribucionGuardiasURL + `delete/${id}`, {});
}

}