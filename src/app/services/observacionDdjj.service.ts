import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { ObservacionDdjj } from '../models/ObservacionDdjj';
import { ObservacionDdjjDto } from '../dto/ObservacionDdjjDto';
import { ObservacionDdjjUltimoDto } from '../dto/ObservacionDdjjUltimoDto';

@Injectable({
  providedIn: 'root'
})
export class ObservacionDdjjService {
  private baseUrl = 'http://localhost:8080/observacionDdjj/';

  constructor(private httpClient: HttpClient) {}

  list(): Observable<ObservacionDdjj[]> {
    return this.httpClient.get<ObservacionDdjj[]>(`${this.baseUrl}list`);
  }

  getById(id: number): Observable<ObservacionDdjj> {
    return this.httpClient.get<ObservacionDdjj>(`${this.baseUrl}detail/${id}`);
  }

  save(dto: ObservacionDdjjDto): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}create`, dto);
  }

  update(id: number, dto: ObservacionDdjjDto): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}update/${id}`, dto);
  }

  logicDelete(id: number): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}delete/${id}`, null);
  }

  fisicDelete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}fisicdelete/${id}`);
  }

  getUltimaObservacionPorDdjjYTipoDph(idDdjj: number, tipoDph: boolean): Observable<ObservacionDdjjUltimoDto> {
    return this.httpClient.get<ObservacionDdjjUltimoDto>(`${this.baseUrl}ultimaPorDdjj/${idDdjj}/${tipoDph}`);
  }
}
