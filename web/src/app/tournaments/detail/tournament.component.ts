import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {CompetitionResponseModel, TournamentResponseModel} from '../../shared/api-responses';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html'
})
export class TournamentComponent implements OnInit, OnDestroy {
  tournament: Observable<TournamentResponseModel>;
  standingsView: 'normal'|'per-hill' = 'normal';

  private competitions: CompetitionResponseModel[];
  private currentCompetitionId: number;

  private sub: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {
    this.sub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        if (this.router.routerState.snapshot.root.firstChild.firstChild) {
          this.currentCompetitionId = +this.router.routerState.snapshot.root.firstChild.firstChild.params['cid'];
        } else {
          this.currentCompetitionId = null;
        }
      }
    });
  }

  ngOnInit() {
    this.tournament = this.route.params
      .switchMap(params => this.httpClient.get<TournamentResponseModel>(`${environment.apiUrl}/tournaments/${params['id']}`))
      .do(tournament => this.competitions = tournament.competitions);
  }

  get currentCompetition(): CompetitionResponseModel {
    return this.competitions
    && this.currentCompetitionId
    && this.competitions.find(c => c.id === this.currentCompetitionId);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
