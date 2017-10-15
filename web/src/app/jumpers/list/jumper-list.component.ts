import {Component, Input} from '@angular/core';
import {JumperResponseModel} from '../../shared/api-responses';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-jumper-list',
  template: `
    <div class="ui seven cards">
      <a *ngFor="let j of jumpers" class="ui raised jumper card" [routerLink]="['/jumpers', j.id]">
        <div class="content">
          <div class="header">
            {{j.name}}
          </div>
          <div class="meta">
            <span class="ui tiny label">{{j.participations}}</span>
            <i [appFlag]="j.nation"></i> {{j.nation}}
          </div>
        </div>
      </a>
    </div>
  `,
  styles: [`
    .jumper.card  {
      font-size: 75% !important;
    }
    
    .jumper.card .content .header {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  `]
})
export class JumperListComponent {
  @Input() jumpers: JumperResponseModel[];
}
