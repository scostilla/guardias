import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pais } from "src/app/models/pais";

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  paisesURL = 'http://localhost:8080/pais/';

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<Pais[]> {
      return this.httpClient.get<Pais[]>(this.paisesURL + 'lista');
  }

  public detail(id:number): Observable<Pais> {
      return this.httpClient.get<Pais>(this.paisesURL + `detalle/${id}`);
  }

  public detailName(nombre:string): Observable<Pais> {
    return this.httpClient.get<Pais>(this.paisesURL + `detallenombre/${nombre}`);
}

public save(paises:Pais): Observable<any> {
  return this.httpClient.post<any>(this.paisesURL + 'create', paises);
}

public update(id:number, paises:Pais): Observable<any> {
  return this.httpClient.put<any>(this.paisesURL + `update/${id}`, paises);
}

public delete(id:number): Observable<any> {
  return this.httpClient.delete<any>(this.paisesURL + `delete/${id}`);
}

}
