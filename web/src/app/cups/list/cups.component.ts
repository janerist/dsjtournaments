import {Component, input} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {CupSeasonsComponent} from './cup-seasons.component';
import {CupListComponent} from './cup-list.component';
import {PaginationComponent} from '../../shared/components/pagination.component';
import {CupResponseModel, PagedResponse} from '../../shared/api-responses';
import {toHttpParams} from '../../util/http-utils';

@Component({
  selector: 'app-cups',
  imports: [
    CupSeasonsComponent,
    CupListComponent,
    PaginationComponent
  ],
  template: `
    @if (cupPagesResource.value(); as cupPage) {
      <div class="ui two column stackable grid">
        <div class="twelve wide column">
          @if (cupPage.data.length) {
            <app-cup-list [cups]="cupPage.data"></app-cup-list>
            <app-pagination [totalCount]="cupPage.totalCount"
                            [pageSize]="cupPage.pageSize"
                            [page]="cupPage.page">
            </app-pagination>
          } @else {
            <p>No cups.</p>
          }
        </div>
        <div class="four wide column">
          <div class="ui segment">
            <app-cup-seasons></app-cup-seasons>
          </div>
        </div>
      </div>
    }
  `
})
export class CupsComponent {
  page = input<number>();
  season = input<string>();

  cupPagesResource =  httpResource<PagedResponse<CupResponseModel>>(() => ({
    url: '/cups',
    params: toHttpParams({
      page: this.page(),
      season: this.season()
    })
  }));
}
