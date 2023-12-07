import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departamento } from "src/app/models/departamento";

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {

  departamentosURL = 'http://localhost:8080/departamento/';

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<Departamento[]> {
      return this.httpClient.get<Departamento[]>(this.departamentosURL + 'lista');
  }

  public detail(id:number): Observable<Departamento> {
      return this.httpClient.get<Departamento>(this.departamentosURL + `detalle/${id}`);
  }

  public detailName(nombre:string): Observable<Departamento> {
    return this.httpClient.get<Departamento>(this.departamentosURL + `detallenombre/${nombre}`);
}

public save(departamento:Departamento): Observable<any> {
  return this.httpClient.post<any>(this.departamentosURL + 'create', departamento);
}

public update(id:number, departamento:Departamento): Observable<any> {
  return this.httpClient.put<any>(this.departamentosURL + `update/${id}`, departamento);
}

public delete(id:number): Observable<any> {
  return this.httpClient.delete<any>(this.departamentosURL + `delete/${id}`);
}

}
