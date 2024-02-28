import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Region } from "src/app/models/Region";

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  regionesURL = 'http://localhost:8080/region/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Region[]> {
      return this.httpClient.get<Region[]>(this.regionesURL + 'list');
  }

  public detail(id:number): Observable<Region> {
      return this.httpClient.get<Region>(this.regionesURL + `detail/${id}`);
  }

  public detailname(nombre:string): Observable<Region> {
    return this.httpClient.get<Region>(this.regionesURL + `detailname/${nombre}`);
}

public save(regiones:Region): Observable<any> {
  return this.httpClient.post<any>(this.regionesURL + 'create', regiones)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public update(id:number, regiones:Region): Observable<any> {
  return this.httpClient.put<any>(this.regionesURL + `update/${id}`, regiones)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.delete<any>(this.regionesURL + `delete/${id}`);
}

}
