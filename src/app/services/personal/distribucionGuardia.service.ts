import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DistribucionGuardia } from "src/app/models/personal/DistribucionGuardia";
import { DistribucionGuardiaDto } from "src/app/dto/personal/DistribucionGuardiaDto";


@Injectable({
  providedIn: 'root'
})
export class DistribucionGuardiaService {

  distribucionGuardiasURL = 'http://localhost:8080/distribucionGuardia/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<DistribucionGuardia[]> {
      return this.httpClient.get<DistribucionGuardia[]>(this.distribucionGuardiasURL + 'list');
  }

  public detail(id:number): Observable<DistribucionGuardia> {
      return this.httpClient.get<DistribucionGuardia>(this.distribucionGuardiasURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<DistribucionGuardia> {
    return this.httpClient.get<DistribucionGuardia>(this.distribucionGuardiasURL + `detailnombre/${nombre}`);
}

public save(distribucionGuardias:DistribucionGuardiaDto): Observable<any> {
  return this.httpClient.post<any>(this.distribucionGuardiasURL + 'create', distribucionGuardias)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, distribucionGuardias:DistribucionGuardiaDto): Observable<any> {
  return this.httpClient.put<any>(this.distribucionGuardiasURL + `update/${id}`, distribucionGuardias)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.distribucionGuardiasURL + `delete/${id}`, {});
}

// Verificar si existe distribución para un efector
getDistribucionesByEfector(idEfector: number): Observable<DistribucionGuardia[]> {
  return this.httpClient.get<DistribucionGuardia[]>(`${this.distribucionGuardiasURL}detailefector/${idEfector}`);
}

// Obtener distribuciones por fecha de inicio
getDistribucionesByFechaInicio(fechaInicio: string): Observable<DistribucionGuardia[]> {
  return this.httpClient.get<DistribucionGuardia[]>(`${this.distribucionGuardiasURL}list/${fechaInicio}`);
}

// Verificar si existe distribución para una persona
getDistribucionesGuardiaByPersona(idPersona: number): Observable<DistribucionGuardia[]> {
  return this.httpClient.get<DistribucionGuardia[]>(`${this.distribucionGuardiasURL}detailpersona/${idPersona}`);
}

// Verificar si existe una distribución
existDistribucion(dia: string, fecha: string, idAsistencial: number, idEfector: number): Observable<boolean> {
  return this.httpClient.get<boolean>(`${this.distribucionGuardiasURL}existDistribucion/${dia}/${fecha}/${idAsistencial}/${idEfector}`);
}

// Verificar si es guardia en una fecha específica
esGuardia(dia: string, fecha: string, idAsistencial: number, idEfector: number): Observable<boolean> {
  return this.httpClient.get<boolean>(`${this.distribucionGuardiasURL}esGuardia/${dia}/${fecha}/${idAsistencial}/${idEfector}`);
}

}