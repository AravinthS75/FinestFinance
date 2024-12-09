import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUser } from '../models/auth-user.model';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {

  constructor(){}
  
  private userKey = 'authUser';
  
  private userSubject = new BehaviorSubject<AuthUser | null>(this.getUser());

  get userChanges(): Observable<AuthUser | null> {
    return this.userSubject.asObservable();
  }

  saveUser(authUser: AuthUser): void {
    sessionStorage.setItem(this.userKey, JSON.stringify(authUser));
    this.userSubject.next(authUser);
  }

  getUser(): AuthUser | null {
    const userString = sessionStorage.getItem(this.userKey);
    return userString ? JSON.parse(userString) : null;
  }

  getUserRole(): string | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  getUserId() : number | null{
    const user = this.getUser();
    return user ? user.userId : null; 
  }
  
  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  logout(): void {
    sessionStorage.removeItem(this.userKey);
    this.userSubject.next(null);
  }

  getJwtToken(): string | null {
    const user = this.getUser();
    return user ? user.token : null;
  }
}
