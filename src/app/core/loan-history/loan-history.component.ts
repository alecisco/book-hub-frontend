import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoanService } from 'src/app/services/loan/loan.service';
import { LoanHistoryDto } from 'src/app/models/loan-history.model';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-loan-history',
  templateUrl: './loan-history.component.html',
  styleUrls: ['./loan-history.component.css']
})
export class LoanHistoryComponent implements OnInit {
  @Input() userData: User | null = null;
  loanHistory: LoanHistoryDto[] = [];

  constructor(private userService: UserService, private loanService: LoanService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      this.userData = user;
      this.loadLoanHistory();
    });
  }

  loadLoanHistory(): void {
    this.loanService.getLoanHistory().subscribe({
      next: (history: LoanHistoryDto[]) => {
        this.loanHistory = history;
      },
      error: (error: any) => {
        console.error('Error fetching loan history', error);
      }
    });
  }

  openReviewDialog(loan: LoanHistoryDto,  actionType: string): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '400px',
      data: { loanRequestId: loan.loanRequestId, userId: this.userData?.userId, actionType  }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadLoanHistory();
      }
    });
  }

  canLeaveReview(loan: LoanHistoryDto): boolean {
    if (this.userData === null) {
      console.log('User data is null');
      return false;
    }

    const isBorrower = loan.borrowerName === this.userData.nickname;
    const isLender = loan.lenderName === this.userData.nickname;

    if (isBorrower && loan.borrowerReview === null) {
      return true;
    }

    if (isLender && loan.lenderReview === null) {
      return true;
    }

    return false;
  }
}
