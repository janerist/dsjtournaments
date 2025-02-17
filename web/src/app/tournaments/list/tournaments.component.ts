import {Component, inject} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {PagedResponse, TournamentResponseModel, TournamentTypeWithCount} from '../../shared/api-responses';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {switchMap} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {PaginationComponent} from '../../shared/components/pagination.component';
import {TournamentListComponent} from './tournament-list.component';
import {TournamentTypesComponent} from './tournament-types.component';
import {TournamentMonthSelectComponent} from './tournament-month-select.component';
import {TournamentSortComponent} from './tournament-sort.component';

@Component({
  selector: 'app-tournaments',
  imports: [
    AsyncPipe,
    PaginationComponent,
    TournamentListComponent,
    TournamentTypesComponent,
    TournamentMonthSelectComponent,
    TournamentSortComponent
  ],
  template: `
    @if (tournamentPages$ | async; as tournamentPage) {
      <div class="ui stackable two column grid">
        <div class="twelve wide column">
          <app-tournament-list [tournaments]="tournamentPage.data"></app-tournament-list>

          <app-pagination [page]="tournamentPage.page"
                          [pageSize]="tournamentPage.pageSize"
                          [totalCount]="tournamentPage.totalCount">
          </app-pagination>
        </div>
        <div class="four wide column">
          <div class="ui segment">
            @if (typesWithCount$ | async; as typesWithCount) {
              <app-tournament-types [types]="typesWithCount"></app-tournament-types>
            }
          </div>
          <div class="ui segment">
            <app-tournament-month-select></app-tournament-month-select>
          </div>
          <div class="ui segment">
            <app-tournament-sort></app-tournament-sort>
          </div>
        </div>
      </div>
    }
  `
})
export class TournamentsComponent {
  private route = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);

  tournamentPages$ = this.route.queryParamMap
    .pipe(
      switchMap(params =>
        this.httpClient.get<PagedResponse<TournamentResponseModel>>(`${environment.apiUrl}/tournaments`, {
          params: this.toHttpParams(params)
        }))
    );
  typesWithCount$ = this.httpClient.get<TournamentTypeWithCount[]>(`${environment.apiUrl}/tournaments/typeswithcount`);

  private toHttpParams(params: ParamMap): HttpParams {
    const types = params.getAll('type');
    const startDate = params.get('startDate');
    const endDate = params.get('endDate');
    const sort = params.get('sort');
    const page = params.get('page');

    let httpParams = new HttpParams();

    for (const type of types) {
      httpParams = httpParams.append('type', type);
    }
    if (startDate) {
      httpParams = httpParams.set('startDate', startDate);
    }
    if (endDate) {
      httpParams = httpParams.set('endDate', endDate);
    }
    if (sort) {
      httpParams = httpParams.set('sort', sort);
    }
    if (page) {
      httpParams = httpParams.set('page', page);
    }

    return httpParams;
  }
}
