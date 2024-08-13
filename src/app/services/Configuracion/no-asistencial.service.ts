import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { NoAsistencialDto } from 'src/app/dto/Configuracion/noAsistencial/NoAsistencialDto';
import { NoAsistencialListDto } from 'src/app/dto/Configuracion/noAsistencial/NoAsistencialListDto';
import { NoAsistencial } from "src/app/models/Configuracion/No-asistencial";

@Injectable({
  providedIn: 'root'
})
export class NoAsistencialService {

  
    noasistencialesURL = 'http://localhost:8080/noasistencial/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<NoAsistencial[]> {
      return this.httpClient.get<NoAsistencial[]>(this.noasistencialesURL + 'list')
    }

    public listDtos(): Observable<NoAsistencialListDto[]> {
      return this.httpClient.get<NoAsistencialListDto[]>(this.noasistencialesURL + 'listDtos')
    }
      
    public detail(id:number): Observable<NoAsistencial> {
        return this.httpClient.get<NoAsistencial>(this.noasistencialesURL + `detail/${id}`);
    }
  
    public detailnombre(nombre:string): Observable<NoAsistencial> {
      return this.httpClient.get<NoAsistencial>(this.noasistencialesURL + `detailnombre/${nombre}`);
  }
  
  public save(noasistenciales:NoAsistencialDto): Observable<any> {
    return this.httpClient.post<any>(this.noasistencialesURL + 'create', noasistenciales)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, noasistenciales:NoAsistencial): Observable<any> {
    return this.httpClient.put<any>(this.noasistencialesURL + `update/${id}`, noasistenciales)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.noasistencialesURL + `delete/${id}`, {})    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    ) 
  }
}