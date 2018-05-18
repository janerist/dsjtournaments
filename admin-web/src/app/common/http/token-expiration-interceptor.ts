import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {tap} from 'rxjs/operators';

@Injectable()
export class TokenExpirationInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        tap(
          () => {},
          (err: any) => {
            if (err instanceof HttpErrorResponse && err.status === 401) {
              this.authService.clearAuthData();
              this.router.navigate(['/login']);
            }
          }
        )
      );
  }
}
