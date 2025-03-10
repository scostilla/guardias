import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TipoLicenciaDto } from 'src/app/dto/Configuracion/TipoLicenciaDto';
import { TipoLicencia } from 'src/app/models/Configuracion/TipoLicencia';


@Injectable({
    providedIn: 'root'
    })
    export class TipoLicenciaService {

    tipoLicenciaURL = 'http://localhost:8080/tipoLicencia/';
    private _refresh$ = new Subject<void>();

    constructor (private httpClient: HttpClient) { }

    get refresh$() {
        return this._refresh$;
    }

    public list(): Observable<TipoLicencia[]> {
        return this.httpClient.get<TipoLicencia[]>(this.tipoLicenciaURL + 'list')
    }

    public detail(id: number): Observable<TipoLicencia> {
        return this.httpClient.get<TipoLicencia>(this.tipoLicenciaURL + `detail/${id}`);
    }

    public save(tipoLicencia: TipoLicenciaDto): Observable<any> {
        return this.httpClient.post<any>(this.tipoLicenciaURL + 'create', tipoLicencia)
        .pipe(
            tap(() => {
                this._refresh$.next();
            })
        )
    }

    public update(id: number, tipoLicencia: TipoLicenciaDto): Observable<any> {
        return this.httpClient.put<any>(this.tipoLicenciaURL + `update/${id}`, tipoLicencia)
        .pipe(
            tap(() => {
                this._refresh$.next();
            })
        )
    }

    public delete(id: number): Observable<any> {
        return this.httpClient.put<any>(this.tipoLicenciaURL + `delete/${id}`, {});
    }

    }



