import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {JumperResponseModel, PagedResponse} from '../../shared/api-responses';
import {iso3toiso2} from '../../shared/country-codes';
import {Router} from '@angular/router';

@Component({
  selector: 'app-jumper-search',
  template: `
    <div class="ui jumper search">
      <div class="ui icon input">
        <input #q class="prompt" placeholder="Search" autocomplete="off" (keyup.enter)="handleEnter(q.value)">
        <i class="search icon"></i>
      </div>
      <div class="results"></div>
    </div>
  `
})
export class JumperSearchComponent implements OnInit {

  constructor(private router: Router) {
  }

  handleEnter(q: string) {
    if (q) {
      $('.jumper.search').search('hide results');
      this.router.navigate(['/jumpers'], {queryParams: {q}});
      return false;
    }
  }

  ngOnInit() {
    $('.jumper.search').search({
      maxResults: 8,
      apiSettings: {
        url: `${environment.apiUrl}/jumpers?q={query}`,
        onResponse: ({data: data}: { data: PagedResponse<JumperResponseModel> }) => ({ // tslint:disable-line
          results: data.data.map(jumper => ({
            id: jumper.id,
            title: jumper.name,
            description: `
              <span class="ui tiny label">${jumper.participations}</span>
              <i class="${iso3toiso2[jumper.nation]} flag"></i> ${jumper.nation}`
          }))
        })
      },
      onSelect: ({id}: { id: number }) => {
        this.router.navigate(['/jumpers', id]);
      }
    });
  }
}
