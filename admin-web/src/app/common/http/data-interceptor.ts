import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

// Rewrites the response body to the value of the 'data' property, if it exists.
@Injectable()
export class DataInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
    return next.handle(req).map(event => {
      if (event instanceof HttpResponse && event.body && event.body.data) {
        return event.clone({body: event.body.data});
      } else {
        return event;
      }
    });
  }
}
