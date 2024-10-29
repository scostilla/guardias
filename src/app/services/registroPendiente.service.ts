import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { RegistroMensual } from "../models/RegistroMensual";

@Injectable({
    providedIn: 'root'
  })
  export class RegistroPendienteService {
  
    registroMensualURL = 'http://localhost:8080/registrosPendientes/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<RegistroMensual[]> {
        return this.httpClient.get<RegistroMensual[]>(this.registroMensualURL + 'list');
    }
  
    public detail(id:number): Observable<RegistroMensual> {
        return this.httpClient.get<RegistroMensual>(this.registroMensualURL + `detail/${id}`);
    }
  
  
  }