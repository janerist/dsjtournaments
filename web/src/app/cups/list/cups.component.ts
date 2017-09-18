import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {CupResponseModel, PagedResponse} from '../../shared/api-responses';
import {ActivatedRoute} from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-cups',
  template: `
    <div *ngIf="cupPages$ | async, let cupPage" class="ui two column stackable grid">
      <div class="twelve wide column">
        <div *ngIf="cupPage.data.length">
          <app-cup-list [cups]="cupPage.data"></app-cup-list>
          <app-pagination [totalCount]="cupPage.totalCount"
                          [pageSize]="cupPage.pageSize"
                          [page]="cupPage.page">
          </app-pagination>
        </div>

        <p *ngIf="!cupPage.data.length">No cups.</p>
      </div>
      <div class="four wide column">
        <div class="ui segment">
          <app-cup-seasons></app-cup-seasons>
        </div>
      </div>
    </div>
  `
})
export class CupsComponent implements OnInit {
  cupPages$: Observable<PagedResponse<CupResponseModel>>;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {
  }

  ngOnInit() {
    this.cupPages$ = this.route.queryParams.switchMap(params =>
      this.httpClient.get(`${environment.apiUrl}/cups`, {
          params: new HttpParams()
            .set('page', params['page'] || '1')
            .set('season', params['season'] || '')
        }));
  }
}
