import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {
  public nombre?: string = '';
  public apellido?: string = '';
  public url?: string = '';

  constructor() { }
}
