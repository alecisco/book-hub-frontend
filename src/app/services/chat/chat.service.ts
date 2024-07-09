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
        this.getUnreadMessageCount().subscribe(count => {
          this.unreadMessageCountSubject.next(count);
        });
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
        .catch(err => console.log('Error while starting connection: ' + err));

      this.hubConnection.on('ReceiveMessage', () => {
        this.getUnreadMessageCount().subscribe(count => {
          this.unreadMessageCountSubject.next(count);
        });
      });
    }
  }

  private stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .catch(err => console.log('Error while stopping connection: ' + err));
      this.hubConnection = null;
    }
  }

  public addReceiveMessageListener(callback: (user: string, message: string, conversationId: number) => void): void {
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
