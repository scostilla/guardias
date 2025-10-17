import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CronogramaDefinitivo } from 'src/app/models/Cronogramas/CronogramaDefinitivo';
import { CronogramaDefinitivoDto } from 'src/app/dto/Cronogramas/CronogramaDefinitivoDto';
import { CronogramaDefinitivoListDto } from 'src/app/dto/CronogramaDefinitivoListDto';

@Injectable({
  providedIn: 'root'
})
export class CronogramaDefinitivoService {

  private cDefinitivoURL = 'http://localhost:8080/cronogramaDefinitivo/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  public list(): Observable<CronogramaDefinitivo[]> {
    return this.httpClient.get<CronogramaDefinitivo[]>(this.cDefinitivoURL + 'list');
  }

  public listAll(): Observable<CronogramaDefinitivo[]> {
    return this.httpClient.get<CronogramaDefinitivo[]>(this.cDefinitivoURL + 'listAll');
  }

  public detail(id: number): Observable<CronogramaDefinitivo> {
    return this.httpClient.get<CronogramaDefinitivo>(`${this.cDefinitivoURL}detail/${id}`);
  }

  public save(dto: CronogramaDefinitivoDto): Observable<any> {
    return this.httpClient.post<any>(this.cDefinitivoURL + 'create', dto)
      .pipe(tap(() => this._refresh$.next()));
  }

  public saveCF(dto: CronogramaDefinitivoDto): Observable<any> {
    return this.httpClient.post<any>(this.cDefinitivoURL + 'createCF', dto)
      .pipe(tap(() => this._refresh$.next()));
  }

  public update(id: number, dto: CronogramaDefinitivoDto): Observable<any> {
    return this.httpClient.put<any>(`${this.cDefinitivoURL}update/${id}`, dto)
      .pipe(tap(() => this._refresh$.next()));
  }

  public logicDelete(id: number): Observable<any> {
    return this.httpClient.put<any>(`${this.cDefinitivoURL}delete/${id}`, {})
      .pipe(tap(() => this._refresh$.next()));
  }

  public fisicDelete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.cDefinitivoURL}fisicdelete/${id}`)
      .pipe(tap(() => this._refresh$.next()));
  }

  public listByAnioMesEfector(anio: number, mes: string, idEfector: number): Observable<CronogramaDefinitivoListDto[]> {
    return this.httpClient.get<CronogramaDefinitivoListDto[]>(`${this.cDefinitivoURL}listCronogramaByAnioMesEfector/${anio}/${mes}/${idEfector}`);
  }

  listByAnioMesEfectorAndTipoGuardia(anio: number, mes: string, idEfector: number, idTipoGuardia: number): Observable<CronogramaDefinitivoListDto[]> {
    return this.httpClient.get<CronogramaDefinitivoListDto[]>(`${this.cDefinitivoURL}listCronogramaByAnioMesEfectorGuardia/${anio}/${mes}/${idEfector}/${idTipoGuardia}`);
  }

  getTiposGuardia(id: number): Observable<number[]> {
    return this.httpClient.get<number[]>(`${this.cDefinitivoURL}tiposGuardia/${id}`);
  }
}
