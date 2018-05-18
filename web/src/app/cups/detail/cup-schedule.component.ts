import {Component, Input} from '@angular/core';
import {CupDateResponseModel} from '../../shared/api-responses';
import * as moment from 'moment';

@Component({
  selector: 'app-cup-schedule',
  template: `
    <div *ngIf="getCupDateGroups(dates), let months" class="ui list">
      <div *ngFor="let month of keys(months)" class="item">
        <strong>{{month}}</strong>
        <div class="ui list">
          <div *ngFor="let date of months[month]" class="item">
            <i class="calendar icon"></i>
            <div class="content">
              <a *ngIf="date.tournamentId" [routerLink]="['/tournaments', date.tournamentId]">
                {{date.date | date: 'ddd DD MMM YYYY HH:mm'}}
              </a>
              <span *ngIf="!date.tournamentId">
                    {{date.date | date: 'ddd DD MMM YYYY HH:mm'}}
                  </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CupScheduleComponent {
  @Input() dates: CupDateResponseModel[];

  keys = Object.keys;

  getCupDateGroups(dates: CupDateResponseModel[]) {
    return dates.reduce((agg, date) => {
      const month = moment(date.date).format('MMMM YYYY');
      if (!agg[month]) {
        agg[month] = [];
      }

      agg[month].push(date);
      return agg;
    }, {});
  }
}
