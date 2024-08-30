import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ValorGuardiasCargo } from "src/app/models/ValorGuardiasCargo";
import { ValorGuardias } from "src/app/models/ValorGuardias";
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValorGuardiasCargoService {

  
    valorGuardiasCargoURL = 'http://localhost:8080/valorGuardiaCargoYagrup/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<ValorGuardiasCargo[]> {
      return this.httpClient.get<ValorGuardiasCargo[]>(this.valorGuardiasCargoURL + 'list')
    }  
    
    public listGuardias(): Observable<ValorGuardias[]> {
      return this.httpClient.get<ValorGuardias[]>(this.valorGuardiasCargoURL + 'listGuardias');
  }

    public detail(id:number): Observable<ValorGuardiasCargo> {
        return this.httpClient.get<ValorGuardiasCargo>(this.valorGuardiasCargoURL + `detail/${id}`);
    }
  
    public detailnombre(nombre:string): Observable<ValorGuardiasCargo> {
      return this.httpClient.get<ValorGuardiasCargo>(this.valorGuardiasCargoURL + `detailnombre/${nombre}`);
  }

  public getByIds(ids: number[]): Observable<ValorGuardiasCargo[]> {
    const requests = ids.map(id => this.detail(id));
    return forkJoin(requests);
  }
      
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.valorGuardiasCargoURL + `delete/${id}`, {})
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }

  }
  
  