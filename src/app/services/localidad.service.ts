import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Localidad } from "src/app/models/Localidad";
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LocalidadService {

  localidadesURL = 'http://localhost:8080/localidad/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Localidad[]> {
      return this.httpClient.get<Localidad[]>(this.localidadesURL + 'list');
  }

  public detail(id:number): Observable<Localidad> {
      return this.httpClient.get<Localidad>(this.localidadesURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<Localidad> {
    return this.httpClient.get<Localidad>(this.localidadesURL + `detailnombre/${nombre}`);
}

public save(localidad:Localidad): Observable<any> {
  return this.httpClient.post<any>(this.localidadesURL + 'create', localidad)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, localidad:Localidad): Observable<any> {
  return this.httpClient.put<any>(this.localidadesURL + `update/${id}`, localidad)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.localidadesURL + `delete/${id}`, {});
}

}
