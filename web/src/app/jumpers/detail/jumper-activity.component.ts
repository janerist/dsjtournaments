import {Component, computed, input} from '@angular/core';
import {JumperActivityResponseModel, PagedResponse} from '../../shared/api-responses';
import {RouterLink} from '@angular/router';
import {httpResource} from '@angular/common/http';
import {PaginationComponent} from '../../shared/components/pagination.component';
import {FormatDistanceToNowPipeModule, FormatPipeModule} from 'ngx-date-fns';
import {JumperFormComponent} from './jumper-form.component';
import {toHttpParams} from '../../util/http-utils';

@Component({
  selector: 'app-jumper-activity',
  imports: [
    PaginationComponent,
    RouterLink,
    FormatPipeModule,
    FormatDistanceToNowPipeModule,
    JumperFormComponent
  ],
  template: `
    @if (activityPages.value(); as activityPage) {
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
          <app-jumper-form [rankings]="formRankings()"></app-jumper-form>
        </div>
      </div>
    }
  `
})
export class JumperActivityComponent {
  id = input<number>();
  page = input<number>();

  activityPages = httpResource<PagedResponse<JumperActivityResponseModel>>(() =>({
    url: `/jumpers/${this.id()}/activity`,
    params: toHttpParams({page: this.page()})
  }));

  formRankings = computed(() => this.activityPages.value()?.data.filter(a => a.rank).reverse());
}
