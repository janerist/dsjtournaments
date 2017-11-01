import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {CupStandingResponseModel, PagedResponse} from '../../shared/api-responses';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../../environments/environment';
import {CupService} from './cup.service';

@Component({
  selector: 'app-cup-standings',
  template: `
    <div *ngIf="standingPages$ | async, let standingPage">
      <app-pagination [page]="standingPage.page"
                      [pageSize]="standingPage.pageSize"
                      [totalCount]="standingPage.totalCount">
      </app-pagination>
      
      <app-cup-standings-table *ngIf="standingPage.data.length"
                               [standings]="standingPage.data"
                               [rankMethod]="cup?.rankMethod">
      </app-cup-standings-table>
      
      <app-pagination [page]="standingPage.page"
                      [pageSize]="standingPage.pageSize"
                      [totalCount]="standingPage.totalCount">
      </app-pagination>

      <p *ngIf="!standingPage.data.length">
        There is no data available.
      </p>
    </div>
  `
})
export class CupStandingsComponent implements OnInit {
  standingPages$: Observable<PagedResponse<CupStandingResponseModel>>;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private cupService: CupService
  ) {
  }

  ngOnInit() {
    this.standingPages$ = Observable
      .combineLatest(this.route.parent.params, this.route.queryParams, (params, qparams) => ({id: params['id'], page: qparams['page']}))
      .switchMap(({id, page}) =>
        this.httpClient.get<PagedResponse<CupStandingResponseModel>>(`${environment.apiUrl}/cups/${id}/standings?page=${page || '1'}`));
  }

  get cup() {
    return this.cupService.cup;
  }
}
