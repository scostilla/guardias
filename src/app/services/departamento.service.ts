import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Departamento } from "src/app/models/Departamento";
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  departamentosURL = 'http://localhost:8080/departamento/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Departamento[]> {
      return this.httpClient.get<Departamento[]>(this.departamentosURL + 'list');
  }

  public detail(id:number): Observable<Departamento> {
      return this.httpClient.get<Departamento>(this.departamentosURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<Departamento> {
    return this.httpClient.get<Departamento>(this.departamentosURL + `detailnombre/${nombre}`);
}

public save(departamento:Departamento): Observable<any> {
  return this.httpClient.post<any>(this.departamentosURL + 'create', departamento)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, departamento:Departamento): Observable<any> {
  return this.httpClient.put<any>(this.departamentosURL + `update/${id}`, departamento)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.delete<any>(this.departamentosURL + `delete/${id}`);
}

}
