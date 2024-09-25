import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ArticuloDto } from 'src/app/dto/Configuracion/ArticuloDto';
import { Articulo } from 'src/app/models/Configuracion/Articulo';

@Injectable({
    providedIn: 'root'
  })
  export class ArticuloService {
  
    articuloURL = 'http://localhost:8080/articulo/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<Articulo[]> {
        return this.httpClient.get<Articulo[]>(this.articuloURL + 'list');
    }
  
    public detail(id:number): Observable<Articulo> {
        return this.httpClient.get<Articulo>(this.articuloURL + `detail/${id}`);
    }
  
  public save(articulo:ArticuloDto): Observable<any> {
    return this.httpClient.post<any>(this.articuloURL + 'create', articulo)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, articulo:ArticuloDto): Observable<any> {
    return this.httpClient.put<any>(this.articuloURL + `update/${id}`, articulo)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.articuloURL + `delete/${id}`, {});
  }
  
  }