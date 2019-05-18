import {ErrorHandler, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocationStrategy, PathLocationStrategy} from '@angular/common';
import {environment} from '../../environments/environment';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private httpClient: HttpClient, private location: LocationStrategy) {
  }

  handleError(error: any) {
    console.error(error);

    const message = error.message || error.toString();
    const path = this.location instanceof PathLocationStrategy
      ? this.location.path()
      : '';
    const stackTrace = error.stack;

    this.httpClient.post(`${environment.apiUrl}/logs/error`, {
      clientId: 'web',
      path,
      message,
      stackTrace
    }).subscribe(
      () => console.log('Error was logged to server'),
      err => console.log('Failed to log error to server: ', err));
  }
}
