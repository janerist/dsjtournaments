import {Component} from '@angular/core';

@Component({
  selector: 'app-jumper-sort',
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
