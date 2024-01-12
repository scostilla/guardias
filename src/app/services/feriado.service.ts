import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Feriado } from "src/app/models/Feriado";

@Injectable({
  providedIn: 'root'
})
export class FeriadoService {

  feriadosURL = 'http://localhost:8080/feriado/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public lista(): Observable<Feriado[]> {
      return this.httpClient.get<Feriado[]>(this.feriadosURL + 'lista');
  }

  public detalle(id:number): Observable<Feriado> {
      return this.httpClient.get<Feriado>(this.feriadosURL + `detalle/${id}`);
  }

  public detallenombre(nombre:string): Observable<Feriado> {
    return this.httpClient.get<Feriado>(this.feriadosURL + `detallenombre/${nombre}`);
}

public save(feriados:Feriado): Observable<any> {
  return this.httpClient.post<any>(this.feriadosURL + 'create', feriados)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, feriados:Feriado): Observable<any> {
  return this.httpClient.put<any>(this.feriadosURL + `update/${id}`, feriados)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.delete<any>(this.feriadosURL + `delete/${id}`);
}

}
