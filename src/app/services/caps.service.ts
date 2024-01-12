import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Caps } from "src/app/models/Caps";

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

  public lista(): Observable<Caps[]> {
      return this.httpClient.get<Caps[]>(this.capsURL + 'lista');
  }

  public detalle(id:number): Observable<Caps> {
      return this.httpClient.get<Caps>(this.capsURL + `detalle/${id}`);
  }

  public detallenombre(nombre:string): Observable<Caps> {
    return this.httpClient.get<Caps>(this.capsURL + `detallenombre/${nombre}`);
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
  return this.httpClient.delete<any>(this.capsURL + `delete/${id}`);
}

}
