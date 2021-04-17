import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {eachMonthOfInterval, endOfMonth, format} from 'date-fns';

@Component({
  selector: 'app-tournament-month-select',
  template: `
    <h4>Jump to month:</h4>
    <div class="ui form">
      <div class="field">
        <select (change)="selectMonth($event.target.value)">
          <option value="">-- Select year/month --</option>
          <optgroup *ngFor="let year of keys(yearmonths).reverse()" [label]="year">
            <option *ngFor="let date of yearmonths[year]" [value]="date | dsjtDate: 'y-MM-dd'">
              {{date | dsjtDate: 'MMMM'}}
            </option>
          </optgroup>
        </select>
      </div>
    </div>
  `
})
export class TournamentMonthSelectComponent implements OnInit {
  yearmonths: { [key: string]: Date[] };
  keys = Object.keys;

  constructor(private router: Router) {
  }

  ngOnInit() {
    const range = eachMonthOfInterval({start: new Date(2007, 10, 1), end: new Date()});
    this.yearmonths = Array.from(range)
      .reduceRight((acc, current: Date) => {
        const year = current.getFullYear();
        if (!acc[year]) {
          acc[year] = [];
        }

        acc[year].push(current);
        return acc;
      }, {});
  }

  selectMonth(startDate: string) {
    this.router.navigate(['./'], {
      queryParams: {
        page: 1,
        startDate: startDate || '',
        endDate: startDate ? format(endOfMonth(new Date(startDate)), 'y-MM-dd') : ''
      },
      queryParamsHandling: 'merge'
    });
  }
}
