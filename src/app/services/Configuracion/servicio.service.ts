import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Servicio } from "src/app/models/Configuracion/Servicio";

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  serviciosURL = 'http://localhost:8080/servicio/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Servicio[]> {
      return this.httpClient.get<Servicio[]>(this.serviciosURL + 'list');
  }

  public detail(id:number): Observable<Servicio> {
      return this.httpClient.get<Servicio>(this.serviciosURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<Servicio> {
    return this.httpClient.get<Servicio>(this.serviciosURL + `detailnombre/${nombre}`);
}

public save(servicios:Servicio): Observable<any> {
  return this.httpClient.post<any>(this.serviciosURL + 'create', servicios)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public update(id:number, servicios:Servicio): Observable<any> {
  return this.httpClient.put<any>(this.serviciosURL + `update/${id}`, servicios)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.serviciosURL + `delete/${id}`, {});
}

}
