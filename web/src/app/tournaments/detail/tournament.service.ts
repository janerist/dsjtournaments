import {Injectable} from '@angular/core';
import {TournamentResponseModel} from '../../shared/api-responses';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Injectable()
export class TournamentService {
  tournament: TournamentResponseModel;
  competitionId: number;
  hideCompetitions = false;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => activatedRoute)
      .map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route.snapshot;
      })
      .subscribe(route => {
        setTimeout(() => this.hideCompetitions = !!route.data['hideCompetitions']);
        setTimeout(() => this.competitionId = +route.parent.params['cid']);
      });
  }
}
