import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {AuthService} from '../common/services/auth.service';

@Component({
  selector: 'dsjt-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private httpClient: HttpClient, private authService: AuthService, private router: Router) {
  }

  form: FormGroup | undefined;
  errorMessage = '';

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
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
      await this.httpClient.post(`${environment.apiUrl}/account/login`, this.form.value).toPromise();
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
