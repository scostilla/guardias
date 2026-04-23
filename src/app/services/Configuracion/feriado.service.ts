import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Feriado } from "src/app/models/Configuracion/Feriado";
import { FeriadoDto } from "src/app/dto/Configuracion/FeriadoDto";
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FeriadoService {

  feriadosURL = `${environment.apiUrl}/feriado/`;
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Feriado[]> {
      return this.httpClient.get<Feriado[]>(this.feriadosURL + 'list');
  }

  public detail(id:number): Observable<Feriado> {
      return this.httpClient.get<Feriado>(this.feriadosURL + `detail/${id}`);
  }

  public detailmotivo(motivo:string): Observable<Feriado> {
    return this.httpClient.get<Feriado>(this.feriadosURL + `detailmotivo/${motivo}`);
}

public save(feriadosDto:FeriadoDto): Observable<any> {
  return this.httpClient.post<any>(this.feriadosURL + 'create', feriadosDto)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, feriadosDto:FeriadoDto): Observable<any> {
  return this.httpClient.put<any>(this.feriadosURL + `update/${id}`, feriadosDto)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.feriadosURL + `delete/${id}`, {});
}

}
