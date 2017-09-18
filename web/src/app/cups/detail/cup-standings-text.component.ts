import {Component, OnInit} from '@angular/core';
import {CupStandingResponseModel, PagedResponse} from '../../shared/api-responses';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-cup-standings-text',
  template: `
    <div *ngIf="standings$ | async, let standings">
      <app-cup-standings-table-text [standings]="standings"></app-cup-standings-table-text>
    </div>
  `
})
export class CupStandingsTextComponent implements OnInit {
  standings$: Observable<CupStandingResponseModel[]>;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {
  }

  ngOnInit() {
    this.standings$ = this.route.parent.params
      .switchMap(params =>
        this.httpClient
          .get<PagedResponse<CupStandingResponseModel>>(`${environment.apiUrl}/cups/${params['id']}/standings?pageSize=10000`))
      .map(pagedResponse => pagedResponse.data);
  }
}
