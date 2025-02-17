import {Component, inject} from '@angular/core';
import {PagedResponse, ResultResponseModel, TournamentTypeWithCount} from '../shared/api-responses';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {filter, switchMap, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {PaginationComponent} from '../shared/components/pagination.component';
import {AsyncPipe} from '@angular/common';
import {ResultsFilterComponent} from './results-filter.component';
import {ResultsTableComponent} from './results-table.component';

interface GetResultsRequestModel {
  gameVersion: number;
  type?: number;
  dateFrom?: string;
  dateTo?: string;
  rankMethod: string;
}

@Component({
  selector: 'app-results',
  imports: [
    PaginationComponent,
    AsyncPipe,
    ResultsFilterComponent,
    ResultsTableComponent
  ],
  template: `
    <p>
      Here you can aggregate results from tournaments to create custom result tables of your choice.
    </p>

    @if (types$ | async; as types) {
      <app-results-filter [types]="types" (filter)="handleFilter($event)">
      </app-results-filter>
    }

    @if (standingPages$ | async; as standingPage) {
      <app-pagination [page]="standingPage.page"
                      [pageSize]="standingPage.pageSize"
                      [totalCount]="standingPage.totalCount">
      </app-pagination>

      @if (standingPage.data.length) {
        <app-results-table [standings]="standingPage.data"
                           [rankMethod]="rankMethod">
        </app-results-table>
      }

      <app-pagination [page]="standingPage.page"
                      [pageSize]="standingPage.pageSize"
                      [totalCount]="standingPage.totalCount">
      </app-pagination>

      @if (!standingPage.data.length) {
        <p>
          No tournaments match the specified filter.
        </p>
      }
    }
  `
})
export class ResultsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private httpClient = inject(HttpClient);

  types$ = this.httpClient.get<TournamentTypeWithCount[]>(`${environment.apiUrl}/tournaments/typeswithcount`);

  standingPages$ = this.route.queryParamMap.pipe(
    filter(qparams => !!qparams.get('submitted')),
    tap(qparams => this.rankMethod = qparams.get('rankMethod') || 'jump_points'),
    switchMap(qparams =>
      this.httpClient.get<PagedResponse<ResultResponseModel>>(`${environment.apiUrl}/results`, {
        params: new HttpParams()
          .set('gameVersion', qparams.get('gameVersion') || '')
          .set('rankMethod', qparams.get('rankMethod') || '')
          .set('type', qparams.get('type') || '')
          .set('dateFrom', qparams.get('dateFrom') || '')
          .set('dateTo', qparams.get('dateTo') || '')
          .set('page', qparams.get('page') || '1')
      }))
  );

  rankMethod?: string;

  handleFilter(data: GetResultsRequestModel) {
    void this.router.navigate(['./'], {
      queryParams: {...data, submitted: true, page: 1},
      relativeTo: this.route
    });
  }
}
