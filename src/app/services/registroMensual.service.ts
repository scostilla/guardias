import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { RegistroMensual } from "../models/RegistroMensual";
import { RegistroMensualDto } from "../dto/RegistroMensualDto";

@Injectable({
    providedIn: 'root'
  })
  export class RegistroMensualService {
  
    registroMensualURL = 'http://localhost:8080/registroMensual/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<RegistroMensual[]> {
        return this.httpClient.get<RegistroMensual[]>(this.registroMensualURL + 'list');
    }

    public listByYearMonthAndEfector( anio:number, mes:string,idEfector:number): Observable<RegistroMensual[]> {
        return this.httpClient.get<RegistroMensual[]>(this.registroMensualURL + `listAnioMesEfector/${anio}/${mes}/${idEfector}`);
    }
  
    public detail(id:number): Observable<RegistroMensual> {
        return this.httpClient.get<RegistroMensual>(this.registroMensualURL + `detail/${id}`);
    }
  
  public save(registroMensual:RegistroMensual): Observable<any> {
    return this.httpClient.post<any>(this.registroMensualURL + 'create', registroMensual)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, registroMensual:RegistroMensualDto): Observable<any> {
    return this.httpClient.put<any>(this.registroMensualURL + `update/${id}`, registroMensual)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.registroMensualURL + `delete/${id}`, {});
  }
  
  }