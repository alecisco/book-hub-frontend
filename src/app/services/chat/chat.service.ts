import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ConversationDto, MessageDto, StartConversationDto } from 'src/app/models/conversation.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection: signalR.HubConnection | null = null;
  private apiUrl = 'https://localhost:7160/chat';
  private unreadMessageCountSubject = new BehaviorSubject<number>(0);
  public unreadMessageCount$ = this.unreadMessageCountSubject.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.authChanged.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.startConnection();
      } else {
        this.stopConnection();
      }
    });
  }

  private startConnection(): void {
    if (!this.hubConnection) {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:7160/chatHub', {
          accessTokenFactory: () => this.authService.getToken()
        })
        .build();

      this.hubConnection.start()
        .then(() => {
          console.log('Connection started successfully');
          this.registerReceiveMessageListener();
          this.joinAllConversations();
          this.getUnreadMessageCount().subscribe(count => {
            this.unreadMessageCountSubject.next(count);
          });
        })
        .catch(err => console.log('Error while starting connection: ' + err));
    } else {
      console.log('Connection already exists');
    }
  }

  private stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => {
          console.log('Connection stopped successfully');
        })
        .catch(err => console.log('Error while stopping connection: ' + err));
      this.hubConnection = null;
    }
  }

  private registerReceiveMessageListener(): void {
    if (this.hubConnection) {
      this.hubConnection.on('ReceiveMessage', (user, message, conversationId) => {
        console.log('ReceiveMessage event triggered:', { user, message, conversationId });
        this.getUnreadMessageCount().subscribe(count => {
          this.unreadMessageCountSubject.next(count);
        });
      });
    } else {
      console.log('HubConnection is not established.');
    }
  }

  private joinAllConversations(): void {
    this.getConversations().subscribe(conversations => {
      conversations.forEach(conversation => {
        this.joinConversation(conversation.id);
      });
    });
  }

  public addReceiveMessageListener(callback: (user: string, message: string, conversationId: number) => void): void {
    this.registerReceiveMessageListener();
    this.hubConnection?.on('ReceiveMessage', callback);
  }

  public sendMessage(user: string, message: string, conversationId: number): void {
    this.hubConnection?.invoke('SendMessage', user, message, conversationId)
      .catch(err => console.error('Error sending message:', err));
  }

  public joinConversation(conversationId: number): void {
    this.hubConnection?.invoke('JoinConversation', conversationId)
      .catch(err => console.error('Error joining conversation:', err));
  }

  public startConversation(conversation: StartConversationDto): Observable<ConversationDto> {
    return this.http.post<ConversationDto>(`${this.apiUrl}/start`, conversation);
  }

  public getConversations(): Observable<ConversationDto[]> {
    return this.http.get<ConversationDto[]>(`${this.apiUrl}/conversations`);
  }

  public getMessages(conversationId: number): Observable<MessageDto[]> {
    return this.http.get<MessageDto[]>(`${this.apiUrl}/conversations/${conversationId}/messages`);
  }

  public getUnreadMessageCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count`);
  }

  public isConnected(): boolean {
    return this.hubConnection !== null && this.hubConnection.state === signalR.HubConnectionState.Connected;
  }
}
