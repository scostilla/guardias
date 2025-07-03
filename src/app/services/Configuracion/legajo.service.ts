import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Legajo } from "src/app/models/Configuracion/Legajo";
import { LegajoDto } from 'src/app/dto/Configuracion/LegajoDto';
import { LegajoBajaDto } from 'src/app/dto/Configuracion/LegajoBajaDto';
import { LegajoActualDto } from 'src/app/dto/Configuracion/asistencial/LegajoActualDto';


@Injectable({
  providedIn: 'root'
})
export class LegajoService {

  legajosURL = 'http://localhost:8080/legajo/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Legajo[]> {
      return this.httpClient.get<Legajo[]>(this.legajosURL + 'list');
  }

  public detail(id:number): Observable<Legajo> {
      return this.httpClient.get<Legajo>(this.legajosURL + `detail/${id}`);
  }

public save(legajo:LegajoDto): Observable<any> {
  return this.httpClient.post<any>(this.legajosURL + 'create', legajo)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, legajo:LegajoDto): Observable<any> {
  return this.httpClient.put<any>(this.legajosURL + `update/${id}`, legajo)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id: number, legajoBajaDto: LegajoBajaDto): Observable<any> {
  return this.httpClient.put<any>(`${this.legajosURL}delete/${id}`, legajoBajaDto);
}

// Método para verificar si el asistencial es autoridad
public verificarAutoridad(id: number): Observable<any> {
  return this.httpClient.get<any>(`http://localhost:8080/legajo/esAutoridad/${id}`);
}

tieneTipoGuardiaPermitido(idPersona: number): Observable<boolean> {
  return this.httpClient.get<boolean>(`${this.legajosURL}/tieneTipoGuardiaPermitido/${idPersona}`);
}

listByAsistencial(idAsistencial: number): Observable<LegajoActualDto[]> {
  const url = `${this.legajosURL}listByAsistencial/${idAsistencial}`;
  return this.httpClient.get<LegajoActualDto[]>(url);
}
}