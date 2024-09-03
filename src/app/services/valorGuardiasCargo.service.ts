import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ValorGuardiasCargo } from "src/app/models/ValorGuardiasCargo";
import { ValorGuardias } from "src/app/models/ValorGuardias";
import * as moment from 'moment';

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

  public obtenerValorGuardiaCargo(): Observable<{ [nivel: number]: ValorGuardiasCargo[] }> {
    return this.httpClient.get<ValorGuardiasCargo[]>(this.valorGuardiasCargoURL + 'list').pipe(
      map((valorGuardiasCargos: ValorGuardiasCargo[]) => {
        // Filtra solo los registros activos
        const activos = valorGuardiasCargos.filter(vgc => vgc.activo);

        if (activos.length === 0) {
          return {};
        }

        // Encuentra la última fechaInicio
        const ultimaFechaInicio = moment.max(activos.map(r => moment(r.fechaInicio)));

        // Filtra los registros para mantener solo los que tienen la última fechaInicio
        const registrosUltimaFecha = activos.filter(vgc =>
          moment(vgc.fechaInicio).isSame(ultimaFechaInicio)
        );

        // Organiza los registros por nivel de complejidad
        const valoresPorNivel: { [nivel: number]: ValorGuardiasCargo[] } = {};

        registrosUltimaFecha.forEach(vgc => {
          const nivel = vgc.nivelComplejidad;
          if (!valoresPorNivel[nivel]) {
            valoresPorNivel[nivel] = [];
          }

          valoresPorNivel[nivel].push(vgc);
        });

        return valoresPorNivel;
      })
    );
  }
}
  
  