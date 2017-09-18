import {Input, Directive, ElementRef, OnChanges, SimpleChanges} from '@angular/core';
import {iso3toiso2} from '../country-codes';

@Directive({
  selector: '[appFlag]'
})
export class FlagDirective implements OnChanges {
  @Input() appFlag: string;

  constructor(private el: ElementRef) {
  }

  ngOnChanges({appFlag}: SimpleChanges) {
    this.el.nativeElement.className = `${iso3toiso2[appFlag.currentValue]} flag`;
  }
}
