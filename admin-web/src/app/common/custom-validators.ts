import {UntypedFormArray, ValidatorFn} from '@angular/forms';

export class CustomValidators {
  static formArrayMinLength(minLength: number): ValidatorFn {
    return (fa: UntypedFormArray) => {
      const length = fa.controls.filter(c => !c.get('destroy').value).length;
      return length < minLength
        ? {minlength: {requiredLength: minLength, actualLength: length} }
        : null;
    };
  }
}
