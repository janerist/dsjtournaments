import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {eachMonthOfInterval, endOfMonth, format} from 'date-fns';
import {FormatPipeModule} from 'ngx-date-fns';

@Component({
  selector: 'app-tournament-month-select',
  imports: [
    FormatPipeModule
  ],
  template: `
    <h4>Jump to month:</h4>
    <div class="ui form">
      <div class="field">
        <select (change)="selectMonth($event.target.value)">
          <option value="">-- Select year/month --</option>
          @for (year of keys(yearmonths).reverse(); track year) {
            <optgroup [label]="year">
              @for (date of yearmonths[year]; track date) {
                <option [value]="date | dfnsFormat: 'y-MM-dd'">
                  {{ date | dfnsFormat: 'MMMM' }}
                </option>
              }
            </optgroup>
          }
        </select>
      </div>
    </div>
  `
})
export class TournamentMonthSelectComponent {
  private router = inject(Router);

  yearmonths: { [key: string]: Date[] };
  keys = Object.keys;

  constructor() {
    const range = eachMonthOfInterval({start: new Date(2007, 10, 1), end: new Date()});
    this.yearmonths = Array.from(range)
      .reduceRight((acc: {[key: string]: Date[]}, current: Date) => {
        const year = current.getFullYear();
        if (!acc[year]) {
          acc[year] = [];
        }

        acc[year].push(current);
        return acc;
      }, {});
  }

  selectMonth(startDate: string) {
    void this.router.navigate(['./'], {
      queryParams: {
        page: 1,
        startDate: startDate || '',
        endDate: startDate ? format(endOfMonth(new Date(startDate)), 'y-MM-dd') : ''
      },
      queryParamsHandling: 'merge'
    });
  }
}
