import {Component, Input} from '@angular/core';
import {CupResponseModel} from '../../shared/api-responses';

@Component({
  selector: 'app-cup-header',
  template: `
    <h2 class="ui header">
      <i class="circular trophy icon"></i>
      <div class="content">
        {{cup.name}}
        <div class="sub header">Standings after {{cup.completedCount}}/{{cup.tournamentCount}} tournaments</div>
        <div class="sub header">Rank method: {{cup.rankMethod | rankMethod}}</div>
      </div>
    </h2>
  `
})
export class CupHeaderComponent {
  @Input() cup!: CupResponseModel;
}
