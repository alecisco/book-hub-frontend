import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat/chat.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  conversations: any[] = [];
  unreadMessageCount: number = 0;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        if (!this.chatService.isConnected()) {
          this.chatService['startConnection']();
        }
        this.loadConversations();
        //this.loadUnreadMessageCount();
      } else {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  private loadConversations(): void {
    this.chatService.getConversations().subscribe({
      next: (conversations) => {
        this.conversations = conversations;
      },
      error: (error) => {
        console.error('Error loading conversations', error);
      }
    });
  }

  /*private loadUnreadMessageCount(): void {
    this.chatService.getUnreadMessageCount().subscribe({
      next: (count) => {
        this.unreadMessageCount = count;
      },
      error: (error) => {
        console.error('Error loading unread message count', error);
      }
    });
  }*/

  openConversation(conversationId: number): void {
    this.router.navigate(['/conversation', conversationId]);
  }
}
