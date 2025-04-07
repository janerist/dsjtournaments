import { HttpParams } from '@angular/common/http';

type HttpParamValue = string | number | boolean | string[] | number[] | boolean[] | null | undefined;

export function toHttpParams(params: Record<string, HttpParamValue>): HttpParams {
  let httpParams = new HttpParams();

  Object.keys(params).forEach((key) => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(val => httpParams = httpParams.append(key, val));
      } else {
        httpParams = httpParams.set(key, value);
      }
    }
  });

  return httpParams;
}
