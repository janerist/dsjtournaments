import {Component, OnInit} from '@angular/core';
import {AuthService} from '../common/services/auth.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'dsjt-login',
  template: `
    <form class="form-signin" [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
      <h2 class="form-signin-heading">Please log in</h2>
      <div *ngIf="loginError" class="alert alert-danger">{{loginError}}</div>
      <label for="inputUsername" class="sr-only">Username</label>
      <input type="email" formControlName="username" id="inputUsername" class="form-control" placeholder="Username" autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" formControlName="password" id="inputPassword" class="form-control" placeholder="Password">
      <button class="btn btn-lg btn-primary btn-block" type="submit">Login</button>
    </form>
  `,
  styles: [`
    body {
      padding-top: 40px;
      padding-bottom: 40px;
      background-color: #eee;
    }

    .form-signin {
      max-width: 330px;
      padding: 15px;
      margin: 0 auto;
    }
    .form-signin .form-signin-heading,
    .form-signin .checkbox {
      margin-bottom: 10px;
    }
    .form-signin .checkbox {
      font-weight: normal;
    }
    .form-signin .form-control {
      position: relative;
      height: auto;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding: 10px;
      font-size: 16px;
    }
    .form-signin .form-control:focus {
      z-index: 2;
    }
    .form-signin input[type="email"] {
      margin-bottom: -1px;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }
    .form-signin input[type="password"] {
      margin-bottom: 10px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      return;
    }

    const {username, password} = this.loginForm.value;

    this.authService
      .login(username, password)
      .then(redirectUrl => {
        this.router.navigate([redirectUrl]);
      }, (err: string) => {
        this.loginError = err;
      });
  }
}
