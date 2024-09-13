import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class AgrupacionService {
    private agrupacionURL = 'http://localhost:8080/agrupacion';
  
    constructor(private http: HttpClient) { }

    getAgrupaciones(): Observable<AgrupacionEnum[]> {
      return this.http.get<AgrupacionEnum[]>(this.agrupacionURL);
    }
  }
  
  export interface AgrupacionEnum {
    name: string;
    displayName: string;
  }
