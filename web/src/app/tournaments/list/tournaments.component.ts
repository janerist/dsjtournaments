import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {PagedResponse, TournamentResponseModel, TournamentTypeWithCount} from '../../shared/api-responses';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-tournaments',
  template: `
    <div *ngIf="tournamentPages$ | async, let tournamentPage" class="ui stackable two column grid">
      <div class="twelve wide column">
        <app-tournament-list
          [tournaments]="tournamentPage.data">
        </app-tournament-list>

        <app-pagination [page]="tournamentPage.page"
                        [pageSize]="tournamentPage.pageSize"
                        [totalCount]="tournamentPage.totalCount">
        </app-pagination>
      </div>
      <div class="four wide column">
        <div class="ui segment">
          <app-tournament-types [types]="typesWithCount$"></app-tournament-types>
        </div>
        <div class="ui segment">
          <app-tournament-month-select></app-tournament-month-select>
        </div>
        <div class="ui segment">
          <app-tournament-sort></app-tournament-sort>
        </div>
      </div>
    </div>
  `
})
export class TournamentsComponent implements OnInit {
  tournamentPages$: Observable<PagedResponse<TournamentResponseModel>>;
  typesWithCount$: Observable<TournamentTypeWithCount[]>;

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.tournamentPages$ = this.route.queryParamMap
      .pipe(
        switchMap(params =>
          this.httpClient.get<PagedResponse<TournamentResponseModel>>(`${environment.apiUrl}/tournaments`, {
            params: new HttpParams()
              .set('type', params.get('type') || '')
              .set('startDate', params.get('startDate') || '')
              .set('endDate', params.get('endDate') || '')
              .set('sort', params.get('sort') || '')
              .set('page', params.get('page') || '1')
          }))
      );

    this.typesWithCount$ = this.httpClient
      .get<TournamentTypeWithCount[]>(`${environment.apiUrl}/tournaments/typeswithcount`);
  }
}
