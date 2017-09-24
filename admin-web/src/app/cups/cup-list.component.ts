import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {CupService} from './cup.service';
import {CupResponseModel} from './cup-models';

@Component({
  templateUrl: './cup-list.component.html'
})
export class CupListComponent implements OnInit {
  cups$: Observable<CupResponseModel[]>;

  constructor(private cupService: CupService) {
  }

  ngOnInit() {
    this.cups$ = this.cupService.getCups().map(pagedResponse => pagedResponse.data);
  }
}
