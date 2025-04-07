import {Component, inject, input} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {CupStandingResponseModel, PagedResponse} from '../../shared/api-responses';
import {CupService} from './cup.service';
import {PaginationComponent} from '../../shared/components/pagination.component';
import {CupStandingsTableComponent} from './cup-standings-table.component';
import {toHttpParams} from '../../util/http-utils';

@Component({
  selector: 'app-cup-standings',
  imports: [
    PaginationComponent,
    CupStandingsTableComponent
  ],
  template: `
    @if (standingsResource.value(); as standingPage) {
      <app-pagination [page]="standingPage.page"
                      [pageSize]="standingPage.pageSize"
                      [totalCount]="standingPage.totalCount">
      </app-pagination>

      @if (standingPage.data.length) {
        <app-cup-standings-table [standings]="standingPage.data"
                                 [rankMethod]="cupService.cup()?.rankMethod">
        </app-cup-standings-table>
      }

      <app-pagination [page]="standingPage.page"
                      [pageSize]="standingPage.pageSize"
                      [totalCount]="standingPage.totalCount">
      </app-pagination>

      @if (!standingPage.data.length) {
        <p>There is no data available.</p>
      }
    }
  `
})
export class CupStandingsComponent {
  page = input<number>();
  cupService = inject(CupService);
  standingsResource = httpResource<PagedResponse<CupStandingResponseModel>>(() => ({
    url: `/cups/${this.cupService.cup()?.id}/standings`,
    params: toHttpParams({page: this.page()})
  }));
}
