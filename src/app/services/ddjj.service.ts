import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { DdjjDto } from 'src/app/dto/DdjjDto';
import { EstadoDdjjDto } from 'src/app/dto/EstadoDdjjDto';
import { AutoridadImagenDto } from 'src/app/dto/AutoridadImagenDto';
import { DdjjListDto } from 'src/app/dto/DdjjListDto';
import { Ddjj } from 'src/app/models/Configuracion/Ddjj';

@Injectable({
  providedIn: 'root'
})
export class DdjjService {

  private readonly baseUrl = 'http://localhost:8080/ddjj/';
  private _refresh$ = new Subject<void>();


  constructor(private httpClient: HttpClient) {}

  get refresh$(){
    return this._refresh$;
  }

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
    return this.httpClient.post<any>(`${this.baseUrl}create`, ddjjDto)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  update(id: number, ddjjDto: DdjjDto): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}update/${id}`, ddjjDto)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
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

  // ===================== MANEJO FIRMA SEGUN USUARIO =====================


  getAutoridadImageUrl(idUsuario: number): Observable<AutoridadImagenDto> {
    return this.httpClient.get<AutoridadImagenDto>(`${this.baseUrl}getAutoridadImageUrl/${idUsuario}`);
  }

  // ===================== VERIFICAR SI SE COMPLETARON TODOS LOS TIPOS DE GUARDIA =====================

  checkCompleteDdjjSet(anio: number, mes: string, idEfector: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}existCompleteSet/${anio}/${mes}/${idEfector}`);
  }

  // ===================== FILTROS POR TIPO DE GUARDIA con DTO =====================

  listCargoyAgrupAndServicio(anio: number, mes: string, idEfector: number, idServicio: number): Observable<DdjjListDto[]> {
    return this.httpClient.get<DdjjListDto[]>(`${this.baseUrl}listCargoyaAgrupServicio/${anio}/${mes}/${idEfector}/${idServicio}`);
  }

  listCargoyAgrup(anio: number, mes: string, idEfector: number): Observable<DdjjListDto[]> {
    return this.httpClient.get<DdjjListDto[]>(`${this.baseUrl}listCargoyaAgrup/${anio}/${mes}/${idEfector}`);
  }

  listExtraAndServicio(anio: number, mes: string, idEfector: number, idServicio: number): Observable<DdjjListDto[]> {
    return this.httpClient.get<DdjjListDto[]>(`${this.baseUrl}listExtraServicio/${anio}/${mes}/${idEfector}/${idServicio}`);
  }

  listExtra(anio: number, mes: string, idEfector: number): Observable<DdjjListDto[]> {
    return this.httpClient.get<DdjjListDto[]>(`${this.baseUrl}listExtra/${anio}/${mes}/${idEfector}`);
  }

  listCfAndServicio(anio: number, mes: string, idEfector: number, idServicio: number): Observable<DdjjListDto[]> {
    return this.httpClient.get<DdjjListDto[]>(`${this.baseUrl}listCfServicio/${anio}/${mes}/${idEfector}/${idServicio}`);
  }

  listCf(anio: number, mes: string, idEfector: number): Observable<DdjjListDto[]> {
    return this.httpClient.get<DdjjListDto[]>(`${this.baseUrl}listCf/${anio}/${mes}/${idEfector}`);
  }
}
