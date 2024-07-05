import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProvinciaDto } from "src/app/dto/Configuracion/ProvinciaDto";
import { Provincia } from "src/app/models/Configuracion/Provincia";


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

public save(provincias:ProvinciaDto): Observable<any> {
  return this.httpClient.post<any>(this.provinciasURL + 'create', provincias)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, provincias:ProvinciaDto): Observable<any> {
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
