import {Component, inject, input} from '@angular/core';
import {PagedResponse, ResultResponseModel, TournamentTypeWithCount} from '../shared/api-responses';
import {httpResource} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {PaginationComponent} from '../shared/components/pagination.component';
import {ResultsFilterComponent} from './results-filter.component';
import {ResultsTableComponent} from './results-table.component';
import {toHttpParams} from '../util/http-utils';

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
    ResultsFilterComponent,
    ResultsTableComponent
  ],
  template: `
    <p>
      Here you can aggregate results from tournaments to create custom result tables of your choice.
    </p>

    @if (types.value(); as types) {
      <app-results-filter [types]="types" (filter)="handleFilter($event)">
      </app-results-filter>
    }

    @if (standingPages.value(); as standingPage) {
      <app-pagination [page]="standingPage.page"
                      [pageSize]="standingPage.pageSize"
                      [totalCount]="standingPage.totalCount">
      </app-pagination>

      @if (standingPage.data.length) {
        <app-results-table [standings]="standingPage.data"
                           [rankMethod]="rankMethod()">
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
  gameVersion = input<number>();
  rankMethod = input<string>('jumper_points');
  type = input<number>();
  dateFrom = input<string>();
  dateTo = input<string>();
  page = input<number>();
  submitted = input<boolean>();

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  types = httpResource<TournamentTypeWithCount[]>(() => '/tournaments/typeswithcount');

  standingPages = httpResource<PagedResponse<ResultResponseModel>>(() => this.submitted() ? ({
    url: '/results',
    params: toHttpParams({
      gameVersion: this.gameVersion(),
      rankMethod: this.rankMethod(),
      type: this.type(),
      dateFrom: this.dateFrom(),
      dateTo: this.dateTo(),
      page: this.page(),
    }),
  }) : undefined);

  handleFilter(data: GetResultsRequestModel) {
    void this.router.navigate(['./'], {
      queryParams: {...data, submitted: true, page: 1},
      relativeTo: this.route
    });
  }
}
