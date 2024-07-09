import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MustMatch } from 'src/app/helpers/must-match.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  genres = [
    { genreId: 1, name: 'Fantasia' },
    { genreId: 2, name: 'Fantascienza' },
    { genreId: 3, name: 'Giallo' },
    { genreId: 4, name: 'Thriller' },
    { genreId: 5, name: 'Storico' }
  ];


  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar) {
    this.profileForm = this.fb.group({
      nickname: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      community: [''],
      favoriteGenres: [[]]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', Validators.required]
    }, {
      validator: MustMatch('newPassword', 'confirmNewPassword')
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.profileForm.patchValue({
          ...profile,
          favoriteGenres: profile.favoriteGenres || []
        });
      },
      error: (error) => {
        console.error('Failed to load profile', error);
      }
    });
  }

  onUpdate(): void {
    if (this.profileForm.valid) {
      this.authService.updateProfile(this.profileForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Profilo aggiornato con successo', 'Close', {
            duration: 3000,
            panelClass: ['green-snackbar']
          });
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
        error: (error) => {
          console.error('Failed to update profile', error);
          this.snackBar.open('Errore durante l\'aggiornamento del profilo, riprova più tardi', 'Close', {
            duration: 3000,
            panelClass: ['red-snackbar']
          });
        }
      });
    } else {
      console.log('Form is not valid', this.profileForm.errors);
    }
  }

  onChangePassword(): void {
    if (this.passwordForm.valid) {
      this.authService.changePassword(this.passwordForm.value).subscribe({
        next: () => {
          this.snackBar.open('Password cambiata con successo', 'Close', {
            duration: 3000,
            panelClass: ['green-snackbar']
          });
        },
        error: (error) => {
          console.error('Failed to change password', error);
          this.snackBar.open('Errore durante il cambio della password, riprova più tardi', 'Close', {
            duration: 3000,
            panelClass: ['red-snackbar']
          });
        }
      });
    } else {
      console.log('Form is not valid', this.passwordForm.errors);
    }
  }
}
