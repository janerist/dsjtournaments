import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-cup-seasons',
  imports: [
    RouterLink
  ],
  template: `
    <h4>Season:</h4>
    <div class="ui list">
      @for (season of seasons; track season) {
        <a class="item"
           routerLink="./"
           [queryParams]="{page: 1, season: season.replace('/', '-')}"
           queryParamsHandling="merge">
          {{ season }}
        </a>
      }
    </div>
  `
})
export class CupSeasonsComponent {
  seasons = this.constructSeasons();

  private constructSeasons(): string[] {
    const seasons = [];
    const now = new Date();
    const startYear = now.getMonth() < 7 ? now.getFullYear() - 1 : now.getFullYear();
    for (let year = startYear; year >= 2007; year--) {
      seasons.push(`${year}/${year + 1}`);
    }
    return seasons;
  }
}
