import { HttpInterceptorFn } from '@angular/common/http';
import {environment} from '../../environments/environment';

export const apiUrlPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  // Ensure we only modify relative URLs
  if (!req.url.startsWith('http') && !req.url.startsWith('//')) {
    const apiReq = req.clone({ url: `${environment.apiUrl}${req.url}` });
    return next(apiReq);
  }
  return next(req);
};
