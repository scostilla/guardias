import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Provincia } from "src/app/models/Configuracion/Provincia";
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  provinciasURL = 'http://localhost:8080/provincia/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Provincia[]> {
      return this.httpClient.get<Provincia[]>(this.provinciasURL + 'list');
  }

  public detail(id:number): Observable<Provincia> {
      return this.httpClient.get<Provincia>(this.provinciasURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<Provincia> {
    return this.httpClient.get<Provincia>(this.provinciasURL + `detailnombre/${nombre}`);
}

public save(provincias:Provincia): Observable<any> {
  return this.httpClient.post<any>(this.provinciasURL + 'create', provincias)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, provincias:Provincia): Observable<any> {
  return this.httpClient.put<any>(this.provinciasURL + `update/${id}`, provincias)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.provinciasURL + `delete/${id}`, {});
}

}
