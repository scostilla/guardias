import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pais } from "src/app/models/Pais";

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
      return this.httpClient.get<Pais>(this.paisesURL + `detail/${id}`);
  }

  public detailName(nombre:string): Observable<Pais> {
    return this.httpClient.get<Pais>(this.paisesURL + `detailname/${nombre}`);
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
