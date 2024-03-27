import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Caps } from "src/app/models/Configuracion/Caps";

@Injectable({
  providedIn: 'root'
})
export class CapsService {

  capsURL = 'http://localhost:8080/caps/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Caps[]> {
      return this.httpClient.get<Caps[]>(this.capsURL + 'list');
  }

  public detail(id:number): Observable<Caps> {
      return this.httpClient.get<Caps>(this.capsURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<Caps> {
    return this.httpClient.get<Caps>(this.capsURL + `detailnombre/${nombre}`);
}

public save(caps:Caps): Observable<any> {
  return this.httpClient.post<any>(this.capsURL + 'create', caps)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public update(id:number, caps:Caps): Observable<any> {
  return this.httpClient.put<any>(this.capsURL + `update/${id}`, caps)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.capsURL + `delete/${id}`, {});
}

}
