import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { Servicio } from "../models/Configuracion/Servicio";
import { ServicioDto } from "../dto/ServicioDto";

@Injectable({
    providedIn: 'root'
  })
  export class ServicioService {
  
    servicioURL = 'http://localhost:8080/servicio/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<Servicio[]> {
        return this.httpClient.get<Servicio[]>(this.servicioURL + 'list');
    }
  
    public detail(id:number): Observable<Servicio> {
        return this.httpClient.get<Servicio>(this.servicioURL + `detail/${id}`);
    }
  
  public save(servicio:ServicioDto): Observable<any> {
    return this.httpClient.post<any>(this.servicioURL + 'create', servicio)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, servicio:ServicioDto): Observable<any> {
    return this.httpClient.put<any>(this.servicioURL + `update/${id}`, servicio)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.servicioURL + `delete/${id}`, {});
  }
  
  }