import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DistribucionOtroDto } from 'src/app/dto/personal/DistribucionOtroDto';
import { DistribucionOtro } from "src/app/models/personal/DistribucionOtro";


@Injectable({
  providedIn: 'root'
})
export class DistribucionOtroService {

  distribucionOtrosURL = 'http://localhost:8080/distribucionOtra/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<DistribucionOtro[]> {
      return this.httpClient.get<DistribucionOtro[]>(this.distribucionOtrosURL + 'list');
  }

  public detail(id:number): Observable<DistribucionOtro> {
      return this.httpClient.get<DistribucionOtro>(this.distribucionOtrosURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<DistribucionOtro> {
    return this.httpClient.get<DistribucionOtro>(this.distribucionOtrosURL + `detailnombre/${nombre}`);
}

public save(distribucionOtroes:DistribucionOtroDto): Observable<any> {
  return this.httpClient.post<any>(this.distribucionOtrosURL + 'create', distribucionOtroes)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, distribucionOtroes:DistribucionOtroDto): Observable<any> {
  return this.httpClient.put<any>(this.distribucionOtrosURL + `update/${id}`, distribucionOtroes)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.distribucionOtrosURL + `delete/${id}`, {});
}

}