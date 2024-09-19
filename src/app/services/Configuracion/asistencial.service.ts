import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AsistencialDto } from 'src/app/dto/Configuracion/AsistencialDto';
import { Asistencial } from "src/app/models/Configuracion/Asistencial";
import { Person } from "src/app/models/Configuracion/Person";
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsistencialService {

  
    asistencialesURL = 'http://localhost:8080/asistencial/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<Asistencial[]> {
      return this.httpClient.get<Asistencial[]>(this.asistencialesURL + 'list')
    }  

    public listByUdoAndTipoGuardia(idUdo: number): Observable<AsistencialDto[]> {
      return this.httpClient.get<AsistencialDto[]>(`${this.asistencialesURL}listByUdoAndTipoGuardia/${idUdo}`);
    }
    
    public listPerson(): Observable<Person[]> {
      return this.httpClient.get<Person[]>(this.asistencialesURL + 'listPerson');
  }

    public detail(id:number): Observable<Asistencial> {
        return this.httpClient.get<Asistencial>(this.asistencialesURL + `detail/${id}`);
    }
  
    public detailnombre(nombre:string): Observable<Asistencial> {
      return this.httpClient.get<Asistencial>(this.asistencialesURL + `detailnombre/${nombre}`);
  }

  public getByIds(ids: number[]): Observable<Asistencial[]> {
    const requests = ids.map(id => this.detail(id));
    return forkJoin(requests);
  }
  
  public save(asistencial:AsistencialDto): Observable<any> {
    return this.httpClient.post<any>(this.asistencialesURL + 'create', asistencial)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, asistencial:AsistencialDto): Observable<any> {
    return this.httpClient.put<any>(this.asistencialesURL + `update/${id}`, asistencial)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.asistencialesURL + `delete/${id}`, {})
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }

  }
  
  