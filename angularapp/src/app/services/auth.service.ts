import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { AuthUser } from '../models/auth-user.model';
import { UserStoreService } from './user-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendURL: string = 'https://psychic-spork-7ww59r94q67cr6jv-8080.app.github.dev/api';

  constructor(private httpClient: HttpClient, private userStoreService: UserStoreService) {}

  signIn(user: User): Observable<AuthUser> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.userStoreService.getJwtToken()}`
    });

    return this.httpClient.post<AuthUser>(`${this.backendURL}/login`, user, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  signUp(user: User): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.httpClient.post(`${this.backendURL}/register`, user, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  isAuthenticated(): boolean {
    return this.userStoreService.isLoggedIn();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }
}