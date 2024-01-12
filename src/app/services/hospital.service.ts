import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Hospital } from "src/app/models/Hospital";

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  hospitalesURL = 'http://localhost:8080/hospital/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public lista(): Observable<Hospital[]> {
      return this.httpClient.get<Hospital[]>(this.hospitalesURL + 'lista');
  }

  public detalle(id:number): Observable<Hospital> {
      return this.httpClient.get<Hospital>(this.hospitalesURL + `detalle/${id}`);
  }

  public detallenombre(nombre:string): Observable<Hospital> {
    return this.httpClient.get<Hospital>(this.hospitalesURL + `detallenombre/${nombre}`);
}

public save(hospitales:Hospital): Observable<any> {
  return this.httpClient.post<any>(this.hospitalesURL + 'create', hospitales)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public update(id:number, hospitales:Hospital): Observable<any> {
  return this.httpClient.put<any>(this.hospitalesURL + `update/${id}`, hospitales)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.delete<any>(this.hospitalesURL + `delete/${id}`);
}

}
