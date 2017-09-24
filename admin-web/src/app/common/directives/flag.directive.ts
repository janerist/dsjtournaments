import {Input, Directive, ElementRef, OnChanges, SimpleChanges} from '@angular/core';
import {iso3toiso2} from '../country-codes';

@Directive({
  selector: '[dsjtFlag]'
})
export class FlagDirective implements OnChanges {
  @Input('dsjtFlag') countryCode: string;

  constructor(private el: ElementRef) {
  }

  ngOnChanges({countryCode}: SimpleChanges) {
    this.el.nativeElement.className = `flag-icon flag-icon-${iso3toiso2[countryCode.currentValue]}`;
  }
}
