import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoanedBookDto } from 'src/app/models/loanedbook';
import { CreateLoanRequestDto, LoanRequestDto } from 'src/app/models/loan-request.model';
import { LoanHistoryDto, ReviewDto } from 'src/app/models/loan-history.model';


@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private apiUrl = 'https://localhost:7160'; 

  constructor(private http: HttpClient) { }

  createLoan(loanData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`+'/loans/createLoan', loanData);
  }

  retractLoan(bookId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/loans/retractLoan/${bookId}`);
  }

  getLoanedBooks(): Observable<LoanedBookDto[]> {
    return this.http.get<LoanedBookDto[]>(`${this.apiUrl}/loans/loanedBooks`);
  }

  createLoanRequest(loanRequest: CreateLoanRequestDto): Observable<LoanRequestDto> {
    return this.http.post<LoanRequestDto>(`${this.apiUrl}/loanrequests/createLoanRequest`, loanRequest);
  }

  getLoanRequests(): Observable<LoanRequestDto[]> {
    return this.http.get<LoanRequestDto[]>(`${this.apiUrl}/loanrequests`);
  }

  acceptLoanRequest(requestId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/loanrequests/${requestId}/accept`, {});
  }

  rejectLoanRequest(requestId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/loanrequests/${requestId}/reject`, {});
  }

  concludeLoan(review: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reviews/concludeLoan`, review);
  }

  getLoanHistory(): Observable<LoanHistoryDto[]> {
    return this.http.get<LoanHistoryDto[]>(`${this.apiUrl}/loanrequests/history`);
  }

  submitReview(review: ReviewDto): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reviews/review`, review);
  }

}
