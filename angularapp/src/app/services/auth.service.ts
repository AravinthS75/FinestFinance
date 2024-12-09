import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { AuthUser} from '../models/auth-user.model';
import { UserStoreService } from './user-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   private backendURL: string = 'http://localhost:8080/api';

  constructor(private httpClient: HttpClient, private userStoreService: UserStoreService) {}

  signIn(user: User): Observable<AuthUser> {
    return this.httpClient.post<AuthUser>(`${this.backendURL}/login`, user);
  }

  signUp(user: User): Observable<any> {
    return this.httpClient.post(`${this.backendURL}/register`, user);
  }

  isAuthenticated(): boolean {
    return this.userStoreService.isLoggedIn();
  }
}
