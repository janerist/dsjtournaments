import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter, withComponentInputBinding, withRouterConfig} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {apiUrlPrefixInterceptor} from './util/api-url-prefix-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes, withRouterConfig({paramsInheritanceStrategy: 'always'}), withComponentInputBinding()),
    provideHttpClient(withInterceptors([apiUrlPrefixInterceptor]))]
};
