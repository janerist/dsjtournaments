import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable()
export class FormService {
  markAsTouched(form: FormGroup) {
    for (let key in form.controls) {
      if (form.controls.hasOwnProperty(key)) {
        form.get(key).markAsTouched();
      }
    }
  }
}
