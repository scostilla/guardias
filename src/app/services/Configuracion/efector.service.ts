import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class EfectorService {
  private secretKey = 'Dph*FfLlMmNn99';


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
