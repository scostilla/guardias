import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TipoLey } from "src/app/models/Configuracion/TipoLey";

@Injectable({
  providedIn: 'root'
})
export class TipoLeyService {

  tipoLeyURL = 'http://localhost:8080/tipoLey/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<TipoLey[]> {
      return this.httpClient.get<TipoLey[]>(this.tipoLeyURL + 'list');
  }

  public detail(id:number): Observable<TipoLey> {
      return this.httpClient.get<TipoLey>(this.tipoLeyURL + `detail/${id}`);
  }

public save(revistas:TipoLey): Observable<any> {
  return this.httpClient.post<any>(this.tipoLeyURL + 'create', revistas)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public update(id:number, revistas:TipoLey): Observable<any> {
  return this.httpClient.put<any>(this.tipoLeyURL + `update/${id}`, revistas)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.tipoLeyURL + `delete/${id}`,{});
}

}
