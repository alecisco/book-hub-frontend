import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { LoanService } from '../services/loan/loan.service';
import { NotificationCenterComponent } from '../core/notification-center/notification-center.component';
import { Subscription } from 'rxjs';
import { ChatService } from '../services/chat/chat.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  pendingRequestsCount = 0;
  unreadMessageCount: number = 0;
  isLoggedIn = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private loanService: LoanService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.isLoggedIn.subscribe(status => {
        this.isLoggedIn = status;
        if (status) {
          this.getUnreadMessageCount();
        }
      })
    );

    this.subscriptions.push(
      this.chatService.unreadMessageCount$.subscribe(count => {
        this.unreadMessageCount = count;
      })
    );

    this.loadPendingRequestsCount();

    this.chatService.addReceiveMessageListener((user, message, conversationId) => {
      const currentUser = this.authService.getUser();
      if (currentUser && user !== currentUser.nickname) {
        this.getUnreadMessageCount();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
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
      this.getUnreadMessageCount();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  getUnreadMessageCount(): void {
    this.chatService.getUnreadMessageCount().subscribe({
      next: (count) => {
        this.unreadMessageCount = count;
      },
      error: (error) => {
        console.error('Error fetching unread message count', error);
      }
    });
  }
}
