import {Component} from '@angular/core';


@Component({
  selector: 'app-cup-seasons',
  template: `
    <h4>Season:</h4>
    <div class="ui list">
      <a *ngFor="let season of seasons" 
         class="item" 
         routerLink="./" 
         [queryParams]="{page: 1, season: season.replace('/', '-')}" 
         queryParamsHandling="merge">
        {{season}}
      </a>
    </div>
    
  `
})
export class CupSeasonsComponent {
  seasons: string[] = [];

  constructor() {
    const now = new Date();
    const startYear = now.getMonth() < 7 ? now.getFullYear() - 1 : now.getFullYear();
    for (let year = startYear; year >= 2007; year--) {
      this.seasons.push(`${year}/${year + 1}`);
    }
  }
}
