import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DistribucionConsultorio } from "src/app/models/personal/DistribucionConsultorio";
import { DistribucionConsultorioDto } from "src/app/dto/personal/DistribucionConsultorioDto";
import { CronogramaTentativoDto } from "src/app/dto/Cronogramas/CronogramaTentativoDto";


@Injectable({
  providedIn: 'root'
})
export class DistribucionConsultorioService {

  distribucionConsultoriosURL = 'http://localhost:8080/distribucionConsultorio/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<DistribucionConsultorio[]> {
      return this.httpClient.get<DistribucionConsultorio[]>(this.distribucionConsultoriosURL + 'list');
  }

  // Obtener distribuciones por fecha de inicio
  getDistribucionesByFechaInicio(fechaInicio: string): Observable<DistribucionConsultorio[]> {
    return this.httpClient.get<DistribucionConsultorio[]>(`${this.distribucionConsultoriosURL}list/${fechaInicio}`);
  }

  // Obtener distribuciones por persona, fecha de inicio y ACTIVO
  getActivoByPersonaFechaInicio(idPersona: number, fechaInicio: string): Observable<DistribucionConsultorio[]> {
    return this.httpClient.get<DistribucionConsultorio[]>(`${this.distribucionConsultoriosURL}listByActivoByPersonAndFechaInicio/${idPersona}/${fechaInicio}`);
  }
  
  // Obtener distribuciones por persona, fecha de inicio y ACTIVO
  getDistribucionesByActivoPersonaAndFechaInicio(idPersona: number, mes: number, anio: number): Observable<DistribucionConsultorio[]> {
    return this.httpClient.get<DistribucionConsultorio[]>(`${this.distribucionConsultoriosURL}detailByActivoByPersonaAndFechaInicio/${idPersona}/${mes}/${anio}`);
  }
  
  // Verifica distribuciones por persona, fecha de inicio y ACTIVO
  existsByActivoPersonaAndFechaInicio(idPersona: number, mes: number, anio: number): Observable<DistribucionConsultorio[]> {
    return this.httpClient.get<DistribucionConsultorio[]>(`${this.distribucionConsultoriosURL}existsByActivoByPersonaAndFechaInicio/${idPersona}/${mes}/${anio}`);
  }

  // Obtener detalle de una distribución por ID
  getDistribucionById(id: number): Observable<DistribucionConsultorio> {
    return this.httpClient.get<DistribucionConsultorio>(`${this.distribucionConsultoriosURL}detail/${id}`);
  }

  // Obtener distribuciones por ID de Efector
  getDistribucionesByEfector(idEfector: number): Observable<DistribucionConsultorio[]> {
    return this.httpClient.get<DistribucionConsultorio[]>(`${this.distribucionConsultoriosURL}detailefector/${idEfector}`);
  }

  // Obtener distribuciones por ID de Persona
  getDistribucionesConsultorioByPersona(idPersona: number): Observable<DistribucionConsultorio[]> {
    return this.httpClient.get<DistribucionConsultorio[]>(`${this.distribucionConsultoriosURL}detailpersona/${idPersona}`);
  }

public save(distribucionConsultorioes:DistribucionConsultorioDto): Observable<any> {
  return this.httpClient.post<any>(this.distribucionConsultoriosURL + 'create', distribucionConsultorioes)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, distribucionConsultorioes:DistribucionConsultorioDto): Observable<any> {
  return this.httpClient.put<any>(this.distribucionConsultoriosURL + `update/${id}`, distribucionConsultorioes)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.distribucionConsultoriosURL + `delete/${id}`, {});
}

// Verificar si un cronograma tentativo existe
existeTentativoEnDistribucionConsultorio(cTentativos: CronogramaTentativoDto): Observable<boolean> {
  return this.httpClient.post<boolean>(`${this.distribucionConsultoriosURL}verificarCronogramaEnDistribucion`, cTentativos);
}

}