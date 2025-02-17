import {inject, Injectable} from '@angular/core';
import {TournamentResponseModel} from '../../shared/api-responses';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs/operators';

@Injectable()
export class TournamentService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  tournament?: TournamentResponseModel;
  competitionId?: number;
  hideCompetitions = false;

  constructor() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot;
        })
      )
      .subscribe(route => {
        setTimeout(() => this.hideCompetitions = !!route.data['hideCompetitions']);
        setTimeout(() => this.competitionId = +route.parent!.paramMap.get('cid')!);
      });
  }
}
