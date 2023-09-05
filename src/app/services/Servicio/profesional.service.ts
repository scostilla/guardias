import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicio } from 'src/app/models/servicio';
import { Profesional } from "src/app/models/profesional";

@Injectable({
    providedIn: 'root'
})
export class ProfesionalService {

    profesionalURL = 'http://localhost:8080/profesional/';

    constructor(private httpClient: HttpClient) { }

    public lista(): Observable<Profesional[]> {
        return this.httpClient.get<Profesional[]>(this.profesionalURL + 'lista');
    }

    public detail(id:number): Observable<Profesional> {
        return this.httpClient.get<Profesional>(this.profesionalURL + `detail/${id}`);
    }

    /* public detailDescripcion(descripcion:string): Observable<Servicio> {
        return this.httpClient.get<Servicio>(this.profesionalURL + `detail/${descripcion}`);
    }

    public save(servicio:Servicio): Observable<any> {
        return this.httpClient.post<any>(this.profesionalURL + 'create',servicio);
    }
    
    public update(id:number,servicio:Servicio): Observable<any> {
        return this.httpClient.put<any>(this.servicioURL + `update/${id}`,servicio);
    }

    public delete(id:number): Observable<any> {
        return this.httpClient.delete<any>(this.servicioURL + `delete/${id}`);
    }
 */

}