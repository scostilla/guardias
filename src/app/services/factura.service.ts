import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap, throwError } from 'rxjs';

// Ajusta según tu estructura de modelos
import { FacturaDetailDto } from '../dto/FacturaDetailDto';
import { FacturaDto } from '../dto/FacturaDto';
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
    return this.httpClient.get<number>(`${this.facturaURL}getMontoByQuincena/${idAsistencial}/${idEfector}/${quincena}/${mes}/${anio}`);
  }

  public getMonto(idAsistencial: number, idEfector: number, mes: string, anio: number): Observable<number> {
    return this.httpClient.get<number>(`${this.facturaURL}getMonto/${idAsistencial}/${idEfector}/${mes}/${anio}`);
  }

  public getMontoFueraTermino(idAsistencial: number, idEfector: number, mes: string, anio: number): Observable<number> {
    return this.httpClient.get<number>(`${this.facturaURL}getMontoFueraTermino/${idAsistencial}/${idEfector}/${mes}/${anio}`);
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

  // Obtener factura por asistencial
  listByAsistencialSinQuincena(idEfector: number, anio: number, mes: string, idAsistencial: number): Observable<FacturaDetailDto[]> {
    return this.httpClient.get<FacturaDetailDto[]>(`${this.facturaURL}listByAsistencialSinQuincena/${idEfector}/${anio}/${mes}/${idAsistencial}`);
  }

  // Listado resumido por efector, año, mes y quincena
  listSummarySinQuincena(idEfector: number, anio: number, mes: string): Observable<FacturaSummaryDto[]> {
    return this.httpClient.get<FacturaSummaryDto[]>(
      `${this.facturaURL}listSummarySinQuincena/${idEfector}/${anio}/${mes}}`
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

  existeFacturaSinQuincena(idAsistencial: number, idEfector: number, anio: number, mes: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.facturaURL}existeFacturaSinQuincena/${idAsistencial}/${idEfector}/${anio}/${mes}`);
  }

  existenDosFacturasSinQuincena(idAsistencial: number, idEfector: number, anio: number, mes: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.facturaURL}existenDosFacturasSinQuincena/${idAsistencial}/${idEfector}/${anio}/${mes}`);
  }


  /**
   * Subir un PDF asociado a una factura existente.
   * El backend espera multipart/form-data con campo 'pdf' y la ruta POST /factura/uploadPdf/{facturaId}
   */
  public uploadPdf(facturaId: number, file: File): Observable<any> {
    // Validaciones básicas
    if (facturaId === null || facturaId === undefined) {
      return throwError(() => new Error('FacturaId inválido'));
    }
    if (!file) {
      return throwError(() => new Error('No se seleccionó ningún archivo'));
    }
    if (file.type !== 'application/pdf') {
      return throwError(() => new Error('El archivo debe ser un PDF'));
    }
    const MAX = 10 * 1024 * 1024;
    if (file.size > MAX) {
      return throwError(() => new Error('El archivo no puede ser mayor a 10MB'));
    }

    const formData = new FormData();
    formData.append('pdf', file, file.name);

    // DEBUG opcional
    console.log('[UPLOAD PDF][FACTURA] facturaId:', facturaId, 'file:', file.name, file.type, file.size);

    return this.httpClient.post<any>(`${this.facturaURL}uploadPdf/${facturaId}`, formData)
      .pipe(
        tap(() => { this._refresh$.next(); })
      );
  }
}
