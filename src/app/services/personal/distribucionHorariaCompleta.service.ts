import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DistribucionesConCronogramasDto } from "src/app/dto/personal/DistribucionesConCronogramasDto";


@Injectable({
  providedIn: 'root'
})
export class DistribucionHorariaCompletaService {

  distribucionDiariaCompletaURL = 'http://localhost:8080/distribuciones-completas/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public save(distribucionCompleta:DistribucionesConCronogramasDto): Observable<any> {
    return this.httpClient.post<any>(this.distribucionDiariaCompletaURL + 'crear', distribucionCompleta)
    .pipe(
      tap(() => {
      this._refresh$.next(); 
      })
    )
  }
  
}
