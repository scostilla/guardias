import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfesionalTempService {
    // Creamos un BehaviorSubject de tipo boolean
  public profesionalTempId = new BehaviorSubject<number>(-1);

  constructor() { }
/* 	private id:number | undefined;

    setId(id: number) {
        this.id = id;
      }
    
      getId() {
        return this.id;
      }
    
    constructor() {
	}
 */
}