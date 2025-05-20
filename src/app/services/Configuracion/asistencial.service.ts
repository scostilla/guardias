import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AsistencialDto } from 'src/app/dto/Configuracion/AsistencialDto';
import { AsistencialEfectorDto } from 'src/app/dto/Configuracion/asistencial/AsistencialEfectorDto';
import { AsistencialEfectorRegistroActividadDto } from 'src/app/dto/Configuracion/asistencial/AsistencialEfectorRegistroActividadDto';
import { Asistencial } from "src/app/models/Configuracion/Asistencial";
import { Person } from "src/app/models/Configuracion/Person";
import { forkJoin } from 'rxjs';
import { AsistencialListDto } from 'src/app/dto/Configuracion/asistencial/AsistencialListDto';
import { AsistencialSummaryDto } from 'src/app/dto/Configuracion/asistencial/AsistencialSummaryDto';
import { AsistencialListForLegajosDto } from 'src/app/dto/Configuracion/asistencial/AsistencialListForLegajosDto';
import { AsistencialDetailDto } from 'src/app/dto/Configuracion/asistencial/AsistencialDetailDto';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AsistencialService {

  private secretKey = 'Dph*FfLlMmNn99';


  asistencialesURL = 'http://localhost:8080/asistencial/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  public list(): Observable<Asistencial[]> {
    return this.httpClient.get<Asistencial[]>(this.asistencialesURL + 'list')
  }

  public listAll(): Observable<Asistencial[]> {
    return this.httpClient.get<Asistencial[]>(this.asistencialesURL + 'listAll')
  }

  // Lista Asistenciales por Efector
  /*getByEfector(idEfector: number): Observable<AsistencialEfectorDto[]> {
    return this.httpClient.get<AsistencialEfectorDto[]>(`${this.asistencialesURL}listByEfector/${idEfector}`);
  }*/

  getByEfector(idEfector: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.asistencialesURL}listByEfector/${idEfector}`);
  }

  listAsistencialByEfector(idEfector: number): Observable<AsistencialEfectorRegistroActividadDto[]> {
    return this.httpClient.get<AsistencialEfectorRegistroActividadDto[]>(`${this.asistencialesURL}listAsistencialByEfector/${idEfector}`);
  }

  public listByUdoAndTipoGuardia(idUdo: number): Observable<AsistencialDto[]> {
    return this.httpClient.get<AsistencialDto[]>(`${this.asistencialesURL}listByUdoAndTipoGuardia/${idUdo}`);
  }

  public getLegajosByAsistencial(id: number): Observable<Legajo[]> {
    return this.httpClient.get<Legajo[]>(this.asistencialesURL + `legajos/${id}`);
}

  public listSummary(): Observable<AsistencialSummaryDto[]> {
    return this.httpClient.get<AsistencialSummaryDto[]>(this.asistencialesURL + 'listSummary')
  }

  public listAsistencialSinLegajo(): Observable<AsistencialEfectorDto[]> {
    return this.httpClient.get<AsistencialEfectorDto[]>(this.asistencialesURL + 'listAsistencialSinLegajo')
  }

  listAutoridadesByEfector(idEfector: number): Observable<AsistencialListDto[]> {
    return this.httpClient.get<AsistencialListDto[]>(`${this.asistencialesURL}listAutoridadesByEfector/${idEfector}`);
  }

  listAutoridadesRegionalesByEfector(idEfector: number): Observable<AsistencialListDto[]> {
    return this.httpClient.get<AsistencialListDto[]>(`${this.asistencialesURL}listAutoridadesRegionalesByEfector/${idEfector}`);
  }

  public listForLegajosDtos(): Observable<AsistencialListForLegajosDto[]> {
    return this.httpClient.get<AsistencialListForLegajosDto[]>(this.asistencialesURL + 'listForLegajosDtos')
  }

  public listPerson(): Observable<Person[]> {
    return this.httpClient.get<Person[]>(this.asistencialesURL + 'listPerson');
  }

  public listDtos(): Observable<AsistencialListDto[]> {
    return this.httpClient.get<AsistencialListDto[]>(this.asistencialesURL + 'listDtos')
  }

  public detail(id: number): Observable<Asistencial> {
    return this.httpClient.get<Asistencial>(this.asistencialesURL + `detail/${id}`);
  }

  public detailAsistencial(id: number): Observable<AsistencialDetailDto> {
    return this.httpClient.get<AsistencialDetailDto>(this.asistencialesURL + `detailAsistencial/${id}`);
  }

  public getByIds(ids: number[]): Observable<Asistencial[]> {
    const requests = ids.map(id => this.detail(id));
    return forkJoin(requests);
  }

  public save(asistencial: AsistencialDto): Observable<any> {
    return this.httpClient.post<any>(this.asistencialesURL + 'create', asistencial)
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      )
  }

  public update(id: number, asistencial: AsistencialDto): Observable<any> {
    return this.httpClient.put<any>(this.asistencialesURL + `update/${id}`, asistencial)
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      )
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.put<any>(this.asistencialesURL + `delete/${id}`, {})
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      )
  }

  private currentAsistencialIdSubject = new BehaviorSubject<number | null>(null);
  currentAsistencialId$ = this.currentAsistencialIdSubject.asObservable();

  setCurrentAsistencialId(id: number): void {
    this.currentAsistencialIdSubject.next(id);
  }
  
  /*/lo uso para enviar id sin usar la url
  private currentAsistencialSubject = new BehaviorSubject<Asistencial | null>(null);
  currentAsistencial$ = this.currentAsistencialSubject.asObservable();
  
  setCurrentAsistencial(asistencial: Asistencial) {
    this.currentAsistencialSubject.next(asistencial);
  }*/

  //uso para filtrar por el efector del usuario logueado
listByEfectorAndTipoGuardia(efectorId: number): Observable<AsistencialSummaryDto[]> {
  console.log('Listando asistenciales para el ID Efector:', efectorId); // Log del efectorId
  return this.httpClient.get<AsistencialSummaryDto[]>(`${this.asistencialesURL}listByEfectorAndTipoGuardia/${efectorId}`);
}

public listByEfectorAndTG(idEfector: number, tipoGuardia: string): Observable<AsistencialSummaryDto[]> {
  return this.httpClient.get<AsistencialSummaryDto[]>(`${this.asistencialesURL}listByEfectorAndTG/${idEfector}/${tipoGuardia}`);
}

public asistencialesConPendientes(idEfector: number, mes: number, anio: number, tipoGuardia: string): Observable<AsistencialSummaryDto[]> {
  return this.httpClient.get<AsistencialSummaryDto[]>(`${this.asistencialesURL}asistencialesConPendientes/${idEfector}/${mes}/${anio}/${tipoGuardia}`);
}

public ConPendientes(idEfector: number, tipoGuardia: string): Observable<AsistencialSummaryDto[]> {
  return this.httpClient.get<AsistencialSummaryDto[]>(`${this.asistencialesURL}ConPendientes/${idEfector}/${tipoGuardia}`);
}

public esCargoAgrupacion(idAsistencial: number): Observable<boolean> {
  return this.httpClient.get<boolean>(this.asistencialesURL + `es-cargo-o-agrupacion/${idAsistencial}`);
}


}