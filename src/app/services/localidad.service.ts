import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Localidad } from "src/app/models/localidad";

@Injectable({
  providedIn: 'root'
})
export class LocalidadService {

  localidadesURL = 'http://localhost:8080/localidad/';

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<Localidad[]> {
      return this.httpClient.get<Localidad[]>(this.localidadesURL + 'lista');
  }

  public detail(id:number): Observable<Localidad> {
      return this.httpClient.get<Localidad>(this.localidadesURL + `detalle/${id}`);
  }

  public detailName(nombre:string): Observable<Localidad> {
    return this.httpClient.get<Localidad>(this.localidadesURL + `detallenombre/${nombre}`);
}

public save(localidad:Localidad): Observable<any> {
  return this.httpClient.post<any>(this.localidadesURL + 'create', localidad);
}

public update(id:number, localidad:Localidad): Observable<any> {
  return this.httpClient.put<any>(this.localidadesURL + `update/${id}`, localidad);
}

public delete(id:number): Observable<any> {
  return this.httpClient.delete<any>(this.localidadesURL + `delete/${id}`);
}

}
