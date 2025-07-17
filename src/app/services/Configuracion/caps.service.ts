import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CapsDto } from "src/app/dto/Configuracion/CapsDto";
import { EfectorCapsDto } from "src/app/dto/Configuracion/efector/EfectorCapsDto";
import { EfectorSummaryDto } from "src/app/dto/Configuracion/efector/EfectorSummaryDto";
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

  public listAll(): Observable<Caps[]> {
    return this.httpClient.get<Caps[]>(this.capsURL + 'listAll');
}

public listSelection(): Observable<EfectorSummaryDto[]> {
  return this.httpClient.get<EfectorSummaryDto[]>(this.capsURL + 'listSelection');
}


  public getById( id:number): Observable<Caps> {
    return this.httpClient.get<Caps>(this.capsURL + `detail/${id}`);
}

  public detailnombre(nombre:string): Observable<Caps> {
    return this.httpClient.get<Caps>(this.capsURL + `detailnombre/${nombre}`);
}

public detailNombreAll(id:number): Observable<EfectorCapsDto> {
  return this.httpClient.get<EfectorCapsDto>(this.capsURL + `detailNombreAll/${id}`);
}

public save(caps:CapsDto): Observable<any> {
  return this.httpClient.post<any>(this.capsURL + 'create', caps)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public update(id:number, caps:CapsDto): Observable<any> {
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

// Método para obtener el nombre del hospital asociado a un CAPS
getCabeceraNameByCapsId(id: number): Observable<string> {
  console.log('Llamando al backend con ID:', id);
  return this.httpClient.get<string>(this.capsURL + `getCabecera/${id}`, { responseType: 'text' as 'json' });
}

  // Método para verificar si el id corresponde a un CAPS
  isCaps(id: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.capsURL}isCaps/${id}`);
  }

}
