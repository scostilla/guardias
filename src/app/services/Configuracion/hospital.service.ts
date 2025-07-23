import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CapsDto } from 'src/app/dto/Configuracion/CapsDto';
import { EfectorHospitalDto } from "src/app/dto/Configuracion/efector/EfectorHospitalDto";
import { EfectorSummaryDto } from "src/app/dto/Configuracion/efector/EfectorSummaryDto";
import { HospitalDto } from "src/app/dto/Configuracion/HospitalDto";
import { ServicioSummaryDto } from "src/app/dto/Configuracion/ServicioSummaryDto";
import { Hospital } from "src/app/models/Configuracion/Hospital";


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  hospitalesURL = 'http://localhost:8080/hospital/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Hospital[]> {
      return this.httpClient.get<Hospital[]>(this.hospitalesURL + 'list');
  }

  public listAll(): Observable<Hospital[]> {
    return this.httpClient.get<Hospital[]>(this.hospitalesURL + 'listAll');
  }

  public listSelection(): Observable<EfectorSummaryDto[]> {
    return this.httpClient.get<EfectorSummaryDto[]>(this.hospitalesURL + 'listSelection');
  }

  // Listar hospitales x pasivas
  listPasivas(): Observable<Hospital[]> {
    return this.httpClient.get<Hospital[]>(this.hospitalesURL + 'listPasivas');
  }

  public getById( id:number): Observable<Hospital> {
    return this.httpClient.get<Hospital>(this.hospitalesURL + `detail/${id}`);
}

public listActiveCapsByHospitalId(hospitalId: number): Observable<CapsDto[]> {
  return this.httpClient.get<CapsDto[]>(`${this.hospitalesURL}listCaps/${hospitalId}`);
}

// Obtener servicios activos de un hospital
getActiveServicesByHospital(idHospital: number): Observable<ServicioSummaryDto[]> {
  return this.httpClient.get<ServicioSummaryDto[]>(`${this.hospitalesURL}serviciosActivos/${idHospital}`);
}

  public detailnombre(nombre:string): Observable<Hospital> {
    return this.httpClient.get<Hospital>(this.hospitalesURL + `detailnombre/${nombre}`);
}

public detailNombreAll(id:number): Observable<EfectorHospitalDto> {
  return this.httpClient.get<EfectorHospitalDto>(this.hospitalesURL + `detailNombreAll/${id}`);
}

public save(hospitales:HospitalDto): Observable<any> {
  return this.httpClient.post<any>(this.hospitalesURL + 'create', hospitales)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public update(id:number, hospitales:HospitalDto): Observable<any> {
  return this.httpClient.put<any>(this.hospitalesURL + `update/${id}`, hospitales)
  .pipe(
    tap(() => {
     this._refresh$.next();
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.hospitalesURL + `delete/${id}`, {});
}

// Método para verificar si el id corresponde a un CAPS
isHospital(id: number): Observable<boolean> {
  return this.httpClient.get<boolean>(`${this.hospitalesURL}isHospital/${id}`);
}

// Método para traer lista de servicios de un hospital
getServiciosActivos(idHospital: number): Observable<ServicioSummaryDto[]> {
  return this.httpClient.get<ServicioSummaryDto[]>(`${this.hospitalesURL}serviciosActivos/${idHospital}`);
}

/* uploadImage(hospitalId: number, file: FormData): Observable<any> {
  return this.httpClient.post<any>(`${this.hospitalesURL}uploadImage/${hospitalId}`, file);
} */

uploadImage(hospitalId: number, file: FormData): Observable<any> {
  console.log('📤 Subiendo imagen para hospital ID:', hospitalId);
  return this.httpClient.post<any>(`${this.hospitalesURL}uploadImage/${hospitalId}`, file)
    .pipe(
      tap((response) => {
        console.log('📸 Respuesta de subida de imagen:', response);
        console.log('📁 Carpeta creada:', response.folderName);
      })
    );
}

checkImageDuplicate(hospitalId: number, file: FormData): Observable<any> {
  console.log('🔍 Verificando duplicado de imagen para hospital ID:', hospitalId);
  return this.httpClient.post<any>(`${this.hospitalesURL}checkDuplicate/${hospitalId}`, file)
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

deleteImage(hospitalId: number): Observable<any> {
  console.log('🗑️ Eliminando imagen para hospital ID:', hospitalId);
  return this.httpClient.delete<any>(`${this.hospitalesURL}deleteImage/${hospitalId}`)
    .pipe(
      tap((response) => {
        console.log('✅ Imagen eliminada:', response);
      })
    );
}

listImages(hospitalId: number): Observable<any> {
  console.log('📋 Listando imágenes para hospital ID:', hospitalId);
  return this.httpClient.get<any>(`${this.hospitalesURL}listImages/${hospitalId}`)
    .pipe(
      tap((response) => {
        console.log('📸 Imágenes encontradas:', response);
      })
    );
}

}