import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-jumper-sort',
  imports: [
    RouterLink
  ],
  template: `
    <div class="ui horizontal list">
      <div class="item">Sort by:</div>
      <a class="item"
         routerLink="./"
         [queryParams]="{page: 1, sort: 'participationsdesc'}"
         queryParamsHandling="merge">Most participations</a>
      <a class="item"
         routerLink="./"
         [queryParams]="{page: 1, sort: 'nameasc'}"
         queryParamsHandling="merge">Name</a>
      <a class="item"
         routerLink="./"
         [queryParams]="{page: 1, sort: 'nationasc'}"
         queryParamsHandling="merge">Nation</a>
    </div>
  `
})
export class JumperSortComponent {
}
