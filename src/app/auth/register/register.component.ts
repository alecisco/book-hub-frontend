import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup =this.fb.group({
    nickname: ['', [Validators.required]],
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    community: ['']  // Optional
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    }
  }
}
