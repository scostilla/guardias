import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { RegistroActividad } from "../models/RegistroActividad";
import { RegistroActividadDto } from "../dto/RegistroActividadDto";

@Injectable({
    providedIn: 'root'
  })
  export class RegistroActividadService {
  
    registroActividadURL = 'http://localhost:8080/registroActividad/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<RegistroActividad[]> {
        return this.httpClient.get<RegistroActividad[]>(this.registroActividadURL + 'list');
    }
  
    public detail(id:number): Observable<RegistroActividad> {
        return this.httpClient.get<RegistroActividad>(this.registroActividadURL + `detail/${id}`);
    }
  
  public save(registroActividad:RegistroActividadDto): Observable<any> {
    return this.httpClient.post<any>(this.registroActividadURL + 'create', registroActividad)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, registroActividad:RegistroActividadDto): Observable<any> {
    return this.httpClient.put<any>(this.registroActividadURL + `update/${id}`, registroActividad)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.registroActividadURL + `delete/${id}`, {});
  }
  
  }