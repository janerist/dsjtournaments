import {Component, inject} from '@angular/core';
import {CupRankingsResponseModel, PagedResponse} from '../../shared/api-responses';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {CupService} from './cup.service';
import {combineLatest} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {PaginationComponent} from '../../shared/components/pagination.component';
import {AsyncPipe} from '@angular/common';
import {CupRankingsTableComponent} from './cup-rankings-table.component';

@Component({
  selector: 'app-cup-rankings',
  imports: [
    PaginationComponent,
    AsyncPipe,
    CupRankingsTableComponent
  ],
  template: `
    @if (rankingPages$ | async; as rankingPage) {
      <app-pagination [page]="rankingPage.page"
                      [pageSize]="rankingPage.pageSize"
                      [totalCount]="rankingPage.totalCount">
      </app-pagination>

      <app-cup-rankings-table [rankings]="rankingPage.data"
                              [dates]="cupService.cup?.dates">
      </app-cup-rankings-table>

      <app-pagination [page]="rankingPage.page"
                      [pageSize]="rankingPage.pageSize"
                      [totalCount]="rankingPage.totalCount">
      </app-pagination>
    }
  `
})
export class CupRankingsComponent {
  private route = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);
  cupService = inject(CupService);

  rankingPages$ = combineLatest([this.route.parent!.paramMap, this.route.queryParamMap])
    .pipe(
      map(([params, qparams]) => ({id: params.get('id'), page: qparams.get('page')})),
      switchMap(({id, page}) =>
        this.httpClient.get<PagedResponse<CupRankingsResponseModel>>(`${environment.apiUrl}/cups/${id}/rankings?page=${page || '1'}`))
    );
}
