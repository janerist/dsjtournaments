import {Component, Input} from '@angular/core';
import {CupResponseModel} from '../../shared/api-responses';

@Component({
  selector: 'app-cup-list',
  template: `
    <table class="ui condensed table">
      <thead>
      <tr>
        <th>Name</th>
        <th>Rank method</th>
        <th>Starts</th>
        <th>Ends</th>
        <th class="right aligned">Completed</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let cup of cups">
        <td>
          <span class="ui label dsj{{cup.gameVersion}}">DSJ{{cup.gameVersion}}</span>
          <a [routerLink]="['/cups', cup.id]">{{cup.name}}</a>
        </td>
        <td>
          {{cup.rankMethod | rankMethod}}
        </td>
        <td>
          {{cup.startDate | date}}
        </td>
        <td>
          {{cup.endDate | date}}
        </td>
        <td class="right aligned">
          {{cup.completedCount}} / {{cup.tournamentCount}}
        </td>
      </tr>
      </tbody>
    </table>
  `
})
export class CupListComponent {
  @Input() cups: CupResponseModel[];
}
