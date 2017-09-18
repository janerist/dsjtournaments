import {Component} from '@angular/core';

@Component({
  selector: 'app-tournament-sort',
  template: `
    <h4>Sort by:</h4>
    <ul class="ui list">
      <li>
        <a routerLink="./" [queryParams]="{page: 1, sort: 'dateDesc'}" queryParamsHandling="merge">Newest</a>
      </li>
      <li>
        <a routerLink="./" [queryParams]="{page: 1, sort: 'dateAsc'}" queryParamsHandling="merge">Oldest</a>
      </li>
      <li>
        <a routerLink="./" [queryParams]="{page: 1, sort: 'participantsDesc'}" queryParamsHandling="merge">Most participants</a>
      </li>
      <li>
        <a routerLink="./" [queryParams]="{page: 1, sort: 'participantsAsc'}" queryParamsHandling="merge">Fewest participants</a>
      </li>
    </ul>
  `
})
export class TournamentSortComponent {

}
