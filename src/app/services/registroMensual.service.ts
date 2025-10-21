import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, tap } from "rxjs";
import { RegistroMensual } from "../models/RegistroMensual";
import { RegistroMensualDto } from "../dto/RegistroMensualDto";
import { RegistroMensualListDto } from "../dto/RegistroMensualListDto";
import { BehaviorSubject } from 'rxjs';

export interface FechaSeleccionada {
  mes: number;
  anio: number;
}

@Injectable({
    providedIn: 'root'
  })
  export class RegistroMensualService {
  
    registroMensualURL = 'http://localhost:8080/registroMensual/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<RegistroMensual[]> {
        return this.httpClient.get<RegistroMensual[]>(this.registroMensualURL + 'list');
    }

    public listByYearMonthEfectorAndTipoGuardiaCargoReagrupacion( anio:number, mes:string, idEfector:number): Observable<RegistroMensual[]> {
        return this.httpClient.get<RegistroMensual[]>(this.registroMensualURL + `listAMEcargoyagrup/${anio}/${mes}/${idEfector}`);
    }

    public listByYearMonthEfectorAndTipoGuardiaCargoReagrupacionService( anio:number, mes:string, idEfector:number, idServicio:number): Observable<RegistroMensual[]> {
        return this.httpClient.get<RegistroMensual[]>(this.registroMensualURL + `listAMEcargoyagrupAndServicio/${anio}/${mes}/${idEfector}/${idServicio}`);
    }

    public listByYearMonthEfectorAndTipoGuardiaExtra( anio:number, mes:string,idEfector:number): Observable<RegistroMensual[]> {
        return this.httpClient.get<RegistroMensual[]>(this.registroMensualURL + `listAMEextra/${anio}/${mes}/${idEfector}`);
    }

    public listByYearMonthEfectorAndTipoGuardiaExtraService( anio:number, mes:string, idEfector:number, idServicio:number): Observable<RegistroMensual[]> {
        return this.httpClient.get<RegistroMensual[]>(this.registroMensualURL + `listAMEextraAndServicio/${anio}/${mes}/${idEfector}/${idServicio}`);
    }
  
    public listByYearMonthEfectorAndTipoGuardiaCF( anio:number, mes:string,idEfector:number): Observable<RegistroMensual[]> {
        return this.httpClient.get<RegistroMensual[]>(this.registroMensualURL + `listAMEcf/${anio}/${mes}/${idEfector}`);
    }

    public listByYearMonthEfectorAndTipoGuardiaCFService( anio:number, mes:string, idEfector:number, idServicio:number): Observable<RegistroMensual[]> {
        return this.httpClient.get<RegistroMensual[]>(this.registroMensualURL + `listAMEcfAndServicio/${anio}/${mes}/${idEfector}/${idServicio}`);
    }

    public detail(id:number): Observable<RegistroMensual> {
        return this.httpClient.get<RegistroMensual>(this.registroMensualURL + `detail/${id}`);
    }
  
  public save(registroMensual:RegistroMensual): Observable<any> {
    return this.httpClient.post<any>(this.registroMensualURL + 'create', registroMensual)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, registroMensual:RegistroMensualDto): Observable<any> {
    return this.httpClient.put<any>(this.registroMensualURL + `update/${id}`, registroMensual)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.registroMensualURL + `delete/${id}`, {});
  }


  // ===================== FILTROS POR TIPO DE GUARDIA con DTO =====================

  listCargoyagrup(anio: number, mes: string, idEfector: number): Observable<RegistroMensualListDto[]> {
    return this.httpClient.get<RegistroMensualListDto[]>(this.registroMensualURL + `listCargoyagrup/${anio}/${mes}/${idEfector}`);
  }

  listCargoyagrupAndServicio(anio: number, mes: string, idEfector: number, idServicio: number): Observable<RegistroMensualListDto[]> {
    return this.httpClient.get<RegistroMensualListDto[]>(this.registroMensualURL + `listCargoyagrupAndServicio/${anio}/${mes}/${idEfector}/${idServicio}`);
  }

  listExtra(anio: number, mes: string, idEfector: number): Observable<RegistroMensualListDto[]> {
    return this.httpClient.get<RegistroMensualListDto[]>(this.registroMensualURL + `listExtra/${anio}/${mes}/${idEfector}`);
  }

  listExtraAndServicio(anio: number, mes: string, idEfector: number, idServicio: number): Observable<RegistroMensualListDto[]> {
    return this.httpClient.get<RegistroMensualListDto[]>(this.registroMensualURL + `listExtraAndServicio/${anio}/${mes}/${idEfector}/${idServicio}`);
  }

  listCf(anio: number, mes: string, idEfector: number, quincena: string): Observable<RegistroMensualListDto[]> {
    return this.httpClient.get<RegistroMensualListDto[]>(this.registroMensualURL + `listCf/${anio}/${mes}/${idEfector}/${quincena}`);
  }

  listCfAndServicio(anio: number, mes: string, idEfector: number, idServicio: number, quincena: string): Observable<RegistroMensualListDto[]> {
    return this.httpClient.get<RegistroMensualListDto[]>(this.registroMensualURL + `listCfAndServicio/${anio}/${mes}/${idEfector}/${idServicio}/${quincena}`);
  }

  getMontoTotalByQuincena(idAsistencial: number, idEfector: number, quincena: string, mes: string, anio: number): Observable<number> {
    return this.httpClient.get<number>(
      `${this.registroMensualURL}getMontoTotalByQuincena/${idAsistencial}/${idEfector}/${quincena}/${mes}/${anio}`
    );
  }

  getMontoTotal(idAsistencial: number, idEfector: number, mes: string, anio: number): Observable<number> {
    return this.httpClient.get<number>(
      `${this.registroMensualURL}getMontoTotal/${idAsistencial}/${idEfector}/${mes}/${anio}`
    );
  }

  getRegistrosIncompletos(idEfector: number, mes: string, anio: number, quincena: string): Observable<RegistroMensualListDto[]> {
    return this.httpClient.get<RegistroMensualListDto[]>(`${this.registroMensualURL}incompletos/${idEfector}/${mes}/${anio}/${quincena}`);
  }

   listFueraDeTermino(idEfector: number, mes: string, anio: number): Observable<RegistroMensualListDto[]> {
    return this.httpClient.get<RegistroMensualListDto[]>(`${this.registroMensualURL}fuera-de-termino/${idEfector}/${mes}/${anio}`
    );
  }

   listFueraDeTerminoPorServicio(idEfector: number, mes: string, anio: number, idServicio: number): Observable<RegistroMensualListDto[]> {
    return this.httpClient.get<RegistroMensualListDto[]>(`${this.registroMensualURL}fuera-de-termino-por-servicio/${idEfector}/${mes}/${anio}/${idServicio}`
    );
  }

  existenRegistrosFueraDeTermino(idEfector: number, mes: string, anio: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.registroMensualURL}existen-fuera-de-termino/${idEfector}/${mes}/${anio}`
    );
  }

  existenCompletos(idEfector: number, mes: string, anio: number, quincena: string ): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.registroMensualURL}existen-completos/${idEfector}/${mes}/${anio}/${quincena}`);
  }

//Behaivour para manejo de fechas en fuera de termino
  private fechaSubject = new BehaviorSubject<FechaSeleccionada | null>(null);

  fecha$ = this.fechaSubject.asObservable();

  setFecha(fecha: FechaSeleccionada) {
    this.fechaSubject.next(fecha);
  }

  getFecha(): FechaSeleccionada | null {
    return this.fechaSubject.getValue();
  }

}