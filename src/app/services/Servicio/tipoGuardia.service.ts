import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from 'src/app/models/servicio';
import { TipoGuardia } from 'src/app/models/tipoGuardia';


@Injectable({
    providedIn: 'root'
})
export class tipoGuardiaService {

    tipoGuardiaURL = 'http://localhost:8080/tipoGuardia/';

    constructor(private httpClient: HttpClient) { }

    public lista(): Observable<TipoGuardia[]> {
        return this.httpClient.get<TipoGuardia[]>(this.tipoGuardiaURL + 'lista');
    }

    public detail(id:number): Observable<TipoGuardia> {
        return this.httpClient.get<TipoGuardia>(this.tipoGuardiaURL + `detail/${id}`);
    }

    public detailNombre(nombre:string): Observable<TipoGuardia> {
        return this.httpClient.get<TipoGuardia>(this.tipoGuardiaURL + `detail/${nombre}`);
    }

    public detailDescripcion(descripcion:string): Observable<TipoGuardia> {
        return this.httpClient.get<TipoGuardia>(this.tipoGuardiaURL + `detail/${descripcion}`);
    }

    public save(tipoGuardia:TipoGuardia): Observable<any> {
        return this.httpClient.post<any>(this.tipoGuardiaURL + 'create',tipoGuardia);
    }
    
    public update(id:number,tipoGuardia:TipoGuardia): Observable<any> {
        return this.httpClient.put<any>(this.tipoGuardiaURL + `update/${id}`,tipoGuardia);
    }

    public delete(id:number): Observable<any> {
        return this.httpClient.delete<any>(this.tipoGuardiaURL + `delete/${id}`);
    }


}
