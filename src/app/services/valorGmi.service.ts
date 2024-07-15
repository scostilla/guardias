import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ValorGmi } from "src/app/models/ValorGmi";

@Injectable({
  providedIn: 'root'
})
export class ValorGmiService {

  valorGmiesURL = 'http://localhost:8080/valorGmi/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<ValorGmi[]> {
      return this.httpClient.get<ValorGmi[]>(this.valorGmiesURL + 'list');
  }

  public detail(id:number): Observable<ValorGmi> {
      return this.httpClient.get<ValorGmi>(this.valorGmiesURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<ValorGmi> {
    return this.httpClient.get<ValorGmi>(this.valorGmiesURL + `detailnombre/${nombre}`);
}

public save(valorGmies:ValorGmi): Observable<any> {
  return this.httpClient.post<any>(this.valorGmiesURL + 'create', valorGmies)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, valorGmies:ValorGmi): Observable<any> {
  return this.httpClient.put<any>(this.valorGmiesURL + `update/${id}`, valorGmies)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.valorGmiesURL + `delete/${id}`, {});
}

}