import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DistribucionGira } from "src/app/models/personal/DistribucionGira";
import { DistribucionGiraDto } from "src/app/dto/personal/DistribucionGiraDto";


@Injectable({
  providedIn: 'root'
})
export class DistribucionGiraService {

  distribucionGirasURL = 'http://localhost:8080/distribucionGira/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<DistribucionGira[]> {
      return this.httpClient.get<DistribucionGira[]>(this.distribucionGirasURL + 'list');
  }

  public detail(id:number): Observable<DistribucionGira> {
      return this.httpClient.get<DistribucionGira>(this.distribucionGirasURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<DistribucionGira> {
    return this.httpClient.get<DistribucionGira>(this.distribucionGirasURL + `detailnombre/${nombre}`);
}

public save(distribucionGiraes:DistribucionGiraDto): Observable<any> {
  return this.httpClient.post<any>(this.distribucionGirasURL + 'create', distribucionGiraes)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, distribucionGiraes:DistribucionGiraDto): Observable<any> {
  return this.httpClient.put<any>(this.distribucionGirasURL + `update/${id}`, distribucionGiraes)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.distribucionGirasURL + `delete/${id}`, {});
}

}