import {Directive, effect, ElementRef, input} from '@angular/core';

@Directive({
    selector: '[appGravatar]'
})
export class GravatarDirective{
  appGravatar = input.required<string>();

  constructor(private el: ElementRef) {
    effect(() => {
      this.el.nativeElement.className = 'ui circular bordered image';
      this.el.nativeElement.src = `https://www.gravatar.com/avatar/${this.appGravatar()}`;
    });
  }
}
