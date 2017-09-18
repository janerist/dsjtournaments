import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Http, Headers, Response} from '@angular/http';
import {TokenResponseModel} from '../../login/login-models';
import {StorageService, TOKEN_STORAGE_KEY, USERNAME_STORAGE_KEY} from './storage.service';

@Injectable()
export class AuthService {
  isLoggedIn = false;
  username: string;
  redirectUrl: string;

  constructor(private http: Http, private storageService: StorageService) {
    this.isLoggedIn = !!this.accessToken;
    this.username = this.isLoggedIn ? storageService.get(USERNAME_STORAGE_KEY) : null;
  }

  get accessToken() {
    return this.storageService.get(TOKEN_STORAGE_KEY);
  }

  login(username: string, password: string): Promise<string> {
    const body = `client_id=admin&grant_type=password&scope=dsjt&username=${username}&password=${password}`;

    const headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return new Promise((resolve, reject) => {
      this.http
        .post(`${environment.apiUrl}/id/connect/token`, body, { headers: headers})
        .map(res => res.json())
        .subscribe(
          (res: TokenResponseModel) => {
            this.setAuthData(username, res);
            resolve(this.redirectUrl || '/');
          },
          (err: Response) => {
            reject(err.json().error_description);
          }, () => this.redirectUrl = null);
    });
  }

  logout() {
    if (!this.isLoggedIn) {
      return;
    }

    this.clearAuthData();
  }

  private setAuthData(username: string, tokenResponse: TokenResponseModel) {
    this.storageService.set(TOKEN_STORAGE_KEY, tokenResponse.access_token);
    this.storageService.set(USERNAME_STORAGE_KEY, username);

    this.isLoggedIn = true;
    this.username = username;
  }

  private clearAuthData() {
    this.storageService.remove(TOKEN_STORAGE_KEY);
    this.isLoggedIn = false;
    this.username = null;
  }
}
