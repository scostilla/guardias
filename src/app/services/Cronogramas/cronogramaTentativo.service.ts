import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CronogramaTentativo } from "src/app/models/Cronogramas/CronogramaTentativo";
import { CronogramaTentativoDto } from "src/app/dto/Cronogramas/CronogramaTentativoDto";

@Injectable({
  providedIn: 'root'
})
export class CronogramaTentativoService {  
    
      cTentativoURL = 'http://localhost:8080/cronogramaTentativo/';
      private _refresh$ = new Subject<void>();
    
      constructor(private httpClient: HttpClient) { }
    
      get refresh$(){
        return this._refresh$;
      }
    
      public list(): Observable<CronogramaTentativo[]> {
        return this.httpClient.get<CronogramaTentativo[]>(this.cTentativoURL + 'list')
      }

      public listEfector(idEfector: number): Observable<CronogramaTentativo[]> {
        return this.httpClient.get<CronogramaTentativo[]>(this.cTentativoURL + `detailByEfector/${idEfector}`)
      }

      public listEfectorService(idEfector: number, idServicio: number): Observable<CronogramaTentativo[]> {
        return this.httpClient.get<CronogramaTentativo[]>(this.cTentativoURL + `detailByEfector/${idEfector}/${idServicio}`)
      }

      public listAll(): Observable<CronogramaTentativo[]> {
        return this.httpClient.get<CronogramaTentativo[]>(this.cTentativoURL + 'listAll')
      }  
      
      public detail(id:number): Observable<CronogramaTentativo> {
          return this.httpClient.get<CronogramaTentativo>(this.cTentativoURL + `detail/${id}`);
      }
    
    public save(cTentativos:CronogramaTentativoDto): Observable<any> {
      return this.httpClient.post<any>(this.cTentativoURL + 'create', cTentativos)
      .pipe(
        tap(() => {
         this._refresh$.next(); 
        })
      )
    }
    
    public update(id:number, cTentativos:CronogramaTentativoDto): Observable<any> {
      return this.httpClient.put<any>(this.cTentativoURL + `update/${id}`, cTentativos)
      .pipe(
        tap(() => {
         this._refresh$.next(); 
        })
      )
    }
    
    public delete(id:number): Observable<any> {
      return this.httpClient.put<any>(this.cTentativoURL + `delete/${id}`, {})
      .pipe(
        tap(() => {
         this._refresh$.next(); 
        })
      )
    }

    // Verificar si un cronograma tentativo existe
    existCronograma(cTentativos: CronogramaTentativoDto): Observable<boolean> {
      return this.httpClient.post<boolean>(`${this.cTentativoURL}existCronograma`, cTentativos);
    }
  
    }
    
    