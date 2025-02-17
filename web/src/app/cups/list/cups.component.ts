import {Component, inject} from '@angular/core';
import {CupResponseModel, PagedResponse} from '../../shared/api-responses';
import {ActivatedRoute} from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {switchMap} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {CupSeasonsComponent} from './cup-seasons.component';
import {CupListComponent} from './cup-list.component';
import {PaginationComponent} from '../../shared/components/pagination.component';

@Component({
  selector: 'app-cups',
  imports: [
    AsyncPipe,
    CupSeasonsComponent,
    CupListComponent,
    PaginationComponent
  ],
  template: `
    @if (cupPages$ | async; as cupPage) {
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
  private route = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);

  cupPages$ = this.route.queryParamMap
    .pipe(
      switchMap(params =>
        this.httpClient.get<PagedResponse<CupResponseModel>>(`${environment.apiUrl}/cups`, {
          params: new HttpParams()
            .set('page', params.get('page') || '1')
            .set('season', params.get('season') || '')
        }))
    );
}
