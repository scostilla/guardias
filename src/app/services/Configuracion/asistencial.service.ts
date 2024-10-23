import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AsistencialDto } from 'src/app/dto/Configuracion/AsistencialDto';
import { Asistencial } from "src/app/models/Configuracion/Asistencial";
import { Person } from "src/app/models/Configuracion/Person";
import { forkJoin } from 'rxjs';
import { AsistencialListDto } from 'src/app/dto/Configuracion/asistencial/AsistencialListDto';
import { AsistencialSummaryDto } from 'src/app/dto/Configuracion/asistencial/AsistencialSummaryDto';
import { AsistencialListForLegajosDto } from 'src/app/dto/Configuracion/asistencial/AsistencialListForLegajosDto';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';

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

  public listByUdoAndTipoGuardia(idUdo: number): Observable<AsistencialDto[]> {
    return this.httpClient.get<AsistencialDto[]>(`${this.asistencialesURL}listByUdoAndTipoGuardia/${idUdo}`);
  }

  public getLegajosByAsistencial(id: number): Observable<Legajo[]> {
    return this.httpClient.get<Legajo[]>(this.asistencialesURL + `legajos/${id}`);
}

  public listSummary(): Observable<AsistencialSummaryDto[]> {
    return this.httpClient.get<AsistencialSummaryDto[]>(this.asistencialesURL + 'listSummary')
  }

  public listDtos(): Observable<AsistencialListDto[]> {
    return this.httpClient.get<AsistencialListDto[]>(this.asistencialesURL + 'listDtos')
  }

  public listForLegajosDtos(): Observable<AsistencialListForLegajosDto[]> {
    return this.httpClient.get<AsistencialListForLegajosDto[]>(this.asistencialesURL + 'listForLegajosDtos')
  }

  public listPerson(): Observable<Person[]> {
    return this.httpClient.get<Person[]>(this.asistencialesURL + 'listPerson');
  }

  public detail(id: number): Observable<Asistencial> {
    return this.httpClient.get<Asistencial>(this.asistencialesURL + `detail/${id}`);
  }

  public detailnombre(nombre: string): Observable<Asistencial> {
    return this.httpClient.get<Asistencial>(this.asistencialesURL + `detailnombre/${nombre}`);
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

  //lo uso para enviar id sin usar la url
  private currentAsistencialSubject = new BehaviorSubject<Asistencial | null>(null);
  currentAsistencial$ = this.currentAsistencialSubject.asObservable();
  
  setCurrentAsistencial(asistencial: Asistencial) {
    this.currentAsistencialSubject.next(asistencial);
  }

  //uso para filtrar por el efector del usuario logueado
listByEfectorAndTipoGuardia(efectorId: number): Observable<AsistencialSummaryDto[]> {
  console.log('Listando asistenciales para el ID Efector:', efectorId); // Log del efectorId
  return this.httpClient.get<AsistencialSummaryDto[]>(`${this.asistencialesURL}listByEfectorAndTipoGuardia/${efectorId}`);
}

private currentEfectorIdSubject = new BehaviorSubject<number | null>(null);
currentEfectorId$ = this.currentEfectorIdSubject.asObservable();

// Encriptar
encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, this.secretKey).toString();
}

// Desencriptar
decrypt(encryptedText: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedText, this.secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

setCurrentEfectorId(efectorId: number | null) {
  if (efectorId !== null) {
    const encryptedId = this.encrypt(efectorId.toString());
    sessionStorage.setItem('currentEfectorId', encryptedId);
  } else {
    sessionStorage.removeItem('currentEfectorId');
  }
}

getCurrentEfectorId(): number | null {
  const encryptedId = sessionStorage.getItem('currentEfectorId');
  if (encryptedId) {
    const decryptedId = this.decrypt(encryptedId);
    return parseInt(decryptedId, 10);
  }
  return null;
}
}