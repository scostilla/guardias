import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DistribucionGiraDto } from 'src/app/dto/personal/DistribucionGiraDto';
import { DistribucionGira } from "src/app/models/personal/DistribucionGira";
import { CronogramaTentativoResquestDto } from "src/app/dto/Cronogramas/CronogramaTentativoResquestDto";

@Injectable({
  providedIn: 'root'
})
export class DistribucionGiraService {

  distribucionGirasURL = 'http://localhost:8080/distribucionGira/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<DistribucionGira[]> {
      return this.httpClient.get<DistribucionGira[]>(this.distribucionGirasURL + 'list');
  }

  // Obtener distribuciones por fecha de inicio
  getDistribucionesByFechaInicio(fechaInicio: string): Observable<DistribucionGira[]> {
    return this.httpClient.get<DistribucionGira[]>(`${this.distribucionGirasURL}list/${fechaInicio}`);
  }

  // Obtener distribuciones por persona, fecha de inicio y ACTIVO
  getActivoByPersonaFechaInicio(idPersona: number, fechaInicio: string): Observable<DistribucionGira[]> {
    return this.httpClient.get<DistribucionGira[]>(`${this.distribucionGirasURL}listByActivoByPersonAndFechaInicio/${idPersona}/${fechaInicio}`);
  }

  // Obtener distribuciones por persona, fecha de inicio y ACTIVO
  getDistribucionesByActivoPersonaAndFechaInicio(idPersona: number, mes: number, anio: number): Observable<DistribucionGira[]> {
    return this.httpClient.get<DistribucionGira[]>(`${this.distribucionGirasURL}detailByActivoByPersonaAndFechaInicio/${idPersona}/${mes}/${anio}`);
  }
  
  // Verifica distribuciones por persona, fecha de inicio y ACTIVO
  existsByActivoPersonaAndFechaInicio(idPersona: number, mes: number, anio: number): Observable<DistribucionGira[]> {
    return this.httpClient.get<DistribucionGira[]>(`${this.distribucionGirasURL}existsByActivoByPersonaAndFechaInicio/${idPersona}/${mes}/${anio}`);
  }
  
  // Obtener detalle de una distribución por ID
  getDistribucionById(id: number): Observable<DistribucionGira> {
    return this.httpClient.get<DistribucionGira>(`${this.distribucionGirasURL}detail/${id}`);
  }

  // Obtener distribuciones por ID de Efector
  getDistribucionesByEfector(idEfector: number): Observable<DistribucionGira[]> {
    return this.httpClient.get<DistribucionGira[]>(`${this.distribucionGirasURL}detailefector/${idEfector}`);
  }

  // Obtener distribuciones por ID de Persona
  getDistribucionesGiraByPersona(idPersona: number): Observable<DistribucionGira[]> {
    return this.httpClient.get<DistribucionGira[]>(`${this.distribucionGirasURL}detailpersona/${idPersona}`);
  }
public save(distribucionGiraes:DistribucionGiraDto): Observable<any> {
  return this.httpClient.post<any>(this.distribucionGirasURL + 'create', distribucionGiraes)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, distribucionGiraes:DistribucionGiraDto): Observable<any> {
  return this.httpClient.put<any>(this.distribucionGirasURL + `update/${id}`, distribucionGiraes)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.distribucionGirasURL + `delete/${id}`, {});
}

// Verificar si un cronograma tentativo existe
existeTentativoEnDistribucionGira(cTentativos: CronogramaTentativoResquestDto): Observable<boolean> {
  return this.httpClient.post<boolean>(`${this.distribucionGirasURL}verificarCronogramaEnDistribucion`, cTentativos);
}

}