import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LegajoBajaDto } from 'src/app/dto/Configuracion/LegajoBajaDto';
import { LegajoDto } from 'src/app/dto/Configuracion/LegajoDto';
import { LegajoActualDto } from 'src/app/dto/Configuracion/asistencial/LegajoActualDto';
import { Legajo } from "src/app/models/Configuracion/Legajo";
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class LegajoService {

  legajosURL = `${environment.apiUrl}/legajo/`;
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Legajo[]> {
      return this.httpClient.get<Legajo[]>(this.legajosURL + 'list');
  }

  public detail(id:number): Observable<Legajo> {
      return this.httpClient.get<Legajo>(this.legajosURL + `detail/${id}`);
  }

  public getById( id:number): Observable<Legajo> {
      return this.httpClient.get<Legajo>(this.legajosURL + `detail/${id}`);
  }

public save(legajo:LegajoDto): Observable<any> {
  return this.httpClient.post<any>(this.legajosURL + 'create', legajo)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, legajo:LegajoDto): Observable<any> {
  return this.httpClient.put<any>(this.legajosURL + `update/${id}`, legajo)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id: number, legajoBajaDto: LegajoBajaDto): Observable<any> {
  return this.httpClient.put<any>(`${this.legajosURL}delete/${id}`, legajoBajaDto);
}

// Método para verificar si el asistencial es autoridad
public verificarAutoridad(id: number): Observable<any> {
  return this.httpClient.get<any>( `${environment.apiUrl}/legajo/esAutoridad/${id}`);
}

tieneTipoGuardiaPermitido(idPersona: number): Observable<boolean> {
  return this.httpClient.get<boolean>(`${this.legajosURL}/tieneTipoGuardiaPermitido/${idPersona}`);
}

listByAsistencial(idAsistencial: number): Observable<LegajoActualDto[]> {
  const url = `${this.legajosURL}listByAsistencial/${idAsistencial}`;
  return this.httpClient.get<LegajoActualDto[]>(url);
}

uploadImage(legajoId: number, file: FormData): Observable<any> {
  console.log('📤 Subiendo imagen para legajo ID:', legajoId);
  return this.httpClient.post<any>(`${this.legajosURL}uploadImage/${legajoId}`, file)
    .pipe(
      tap((response) => {
        console.log('📸 Respuesta de subida de imagen:', response);
        console.log('📁 Carpeta creada:', response.folderName);
      })
    );
}

checkImageDuplicate(legajoId: number, file: FormData): Observable<any> {
  console.log('🔍 Verificando duplicado de imagen para legajo ID:', legajoId);
  return this.httpClient.post<any>(`${this.legajosURL}checkDuplicate/${legajoId}`, file)
    .pipe(
      tap((response) => {
        console.log('📸 Respuesta de verificación de duplicado:', response);
      }),
            catchError((error) => {
              console.error('❌ Error al verificar duplicado:', error);
              return throwError(error);
            })
    );
}

deleteImage(legajoId: number): Observable<any> {
  console.log('🗑️ Eliminando imagen para legajo ID:', legajoId);
  return this.httpClient.delete<any>(`${this.legajosURL}deleteImage/${legajoId}`)
    .pipe(
      tap((response) => {
        console.log('✅ Imagen eliminada:', response);
      })
    );
}

listImages(legajoId: number): Observable<any> {
  console.log('📋 Listando imágenes para legajo ID:', legajoId);
  return this.httpClient.get<any>(`${this.legajosURL}listImages/${legajoId}`)
    .pipe(
      tap((response) => {
        console.log('📸 Imágenes encontradas:', response);
      })
    );
}

}