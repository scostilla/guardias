import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Hospital } from "src/app/models/Hospital";

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  ministeriosURL = 'http://localhost:8080/ministerio/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public lista(): Observable<Hospital[]> {
      return this.httpClient.get<Hospital[]>(this.ministeriosURL + 'lista');
  }

  public detalle(id:number): Observable<Hospital> {
      return this.httpClient.get<Hospital>(this.ministeriosURL + `detalle/${id}`);
  }

  public detallenombre(nombre:string): Observable<Hospital> {
    return this.httpClient.get<Hospital>(this.ministeriosURL + `detallenombre/${nombre}`);
}

public save(ministerios:Hospital): Observable<any> {
  return this.httpClient.post<any>(this.ministeriosURL + 'create', ministerios)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public update(id:number, ministerios:Hospital): Observable<any> {
  return this.httpClient.put<any>(this.ministeriosURL + `update/${id}`, ministerios)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.delete<any>(this.ministeriosURL + `delete/${id}`);
}

}
