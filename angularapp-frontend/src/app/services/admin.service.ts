import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { Loan } from '../models/loan.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public apiUrl = "https://finestfinance-backendend.onrender.com/api/admin";

  public loanUrl = "https://finestfinance-backendend.onrender.com/api/loans"

  constructor(private http: HttpClient) { }

    getAllUsers(token: string): Observable<User[]> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });
  
    return this.http.get<User[]>(`${this.apiUrl}/all-users`, { headers });
    }
  
    getAllManagers(token: string): Observable<User[]> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });
  
    return this.http.get<User[]>(`${this.apiUrl}/all-managers`, { headers });
    }

    getAllLoans(token: string): Observable<Loan[]> {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });
  
    return this.http.get<Loan[]>(`${this.loanUrl}`, { headers });
    }

    getManagerAssignedLoan(token: string, managerName: string): Observable<Loan[]>{
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });
  
      return this.http.get<Loan[]>(`${this.loanUrl}/manager/${managerName}`, { headers });
    }

    getUserById(token: string, userId: number): Observable<User>{
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });

      return this.http.get<User>(`${this.loanUrl}/user/${userId}`, { headers });
    }

  }
