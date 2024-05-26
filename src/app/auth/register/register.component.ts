import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MustMatch } from 'src/app/helpers/must-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup =this.fb.group({
    nickname: ['', [Validators.required]],
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    community: ['']  
  },
  {
    validator: MustMatch('password', 'confirmPassword')  // Aggiungi il validatore personalizzato
  }
);

  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
        },
        error: (error) => {
          console.error('Registration failed', error);
          this.snackBar.open('Errore durante la registrazione, riprova più tardi', 'Close', {
            duration: 3000,
            panelClass: ['red-snackbar']
          });
        }
      });
    } else {
      console.log('Form is not valid', this.registerForm.errors);
    }
  }
}
