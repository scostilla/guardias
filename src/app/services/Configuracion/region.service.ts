import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RegionDto } from 'src/app/dto/Configuracion/RegionDto';
import { RegionSummaryDto } from 'src/app/dto/Configuracion/RegionSummaryDto';
import { Region } from "src/app/models/Configuracion/Region";

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

  // Nuevo: obtener resumen de regiones (lista compacta desde /region/listSummary)
  public listSummary(): Observable<RegionSummaryDto[]> {
    return this.httpClient.get<RegionSummaryDto[]>(this.regionesURL + 'listSummary');
  }

  public detail(id:number): Observable<Region> {
      return this.httpClient.get<Region>(this.regionesURL + `detail/${id}`);
  }

  public detailname(nombre:string): Observable<Region> {
    return this.httpClient.get<Region>(this.regionesURL + `detailname/${nombre}`);
}

public save(regiones:RegionDto): Observable<any> {
  return this.httpClient.post<any>(this.regionesURL + 'create', regiones)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public update(id:number, regiones:RegionDto): Observable<any> {
  return this.httpClient.put<any>(this.regionesURL + `update/${id}`, regiones)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.regionesURL + `delete/${id}`,{});
}

listWithoutLegajosActivos(): Observable<Region[]> {
  return this.httpClient.get<Region[]>(`${this.regionesURL}/listWithoutLegajosActivos`);
}

}
