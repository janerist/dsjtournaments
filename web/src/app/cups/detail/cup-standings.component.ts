import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CupStandingResponseModel, PagedResponse} from '../../shared/api-responses';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CupService} from './cup.service';
import {map, switchMap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {PaginationComponent} from '../../shared/components/pagination.component';
import {CupStandingsTableComponent} from './cup-standings-table.component';

@Component({
  selector: 'app-cup-standings',
  imports: [
    AsyncPipe,
    PaginationComponent,
    CupStandingsTableComponent
  ],
  template: `
    @if (standingPages$ | async; as standingPage) {
      <app-pagination [page]="standingPage.page"
                      [pageSize]="standingPage.pageSize"
                      [totalCount]="standingPage.totalCount">
      </app-pagination>

      @if (standingPage.data.length) {
        <app-cup-standings-table [standings]="standingPage.data"
                                 [rankMethod]="cupService.cup?.rankMethod">
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
  private route = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);
  cupService = inject(CupService);

  standingPages$ = combineLatest([this.route.parent!.paramMap, this.route.queryParamMap])
    .pipe(
      map(([params, qparams]) => ({id: params.get('id'), page: qparams.get('page')})),
      switchMap(({id, page}) =>
        this.httpClient.get<PagedResponse<CupStandingResponseModel>>(`${environment.apiUrl}/cups/${id}/standings?page=${page || '1'}`))
    );
}
