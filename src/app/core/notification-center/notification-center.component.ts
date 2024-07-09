import { Component, OnInit } from '@angular/core';
import { LoanRequestDto } from 'src/app/models/loan-request.model';
import { LoanService } from 'src/app/services/loan/loan.service';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.css']
})
export class NotificationCenterComponent implements OnInit {
  loanRequests: LoanRequestDto[] = [];

  constructor(private loanService: LoanService) {}

  ngOnInit(): void {
    this.loadLoanRequests();
  }

  loadLoanRequests(): void {
    this.loanService.getLoanRequests().subscribe({
      next: (requests: LoanRequestDto[]) => {
        this.loanRequests = requests;
      },
      error: (error: any) => {
        console.error('Error fetching loan requests', error);
      }
    });
  }


  acceptRequest(requestId: number): void {
    this.loanService.acceptLoanRequest(requestId).subscribe({
      next: () => {
        this.loadLoanRequests();
      },
      error: (error: any) => {
        console.error('Error accepting loan request', error);
      }
    });
  }

  rejectRequest(requestId: number): void {
    this.loanService.rejectLoanRequest(requestId).subscribe({
      next: () => {
        this.loadLoanRequests();
      },
      error: (error: any) => {
        console.error('Error rejecting loan request', error);
      }
    });
  }

}
