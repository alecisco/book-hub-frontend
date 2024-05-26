import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar, private router: Router) {}

  ngOnInit() {
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        success => {
          this.router.navigate(['/home']);
        },
        error => {
          console.error('Login Failed', error);
          this.snackBar.open('Errore - username o password non validi', 'Close', {
            duration: 3000,
            panelClass: ['red-snackbar']
          });
        }
      );
    } else {
      console.log('Form is not valid', this.loginForm.errors);
      // TODO impostare una logica per mostrare gli errori nel template
    }
  }
}
