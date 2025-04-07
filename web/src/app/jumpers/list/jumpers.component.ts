import {Component, input} from '@angular/core';
import {JumperResponseModel, PagedResponse} from '../../shared/api-responses';
import {httpResource} from '@angular/common/http';
import {JumperSearchComponent} from './jumper-search.component';
import {JumperSortComponent} from './jumper-sort.component';
import {JumperListComponent} from './jumper-list.component';
import {PaginationComponent} from '../../shared/components/pagination.component';
import {toHttpParams} from '../../util/http-utils';

@Component({
  selector: 'app-jumpers',
  imports: [
    JumperSearchComponent,
    JumperSortComponent,
    JumperListComponent,
    PaginationComponent
  ],
  template: `
    @if (jumperPagesResource.value(); as jumperPage) {
      <div class="ui stackable two column grid">
        <div class="eight wide column">
          <app-jumper-search></app-jumper-search>
        </div>
        <div class="eight wide right aligned column">
          <app-jumper-sort></app-jumper-sort>
        </div>
      </div>

      <app-jumper-list [jumpers]="jumperPage.data"></app-jumper-list>

      <app-pagination [totalCount]="jumperPage.totalCount"
                      [page]="jumperPage.page"
                      [pageSize]="jumperPage.pageSize">
      </app-pagination>
    }
  `
})
export class JumpersComponent {
  q = input<string>();
  sort = input<string>();
  page = input<number>();

  jumperPagesResource = httpResource<PagedResponse<JumperResponseModel>>(() => ({
    url: '/jumpers',
    params: toHttpParams({
      q: this.q(),
      sort: this.sort(),
      page: this.page()
    })
  }));
}
