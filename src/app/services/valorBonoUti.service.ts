import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ValorBonoUti } from "src/app/models/ValorBonoUti";

@Injectable({
  providedIn: 'root'
})
export class ValorBonoUtiService {

  valorBonoUtisURL = 'http://localhost:8080/bonoUti/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<ValorBonoUti[]> {
      return this.httpClient.get<ValorBonoUti[]>(this.valorBonoUtisURL + 'list');
  }

  public detail(id:number): Observable<ValorBonoUti> {
      return this.httpClient.get<ValorBonoUti>(this.valorBonoUtisURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<ValorBonoUti> {
    return this.httpClient.get<ValorBonoUti>(this.valorBonoUtisURL + `detailnombre/${nombre}`);
}

public save(valorBonoUtis:ValorBonoUti): Observable<any> {
  return this.httpClient.post<any>(this.valorBonoUtisURL + 'create', valorBonoUtis)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, valorBonoUtis:ValorBonoUti): Observable<any> {
  return this.httpClient.put<any>(this.valorBonoUtisURL + `update/${id}`, valorBonoUtis)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.valorBonoUtisURL + `delete/${id}`, {});
}

}