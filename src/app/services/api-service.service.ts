import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ConsultaProfesional from 'src/server/models/ConsultaProfesional';

@Injectable({
  providedIn: 'root'
})

/*

#UNICO Servicio encargado de comunicarse con el backEnd

 */

export class ApiServiceService {

  //URL del back
  private baseUrl = "http://localhost:8080/api/V1/listaProfesionales";

  constructor(private http: HttpClient) { }

  getProfesionales():Observable<ConsultaProfesional[]>{
    return this.http.get<ConsultaProfesional[]>(`${this.baseUrl}`);
  }

  get(url: string): Observable<any> {
    return this.http.get(this.baseUrl + url);
  }

  post(url: string, data: any): Observable<any> {
    return this.http.post(this.baseUrl + url, data);
  }

  put(url: string, data: any): Observable<any> {
    return this.http.put(this.baseUrl + url, data);
  }

  delete(url: string): Observable<any> {
    return this.http.delete(this.baseUrl + url);
  }
}
