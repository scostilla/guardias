import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NovedadPersonalDto } from 'src/app/dto/personal/NovedadPersonalDto';
import { NovedadPersonal } from "src/app/models/personal/NovedadPersonal";
import { ConsultaLicenciaCompensatorioDto } from 'src/app/dto/personal/ConsultaLicenciaCompensatorioDto';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NovedadPersonalService {

  novedadesPersonalesURL = `${environment.apiUrl}/novedadPersonal/`;
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<NovedadPersonal[]> {
      return this.httpClient.get<NovedadPersonal[]>(this.novedadesPersonalesURL + 'list');
  }

  public detail(id:number): Observable<NovedadPersonal> {
      return this.httpClient.get<NovedadPersonal>(this.novedadesPersonalesURL + `detail/${id}`);
  }

  // Obtener novedades por persona (ID de persona)
  getNovedadesByPersona(id: number): Observable<NovedadPersonal[]> {
    return this.httpClient.get<NovedadPersonal[]>(`${this.novedadesPersonalesURL}detailpersona/${id}`);
  }

  getNovedadesActivasPorPersonaYFecha(idPersona: number, mes: number, anio: number): Observable<NovedadPersonal[]> {
    return this.httpClient.get<NovedadPersonal[]>(`${this.novedadesPersonalesURL}detailPersonaAndActivo/${idPersona}/${mes}/${anio}`);
  }

  // Obtener novedades por fecha
  getNovedadesByFecha(fecha: string): Observable<NovedadPersonal[]> {
    return this.httpClient.get<NovedadPersonal[]>(`${this.novedadesPersonalesURL}detailfecha/${fecha}`);
  }

public save(novedadesPersonales:NovedadPersonalDto): Observable<any> {
  return this.httpClient.post<any>(this.novedadesPersonalesURL + 'create', novedadesPersonales)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, novedadesPersonales:NovedadPersonalDto): Observable<any> {
  return this.httpClient.put<any>(this.novedadesPersonalesURL + `update/${id}`, novedadesPersonales)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.novedadesPersonalesURL + `delete/${id}`, {});
}

// Verificar si una persona puede hacer guardia
puedeHacerGuardia(idPersona: number, fechaConsulta: string): Observable<boolean> {
  return this.httpClient.get<boolean>(`${this.novedadesPersonalesURL}puedeHacerGuardia/${idPersona}/${fechaConsulta}`);
}

// Verificar si una persona tiene LAO
tieneLicenciaLAO(idPersona: number, fechaConsulta: string): Observable<boolean> {
  return this.httpClient.get<boolean>(`${this.novedadesPersonalesURL}tieneLicenciaLAO/${idPersona}/${fechaConsulta}`);
}

// Verificar si una persona tiene Compensatorio
tieneLicenciaCompensatorio(dto: ConsultaLicenciaCompensatorioDto): Observable<boolean> {
  return this.httpClient.post<boolean>(`${this.novedadesPersonalesURL}tieneLicenciaCompensatorio`, dto);
}

}