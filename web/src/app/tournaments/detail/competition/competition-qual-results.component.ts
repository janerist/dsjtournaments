import {Component, input} from '@angular/core';
import {QualificationResultResponseModel} from '../../../shared/api-responses';
import {httpResource} from '@angular/common/http';
import {QualificationResultsTableComponent} from '../../shared/qualification-results-table.component';

@Component({
  selector: 'app-competition-qual-results',
  imports: [
    QualificationResultsTableComponent,
  ],
  template: `
    @if (qualResults.value(); as qualResults) {
      <app-qualification-results-table [results]="qualResults"></app-qualification-results-table>
    }
  `
})
export class CompetitionQualResultsComponent {
  cid = input.required();
  qualResults = httpResource<QualificationResultResponseModel[]>(() => `/competitions/${this.cid()}/qual`);
}
