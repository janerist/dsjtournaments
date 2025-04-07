import {Injectable, signal} from '@angular/core';
import {CompetitionResponseModel, TournamentResponseModel} from '../../shared/api-responses';

@Injectable()
export class TournamentService {
  tournament = signal<TournamentResponseModel | undefined>(undefined);
  hideCompetitions = signal<boolean>(false);
  selectedCompetition = signal<CompetitionResponseModel | undefined>(undefined);

  setTournament(tournament: TournamentResponseModel) {
    this.tournament.set(tournament);
  }

  setCompetition(competitionId: number) {
    const competition = this.tournament()?.competitions.find(c => c.id === competitionId);
    this.selectedCompetition.set(competition);
  }
}
