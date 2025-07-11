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

  existsDdjj(anio: number, mes: string, idEfector: number, idtipoGuardia: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}existsDdjj/${anio}/${mes}/${idEfector}/${idtipoGuardia}`);
  }

  // DDJJ CARGO Y AGRUPACIÓN
  listDdjjCargoyAgrup(anio: number, mes: string, idEfector: number): Observable<Ddjj[]> {
    return this.httpClient.get<Ddjj[]>(`${this.baseUrl}listDdjjCargoyAgrup/${anio}/${mes}/${idEfector}`);
  }

  listDdjjCargoyAgrupAndServicio(anio: number, mes: string, idEfector: number, idServicio: number): Observable<Ddjj[]> {
    return this.httpClient.get<Ddjj[]>(`${this.baseUrl}listDdjjCargoyaAgrupServicio/${anio}/${mes}/${idEfector}/${idServicio}`);
  }

  // DDJJ EXTRA
  listDdjjExtra(anio: number, mes: string, idEfector: number): Observable<Ddjj[]> {
    return this.httpClient.get<Ddjj[]>(`${this.baseUrl}listDdjjExtra/${anio}/${mes}/${idEfector}`);
  }

  listDdjjExtraAndServicio(anio: number, mes: string, idEfector: number, idServicio: number): Observable<Ddjj[]> {
    return this.httpClient.get<Ddjj[]>(`${this.baseUrl}listDdjjExtraServicio/${anio}/${mes}/${idEfector}/${idServicio}`);
  }

  // DDJJ CF
  listDdjjCf(anio: number, mes: string, idEfector: number): Observable<Ddjj[]> {
    return this.httpClient.get<Ddjj[]>(`${this.baseUrl}listDdjjCf/${anio}/${mes}/${idEfector}`);
  }

  listDdjjCfAndServicio(anio: number, mes: string, idEfector: number, idServicio: number): Observable<Ddjj[]> {
    return this.httpClient.get<Ddjj[]>(`${this.baseUrl}listDdjjCfServicio/${anio}/${mes}/${idEfector}/${idServicio}`);
  }
}
