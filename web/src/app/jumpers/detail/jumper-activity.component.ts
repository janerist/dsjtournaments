import {Component, inject} from '@angular/core';
import {JumperActivityResponseModel, PagedResponse} from '../../shared/api-responses';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {combineLatest} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {PaginationComponent} from '../../shared/components/pagination.component';
import {FormatDistanceToNowPipeModule, FormatPipeModule} from 'ngx-date-fns';
import {JumperFormComponent} from './jumper-form.component';

@Component({
  selector: 'app-jumper-activity',
  imports: [
    AsyncPipe,
    PaginationComponent,
    RouterLink,
    FormatPipeModule,
    FormatDistanceToNowPipeModule,
    JumperFormComponent
  ],
  template: `
    @if (activityPages$ | async; as activityPage) {
      <div class="ui two column stackable grid">
        <div class="six wide column">
          <app-pagination [compact]="true"
                          [page]="activityPage.page"
                          [pageSize]="activityPage.pageSize"
                          [totalCount]="activityPage.totalCount">
          </app-pagination>
          <div class="ui feed">
            @for (event of activityPage.data; track event.tournamentId) {
              <div class="event">
                <div class="label">
                  <span class="ui dsj{{event.gameVersion}} tiny label">DSJ{{ event.gameVersion }}</span>
                </div>
                <div class="content" style="margin-top: 0;">
                  <div class="summary">
                    <div class="user">
                      Participated in <a
                      [routerLink]="['/tournaments', event.tournamentId]">{{ event.tournamentType }}</a>
                    </div>
                    <div class="date" [title]="event.date | dfnsFormat: 'dd MMM y'">
                      {{ event.date | dfnsFormatDistanceToNow: {addSuffix: true} }}
                    </div>
                  </div>
                  <div class="meta">
                    @if (event.rank) {
                      Ranked {{ event.rank }}. with {{ event.points }} points
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
        <div class="ten wide column">
          <app-jumper-form [rankings]="formRankings"></app-jumper-form>
        </div>
      </div>
    }
  `
})
export class JumperActivityComponent {
  private route = inject(ActivatedRoute);
  private httpClient = inject(HttpClient);

  activityPages$ = combineLatest([this.route.parent!.paramMap, this.route.queryParamMap])
    .pipe(
      map(([params, qparams]) => ({id: params.get('id'), page: qparams.get('page')})),
      switchMap(({id, page}) => this.httpClient
        .get<PagedResponse<JumperActivityResponseModel>>(`${environment.apiUrl}/jumpers/${id}/activity?page=${page || 1}`)),
      tap(pagedResponse => this.formRankings = pagedResponse.data.filter(a => a.rank).reverse())
    );

  formRankings?: JumperActivityResponseModel[];
}
