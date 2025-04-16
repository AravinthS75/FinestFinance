import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public apiUrl = environment.apiUrl+"api/user";

  constructor(private http: HttpClient) { }

  getUserDetails(userId: number, token: string): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
  });

  return this.http.get<User>(`${this.apiUrl}/${userId}`, { headers });
  }

  updateUserProfile(userId: number, user: User, token: string): Observable<User> {
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });
    
    return this.http.put<User>(
        `${this.apiUrl}/${userId}`,
        user,
        { headers: headers }
    );
  }

}
