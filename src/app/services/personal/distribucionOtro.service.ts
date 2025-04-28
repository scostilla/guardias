import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DistribucionOtroDto } from 'src/app/dto/personal/DistribucionOtroDto';
import { DistribucionOtro } from "src/app/models/personal/DistribucionOtro";
import { CronogramaTentativoDto } from "src/app/dto/Cronogramas/CronogramaTentativoDto";

@Injectable({
  providedIn: 'root'
})
export class DistribucionOtroService {

  distribucionOtrosURL = 'http://localhost:8080/distribucionOtra/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<DistribucionOtro[]> {
      return this.httpClient.get<DistribucionOtro[]>(this.distribucionOtrosURL + 'list');
  }

  public detail(id:number): Observable<DistribucionOtro> {
      return this.httpClient.get<DistribucionOtro>(this.distribucionOtrosURL + `detail/${id}`);
  }

  // Obtener distribuciones por fecha de inicio
  getDistribucionesByFechaInicio(fechaInicio: string): Observable<DistribucionOtro[]> {
    return this.httpClient.get<DistribucionOtro[]>(`${this.distribucionOtrosURL}list/${fechaInicio}`);
  }

  // Obtener distribuciones por persona, fecha de inicio y ACTIVO
  getActivoByPersonaFechaInicio(idPersona: number, fechaInicio: string): Observable<DistribucionOtro[]> {
    return this.httpClient.get<DistribucionOtro[]>(`${this.distribucionOtrosURL}listByActivoByPersonAndFechaInicio/${idPersona}/${fechaInicio}`);
  }

  // Obtener distribuciones por persona, fecha de inicio y ACTIVO
  getDistribucionesByActivoPersonaAndFechaInicio(idPersona: number, mes: number, anio: number): Observable<DistribucionOtro[]> {
    return this.httpClient.get<DistribucionOtro[]>(`${this.distribucionOtrosURL}detailByActivoByPersonaAndFechaInicio/${idPersona}/${mes}/${anio}`);
  }
  
  // Verifica distribuciones por persona, fecha de inicio y ACTIVO
  existsByActivoPersonaAndFechaInicio(idPersona: number, mes: number, anio: number): Observable<DistribucionOtro[]> {
    return this.httpClient.get<DistribucionOtro[]>(`${this.distribucionOtrosURL}existsByActivoByPersonaAndFechaInicio/${idPersona}/${mes}/${anio}`);
  }

  // Obtener distribuciones por ID de Efector
  getDistribucionesByEfector(idEfector: number): Observable<DistribucionOtro[]> {
    return this.httpClient.get<DistribucionOtro[]>(`${this.distribucionOtrosURL}detailefector/${idEfector}`);
  }

  // Obtener distribuciones por ID de Persona
  getDistribucionesOtroByPersona(idPersona: number): Observable<DistribucionOtro[]> {
    return this.httpClient.get<DistribucionOtro[]>(`${this.distribucionOtrosURL}detailpersona/${idPersona}`);
  }

public save(distribucionOtroes:DistribucionOtroDto): Observable<any> {
  return this.httpClient.post<any>(this.distribucionOtrosURL + 'create', distribucionOtroes)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, distribucionOtroes:DistribucionOtroDto): Observable<any> {
  return this.httpClient.put<any>(this.distribucionOtrosURL + `update/${id}`, distribucionOtroes)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.distribucionOtrosURL + `delete/${id}`, {});
}

// Verificar si un cronograma tentativo existe
existeTentativoEnDistribucionOtro(cTentativos: CronogramaTentativoDto): Observable<boolean> {
  return this.httpClient.post<boolean>(`${this.distribucionOtrosURL}verificarCronogramaEnDistribucion`, cTentativos);
}

}