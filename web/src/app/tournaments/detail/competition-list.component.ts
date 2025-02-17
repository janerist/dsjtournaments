import {Component, input} from '@angular/core';
import {CompetitionResponseModel} from '../../shared/api-responses';
import {FlagDirective} from '../../shared/directives/flag.directive';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-competition-list',
  imports: [
    FlagDirective,
    RouterLink
  ],
  template: `
    <h4>Hills:</h4>
    <div class="ui list">
      @for (comp of competitions(); track comp.id) {
        <div class="item">
          <div class="content">
            <i [appFlag]="comp.hillNation"></i>
            <a [routerLink]="['competitions', comp.id]">
              {{ comp.hillName }}
              @if (comp.fileNumber > 1) {
                [{{ comp.fileNumber }}]
              }
              @if (comp.ko) {
                (KO)
              }
            </a>
          </div>
        </div>
      }
    </div>
  `
})
export class CompetitionListComponent {
  competitions = input.required<CompetitionResponseModel[]>();
}
