import {Injectable} from '@angular/core';
import * as toastr from 'toastr';

@Injectable({providedIn: 'root'})
export class ToastService {
  success(message: string, title = 'Success', positionClass = 'toast-bottom-right', timeOut = 2000) {
    toastr.success(message, title, {positionClass, timeOut});
  }

  error(message: string, title = 'Error', positionClass = 'toast-bottom-right') {
    toastr.error(message, title, {positionClass, timeOut: 0});
  }
}
