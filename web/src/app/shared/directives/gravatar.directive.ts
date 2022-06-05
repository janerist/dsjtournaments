import {Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appGravatar]'
})
export class GravatarDirective implements OnChanges {
  @Input() appGravatar!: string;
  constructor(private el: ElementRef) {

  }
  ngOnChanges({appGravatar}: SimpleChanges) {
    this.el.nativeElement.className = 'ui circular bordered image';
    this.el.nativeElement.src = `https://www.gravatar.com/avatar/` + appGravatar.currentValue;
  }
}
