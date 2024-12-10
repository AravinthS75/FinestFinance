import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserStoreService } from './user-store.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private store: UserStoreService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip adding JWT token for login and register requests
    if (request.url.includes('/api/login') || request.url.includes('/api/register')) {
        return next.handle(request);
    }

    // If the user is authenticated, add the Authorization header with the JWT token
    if (this.store?.isLoggedIn()) {
        const clonedReq = request.clone({
            setHeaders: {
                "Authorization": "Bearer " + this.store.getJwtToken(),
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        return next.handle(clonedReq);
    }

    return next.handle(request);
  }
}
