import {Component, Input} from '@angular/core';
import {CompetitionResponseModel} from '../../shared/api-responses';

@Component({
  selector: 'app-competition-list',
  template: `
    <h4>Hills:</h4>
    <div class="ui list">
      <div *ngFor="let comp of competitions" class="item">
        <div class="content">
          <i [appFlag]="comp.hillNation"></i>
          <a [routerLink]="['competitions', comp.id]">
            {{comp.hillName}}
            <span *ngIf="comp.fileNumber > 1">[{{comp.fileNumber}}]</span>
            <span *ngIf="comp.ko">(KO)</span>
          </a>
        </div>
      </div>
    </div>
  `
})
export class CompetitionListComponent {
  @Input() competitions!: CompetitionResponseModel[];
}
