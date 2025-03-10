import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HabilitacionesGuardiasDto } from "src/app/dto/Configuracion/HabilitacionesGuardiasDto";
import { HabilitacionesGuardias } from "src/app/models/Configuracion/HabilitacionesGuardias";

@Injectable({
  providedIn: 'root'
})
export class HabilitacionesGuardiasService {

  
  permisosURL = 'http://localhost:8080/habilitacionesGuardias/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<HabilitacionesGuardias[]> {
      return this.httpClient.get<HabilitacionesGuardias[]>(this.permisosURL + 'list');
  }

  public listAll(): Observable<HabilitacionesGuardias[]> {
    return this.httpClient.get<HabilitacionesGuardias[]>(this.permisosURL + 'listAll');
}

  public detail(id:number): Observable<HabilitacionesGuardias> {
      return this.httpClient.get<HabilitacionesGuardias>(this.permisosURL + `detail/${id}`);
  }

  getPermisoByPersona(idAsistencial: number): Observable<HabilitacionesGuardias> {
    return this.httpClient.get<HabilitacionesGuardias>(`${this.permisosURL}detailAsistencial/${idAsistencial}`);
  }

  public detailnombre(nombre:string): Observable<HabilitacionesGuardias> {
    return this.httpClient.get<HabilitacionesGuardias>(this.permisosURL + `detailnombre/${nombre}`);
}

public save(permisos:HabilitacionesGuardiasDto): Observable<any> {
  return this.httpClient.post<any>(this.permisosURL + 'create', permisos)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, permisos:HabilitacionesGuardiasDto): Observable<any> {
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
listHabilitacionesByEfector(idEfector: number): Observable<HabilitacionesGuardias[]> {
  return this.httpClient.get<HabilitacionesGuardias[]>(`${this.permisosURL}listAsistencialesByEfector/${idEfector}`);
}

// Verifica si un asistencial tiene permisos asociados a un efector
tieneHabilitacionesGuardias(idAsistencial: number, idEfector: number): Observable<boolean> {
  return this.httpClient.get<boolean>(`${this.permisosURL}tieneHabilitacionesGuardias/${idAsistencial}/${idEfector}`);
}

}
