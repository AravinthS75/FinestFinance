import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Loan } from '../models/loan.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  public apiUrl = "https://finestfinance-backendend.onrender.com/api/admin";
  public loanUrl = "https://finestfinance-backendend.onrender.com/api/loans";

  constructor(private http: HttpClient) { }

  getAllAssignedLoans(token: string, approverName: string): Observable<Loan[]> {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
      });
    
      return this.http.get<Loan[]>(`${this.loanUrl}/manager/${approverName}`, { headers });
  }


  updateLoanStatus(token: string, loanId: number, status: string, reason: string): Observable<Loan> {
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    });

    const JSONstatus = {
        status: status,
        rejectReason: reason
    };

    return this.http.patch<Loan>(`${this.loanUrl}/manager/${loanId}/status`, JSONstatus, { headers });
  }

  getAllUsers(token: string): Observable<User[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
  });

  return this.http.get<User[]>(`${this.apiUrl}/all-users`, { headers });
  }

  
}
