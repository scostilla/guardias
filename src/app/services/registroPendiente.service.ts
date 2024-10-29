import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { RegistroPendiente } from "../models/RegistroPendiente";

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
  
    public list(): Observable<RegistroPendiente[]> {
        return this.httpClient.get<RegistroPendiente[]>(this.registroMensualURL + 'list');
    }
  
    public detail(id:number): Observable<RegistroPendiente> {
        return this.httpClient.get<RegistroPendiente>(this.registroMensualURL + `detail/${id}`);
    }
  
    public detailByEfector(idEfector: number): Observable<RegistroPendiente[]> {
      return this.httpClient.get<RegistroPendiente[]>(this.registroMensualURL + `detailByEfector/${idEfector}`);
    }
  
    public detailByEfectorAndFecha(idEfector: number, mes: number, anio: number): Observable<RegistroPendiente[]> {
      return this.httpClient.get<RegistroPendiente[]>(this.registroMensualURL + `detailByEfectorAndFecha/${idEfector}/${mes}/${anio}`);
    }
  
    public create(registroPendiente: RegistroPendiente): Observable<any> {
      return this.httpClient.post<any>(this.registroMensualURL + 'create', registroPendiente)
        .pipe(
          tap(() => {
            this._refresh$.next();
          })
        );
    }
  
    public update(id: number, registroPendiente: RegistroPendiente): Observable<any> {
      return this.httpClient.put<any>(this.registroMensualURL + `update/${id}`, registroPendiente)
        .pipe(
          tap(() => {
            this._refresh$.next();
          })
        );
    }
  
    public delete(id: number): Observable<any> {
      return this.httpClient.delete<any>(this.registroMensualURL + `delete/${id}`)
        .pipe(
          tap(() => {
            this._refresh$.next();
          })
        );
    }
  
    public deleteRegistroActividad(id: number, registroActividad: any): Observable<any> {
      return this.httpClient.post<any>(this.registroMensualURL + `deleteRegistroActividad`, registroActividad)
        .pipe(
          tap(() => {
            this._refresh$.next();
          })
        );
    }
  
  }