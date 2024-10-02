import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TipoNovedadPersonalDto } from 'src/app/dto/personal/TipoNovedadPersonalDto';
import { TipoNovedadPersonal } from "src/app/models/personal/TipoNovedadPersonal";


@Injectable({
  providedIn: 'root'
})
export class TipoNovedadPersonalService {

  tipoNovedadesPersonalesURL = 'http://localhost:8080/tipoLicencia/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<TipoNovedadPersonal[]> {
      return this.httpClient.get<TipoNovedadPersonal[]>(this.tipoNovedadesPersonalesURL + 'list');
  }

  public detail(id:number): Observable<TipoNovedadPersonal> {
      return this.httpClient.get<TipoNovedadPersonal>(this.tipoNovedadesPersonalesURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<TipoNovedadPersonal> {
    return this.httpClient.get<TipoNovedadPersonal>(this.tipoNovedadesPersonalesURL + `detailnombre/${nombre}`);
}

public save(tipoNovedadesPersonales:TipoNovedadPersonalDto): Observable<any> {
  return this.httpClient.post<any>(this.tipoNovedadesPersonalesURL + 'create', tipoNovedadesPersonales)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, novedadesPersonales:TipoNovedadPersonalDto): Observable<any> {
  return this.httpClient.put<any>(this.tipoNovedadesPersonalesURL + `update/${id}`, novedadesPersonales)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.tipoNovedadesPersonalesURL + `delete/${id}`, {});
}

}