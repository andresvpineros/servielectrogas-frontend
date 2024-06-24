import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { LoginService } from 'src/app/services/login.service';
import { LoginRequestService } from 'src/app/shared/services/loginRequest';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginError: string = '';
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  formSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private Login: LoginRequestService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.disableBackNavigation();
  }

  // Getter method for easy access to form controls in the template
  get formControls() {
    return this.loginForm.controls;
  }
  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  login() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      alert('Error al ingresar los datos.');
    } else {
      this.loginError = '';
      this.Login.ValidateUser(
        this.loginForm.value.email,
        this.loginForm.value.password
      ).subscribe({
        next: (userData: any) => {
          if (userData.message) {
            localStorage.setItem(
              'email',
              this.loginForm.value.email ? this.loginForm.value.email : ''
            );
            let data = JSON.stringify(userData);
            localStorage.setItem('agenda', data);
            this.router.navigateByUrl('/dashboard');
          } else {
            this.loginError = 'Usuario No registrado';
          }
        },
        error: (errorData) => {
          console.error(errorData);
          this.loginError = errorData;
        },
      });
    }
  }

  disableBackNavigation() {
    this.location.forward();
  }
}
