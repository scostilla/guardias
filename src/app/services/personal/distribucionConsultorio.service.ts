import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DistribucionConsultorio } from "src/app/models/personal/DistribucionConsultorio";

@Injectable({
  providedIn: 'root'
})
export class DistribucionConsultorioService {

  distribucionConsultoriosURL = 'http://localhost:8080/distribucionConsultorio/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<DistribucionConsultorio[]> {
      return this.httpClient.get<DistribucionConsultorio[]>(this.distribucionConsultoriosURL + 'list');
  }

  public detail(id:number): Observable<DistribucionConsultorio> {
      return this.httpClient.get<DistribucionConsultorio>(this.distribucionConsultoriosURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<DistribucionConsultorio> {
    return this.httpClient.get<DistribucionConsultorio>(this.distribucionConsultoriosURL + `detailnombre/${nombre}`);
}

public save(distribucionConsultorioes:DistribucionConsultorio): Observable<any> {
  return this.httpClient.post<any>(this.distribucionConsultoriosURL + 'create', distribucionConsultorioes)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, distribucionConsultorioes:DistribucionConsultorio): Observable<any> {
  return this.httpClient.put<any>(this.distribucionConsultoriosURL + `update/${id}`, distribucionConsultorioes)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.distribucionConsultoriosURL + `delete/${id}`, {});
}

}