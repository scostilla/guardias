import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DdjjDto } from 'src/app/dto/DdjjDto';
import { EstadoDdjjDto } from 'src/app/dto/EstadoDdjjDto';
import { Ddjj } from 'src/app/models/Configuracion/Ddjj';

@Injectable({
  providedIn: 'root'
})
export class DdjjService {

  private readonly baseUrl = 'http://localhost:8080/ddjj/';

  constructor(private httpClient: HttpClient) {}

  list(): Observable<Ddjj[]> {
    return this.httpClient.get<Ddjj[]>(`${this.baseUrl}list`);
  }

  listAll(): Observable<Ddjj[]> {
    return this.httpClient.get<Ddjj[]>(`${this.baseUrl}listAll`);
  }

  getById(id: number): Observable<Ddjj> {
    return this.httpClient.get<Ddjj>(`${this.baseUrl}detail/${id}`);
  }

  listEfectorMes(idEfector: number, mes: string, anio: number): Observable<Ddjj[]> {
    return this.httpClient.get<Ddjj[]>(`${this.baseUrl}listEfectorMes/${idEfector}/${mes}/${anio}`);
  }

  listAnioMes(mes: string, anio: number): Observable<Ddjj[]> {
    return this.httpClient.get<Ddjj[]>(`${this.baseUrl}listAnioMes/${mes}/${anio}`);
  }

  listAnio(anio: number): Observable<Ddjj[]> {
    return this.httpClient.get<Ddjj[]>(`${this.baseUrl}listAnio/${anio}`);
  }

  create(ddjjDto: DdjjDto): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}create`, ddjjDto);
  }

  update(id: number, ddjjDto: DdjjDto): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}update/${id}`, ddjjDto);
  }

  logicDelete(id: number): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}delete/${id}`, {});
  }

  fisicDelete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}fisicdelete/${id}`);
  }

  cambiarEstado(dto: EstadoDdjjDto): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}cambiarEstado`, dto);
  }

  listByEfectorAndEstadoPendiente(idEfector: number): Observable<Ddjj[]> {
    return this.httpClient.get<Ddjj[]>(`${this.baseUrl}listByEfectorAndEstadoPendiente/${idEfector}`);
  }

  listByEfectorAndEstadoPendienteDph(idEfector: number): Observable<Ddjj[]> {
    return this.httpClient.get<Ddjj[]>(`${this.baseUrl}listByEfectorAndEstadoPendienteDph/${idEfector}`);
  }

  listByEfectorAndEstadoAprobado(idDirector: number, idEfector: number): Observable<Ddjj[]> {
    return this.httpClient.get<Ddjj[]>(`${this.baseUrl}listByEfectorAndEstadoAprobado/${idDirector}/${idEfector}`);
  }

  listByEfectorAndEstadoAprobadoDph(idEfector: number): Observable<Ddjj[]> {
    return this.httpClient.get<Ddjj[]>(`${this.baseUrl}listByEfectorAndEstadoAprobadoDph/${idEfector}`);
  }
}
