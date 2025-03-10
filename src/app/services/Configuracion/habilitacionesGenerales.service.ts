import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HabilitacionesGenerales } from "src/app/models/Configuracion/HabilitacionesGenerales";
import { HabilitacionesGeneralesDto } from "src/app/dto/Configuracion/HabilitacionesGeneralesDto";

@Injectable({
  providedIn: 'root'
})
export class HabilitacionesGeneralesService {

  
  permisosURL = 'http://localhost:8080/habilitacionesGenerales/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<HabilitacionesGenerales[]> {
      return this.httpClient.get<HabilitacionesGenerales[]>(this.permisosURL + 'list');
  }

  public listAll(): Observable<HabilitacionesGenerales[]> {
    return this.httpClient.get<HabilitacionesGenerales[]>(this.permisosURL + 'listAll');
}

  public detail(id:number): Observable<HabilitacionesGenerales> {
      return this.httpClient.get<HabilitacionesGenerales>(this.permisosURL + `detail/${id}`);
  }

  getPermisoByPersona(idPersona: number): Observable<HabilitacionesGenerales> {
    return this.httpClient.get<HabilitacionesGenerales>(`${this.permisosURL}detailAsistencial/${idPersona}`);
  }

  public detailnombre(nombre:string): Observable<HabilitacionesGenerales> {
    return this.httpClient.get<HabilitacionesGenerales>(this.permisosURL + `detailnombre/${nombre}`);
}

public save(permisos:HabilitacionesGeneralesDto): Observable<any> {
  return this.httpClient.post<any>(this.permisosURL + 'create', permisos)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, permisos:HabilitacionesGeneralesDto): Observable<any> {
  return this.httpClient.put<any>(this.permisosURL + `update/${id}`, permisos)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.permisosURL + `delete/${id}`, {});
}

public deleteFisic(id:number): Observable<any> {
  return this.httpClient.put<any>(this.permisosURL + `fisicdelete/${id}`, {});
}

// Obtener habilitaciones por Efector y asistencial
listHabilitacionesGeneralesByEfector(idEfector: number): Observable<HabilitacionesGenerales[]> {
  return this.httpClient.get<HabilitacionesGenerales[]>(`${this.permisosURL}listAsistencialesByEfector/${idEfector}`);
}

// Verifica si un asistencial tiene permisos asociados a un efector
tieneHabilitacionesGenerales(idPersona: number, idEfector: number): Observable<boolean> {
  return this.httpClient.get<boolean>(`${this.permisosURL}tieneHabilitacionesGenerales/${idPersona}/${idEfector}`);
}

// Añadir habilitaciones a una autoridad regional
addHabilitacionesAutoridadRegional(idPersona: number, idRegion: number): Observable<any> {
  return this.httpClient.put(`${this.permisosURL}addHabilitacionesAutoridadRegional/${idPersona}/${idRegion}`, {});
}

}
