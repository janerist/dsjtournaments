import {Component, input} from '@angular/core';
import {JumperResponseModel} from '../../shared/api-responses';
import {RouterLink} from '@angular/router';
import {FlagDirective} from '../../shared/directives/flag.directive';

@Component({
  selector: 'app-jumper-list',
  imports: [
    RouterLink,
    FlagDirective
  ],
  styles: [`
    .jumper.card {
      font-size: 75% !important;
    }

    .jumper.card .content .header {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  `],
  template: `
    <div class="ui seven cards">
      @for (jumper of jumpers(); track jumper.id) {
        <a class="ui raised jumper card" [routerLink]="['/jumpers', jumper.id]">
          <div class="content">
            <div class="header">
              {{ jumper.name }}
            </div>
            <div class="meta">
              <span class="ui tiny label">{{ jumper.participations }}</span>
              <i [appFlag]="jumper.nation"></i> {{ jumper.nation }}
            </div>
          </div>
        </a>
      }

    </div>
  `
})
export class JumperListComponent {
  jumpers = input.required<JumperResponseModel[]>();
}
