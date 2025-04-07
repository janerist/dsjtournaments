import {Directive, ElementRef, input, effect} from '@angular/core';
import {iso3toiso2} from '../country-codes';

@Directive({
    selector: '[appFlag]'
})
export class FlagDirective {
  appFlag = input.required<string>();

  constructor(private el: ElementRef) {
    effect(() => {
      this.el.nativeElement.className = `${iso3toiso2[this.appFlag()]} flag`;
    });
  }
}
