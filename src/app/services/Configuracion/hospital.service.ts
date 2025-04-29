import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Hospital } from "src/app/models/Configuracion/Hospital";
import { HospitalDto } from "src/app/dto/Configuracion/HospitalDto";
import { ServicioSummaryDto } from "src/app/dto/Configuracion/ServicioSummaryDto";
import { CapsDto } from 'src/app/dto/Configuracion/CapsDto';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  hospitalesURL = 'http://localhost:8080/hospital/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Hospital[]> {
      return this.httpClient.get<Hospital[]>(this.hospitalesURL + 'list');
  }

  // Listar hospitales x pasivas
  listPasivas(): Observable<Hospital[]> {
    return this.httpClient.get<Hospital[]>(this.hospitalesURL + 'listPasivas');
  }

  public getById( id:number): Observable<Hospital> {
    return this.httpClient.get<Hospital>(this.hospitalesURL + `detail/${id}`);
}

public listActiveCapsByHospitalId(hospitalId: number): Observable<CapsDto[]> {
  return this.httpClient.get<CapsDto[]>(`${this.hospitalesURL}listCaps/${hospitalId}`);
}

// Obtener servicios activos de un hospital
getActiveServicesByHospital(idHospital: number): Observable<ServicioSummaryDto[]> {
  return this.httpClient.get<ServicioSummaryDto[]>(`${this.hospitalesURL}serviciosActivos/${idHospital}`);
}

  public detailnombre(nombre:string): Observable<Hospital> {
    return this.httpClient.get<Hospital>(this.hospitalesURL + `detailnombre/${nombre}`);
}

public save(hospitales:HospitalDto): Observable<any> {
  return this.httpClient.post<any>(this.hospitalesURL + 'create', hospitales)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public update(id:number, hospitales:HospitalDto): Observable<any> {
  return this.httpClient.put<any>(this.hospitalesURL + `update/${id}`, hospitales)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.hospitalesURL + `delete/${id}`, {});
}

// Método para verificar si el id corresponde a un CAPS
isHospital(id: number): Observable<boolean> {
  return this.httpClient.get<boolean>(`${this.hospitalesURL}isHospital/${id}`);
}


}