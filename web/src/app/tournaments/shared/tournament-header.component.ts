import {Component, input, Input} from '@angular/core';
import {TournamentResponseModel} from '../../shared/api-responses';
import {FormatPipeModule} from 'ngx-date-fns';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-tournament-header',
  imports: [
    FormatPipeModule,
    RouterLink
  ],
  template: `
    <div class="content">
      <div class="header">
        <span class="ui dsj{{tournament().gameVersion}} ribbon label">DSJ{{ tournament().gameVersion }}</span>
        <a [routerLink]="['/tournaments', tournament().id]">{{ tournament().type }} {{ tournament().subType }}</a>
      </div>
      <div class="meta">
        <span class="ui labels">
          <span class="ui basic label">
            {{ tournament().date | dfnsFormat: 'dd MMM y HH:mm' }}
          </span>
          <span class="ui basic label">
            {{ tournament().hillCount }}
            <span class="detail">hills</span>
          </span>
          <span class="ui basic label">
            {{ tournament().participantCount }}
            <span class="detail">
              @if (tournament().type === 'Team Cup') {
                teams
              } @else {
                participants
              }
            </span>
          </span>
        </span>
      </div>
      <ng-content></ng-content>
    </div>
  `
})
export class TournamentHeaderComponent {
  tournament = input.required<TournamentResponseModel>();
}
