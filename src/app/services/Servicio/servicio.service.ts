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
}
