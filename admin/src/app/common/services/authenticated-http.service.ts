import { Injectable } from '@angular/core';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import {Router} from '@angular/router';
import {StorageService, TOKEN_STORAGE_KEY} from './storage.service';

@Injectable()
export class AuthenticatedHttpService extends Http {

  constructor(
    backend: XHRBackend,
    defaultOptions: RequestOptions,
    private router: Router,
    private storageService: StorageService) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    if (url instanceof Request) {
      const accessToken = this.storageService.get(TOKEN_STORAGE_KEY);
      if (accessToken) {
        (<Request>url).headers.set('Authorization', `Bearer ${accessToken}`);
      }
    }

    return super.request(url, options).catch((error: Response) => {
      if ((error.status === 401 || error.status === 403) && (window.location.href.match(/\?/g) || []).length < 2) {
        this.router.navigate(['/logout']);
      }
      return Observable.throw(error);
    });
  }
}
