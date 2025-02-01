import {inject, Injectable} from '@angular/core';
import { Router } from '@angular/router';
import {Profile, User, UserManager} from 'oidc-client';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

interface UserSession {
  username: string;
  expireIn: number;
}

@Injectable()
export class AuthService {
  isLoggedIn = false;
  user: UserSession | undefined;

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  async loadUser() {
    try {
      this.user = await this.httpClient.get<UserSession>(`${environment.apiUrl}/account/user`).toPromise();
      this.isLoggedIn = true;

      setTimeout(() => this.isLoggedIn = false, this.user.expireIn * 1000);

      return true;
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Not logged in
        return false;
      }

      throw error;
    }
  }

  login(returnUrl = '/') {
    sessionStorage.setItem('returnUrl', returnUrl);
    void this.router.navigate(['/login']);
  }

  async logout() {
    await this.httpClient.post(`${environment.apiUrl}/account/logout`, {}).toPromise();
    this.isLoggedIn = false;
    void this.router.navigate(['/']);
  }
}
