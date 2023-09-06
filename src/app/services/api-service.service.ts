import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import ConsultaProfesional from 'src/server/models/ConsultaProfesional';
import Legajo from 'src/server/models/Legajo';
import Persona from 'src/server/models/Persona';
import Profesional from 'src/server/models/Profesional';

@Injectable({
  providedIn: 'root',
})

/*

#UNICO Servicio encargado de comunicarse con el backEnd

 */
export class ApiServiceService {
  //URL del back
  private baseUrl = 'http://localhost:8080/api/V1/listaProfesionales';
  private profesionalUrl = 'http://localhost:8080/api/V1/profesionales/';
  private personaUrl = 'http://localhost:8080/api/V1/personas/';
  private legajoUrl = 'http://localhost:8080/api/V1/legajos/';

  constructor(private http: HttpClient) {}

  getProfesionales(): Observable<ConsultaProfesional[]> {
    return this.http.get<ConsultaProfesional[]>(`${this.baseUrl}`);
  }

  get(url: string): Observable<any> {
    return this.http.get(this.baseUrl + url);
  }

  post(url: string, data: any): Observable<any> {
    console.log('url: ' + url);
    console.log('data: ' + data);
    return this.http.post(url, data);
  }

  public savePersona(persona: Persona): Observable<number> {
    return this.http.post(this.personaUrl, persona).pipe(
      map((response: any) => {
        return response as number;
      }),
      catchError((error) => {
        console.error('Error al guardar persona:', error);
        throw error;
      })
    );
  }

  public saveProfesional(profesional: Profesional): Observable<number> {
    console.log('profesional: ' + profesional.idTipoGuardia);
    return this.http.post(this.profesionalUrl, profesional).pipe(
      map((response: any) => {
        return response as number;
      }),
      catchError((error) => {
        console.error('Error al guardar el profesional:', error);
        throw error;
      })
    );
  }

  public saveLegajo(legajo: Legajo): Observable<number> {
    console.log('legajo: ' + legajo.idLegajo);
    return this.http.post(this.legajoUrl, legajo).pipe(
      map((response: any) => {
        return response as number;
      }),
      catchError((error) => {
        console.error('Error al guardar el legajo:', error);
        throw error;
      })
    );
  }

  put(url: string, data: any): Observable<any> {
    return this.http.put(this.baseUrl + url, data);
  }

  delete(url: string): Observable<any> {
    return this.http.delete(this.baseUrl + url);
  }

  getRevistaId(
    tipoRevista: string,
    categoria: string,
    adicional: string,
    cargaHoraria: string
  ): Observable<number> {
    const params = new HttpParams()
      .set('tipoRevista', tipoRevista)
      .set('categoria', categoria)
      .set('adicional', adicional)
      .set('cargaHoraria', cargaHoraria);

    return this.http.get<number>(`${this.personaUrl}revista`, { params });
  }
}
