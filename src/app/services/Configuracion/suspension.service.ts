import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Suspension } from "src/app/models/Configuracion/Suspension";
import { SuspensionDto } from "src/app/dto/Configuracion/SuspensionDto";
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SuspensionService {
  SuspensionesURL = `${environment.apiUrl}/suspencion/`;
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Suspension[]> {
      return this.httpClient.get<Suspension[]>(this.SuspensionesURL + 'list');
  }

  public detail(id:number): Observable<Suspension> {
      return this.httpClient.get<Suspension>(this.SuspensionesURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<Suspension> {
    return this.httpClient.get<Suspension>(this.SuspensionesURL + `detailnombre/${nombre}`);
}

public save(Suspensiones:SuspensionDto): Observable<any> {
  return this.httpClient.post<any>(this.SuspensionesURL + 'create', Suspensiones)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public update(id:number, Suspensiones:SuspensionDto): Observable<any> {
  return this.httpClient.put<any>(this.SuspensionesURL + `update/${id}`, Suspensiones)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.SuspensionesURL + `delete/${id}`, {});
}

}
