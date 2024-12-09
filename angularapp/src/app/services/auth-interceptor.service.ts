import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStoreService } from './user-store.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private store: UserStoreService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.includes('/api/login') || request.url.includes('/api/register')) {
        localStorage.setItem('error',"Invalid User Credentials!!!");
        return next.handle(request);
    }

    if (this.store?.isLoggedIn()) {
        const clonedReq = request.clone({
            setHeaders: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:8080",
                "Authorization": "Bearer " + this.store.getJwtToken()
            }
        });
        localStorage.removeItem('error')
        return next.handle(clonedReq);
    }

    return next.handle(request);
  }
}
