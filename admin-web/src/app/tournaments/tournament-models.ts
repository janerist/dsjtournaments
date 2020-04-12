export interface TournamentTypeWithCountResponseModel {
  id: number;
  name: string;
  gameVersion: number;
  count: number;
}

export interface TournamentResponseModel {
  id: number;
  tournamentTypeId: number;
  type: string;
  date: string;
  gameVersion: number;
  hillCount?: number;
  participantCount?: number;
}
