import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginApiService } from '../services/login-api.service';
import { Login } from '../models/Login';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginError: string = '';
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private loginService: LoginApiService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.disableBackNavigation();
  }

  login() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
    } else {
      const login: Login = this.loginForm.value;

      this.loginError = '';
      this.loginService.validateUser(login).subscribe({
        next: (response) => {
          if (response.code === 200) {
            localStorage.setItem(
              'email',
              this.loginForm.value.email ? this.loginForm.value.email : ''
            );
            let data = JSON.stringify(response);
            localStorage.setItem('agenda', data);
            this.router.navigateByUrl('/inicio');
          } else {
            this.loginError = response.message;
          }
        },
        error: (errorData) => {
          this.loginError = errorData.error.message;
        },
      });
    }
  }

  disableBackNavigation() {
    this.location.forward();
  }
}
