import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from 'src/app/services/chat/chat.service';
import { UserService } from 'src/app/services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StartConversationDto } from 'src/app/models/conversation.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-conversation',
  templateUrl: './start-conversation.component.html',
  styleUrls: ['./start-conversation.component.css']
})
export class StartConversationComponent {
  startConversationForm: FormGroup;
  userId!: string; 

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.startConversationForm = this.fb.group({
      receiverNickname: ['', Validators.required]
    });

    this.userService.user$.subscribe(user => {
      if (user) {
        this.userId = user.userId;
      }
    });
  }

  onSubmit(): void {
    if (this.startConversationForm.valid) {
      const conversationData: StartConversationDto = {
        initiatorUserId: this.userId, 
        receiverNickname: this.startConversationForm.get('receiverNickname')?.value
      };

      this.chatService.startConversation(conversationData).subscribe({
        next: (conversation) => {
          this.snackBar.open('Conversazione iniziata con successo', 'Chiudi', { duration: 3000 });
          this.router.navigate(['/conversation', conversation.id]);
        },
        error: (error) => {
          this.snackBar.open('Errore nell\'inizio della conversazione: ' + error.error, 'Chiudi', { duration: 3000 });
        }
      });
    }
  }
}
