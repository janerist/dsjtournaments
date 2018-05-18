import {Component, OnInit} from '@angular/core';
import {CupRankingsResponseModel, PagedResponse} from '../../shared/api-responses';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {CupService} from './cup.service';
import {combineLatest} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-cup-rankings',
  template: `
    <div *ngIf="rankingPages$ | async, let rankingPage">
      <app-pagination [page]="rankingPage.page"
                      [pageSize]="rankingPage.pageSize"
                      [totalCount]="rankingPage.totalCount">
      </app-pagination>

      <app-cup-rankings-table [rankings]="rankingPage.data"
                              [dates]="cup?.dates">
      </app-cup-rankings-table>

      <app-pagination [page]="rankingPage.page"
                      [pageSize]="rankingPage.pageSize"
                      [totalCount]="rankingPage.totalCount">
      </app-pagination>
    </div>
  `
})
export class CupRankingsComponent implements OnInit {
  rankingPages$: Observable<PagedResponse<CupRankingsResponseModel>>;

  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private cupService: CupService) {
  }

  ngOnInit() {
    this.rankingPages$ = combineLatest(this.route.parent.params, this.route.queryParams)
      .pipe(
        map(([params, qparams]) => ({id: params['id'], page: qparams['page']})),
        switchMap(({id, page}) =>
          this.httpClient.get<PagedResponse<CupRankingsResponseModel>>(`${environment.apiUrl}/cups/${id}/rankings?page=${page || '1'}`))
      );
  }

  get cup() {
    return this.cupService.cup;
  }
}
