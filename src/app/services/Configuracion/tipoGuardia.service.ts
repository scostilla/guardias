import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TipoGuardiaListDto } from 'src/app/dto/guardias/TipoGuardiaListDto';
import { TipoGuardia } from "src/app/models/Configuracion/TipoGuardia";

@Injectable({
  providedIn: 'root'
})
export class TipoGuardiaService {

  GuardiasURL = 'http://localhost:8080/tipoGuardia/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<TipoGuardia[]> {
      return this.httpClient.get<TipoGuardia[]>(this.GuardiasURL + 'list');
  }

  public listTipoGuardiaAll(): Observable<TipoGuardiaListDto[]> {
    return this.httpClient.get<TipoGuardiaListDto[]>(this.GuardiasURL + 'listActive');
  }

  public detail(id:number): Observable<TipoGuardia> {
      return this.httpClient.get<TipoGuardia>(this.GuardiasURL + `detail/${id}`);
  }

  detailNombre(nombre: string): Observable<TipoGuardia> {
    return this.httpClient.get<TipoGuardia>(`${this.GuardiasURL}/detailnombre/${nombre}`);
  }

  detailDescripcion(descripcion: string): Observable<TipoGuardia> {
    return this.httpClient.get<TipoGuardia>(`${this.GuardiasURL}/detaildescripcion/${descripcion}`);
  }

public save(Guardias:TipoGuardia): Observable<any> {
  return this.httpClient.post<any>(this.GuardiasURL + 'create', Guardias)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public update(id:number, Guardias:TipoGuardia): Observable<any> {
  return this.httpClient.put<any>(this.GuardiasURL + `update/${id}`, Guardias)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.GuardiasURL + `delete/${id}`,{});
}

}
