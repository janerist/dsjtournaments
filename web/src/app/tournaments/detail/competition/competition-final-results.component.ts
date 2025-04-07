import {Component, input} from '@angular/core';
import {FinalResultResponseModel} from '../../../shared/api-responses';
import {httpResource} from '@angular/common/http';
import {FinalResultsTableComponent} from '../../shared/final-results-table.component';

@Component({
  selector: 'app-competition-final-results',
  imports: [
    FinalResultsTableComponent,
  ],
  template: `
    @if (finalResults.value(); as finalResults) {
      <app-final-results-table [results]="finalResults"></app-final-results-table>
    }
  `
})
export class CompetitionFinalResultsComponent {
  cid = input.required();
  finalResults = httpResource<FinalResultResponseModel[]>(() => `/competitions/${this.cid()}/final`);
}
