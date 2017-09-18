import {Component, OnInit} from '@angular/core';
import * as Moment from 'moment';
import {extendMoment} from 'moment-range';
import {Router} from '@angular/router';

const moment = extendMoment(Moment);

@Component({
  selector: 'app-tournament-month-select',
  template: `
    <h4>Jump to month:</h4>
    <div class="ui form">
      <div class="field">
        <select (change)="selectMonth($event.target.value)">
          <option value="">-- Select year/month --</option>
          <optgroup *ngFor="let year of keys(yearmonths).reverse()" [label]="year">
            <option *ngFor="let date of yearmonths[year]" [value]="date.format('YYYY-MM-DD')">
              {{date.format('MMMM')}}
            </option>
          </optgroup>
        </select>
      </div>
    </div>
  `
})
export class TournamentMonthSelectComponent implements OnInit {
  yearmonths: { [key: string]: Moment.Moment[] };
  keys = Object.keys;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.yearmonths = Array.from(moment.range(new Date(2007, 10, 1), new Date()).by('month'))
      .reduceRight((acc, current: Moment.Moment) => {
        const year = current.year();
        if (!acc[year]) {
          acc[year] = [];
        }

        acc[year].push(current);
        return acc;
      }, <any>{});
  }

  selectMonth(startDate: string) {
    this.router.navigate(['./'], {
      queryParams: {
        page: 1,
        startDate: startDate || '',
        endDate: startDate ? moment(startDate).endOf('month').format('YYYY-MM-DD') : ''
      },
      queryParamsHandling: 'merge'
    });
  }
}
