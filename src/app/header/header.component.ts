import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { LoanService } from '../services/loan/loan.service';
import { NotificationCenterComponent } from '../core/notification-center/notification-center.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  pendingRequestsCount = 0;
  isLoggedIn = false;
  private subscription!: Subscription;

  constructor(
    private loanService: LoanService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.isLoggedIn.subscribe(status => {
      this.isLoggedIn = status;
    });
    this.loadPendingRequestsCount();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadPendingRequestsCount(): void {
    this.loanService.getLoanRequests().subscribe({
      next: (requests) => {
        this.pendingRequestsCount = requests.length;
      },
      error: (error) => {
        console.error('Error fetching loan requests count', error);
      }
    });
  }

  openNotificationCenter(): void {
    const dialogRef = this.dialog.open(NotificationCenterComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadPendingRequestsCount();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
