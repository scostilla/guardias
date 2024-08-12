import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Rol } from "src/app/models/Configuracion/Rol";

@Injectable({
  providedIn: 'root'
})
export class RolService{
    rolURL = 'http://localhost:8080/rol/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Rol[]> {
      return this.httpClient.get<Rol[]>(this.rolURL + 'list');
  }
}