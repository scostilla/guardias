import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProfesionSummaryDto } from 'src/app/dto/Configuracion/profesion/ProfesionSummaryDto';
import { ProfesionDto } from 'src/app/dto/Configuracion/ProfesionDto';
import { Profesion } from "src/app/models/Configuracion/Profesion";

@Injectable({
  providedIn: 'root'
})
export class ProfesionService {

  profesionesURL = 'http://localhost:8080/profesion/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  public list(): Observable<Profesion[]> {
    return this.httpClient.get<Profesion[]>(this.profesionesURL + 'list');
  }

  public listProfesionesSummary(): Observable<ProfesionSummaryDto[]> {
    return this.httpClient.get<ProfesionSummaryDto[]>(this.profesionesURL + 'listProfesionesSummary');
  }

  public detail(id: number): Observable<Profesion> {
    return this.httpClient.get<Profesion>(this.profesionesURL + `detail/${id}`);
  }

  public detailnombre(nombre: string): Observable<Profesion> {
    return this.httpClient.get<Profesion>(this.profesionesURL + `detailnombre/${nombre}`);
  }

  public save(profesion: ProfesionDto): Observable<any> {
    return this.httpClient.post<any>(this.profesionesURL + 'create', profesion)
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      )
  }

  public update(id: number, profesion: ProfesionDto): Observable<any> {
    return this.httpClient.put<any>(this.profesionesURL + `update/${id}`, profesion)
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      )
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.put<any>(this.profesionesURL + `delete/${id}`, {});
  }

}