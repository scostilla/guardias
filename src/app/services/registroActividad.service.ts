import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, tap } from "rxjs";
import { RegActivAsistenciaDto } from "../dto/RegistroActividad/RegActivAsistenciaDto";
import { RegActivNombresDto } from "../dto/RegistroActividad/RegActivNombresDto";
import { RegActivRegSalidaDto } from "../dto/RegistroActividad/RegActivRegSalidaDto";
import { RegistroActividadDto } from "../dto/RegistroActividadDto";
import { RegistroActividad } from "../models/RegistroActividad";
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: 'root'
})
export class RegistroActividadService {

  registroActividadURL = `${environment.apiUrl}/registroActividad/`;
  private _refresh$ = new Subject<void>();
  private registroIdSubject = new BehaviorSubject<number | null>(null);

  constructor(private httpClient: HttpClient) { }

  get refresh$() {
    return this._refresh$;
  }

  get registroId$() {
    return this.registroIdSubject.asObservable();
  }

  setRegistroId(id: number): void {
    this.registroIdSubject.next(id);
  }

  clearRegistroId(): void {
    this.registroIdSubject.next(null);
  }

  public list(): Observable<RegistroActividad[]> {
    return this.httpClient.get<RegistroActividad[]>(this.registroActividadURL + 'list');
  }

  public detail(id: number): Observable<RegistroActividad> {
    return this.httpClient.get<RegistroActividad>(this.registroActividadURL + `detail/${id}`);
  }

  public save(registroActividad: RegistroActividadDto): Observable<any> {
    return this.httpClient.post<any>(this.registroActividadURL + 'create', registroActividad)
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      )
  }

  public update(id: number, registroActividad: RegistroActividadDto): Observable<any> {
    return this.httpClient.put<any>(this.registroActividadURL + `update/${id}`, registroActividad)
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      )
  }

  public getRegActivPendiente(idAsistencial: number, idEfector: number): Observable<RegActivRegSalidaDto> {
    return this.httpClient.get<RegActivRegSalidaDto>(this.registroActividadURL + `getRegActivPendiente/${idAsistencial}/${idEfector}`);
  }

  public registrarSalida(idRegistro: number, registroActividad: RegistroActividadDto): Observable<any> {
    return this.httpClient.put<any>(this.registroActividadURL + `registrarSalida/${idRegistro}`, registroActividad)
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      )
  }

  listRegActivPendienteByEfector(idEfector: number): Observable<RegActivNombresDto[]> {
    const url = `${this.registroActividadURL}listRegActivPendienteByEfector/${idEfector}`;
    return this.httpClient.get<RegActivNombresDto[]>(url);
  }

  listAsistenciaByProfesionalEfectorMesAnio(idAsistencial:number, idEfector:number, mes:number, anio:number): Observable<RegActivAsistenciaDto[]> {
    const url = `${this.registroActividadURL}listAsistenciaByProfesionalEfectorMesAnio/${idAsistencial}/${idEfector}/${mes}/${anio}`;
    return this.httpClient.get<RegActivAsistenciaDto[]>(url);
  }
  
  public delete(id: number): Observable<any> {
    return this.httpClient.put<any>(this.registroActividadURL + `delete/${id}`, {});
  }

  public validarPrecondicionesCronograma(idEfector: number, mes: number, anio: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.registroActividadURL}validar-precondiciones-cronograma/${idEfector}/${mes}/${anio}`);
  }

  public obtenerDdjjAprobadas(idEfector: number, mes: number, anio: number): Observable<number[]> {
    return this.httpClient.get<number[]>(`${this.registroActividadURL}obtener-ddjj-aprobadas/${idEfector}/${mes}/${anio}`);
  }
}