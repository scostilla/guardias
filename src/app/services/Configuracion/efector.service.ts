import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class EfectorService {
  private secretKey = 'Dph*FfLlMmNn99';

  private currentEfectorIdSubject = new BehaviorSubject<number | null>(this.getCurrentEfectorId());
  currentEfectorId$ = this.currentEfectorIdSubject.asObservable();

  efectoresURL = `${environment.apiUrl}/efector/`;
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  // Método para obtener el tipo de efector
  getEfectorTipo(id: number): Observable<any> {
    return this.httpClient.get(`${this.efectoresURL}tipo/${id}`);
  }

  // Método para obtener el tipo y nombre del efector usando dto
  getEfectorNombre(id: number): Observable<any> {
    return this.httpClient.get(`${this.efectoresURL}tipoEfector/${id}`);
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

    // Notifica a los suscriptores
    this.currentEfectorIdSubject.next(efectorId);
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
