import {Component, input} from '@angular/core';
import {PagedResponse, TournamentResponseModel, TournamentTypeWithCount} from '../../shared/api-responses';
import {httpResource} from '@angular/common/http';
import {PaginationComponent} from '../../shared/components/pagination.component';
import {TournamentListComponent} from './tournament-list.component';
import {TournamentTypesComponent} from './tournament-types.component';
import {TournamentMonthSelectComponent} from './tournament-month-select.component';
import {TournamentSortComponent} from './tournament-sort.component';
import {toHttpParams} from '../../util/http-utils';

@Component({
  selector: 'app-tournaments',
  imports: [
    PaginationComponent,
    TournamentListComponent,
    TournamentTypesComponent,
    TournamentMonthSelectComponent,
    TournamentSortComponent
  ],
  template: `
    @if (tournamentPages.value(); as tournamentPage) {
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
            @if (typesWithCount.value(); as typesWithCount) {
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
  type = input<string[]>();
  startDate = input<string>();
  endDate = input<string>();
  sort = input<string>();
  page = input<number>();

  tournamentPages = httpResource<PagedResponse<TournamentResponseModel>>(() => ({
    url: '/tournaments',
    params: toHttpParams({
      type: this.type(),
      startDate: this.startDate(),
      endDate: this.endDate(),
      sort: this.sort(),
      page: this.page(),
    })
  }));

  typesWithCount = httpResource<TournamentTypeWithCount[]>('/tournaments/typeswithcount');
}
