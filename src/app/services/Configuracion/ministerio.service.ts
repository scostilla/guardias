import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Ministerio } from "src/app/models/Configuracion/Ministerio";
import { MinisterioDto } from "src/app/dto/Configuracion/MinisterioDto";

@Injectable({
  providedIn: 'root'
})
export class MinisterioService {

  ministeriosURL = 'http://localhost:8080/ministerio/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Ministerio[]> {
      return this.httpClient.get<Ministerio[]>(this.ministeriosURL + 'list');
  }

  public detail(id:number): Observable<Ministerio> {
      return this.httpClient.get<Ministerio>(this.ministeriosURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<Ministerio> {
    return this.httpClient.get<Ministerio>(this.ministeriosURL + `detailnombre/${nombre}`);
}

public save(ministerios:MinisterioDto): Observable<any> {
  return this.httpClient.post<any>(this.ministeriosURL + 'create', ministerios)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public update(id:number, ministerios:MinisterioDto): Observable<any> {
  return this.httpClient.put<any>(this.ministeriosURL + `update/${id}`, ministerios)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.ministeriosURL + `delete/${id}`, {});
}

}
