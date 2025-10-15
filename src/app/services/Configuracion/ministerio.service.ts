import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Ministerio } from "src/app/models/Configuracion/Ministerio";
import { MinisterioDto } from "src/app/dto/Configuracion/MinisterioDto";
import { EfectorSummaryDto } from "src/app/dto/Configuracion/efector/EfectorSummaryDto";
import { EfectorMinisterioDto } from "src/app/dto/Configuracion/efector/EfectorMinisterioDto";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MinisterioService {

  ministeriosURL = `${environment.apiUrl}/ministerio/`;
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Ministerio[]> {
      return this.httpClient.get<Ministerio[]>(this.ministeriosURL + 'list');
  }

  public listAll(): Observable<Ministerio[]> {
    return this.httpClient.get<Ministerio[]>(this.ministeriosURL + 'listAll');
  }

  public listSelection(): Observable<EfectorSummaryDto[]> {
    return this.httpClient.get<EfectorSummaryDto[]>(this.ministeriosURL + 'listSelection');
  }

  public getById( id:number): Observable<Ministerio> {
    return this.httpClient.get<Ministerio>(this.ministeriosURL + `detail/${id}`);
  }

  public detailnombre(nombre:string): Observable<Ministerio> {
    return this.httpClient.get<Ministerio>(this.ministeriosURL + `detailnombre/${nombre}`);
  }

  public detailNombreAll(id:number): Observable<EfectorMinisterioDto> {
    return this.httpClient.get<EfectorMinisterioDto>(this.ministeriosURL + `detailNombreAll/${id}`);
  }

  public save(ministerios:MinisterioDto): Observable<any> {
    return this.httpClient.post<any>(this.ministeriosURL + 'create', ministerios)
    .pipe(
      tap(() => {
      this._refresh$.next();
      })
    )
  }

  public update(id:number, ministerios:MinisterioDto): Observable<any> {
    return this.httpClient.put<any>(this.ministeriosURL + `update/${id}`, ministerios)
    .pipe(
      tap(() => {
      this._refresh$.next();
      })
    )
  }

  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.ministeriosURL + `delete/${id}`, {});
  }

  // Método para verificar si el id corresponde a un CAPS
  isMinisterio(id: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.ministeriosURL}isMinisterio/${id}`);
  }

  getImageByUserId(idUsuario: number): Observable<any> {
      return this.httpClient.get<any>(`${this.ministeriosURL}imageByUser/${idUsuario}`);
  }
  
  uploadImage(ministerioId: number, file: FormData): Observable<any> {
    console.log('📤 Subiendo imagen para ministerio ID:', ministerioId);
    return this.httpClient.post<any>(`${this.ministeriosURL}uploadImage/${ministerioId}`, file)
      .pipe(
        tap((response) => {
          console.log('📸 Respuesta de subida de imagen:', response);
          console.log('📁 Carpeta creada:', response.folderName);
        })
      );
  }
  
  checkImageDuplicate(ministerioId: number, file: FormData): Observable<any> {
    console.log('🔍 Verificando duplicado de imagen para ministerio ID:', ministerioId);
    return this.httpClient.post<any>(`${this.ministeriosURL}checkDuplicate/${ministerioId}`, file)
      .pipe(
        tap((response) => {
          console.log('🔍 Resultado de verificación de duplicado:', response);
        }),
        catchError((error) => {
          console.error('❌ Error al verificar duplicado:', error);
          return throwError(error);
        })
      );
  }

  deleteImage(ministerioId: number): Observable<any> {
    console.log('🗑️ Eliminando imagen para ministerio ID:', ministerioId);
    return this.httpClient.delete<any>(`${this.ministeriosURL}deleteImage/${ministerioId}`)
      .pipe(
        tap((response) => {
          console.log('✅ Imagen eliminada:', response);
        })
      );
  }

  listImages(ministerioId: number): Observable<any> {
    console.log('📋 Listando imágenes para ministerio ID:', ministerioId);
    return this.httpClient.get<any>(`${this.ministeriosURL}listImages/${ministerioId}`)
      .pipe(
        tap((response) => {
          console.log('📸 Imágenes encontradas:', response);
        })
      );
  }

}