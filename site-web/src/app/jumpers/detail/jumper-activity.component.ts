import {Component, OnInit} from '@angular/core';
import {JumperActivityResponseModel, JumperRankingResponseModel, PagedResponse} from '../../shared/api-responses';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import * as moment from 'moment';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'app-jumper-activity',
  template: `
    <div *ngIf="activityPages$ | async, let activityPage" class="ui two column stackable grid">
      <div class="six wide column">
        <app-pagination [compact]="true"
                        [page]="activityPage.page"
                        [pageSize]="activityPage.pageSize"
                        [totalCount]="activityPage.totalCount">
        </app-pagination>
        <div  class="ui feed">
          <div *ngFor="let event of activityPage.data" class="event">
            <div class="label">
              <span class="ui dsj{{event.gameVersion}} tiny label">DSJ{{event.gameVersion}}</span>
            </div>
            <div class="content" style="margin-top: 0;">
              <div class="summary">
                <div class="user">
                  Participated in <a [routerLink]="['/tournaments', event.tournamentId]">{{event.tournamentType}}</a>
                </div>
                <div class="date" [title]="event.date | date">
                  {{moment(event.date).fromNow()}}
                </div>
              </div>
              <div class="meta">
                <div *ngIf="event.rank">Ranked {{event.rank}}. with {{event.points}} points</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ten wide column">
        <app-jumper-form [rankings]="formRankings"></app-jumper-form>
      </div>
    </div>    
  `
})
export class JumperActivityComponent implements OnInit {
  moment = moment;
  activityPages$: Observable<PagedResponse<JumperActivityResponseModel>>;
  formRankings: JumperActivityResponseModel[];

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.activityPages$ = Observable
      .combineLatest(this.route.parent.params, this.route.queryParams, (params, qparams) => ({id: params['id'], page: qparams['page']}))
      .switchMap(({id, page}) =>
        this.httpClient.get<PagedResponse<JumperActivityResponseModel>>(
          `${environment.apiUrl}/jumpers/${id}/activity?page=${page || 1}`)
      )
      .do(pagedResponse => this.formRankings = pagedResponse.data.filter(a => a.rank).reverse())
  }
}
