import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private count = 0; // Contador de peticiones activas
  private spinner$ = new BehaviorSubject<boolean>(false); // Observable del estado del spinner

  constructor() { }

  getSpinnerObserver() { // Método para obtener el observable del estado del spinner
    return this.spinner$.asObservable();
  }

  requestStarted() { // Método para incrementar el contador y activar el spinner si es necesario
    if (++this.count === 1) {
      this.spinner$.next(true);
    }
  }

  requestEnded() { // Método para decrementar el contador y desactivar el spinner si es necesario
    if (this.count === 0 || --this.count === 0) {
      this.spinner$.next(false);
    }
  }
}