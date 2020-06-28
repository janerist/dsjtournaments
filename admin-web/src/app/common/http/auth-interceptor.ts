import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.authService.isAccessTokenValid) {
      this.authService.login(this.router.url);
      return of();
    }

    const acessToken = this.authService.accessToken;
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + acessToken)
    });

    return next.handle(authReq);
  }
}
