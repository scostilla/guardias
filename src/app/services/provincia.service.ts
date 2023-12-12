import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Provincia } from "src/app/models/Provincia";

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  provinciasURL = 'http://localhost:8080/provincia/';

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable<Provincia[]> {
      return this.httpClient.get<Provincia[]>(this.provinciasURL + 'lista');
  }

  public detail(id:number): Observable<Provincia> {
      return this.httpClient.get<Provincia>(this.provinciasURL + `detalle/${id}`);
  }

  public detailName(nombre:string): Observable<Provincia> {
    return this.httpClient.get<Provincia>(this.provinciasURL + `detallenombre/${nombre}`);
}

public save(provincias:Provincia): Observable<any> {
  return this.httpClient.post<any>(this.provinciasURL + 'create', provincias);
}

public update(id:number, provincias:Provincia): Observable<any> {
  return this.httpClient.put<any>(this.provinciasURL + `update/${id}`, provincias);
}

public delete(id:number): Observable<any> {
  return this.httpClient.delete<any>(this.provinciasURL + `delete/${id}`);
}

}
