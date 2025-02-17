import {Component, input} from '@angular/core';
import {CupDateResponseModel} from '../../shared/api-responses';
import {format} from 'date-fns';
import {RouterLink} from '@angular/router';
import {FormatPipeModule} from 'ngx-date-fns';

@Component({
  selector: 'app-cup-schedule',
  imports: [
    RouterLink,
    FormatPipeModule
  ],
  template: `
    <div class="ui list">
      @for (month of keys(dates()); track month) {
        <div class="item">
          <strong>{{ month }}</strong>
          <div class="ui list">
            @for (date of dates()[month]; track date.id) {
              <div class="item">
                <i class="calendar icon"></i>
                <div class="content">
                  @if (date.tournamentId) {
                    <a [routerLink]="['/tournaments', date.tournamentId]">
                      {{ date.date | dfnsFormat: 'EEE dd MMM y HH:mm' }}
                    </a>
                  } @else {
                    {{ date.date | dfnsFormat: 'EEE dd MMM y HH:mm' }}
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class CupScheduleComponent {
  dates = input.required({
    transform: (dates: CupDateResponseModel[]) =>
      dates.reduce((agg: { [key: string]: CupDateResponseModel[] }, date) => {
        const month = format(new Date(date.date), 'MMMM y');
        if (!agg[month]) {
          agg[month] = [];
        }

        agg[month].push(date);
        return agg;
      }, {})
  });

  keys = Object.keys;
}
