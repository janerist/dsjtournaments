import {Injectable} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

@Injectable({providedIn: 'root'})
export class FormService {
  markAsTouched(form: UntypedFormGroup) {
    for (const key in form.controls) {
      if (form.controls.hasOwnProperty(key)) {
        form.get(key).markAsTouched();
      }
    }
  }
}
