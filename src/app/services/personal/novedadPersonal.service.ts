import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NovedadPersonalDto } from 'src/app/dto/personal/NovedadPersonalDto';
import { NovedadPersonal } from "src/app/models/personal/NovedadPersonal";


@Injectable({
  providedIn: 'root'
})
export class NovedadPersonalService {

  novedadesPersonalesURL = 'http://localhost:8080/novedadPersonal/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<NovedadPersonal[]> {
      return this.httpClient.get<NovedadPersonal[]>(this.novedadesPersonalesURL + 'list');
  }

  public detail(id:number): Observable<NovedadPersonal> {
      return this.httpClient.get<NovedadPersonal>(this.novedadesPersonalesURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<NovedadPersonal> {
    return this.httpClient.get<NovedadPersonal>(this.novedadesPersonalesURL + `detailnombre/${nombre}`);
}

public save(novedadesPersonales:NovedadPersonalDto): Observable<any> {
  return this.httpClient.post<any>(this.novedadesPersonalesURL + 'create', novedadesPersonales)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, novedadesPersonales:NovedadPersonalDto): Observable<any> {
  return this.httpClient.put<any>(this.novedadesPersonalesURL + `update/${id}`, novedadesPersonales)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.novedadesPersonalesURL + `delete/${id}`, {});
}

}