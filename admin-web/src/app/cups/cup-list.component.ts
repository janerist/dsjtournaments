import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {CupService} from './cup.service';
import {CupResponseModel} from './cup-models';
import {map} from 'rxjs/operators';

@Component({
  templateUrl: './cup-list.component.html'
})
export class CupListComponent implements OnInit {
  cups$: Observable<CupResponseModel[]>;

  constructor(private cupService: CupService) {
  }

  ngOnInit() {
    this.cups$ = this.cupService.getCups().pipe(map(pagedResponse => pagedResponse.data));
  }
}
