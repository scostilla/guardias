import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { NotificacionDto } from 'src/app/dto/NotificacionDto';
import { Notificacion } from "src/app/models/Notificacion";

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  notificacionesURL = 'http://localhost:8080/notificacion/';
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

  private normalizeTipo(value: any): 'NOTIFICACION' | 'DIGESTO' {
    if (!value) return 'NOTIFICACION';
    const s = String(value).trim().toUpperCase();
    if (s.startsWith('DIGEST')) return 'DIGESTO';
    if (s.startsWith('NOTIFIC')) return 'NOTIFICACION';
    return 'NOTIFICACION';
  }

  public uploadPdf(efectorId: number, file: File, notificacionDto: any): Observable<any> {
  // Validaciones front-end (mismas que en otros lugares)
  if (efectorId === null || efectorId === undefined) {
    return throwError(() => new Error('efectorId inválido'));
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

  const isYMD = (v: any) => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
  const toYMD = (v: any) => {
    if (!v) return null;
    if (isYMD(v)) return v;
    const d = v instanceof Date ? v : new Date(v);
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  };

    const dto = { ...notificacionDto };

    // Normalizar tipo también aquí por seguridad
    if (dto && dto.tipo !== undefined) {
      dto.tipo = this.normalizeTipo(dto.tipo);
    } else {
      dto.tipo = 'NOTIFICACION';
    }

    dto.fechaNotificacion = toYMD(dto.fechaNotificacion);
    dto.fechaBaja = dto.fechaBaja ? toYMD(dto.fechaBaja) : null;

    // DEBUG: inspección del payload y FormData
    console.log('[UPLOAD PDF] efectorId:', efectorId);
    console.log('[UPLOAD PDF] DTO final (normalizado):', dto);
    console.log('[UPLOAD PDF] Archivo -> name:', file.name, 'type:', file.type, 'size:', file.size);

    formData.append('notificacion', JSON.stringify(dto));

  // Log de contenido de FormData (legible)
  try {
    const entries: any[] = [];
    formData.forEach((value, key) => {
      if (value instanceof File) {
        entries.push({ key, fileName: value.name, fileSize: value.size, fileType: value.type });
      } else {
        entries.push({ key, value });
      }
    });
    console.log('[UPLOAD PDF] FormData entries:', entries);
  } catch (e) {
    console.warn('[UPLOAD PDF] No se pudo iterar FormData para debug', e);
  }

  return this.httpClient
    .post<any>(this.notificacionesURL + `uploadPdf/${efectorId}`, formData)
    .pipe(
      tap((resp) => {
        console.log('[UPLOAD PDF] respuesta backend:', resp);
        this._refresh$.next();
      }),
      catchError((err) => {
        // Log detallado y rethrow con mensaje más claro
        console.error('[UPLOAD PDF] Error HTTP:', {
          status: err?.status,
          statusText: err?.statusText,
          url: err?.url,
          body: err?.error
        });
        // si el backend envía { mensaje: '...' } mostrable
        const serverMsg = err?.error?.mensaje || err?.error || err?.message || 'Error al subir PDF';
        return throwError(() => ({ original: err, mensaje: serverMsg }));
      })
    );
}

public uploadPdfMultiple(efectores: number[], file: File, notificacionDto: any): Observable<any[]> {
  const calls = efectores.map(id => this.uploadPdf(id, file, notificacionDto));
  return forkJoin(calls);
}

}