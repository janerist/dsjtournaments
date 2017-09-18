import {Injectable} from '@angular/core';

@Injectable()
export class ToastService {
  success(message: string, title = 'Success', positionClass = 'toast-bottom-right', timeOut = 2000) {
    toastr.success(message, title, {positionClass: positionClass, timeOut: timeOut});
  }

  error(message: string, title = 'Error', positionClass = 'toast-bottom-right') {
    toastr.error(message, title, {positionClass: positionClass, timeOut: 0});
  }
}
