import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RevistaDto } from 'src/app/dto/Configuracion/RevistaDto';
import { Revista } from "src/app/models/Configuracion/Revista";

@Injectable({
  providedIn: 'root'
})
export class RevistaService {

  revistasURL = 'http://localhost:8080/revista/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  public list(): Observable<Revista[]> {
    return this.httpClient.get<Revista[]>(this.revistasURL + 'list');
  }

  public detail(id: number): Observable<Revista> {
    return this.httpClient.get<Revista>(this.revistasURL + `detail/${id}`);
  }

  public checkRevista(revistaDto: RevistaDto): Observable<Revista> {
    return this.httpClient.post<Revista>(this.revistasURL + `check`,revistaDto)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  public save(revista: RevistaDto): Observable<any> {
    return this.httpClient.post<any>(this.revistasURL + 'create', revista)
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      )
  }

  public update(id: number, revistas: Revista): Observable<any> {
    return this.httpClient.put<any>(this.revistasURL + `update/${id}`, revistas)
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      )
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.put<any>(this.revistasURL + `delete/${id}`, {});
  }

}
