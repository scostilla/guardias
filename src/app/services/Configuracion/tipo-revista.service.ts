import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TipoRevista } from "src/app/models/Configuracion/TipoRevista";

@Injectable({
  providedIn: 'root'
})
export class TipoRevistaService {

  revistasURL = 'http://localhost:8080/tipo-revista/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<TipoRevista[]> {
      return this.httpClient.get<TipoRevista[]>(this.revistasURL + 'list');
  }

  public detail(id:number): Observable<TipoRevista> {
      return this.httpClient.get<TipoRevista>(this.revistasURL + `detail/${id}`);
  }

public save(revistas:TipoRevista): Observable<any> {
  return this.httpClient.post<any>(this.revistasURL + 'create', revistas)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public update(id:number, revistas:TipoRevista): Observable<any> {
  return this.httpClient.put<any>(this.revistasURL + `update/${id}`, revistas)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.revistasURL + `delete/${id}`,{});
}

}
