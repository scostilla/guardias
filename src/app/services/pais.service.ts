import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pais } from "src/app/models/pais";

@Injectable({
  providedIn: 'root'
})
export class PaisService {

  PaisURL = 'http://localhost:8080/pais/';

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<Pais[]> {
      return this.httpClient.get<Pais[]>(this.PaisURL + 'lista');
  }

  public detail(id:number): Observable<Pais> {
      return this.httpClient.get<Pais>(this.PaisURL + `detail/${id}`);
  }

  public detailName(nombre:string): Observable<Pais> {
    return this.httpClient.get<Pais>(this.PaisURL + `detailname/${nombre}`);
}

public save(Pais:Pais): Observable<any> {
  return this.httpClient.post<any>(this.PaisURL + 'create', Pais);
}

public update(id:number, Pais:Pais): Observable<any> {
  return this.httpClient.put<any>(this.PaisURL + `update/${id}`, Pais);
}

public delete(id:number): Observable<any> {
  return this.httpClient.delete<any>(this.PaisURL + `delete/${id}`);
}
}
