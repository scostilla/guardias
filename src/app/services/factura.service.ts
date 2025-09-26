import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';

// Ajusta según tu estructura de modelos
import { FacturaDto } from '../dto/FacturaDto';
import { FacturaDetailDto } from '../dto/FacturaDetailDto';
import { FacturaSummaryDto } from '../dto/FacturaSummaryDto';
import { Factura } from '../models/Factura';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private facturaURL = 'http://localhost:8080/factura/';
    private _refresh$ = new Subject<void>();


  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }


  public list(): Observable<Factura[]> {
    return this.httpClient.get<Factura[]>(`${this.facturaURL}list`);
  }

  public listAll(): Observable<Factura[]> {
    return this.httpClient.get<Factura[]>(`${this.facturaURL}listAll`);
  }

  public detail(id: number): Observable<Factura> {
    return this.httpClient.get<Factura>(`${this.facturaURL}detail/${id}`);
  }

  public detailAsistencial(idAsistencial: number): Observable<Factura> {
    return this.httpClient.get<Factura>(`${this.facturaURL}detailAsistencial/${idAsistencial}`);
  }

  public create(dto: FacturaDto): Observable<any> {
    return this.httpClient.post<any>(`${this.facturaURL}create`, dto)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  public update(id: number, dto: FacturaDto): Observable<any> {
    return this.httpClient.put<any>(`${this.facturaURL}update/${id}`, dto)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  public logicDelete(id: number): Observable<any> {
    return this.httpClient.put<any>(`${this.facturaURL}delete/${id}`, {})
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  public fisicDelete(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.facturaURL}fisicdelete/${id}`)
      .pipe(
        tap(() => {
          this._refresh$.next();
        })
      );
  }

  public getMontoByQuincena(idAsistencial: number, idEfector: number, quincena: string, mes: string, anio: number): Observable<number> {
    return this.httpClient.get<number>(
      `${this.facturaURL}getMontoByQuincena/${idAsistencial}/${idEfector}/${quincena}/${mes}/${anio}`
    );
  }

  // Obtener factura por asistencial
  getByAsistencial(idAsistencial: number): Observable<Factura> {
    return this.httpClient.get<Factura>(`${this.facturaURL}getByAsistencialAndFiltros/${idAsistencial}`);
  }

  // Listado resumido por efector, año, mes y quincena
  listSummary(idEfector: number, anio: number, mes: string, quincena: string): Observable<FacturaSummaryDto[]> {
    return this.httpClient.get<FacturaSummaryDto[]>(
      `${this.facturaURL}listSummary/${idEfector}/${anio}/${mes}/${quincena}`
    );
  }

  // Facturas por filtros
  getByFiltros(idAsistencial: number, idEfector: number, anio: number, mes: string, quincena: string): Observable<FacturaDetailDto[]> {
    return this.httpClient.get<FacturaDetailDto[]>(
      `${this.facturaURL}getByFiltros/${idAsistencial}/${idEfector}/${anio}/${mes}/${quincena}`
    );
  }

  // Verifica si existe alguna factura
  existeFactura(idAsistencial: number, idEfector: number, anio: number, mes: string, quincena: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.facturaURL}existeFactura/${idAsistencial}/${idEfector}/${anio}/${mes}/${quincena}`);
  }

  existenDosFacturas(idAsistencial: number, idEfector: number, anio: number, mes: string, quincena: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.facturaURL}existenDosFacturas/${idAsistencial}/${idEfector}/${anio}/${mes}/${quincena}`);
  }
}
