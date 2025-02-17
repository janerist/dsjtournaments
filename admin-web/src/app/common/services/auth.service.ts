import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';

interface UserSession {
  username: string;
  expireIn: number;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  isLoggedIn = false;
  user: UserSession | undefined;

  async loadUser() {
    try {
      this.user = await lastValueFrom(this.httpClient.get<UserSession>(`${environment.apiUrl}/account/user`));
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
    await lastValueFrom(this.httpClient.post(`${environment.apiUrl}/account/logout`, {}));
    this.isLoggedIn = false;
    void this.router.navigate(['/login']);
  }
}
