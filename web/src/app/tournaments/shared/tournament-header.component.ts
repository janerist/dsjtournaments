import {Component, Input} from '@angular/core';
import {TournamentResponseModel} from '../../shared/api-responses';

@Component({
  selector: 'app-tournament-header',
  template: `
    <div class="content">
      <div class="header">
        <span class="ui dsj{{tournament.gameVersion}} ribbon label">DSJ{{tournament.gameVersion}}</span>
        <a [routerLink]="['/tournaments', tournament.id]">{{tournament.type}} {{tournament.subType}}</a>
      </div>
      <div class="meta">
        <span class="ui labels">
          <span class="ui basic label">
            {{tournament.date | momentDateTime}}
          </span>
          <span class="ui basic label">
            {{tournament.hillCount}}
            <span class="detail">hills</span>
          </span>
          <span class="ui basic label">
            {{tournament.participantCount}}
            <span class="detail">
              <span *ngIf="tournament.type === 'Team Cup'">teams</span>
              <span *ngIf="tournament.type !== 'Team Cup'">participants</span>
            </span>
          </span>
        </span>
      </div>
      <ng-content></ng-content>
    </div>
  `
})
export class TournamentHeaderComponent {
  @Input() tournament: TournamentResponseModel;
}
