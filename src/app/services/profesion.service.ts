import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Profesion } from "src/app/models/Profesion";

@Injectable({
  providedIn: 'root'
})
export class ProfesionService {

  profesionesURL = 'http://localhost:8080/profesion/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Profesion[]> {
      return this.httpClient.get<Profesion[]>(this.profesionesURL + 'list');
  }

  public detail(id:number): Observable<Profesion> {
      return this.httpClient.get<Profesion>(this.profesionesURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<Profesion> {
    return this.httpClient.get<Profesion>(this.profesionesURL + `detailnombre/${nombre}`);
}

public save(profesiones:Profesion): Observable<any> {
  return this.httpClient.post<any>(this.profesionesURL + 'create', profesiones)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, profesiones:Profesion): Observable<any> {
  return this.httpClient.put<any>(this.profesionesURL + `update/${id}`, profesiones)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.delete<any>(this.profesionesURL + `delete/${id}`);
}

}
