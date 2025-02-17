import {Component, inject} from '@angular/core';
import {JumperResponseModel, PagedResponse} from '../../shared/api-responses';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';
import {switchMap} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {JumperSearchComponent} from './jumper-search.component';
import {JumperSortComponent} from './jumper-sort.component';
import {JumperListComponent} from './jumper-list.component';
import {PaginationComponent} from '../../shared/components/pagination.component';

@Component({
  selector: 'app-jumpers',
  imports: [
    AsyncPipe,
    JumperSearchComponent,
    JumperSortComponent,
    JumperListComponent,
    PaginationComponent
  ],
  template: `
    @if (jumperPages$ | async; as jumperPage) {
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
  private route = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);

  jumperPages$ = this.route.queryParamMap
    .pipe(
      switchMap(params =>
        this.httpClient.get<PagedResponse<JumperResponseModel>>(`${environment.apiUrl}/jumpers`, {
          params: new HttpParams()
            .set('q', params.get('q') || '')
            .set('sort', params.get('sort') || '')
            .set('page', params.get('page') || '1')
        }))
    );
}
