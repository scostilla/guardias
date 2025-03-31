import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private count = 0; 
  private spinner$ = new BehaviorSubject<boolean>(false); 

  constructor() { }

  getSpinnerObserver() { 
    return this.spinner$.asObservable();
  }

  show(): void {
    this.spinner$.next(true);
  }

  hide(): void {
    this.spinner$.next(false);
  }

  requestStarted() { 
    if (++this.count === 1) {
      this.spinner$.next(true);
    }
  }

  requestEnded() { 
    if (this.count === 0 || --this.count === 0) {
      this.spinner$.next(false);
    }
  }
}