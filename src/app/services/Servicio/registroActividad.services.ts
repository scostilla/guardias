import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RegistroActividad } from "src/app/models/registroActividad";

@Injectable({
    providedIn: 'root'
})
export class registroActividadService{
    registroActividadURL = 'http://localhost:8080/registroActividad/';

    constructor (private httpClient: HttpClient){}

    public save(registroActividad:RegistroActividad): Observable<any> {
        return this.httpClient.post<any>(this.registroActividadURL + 'create',registroActividad);
    }
}