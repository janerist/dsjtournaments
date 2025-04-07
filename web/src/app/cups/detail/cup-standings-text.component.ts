import {Component, inject} from '@angular/core';
import {CupStandingResponseModel, PagedResponse} from '../../shared/api-responses';
import {httpResource} from '@angular/common/http';
import {CupStandingsTableTextComponent} from './cup-standings-table-text.component';
import {CupService} from './cup.service';

@Component({
  selector: 'app-cup-standings-text',
  imports: [
    CupStandingsTableTextComponent
  ],
  template: `
    @if (standingsResource.value(); as standings) {
      <app-cup-standings-table-text [standings]="standings.data"></app-cup-standings-table-text>
    }
  `
})
export class CupStandingsTextComponent {
  private cupService = inject(CupService);

  standingsResource = httpResource<PagedResponse<CupStandingResponseModel>>(() =>
    `/cups/${this.cupService.cup()?.id}/standings?pageSize=10000`);
}
