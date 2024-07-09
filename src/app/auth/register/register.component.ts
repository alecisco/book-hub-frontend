import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MustMatch } from 'src/app/helpers/must-match.validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  genres = [
    { genreId: 1, name: 'Fantasia' },
    { genreId: 2, name: 'Fantascienza' },
    { genreId: 3, name: 'Giallo' },
    { genreId: 4, name: 'Thriller' },
    { genreId: 5, name: 'Storico' }
  ];

  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar, private router: Router) {
    this.registerForm = this.fb.group({
      nickname: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      community: [''],
      favoriteGenres: [[]]  
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  ngOnInit(): void {}

  onRegister(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.snackBar.open('Registrazione avvenuta con successo', 'Chiudi', { duration: 3000 });
          this.router.navigate(['/my-library']);
        },
        error: (error) => {
          if (error.status === 400 && error.error && error.error.Nickname) {
            this.snackBar.open(error.error.Nickname[0], 'Chiudi', { duration: 3000 });
          } else {
            this.snackBar.open('Errore durante la registrazione', 'Chiudi', { duration: 3000 });
          }
        }
      });
    } else {
      this.snackBar.open('Form non valido, correggi gli errori', 'Close', {
        duration: 3000,
        panelClass: ['red-snackbar']
      });
      console.log('Form non valido', this.registerForm.errors);
    }
  }
}
