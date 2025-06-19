  import { HttpClient } from "@angular/common/http";
  import { Injectable } from "@angular/core";
  import { Observable, Subject, tap } from "rxjs";
import { RegistrosPendientes } from "../models/RegistrosPendientes";

  @Injectable({
      providedIn: 'root'
    })
    export class RegistroPendienteService {
    
      registroPendienteURL = 'http://localhost:8080/registrosPendientes/';
      private _refresh$ = new Subject<void>();
    
      constructor(private httpClient: HttpClient) { }
    
      get refresh$(){
        return this._refresh$;
      }
    
      public list(): Observable<RegistrosPendientes[]> {
          return this.httpClient.get<RegistrosPendientes[]>(this.registroPendienteURL + 'list');
      }
    
      public detail(id:number): Observable<RegistrosPendientes> {
          return this.httpClient.get<RegistrosPendientes>(this.registroPendienteURL + `detail/${id}`);
      }
    
      public detailByEfector(idEfector: number): Observable<RegistrosPendientes[]> {
        return this.httpClient.get<RegistrosPendientes[]>(this.registroPendienteURL + `detailByEfector/${idEfector}`);
      }
    
      public detailByEfectorAndFecha(idEfector: number, mes: number, anio: number): Observable<RegistrosPendientes[]> {
        return this.httpClient.get<RegistrosPendientes[]>(this.registroPendienteURL + `detailByEfectorAndFecha/${idEfector}/${mes}/${anio}`);
      }

      public tieneRegistroPendiente(idEfector: number, mes: number, anio: number, idAsistencial: number): Observable<RegistrosPendientes> {
        return this.httpClient.get<RegistrosPendientes>(this.registroPendienteURL + `tieneRegistroPendiente/${idEfector}/${mes}/${anio}/${idAsistencial}`);
      }
    
      public create(registroPendiente: RegistrosPendientes): Observable<any> {
        return this.httpClient.post<any>(this.registroPendienteURL + 'create', registroPendiente)
          .pipe(
            tap(() => {
              this._refresh$.next();
            })
          );
      }
    
      public update(id: number, registroPendiente: RegistrosPendientes): Observable<any> {
        return this.httpClient.put<any>(this.registroPendienteURL + `update/${id}`, registroPendiente)
          .pipe(
            tap(() => {
              this._refresh$.next();
            })
          );
      }
    
      public delete(id: number): Observable<any> {
        return this.httpClient.delete<any>(this.registroPendienteURL + `delete/${id}`)
          .pipe(
            tap(() => {
              this._refresh$.next();
            })
          );
      }
    
      public deleteRegistroActividad(id: number, registroActividad: any): Observable<any> {
        return this.httpClient.post<any>(this.registroPendienteURL + `deleteRegistroActividad`, registroActividad)
          .pipe(
            tap(() => {
              this._refresh$.next();
            })
          );
      }
    
    }