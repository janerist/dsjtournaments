import {Injectable} from '@angular/core';

export const TOKEN_STORAGE_KEY = 'dsjtAccessToken';
export const USERNAME_STORAGE_KEY = 'dsjtUsername';

@Injectable()
export class StorageService {
  get(key: string): any {
    return localStorage.getItem(key);
  }

  set(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }
}
