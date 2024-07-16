import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Categoria } from 'src/app/models/Configuracion/Categoria';

@Injectable({
    providedIn: 'root'
  })
  export class CategoriaService {
  
    categoriaURL = 'http://localhost:8080/categoria/';
    private _refresh$ = new Subject<void>();
  
    constructor(private httpClient: HttpClient) { }
  
    get refresh$(){
      return this._refresh$;
    }
  
    public list(): Observable<Categoria[]> {
        return this.httpClient.get<Categoria[]>(this.categoriaURL + 'list');
    }
  
    public detail(id:number): Observable<Categoria> {
        return this.httpClient.get<Categoria>(this.categoriaURL + `detail/${id}`);
    }
  
  public save(categoria:Categoria): Observable<any> {
    return this.httpClient.post<any>(this.categoriaURL + 'create', categoria)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public update(id:number, categoria:Categoria): Observable<any> {
    return this.httpClient.put<any>(this.categoriaURL + `update/${id}`, categoria)
    .pipe(
      tap(() => {
       this._refresh$.next(); 
      })
    )
  }
  
  public delete(id:number): Observable<any> {
    return this.httpClient.put<any>(this.categoriaURL + `delete/${id}`, {});
  }
  
  }