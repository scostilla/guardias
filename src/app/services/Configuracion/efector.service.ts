import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Efector } from "src/app/models/Configuracion/Efector";
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class EfectorService {
  private secretKey = 'Dph*FfLlMmNn99';

  private currentEfectorIdSubject = new BehaviorSubject<number | null>(this.getCurrentEfectorId());
  currentEfectorId$ = this.currentEfectorIdSubject.asObservable();

  efectoresURL = 'http://localhost:8080/efector/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  public list(): Observable<Efector[]> {
    return this.httpClient.get<Efector[]>(this.efectoresURL + 'list');
  }

  public getById(id: number): Observable<Efector> {
    return this.httpClient.get<Efector>(this.efectoresURL + `detail/${id}`);
  }


  public detailnombre(nombre: string): Observable<Efector> {
    return this.httpClient.get<Efector>(this.efectoresURL + `detailnombre/${nombre}`);
  }

  public save(efectores: Efector): Observable<any> {
    return this.httpClient.post<any>(this.efectoresURL + 'create', efectores)
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      )
  }

  public update(id: number, efectores: Efector): Observable<any> {
    return this.httpClient.put<any>(this.efectoresURL + `update/${id}`, efectores)
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      )
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.put<any>(this.efectoresURL + `delete/${id}`, {});
  }

  // Método para obtener el tipo de efector
  getEfectorTipo(id: number): Observable<any> {
    return this.httpClient.get(`${this.efectoresURL}tipo/${id}`);
  }

  // Encriptar
  encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  // Desencriptar
  decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  //Establece el efector
  setCurrentEfectorId(efectorId: number | null) {
    if (efectorId !== null) {
      const encryptedId = this.encrypt(efectorId.toString());
      sessionStorage.setItem('currentEfectorId', encryptedId);
    } else {
      sessionStorage.removeItem('currentEfectorId');
    }
  }

  //Obtiene el efector
  getCurrentEfectorId(): number | null {
    const encryptedId = sessionStorage.getItem('currentEfectorId');
    if (encryptedId) {
      const decryptedId = this.decrypt(encryptedId);
      return parseInt(decryptedId, 10);
    }
    return null;
  }
}
