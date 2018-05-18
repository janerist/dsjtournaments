import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

// Rewrites the response body to the value of the 'data' property, if it exists.
@Injectable()
export class DataInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        map(event => {
          if (event instanceof HttpResponse && event.body && event.body.data) {
            return event.clone({body: event.body.data});
          } else {
            return event;
          }
        })
      );
  }
}
