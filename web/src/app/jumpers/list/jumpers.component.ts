import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {JumperResponseModel, PagedResponse} from '../../shared/api-responses';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-jumpers',
  template: `
    <div *ngIf="jumperPages$ | async, let jumperPage">
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
    </div>
  `
})
export class JumpersComponent implements OnInit {
  jumperPages$: Observable<PagedResponse<JumperResponseModel>>;

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {
  }

  ngOnInit() {
    this.jumperPages$ = this.route.queryParams.switchMap(params =>
      this.httpClient.get(`${environment.apiUrl}/jumpers`, {
        params: new HttpParams()
          .set('q', params['q'] || '')
          .set('sort', params['sort'] || '')
          .set('page', params['page'] || '1')
      }));
  }
}
