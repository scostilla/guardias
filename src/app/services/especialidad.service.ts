import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Especialidad } from "src/app/models/Especialidad";

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {

  especialidadesURL = 'http://localhost:8080/especialidad/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public lista(): Observable<Especialidad[]> {
      return this.httpClient.get<Especialidad[]>(this.especialidadesURL + 'lista');
  }

  public detalle(id:number): Observable<Especialidad> {
      return this.httpClient.get<Especialidad>(this.especialidadesURL + `detalle/${id}`);
  }

  public detallenombre(nombre:string): Observable<Especialidad> {
    return this.httpClient.get<Especialidad>(this.especialidadesURL + `detallenombre/${nombre}`);
}

public save(especialidades:Especialidad): Observable<any> {
  return this.httpClient.post<any>(this.especialidadesURL + 'create', especialidades)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public update(id:number, especialidades:Especialidad): Observable<any> {
  return this.httpClient.put<any>(this.especialidadesURL + `update/${id}`, especialidades)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.delete<any>(this.especialidadesURL + `delete/${id}`);
}

}
