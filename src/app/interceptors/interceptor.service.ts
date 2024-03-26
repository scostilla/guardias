import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '../services/login/token.service';


/* el interceptor se pone en medio del request y del backend.
cada peticion que hace el cliente la intercepta y comprueba que haya tocken en el sesion history del navegador y se los adjunta, entonces la peticion llega con el token, el backend comprueba que es correcto */
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

  constructor(private tokenService: TokenService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let intReq = req;
    const token = this.tokenService.getToken();
    if (token != null) {
      intReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token)});
    }
    return next.handle(intReq);
  }
}

export const interceptorProvider = [{provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}];