import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '../services/login/token.service';
import { environment } from 'src/environments/environment.prod';


/* el interceptor se pone en medio del request y del backend.
cada peticion que hace el cliente la intercepta y comprueba que haya tocken en el sesion history del navegador y se los adjunta, entonces la peticion llega con el token, el backend comprueba que es correcto */
@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor{

  constructor(private tokenService: TokenService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let intReq = req;

    // Paso 1: Transformar la URL si contiene 'http://localhost:8080'
    if (req.url.startsWith('http://localhost:8080')) {
      const relativeUrl = req.url.replace('http://localhost:8080', environment.apiUrl);
      intReq = req.clone({ url: relativeUrl });
    }

    // Paso 2: Añadir el token de autorización según la lógica existente
    // Si la petición es al perfil del profesional → usa el professionalToken
    if (intReq.url.includes('/auth/detailPersonBasicPanel/professional')) {
      const token = this.tokenService.getProfessionalToken();
      if (token) {
        intReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
      }

    // Para todo lo demás → usa el token general
    } else {
      const token = this.tokenService.getToken();
      if (token) {
        intReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
      }
    }

    // Paso 3: Pasar la request modificada al siguiente handler
    return next.handle(intReq);
  }
}

// Exporta el provider
export const interceptorProvider = [{provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}];