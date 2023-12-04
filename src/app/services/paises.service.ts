import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paises } from "src/app/models/paises";

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  paisesURL = 'http://localhost:8080/pais/';

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<Paises[]> {
      return this.httpClient.get<Paises[]>(this.paisesURL + 'lista');
  }

  public detail(id:number): Observable<Paises> {
      return this.httpClient.get<Paises>(this.paisesURL + `detalle/${id}`);
  }

  public detailName(nombre:string): Observable<Paises> {
    return this.httpClient.get<Paises>(this.paisesURL + `detallenombre/${nombre}`);
}

public save(paises:Paises): Observable<any> {
  return this.httpClient.post<any>(this.paisesURL + 'create', paises);
}

public update(id:number, paises:Paises): Observable<any> {
  return this.httpClient.put<any>(this.paisesURL + `update/${id}`, paises);
}

public delete(id:number): Observable<any> {
  return this.httpClient.delete<any>(this.paisesURL + `delete/${id}`);
}

}
