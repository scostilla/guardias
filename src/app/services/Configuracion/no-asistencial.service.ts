import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NoAsistencialDto } from 'src/app/dto/Configuracion/NoAsistencialDto';
import { Legajo } from 'src/app/models/Configuracion/Legajo';
import { NoAsistencial } from "src/app/models/Configuracion/No-asistencial";
import { NoAsistencialSummaryDto } from 'src/app/dto/Configuracion/no-asistencial/NoAsistencialSummaryDto';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class NoAsistencialService {
  
  noasistencialesURL = 'http://localhost:8080/noasistencial/';
  private _refresh$ = new Subject<void>();
  private currentEfectorIdSubject = new BehaviorSubject<number | null>(null);
  currentEfectorId$ = this.currentEfectorIdSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<NoAsistencial[]> {
    return this.httpClient.get<NoAsistencial[]>(this.noasistencialesURL + 'list');
  }

  public getLegajosByNoAsistencial(id: number): Observable<Legajo[]> {
    return this.httpClient.get<Legajo[]>(this.noasistencialesURL + `legajos/${id}`);
  }
      
  public detail(id:number): Observable<NoAsistencial> {
    return this.httpClient.get<NoAsistencial>(this.noasistencialesURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<NoAsistencial> {
    return this.httpClient.get<NoAsistencial>(this.noasistencialesURL + `detailnombre/${nombre}`);
  }
  
  public save(noAsistencial: NoAsistencialDto): Observable<any> {
    return this.httpClient.post<any>(this.noasistencialesURL + 'create', noAsistencial)
      .pipe(tap(() => this._refresh$.next()));
  }
  
  public update(id: number, noasistencial: NoAsistencialDto): Observable<any> {
    return this.httpClient.put<any>(this.noasistencialesURL + `update/${id}`, noasistencial)
      .pipe(tap(() => this._refresh$.next()));
  }
  
  public delete(id: number): Observable<any> {
    return this.httpClient.put<any>(this.noasistencialesURL + `delete/${id}`, {})
      .pipe(tap(() => this._refresh$.next()));
  }

  public setCurrentEfectorId(efectorId: number | null) {
    this.currentEfectorIdSubject.next(efectorId);
    if (efectorId !== null) {
      const encryptedId = this.encrypt(efectorId.toString());
      sessionStorage.setItem('currentEfectorId', encryptedId);
    } else {
      sessionStorage.removeItem('currentEfectorId');
    }
  }

  public getCurrentEfectorId(): number | null {
    const encryptedId = sessionStorage.getItem('currentEfectorId');
    if (encryptedId) {
      const decryptedId = this.decrypt(encryptedId);
      return parseInt(decryptedId, 10);
    }
    return null;
  }

  private encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, 'secretKey').toString(); // Cambia 'secretKey' por tu clave real
  }

  private decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, 'secretKey'); // Cambia 'secretKey' por tu clave real
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  public getNoAsistencialesByEfector(idEfector: number): Observable<NoAsistencial[]> {
    return this.httpClient.get<NoAsistencial[]>(this.noasistencialesURL + `listByEfector/${idEfector}`);
  }
}
