import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from 'src/app/models/servicio';


@Injectable({
    providedIn: 'root'
})
export class ServicioService {

    servicioURL = 'http://localhost:8080/servicio/';

    constructor(private httpClient: HttpClient) { }

    public lista(): Observable<Servicio[]> {
        return this.httpClient.get<Servicio[]>(this.servicioURL + 'lista');
    }

    public detail(id:number): Observable<Servicio> {
        return this.httpClient.get<Servicio>(this.servicioURL + `detail/${id}`);
    }

    public detailDescripcion(descripcion:string): Observable<Servicio> {
        return this.httpClient.get<Servicio>(this.servicioURL + `detail/${descripcion}`);
    }

    public save(servicio:Servicio): Observable<any> {
        return this.httpClient.post<any>(this.servicioURL + 'create',servicio);
    }
    
    public update(id:number,servicio:Servicio): Observable<any> {
        return this.httpClient.put<any>(this.servicioURL + `update/${id}`,servicio);
    }

    public delete(id:number): Observable<any> {
        return this.httpClient.delete<any>(this.servicioURL + `delete/${id}`);
    }


}
