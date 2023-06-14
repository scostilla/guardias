import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateServiceService {
  private dateChangeSubject = new Subject<Date>();

  dateChange$ = this.dateChangeSubject.asObservable();

  emitDateChange(date: Date): void {
    this.dateChangeSubject.next(date);
  }
}
