import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Loan } from '../models/loan.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  public loanUrl = environment.apiUrl+"api/loans";

  public apiUrl = environment.apiUrl+"api/admin/all-managers"

  constructor(private http: HttpClient) { }

  userApplyPersonalLoan(token: string, userId: number | null, loan: Loan): Observable<Loan>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post<Loan>(
      `${this.loanUrl}/user/${userId}`, 
      loan, 
      { headers }
    );
  }

  adminSetAssignedManager(token: string, userId: number | null, loanId: number | null, managerId: number | null): Observable<Loan>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    
    return this.http.put<Loan>(
      `${this.loanUrl}/assign-manager/${userId}/${loanId}/${managerId}`,
      null,
      { headers }
    );
  }

  getAllManagers(token: string): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.apiUrl}`, { headers });
  }

  getLoansByUserId(token: string, userId: number): Observable<Loan[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Loan[]>(`${this.loanUrl}/user/${userId}`, { headers });
  }

  payEmi(token: string, loanId: number): Observable<Loan> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<Loan>(`${this.loanUrl}/pay-emi/${loanId}`, null, { headers });
  }
  
}
