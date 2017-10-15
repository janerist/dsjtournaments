import {Injectable} from '@angular/core';
import {TokenResponseModel} from '../../login/login-models';
import {StorageService, TOKEN_STORAGE_KEY, USERNAME_STORAGE_KEY} from './storage.service';

@Injectable()
export class AuthService {
  isLoggedIn = false;
  username: string;
  redirectUrl: string;

  constructor(private storageService: StorageService) {
    this.isLoggedIn = !!this.accessToken;
    this.username = this.isLoggedIn ? storageService.get(USERNAME_STORAGE_KEY) : null;
  }

  get accessToken() {
    return this.storageService.get(TOKEN_STORAGE_KEY);
  }

  setAuthData(username: string, tokenResponse: TokenResponseModel) {
    this.storageService.set(TOKEN_STORAGE_KEY, tokenResponse.access_token);
    this.storageService.set(USERNAME_STORAGE_KEY, username);

    this.isLoggedIn = true;
    this.username = username;
  }

  clearAuthData() {
    this.storageService.remove(TOKEN_STORAGE_KEY);
    this.storageService.remove(USERNAME_STORAGE_KEY);
    this.isLoggedIn = false;
    this.username = null;
  }
}
