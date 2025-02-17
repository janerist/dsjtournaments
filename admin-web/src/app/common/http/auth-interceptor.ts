import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private router = inject(Router);
  private authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes('/account/') && !this.authService.isLoggedIn) {
      console.log('redirecting to login from auth interceptor');
      this.authService.login(this.router.url);
      return of();
    }

    const authReq = req.clone({
      withCredentials: true,
      headers: new HttpHeaders({'X-CSRF': '1'})
    });

    return next.handle(authReq);
  }
}
