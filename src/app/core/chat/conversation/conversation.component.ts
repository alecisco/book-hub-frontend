import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageDto } from 'src/app/models/conversation.model';
import { ChatService } from 'src/app/services/chat/chat.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  messages: MessageDto[] = [];
  message: string = '';
  conversationId!: number;
  userNickname!: string;
  receiverNickname!: string; // New variable to store the receiver's nickname

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.conversationId = +this.route.snapshot.paramMap.get('id')!;
    const currentUser = this.authService.getUser();
    if (currentUser) {
      this.userNickname = currentUser.nickname;
      this.loadMessages();
      this.chatService.joinConversation(this.conversationId);
      this.chatService.addReceiveMessageListener((user, message, conversationId) => {
        if (this.conversationId === conversationId) {
          this.messages.push({ senderNickname: user, text: message, timestamp: new Date() });
          this.scrollToBottom();
        }
      });
    }
  }

  loadMessages(): void {
    this.chatService.getMessages(this.conversationId).subscribe({
      next: (messages: MessageDto[]) => {
        this.messages = messages;
        this.scrollToBottom();
        if (messages.length > 0) {
          const otherMessage = messages.find(message => message.senderNickname !== this.userNickname);
          if (otherMessage) {
            this.receiverNickname = otherMessage.senderNickname;
          }
        }
      },
      error: (error: any) => {
        console.error('Error fetching messages', error);
      }
    });
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.userNickname, this.message, this.conversationId);
      this.message = '';
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error('Error scrolling to bottom', err);
      }
    }, 100);
  }

  goBack(): void {
    window.history.back();
  }
}
