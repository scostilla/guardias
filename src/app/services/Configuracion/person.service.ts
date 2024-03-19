import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Person } from "src/app/models/Configuracion/Person";

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  personsURL = 'http://localhost:8080/person/';
  private _refresh$ = new Subject<void>();

  constructor(private httpClient: HttpClient) { }

  get refresh$(){
    return this._refresh$;
  }

  public list(): Observable<Person[]> {
      return this.httpClient.get<Person[]>(this.personsURL + 'list');
  }

  public detail(id:number): Observable<Person> {
      return this.httpClient.get<Person>(this.personsURL + `detail/${id}`);
  }

  public detailmotivo(motivo:string): Observable<Person> {
    return this.httpClient.get<Person>(this.personsURL + `detailmotivo/${motivo}`);
}

public save(persons:Person): Observable<any> {
  return this.httpClient.post<any>(this.personsURL + 'create', persons)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public update(id:number, persons:Person): Observable<any> {
  return this.httpClient.put<any>(this.personsURL + `update/${id}`, persons)
  .pipe(
    tap(() => {
     this._refresh$.next(); 
    })
  )
}

public delete(id:number): Observable<any> {
  return this.httpClient.put<any>(this.personsURL + `delete/${id}`, {});
}

}
