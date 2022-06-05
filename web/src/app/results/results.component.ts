import {Component, OnInit} from '@angular/core';
import {CupStandingResponseModel, PagedResponse, ResultResponseModel, TournamentTypeWithCount} from '../shared/api-responses';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {filter, switchMap, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-results',
  template: `
    <p>
      Here you can aggregate results from tournaments to create custom result tables of your choice.
    </p>

    <app-results-filter
      *ngIf="types$ | async, let types"
      [types]="types"
      (filter)="handleFilter($event)">
    </app-results-filter>

    <div *ngIf="standingPages$ | async, let standingPage">
      <app-pagination [page]="standingPage.page"
                      [pageSize]="standingPage.pageSize"
                      [totalCount]="standingPage.totalCount">
      </app-pagination>

      <app-results-table *ngIf="standingPage.data.length"
                               [standings]="standingPage.data"
                               [rankMethod]="rankMethod">
      </app-results-table>

      <app-pagination [page]="standingPage.page"
                      [pageSize]="standingPage.pageSize"
                      [totalCount]="standingPage.totalCount">
      </app-pagination>

      <p *ngIf="!standingPage.data.length">
        No tournaments match the specified filter.
      </p>
    </div>
  `
})
export class ResultsComponent implements OnInit {
  types$?: Observable<TournamentTypeWithCount[]>;
  standingPages$?: Observable<PagedResponse<ResultResponseModel>>;
  rankMethod?: string;

  constructor(private route: ActivatedRoute, private router: Router, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.types$ = this.httpClient
      .get<TournamentTypeWithCount[]>(`${environment.apiUrl}/tournaments/typeswithcount`);

    this.standingPages$ = this.route.queryParamMap.pipe(
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
  }

  handleFilter(data: GetResultsRequestModel) {
    this.router.navigate(['./'], {
      queryParams: {...data, submitted: true, page: 1},
      relativeTo: this.route
    });
  }
}

interface GetResultsRequestModel {
  gameVersion: number;
  type?: number;
  dateFrom?: string;
  dateTo?: string;
  rankMethod: string;
}
