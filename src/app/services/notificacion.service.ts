import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { NotificacionDto } from 'src/app/dto/NotificacionDto';
import { Notificacion } from "src/app/models/Notificacion";
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  notificacionesURL = `${environment.apiUrl}/notificacion/`;
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Notificacion[]> {
      return this.httpClient.get<any[]>(this.notificacionesURL + 'list').pipe(
        map(arr => (arr || []).map(n => this.mapNotificacion(n)))
      );
  }

  public listByTipo(tipo: string): Observable<Notificacion[]> {
    return this.httpClient.get<any[]>(this.notificacionesURL + `listByTipo/${tipo}`).pipe(
      map(arr => (arr || []).map(n => this.mapNotificacion(n)))
    );
  }

  

  public detail(id:number): Observable<Notificacion> {
      return this.httpClient.get<any>(this.notificacionesURL + `detail/${id}`).pipe(
        map(n => this.mapNotificacion(n))
      );
  }

  private mapNotificacion(raw: any): Notificacion {
    if (raw && (!raw.idEfectores || raw.idEfectores.length === 0) && Array.isArray(raw.efectores)) {
      raw.idEfectores = raw.efectores.map((e: any) => e.id);
    }
    return raw;
  }

  public detailnombre(nombre:string): Observable<Notificacion> {
    return this.httpClient.get<Notificacion>(this.notificacionesURL + `detailnombre/${nombre}`);
}

public save(dto: NotificacionDto): Observable<Notificacion | Notificacion[]> {
  const toYMD = (v: any) => {
    if (!v) return null;
    const d = (v instanceof Date) ? v : new Date(v);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0];
  };
  const body: any = {
    ...dto,
    fechaNotificacion: toYMD(dto.fechaNotificacion),
    fechaBaja: dto.fechaBaja ? toYMD(dto.fechaBaja) : null
  };
  return this.httpClient.post<Notificacion | Notificacion[]>(this.notificacionesURL + 'create', body)
    .pipe(tap(() => this._refresh$.next()));
}

public update(id:number, dto: NotificacionDto | Notificacion): Observable<any> {
  const toYMD = (v: any) => {
    if (!v) return null;
    const d = (v instanceof Date) ? v : new Date(v);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().split('T')[0];
  };
  const body: any = { ...dto };
  if (body.fechaNotificacion) body.fechaNotificacion = toYMD(body.fechaNotificacion);
  if (body.fechaBaja) body.fechaBaja = toYMD(body.fechaBaja);
  return this.httpClient.put<any>(this.notificacionesURL + `update/${id}`, body)
    .pipe(tap(() => this._refresh$.next()));
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.notificacionesURL + `delete/${id}`, {});
}

public uploadPdf(efectorId: number, file: File, notificacionDto: any): Observable<any> {
  const formData = new FormData();
  formData.append('pdf', file, file.name);

  const isYMD = (v: any) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
  const toYMD = (v: any) => {
    if (!v) return null;
    if (isYMD(v)) return v;
    const d = v instanceof Date ? v : new Date(v);
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  };

  const dto = { ...notificacionDto };
  dto.fechaNotificacion = toYMD(dto.fechaNotificacion);
  dto.fechaBaja = dto.fechaBaja ? toYMD(dto.fechaBaja) : null;

  // DEBUG
  console.log('[UPLOAD PDF] efectorId:', efectorId);
  console.log('[UPLOAD PDF] DTO final:', dto);
  console.log('[UPLOAD PDF] Archivo -> name:', file.name, 'type:', file.type, 'size:', file.size);

  formData.append('notificacion', JSON.stringify(dto));

  return this.httpClient
    .post<any>(this.notificacionesURL + `uploadPdf/${efectorId}`, formData)
    .pipe(tap(() => this._refresh$.next()));
}

public uploadPdfMultiple(efectores: number[], file: File, notificacionDto: any): Observable<any[]> {
  const calls = efectores.map(id => this.uploadPdf(id, file, notificacionDto));
  return forkJoin(calls);
}

}