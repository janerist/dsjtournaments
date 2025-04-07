import {Component, inject, input} from '@angular/core';
import {CupRankingsResponseModel, PagedResponse} from '../../shared/api-responses';
import {httpResource} from '@angular/common/http';
import {CupService} from './cup.service';
import {PaginationComponent} from '../../shared/components/pagination.component';
import {CupRankingsTableComponent} from './cup-rankings-table.component';
import {toHttpParams} from '../../util/http-utils';

@Component({
  selector: 'app-cup-rankings',
  imports: [
    PaginationComponent,
    CupRankingsTableComponent
  ],
  template: `
    @if (rankingsResource.value(); as rankingPage) {
      <app-pagination [page]="rankingPage.page"
                      [pageSize]="rankingPage.pageSize"
                      [totalCount]="rankingPage.totalCount">
      </app-pagination>

      <app-cup-rankings-table [rankings]="rankingPage.data"
                              [dates]="cupService.cup()?.dates">
      </app-cup-rankings-table>

      <app-pagination [page]="rankingPage.page"
                      [pageSize]="rankingPage.pageSize"
                      [totalCount]="rankingPage.totalCount">
      </app-pagination>
    }
  `
})
export class CupRankingsComponent {
  page = input<number>();
  cupService = inject(CupService);

  rankingsResource = httpResource<PagedResponse<CupRankingsResponseModel>>(() => ({
    url: `/cups/${this.cupService.cup()?.id}/rankings`,
    params: toHttpParams({page: this.page()})
  }));
}
