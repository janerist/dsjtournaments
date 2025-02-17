import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {AuthService} from '../common/services/auth.service';
import {lastValueFrom} from 'rxjs';

@Component({
  selector: 'dsjt-login',
  imports: [
    ReactiveFormsModule
  ],
  styles: `
    .login-page {
      margin-top: 60px;
      padding-bottom: 40px;
    }
  `,
  template: `
    <div class="container">
      <div class="login-page">
        <div class="row">
          <div class="col-sm-6">
            <div class="card">
              <div class="card-header">
                <h2>Login to DSJT Admin</h2>
              </div>
              <div class="card-body">
                <form [formGroup]="form" (ngSubmit)="login()">
                  <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" id="username" class="form-control" placeholder="Username" formControlName="username" autofocus/>
                  </div>
                  <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" id="password" class="form-control" placeholder="Password" formControlName="password"
                           autocomplete="off"/>
                  </div>
                  <div class="mb-3">
                    <button type="submit" class="btn btn-primary">Log in</button>
                  </div>

                  <p class="form-text text-danger" [class.visible]="errorMessage" [class.invisible]="!errorMessage">
                    {{ errorMessage }}
                  </p>

                </form>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup | undefined;
  errorMessage = '';

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      void this.router.navigate(['/']);
    }

    this.form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  async login() {
    this.errorMessage = '';

    if (!this.form.valid) {
      return;
    }

    try {
      await lastValueFrom(this.httpClient.post(`${environment.apiUrl}/account/login`, this.form.value));
      if (await this.authService.loadUser()) {
        void this.router.navigate(['/']);
      } else {
        this.errorMessage = 'Failed to load user. Try reloading the page.';
      }
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 400) {
        this.errorMessage = 'Invalid username and/or password';
      }
    }
  }
}
