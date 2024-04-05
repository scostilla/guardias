import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Legajo } from "src/app/models/Configuracion/Legajo";

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

public save(legajos:Legajo): Observable<any> {
  return this.httpClient.post<any>(this.legajosURL + 'create', legajos)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, legajos:Legajo): Observable<any> {
  return this.httpClient.put<any>(this.legajosURL + `update/${id}`, legajos)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.legajosURL + `delete/${id}`, {});
}

}
