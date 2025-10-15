import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DistribucionGuardia } from "src/app/models/personal/DistribucionGuardia";
import { DistribucionGuardiaDto } from "src/app/dto/personal/DistribucionGuardiaDto";
import { CronogramaTentativoResquestDto } from "src/app/dto/Cronogramas/CronogramaTentativoResquestDto";
import { ValidacionCronogramaResponseDto } from "src/app/dto/Cronogramas/ValidacionCronogramaResponseDto";
import { DistribucionCheckDto } from "src/app/dto/personal/distribucionGuardia/DistribucionCheckDto";
import { ConsultaLicenciaCompensatorioDto } from "src/app/dto/novedades/ConsultaLicenciaCompensatorioDto";
import { environment } from 'src/environments/environment';




@Injectable({
  providedIn: 'root'
})
export class DistribucionGuardiaService {

  distribucionGuardiasURL = `${environment.apiUrl}/distribucionGuardia/`;
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

// Obtener distribuciones por persona, fecha de inicio y ACTIVO
getActivoByPersonaFechaInicio(idPersona: number, fechaInicio: string): Observable<DistribucionGuardia[]> {
  return this.httpClient.get<DistribucionGuardia[]>(`${this.distribucionGuardiasURL}listByActivoByPersonAndFechaInicio/${idPersona}/${fechaInicio}`);
}

listByActivoByPersonAndFechaInicioAndFechaFin(idPersona: number, fechaInicio: string, fechaFinalizacion: string): Observable<DistribucionGuardia[]> {
  return this.httpClient.get<DistribucionGuardia[]>(`${this.distribucionGuardiasURL}listByActivoByPersonAndFechaInicioAndFechaFin/${idPersona}/${fechaInicio}/${fechaFinalizacion}`);
}

// Obtener distribuciones por persona, fecha de inicio y ACTIVO
getDistribucionesByActivoPersonaAndFechaInicio(idPersona: number, mes: number, anio: number): Observable<DistribucionGuardia[]> {
  return this.httpClient.get<DistribucionGuardia[]>(`${this.distribucionGuardiasURL}detailByActivoByPersonaAndFechaInicio/${idPersona}/${mes}/${anio}`);
}

// Verifica distribuciones por persona, fecha de inicio y ACTIVO
existsByActivoPersonaAndFechaInicio(idPersona: number, mes: number, anio: number): Observable<DistribucionGuardia[]> {
  return this.httpClient.get<DistribucionGuardia[]>(`${this.distribucionGuardiasURL}existsByActivoByPersonaAndFechaInicio/${idPersona}/${mes}/${anio}`);
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

// Verificar si un cronograma tentativo existe dando 3 respuestas
existeTentativoEnDistribucionGuardia(cTentativos: CronogramaTentativoResquestDto): Observable<ValidacionCronogramaResponseDto> {
  return this.httpClient.post<ValidacionCronogramaResponseDto>(`${this.distribucionGuardiasURL}verificarCronogramaEnDistribucion`, cTentativos);
}

// Verificar si un cronograma tentativo existe solo con superposicion y booleano
validarDistribucionSemanal(cTentativos: CronogramaTentativoResquestDto): Observable<boolean> {
  return this.httpClient.post<boolean>(`${this.distribucionGuardiasURL}validarDistribucionSemanal`, cTentativos);
}

tieneDistribucionActiva(dto: DistribucionCheckDto): Observable<boolean> {
  return this.httpClient.post<boolean>(`${this.distribucionGuardiasURL}tieneDistribucionActiva`, dto);
}

verificarSuperposicionConCargo(dto: ConsultaLicenciaCompensatorioDto): Observable<boolean> {
  return this.httpClient.post<boolean>(`${this.distribucionGuardiasURL}verificarSuperposicionConCargo`, dto);
}
}