export interface PagedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface TournamentResponseModel {
  id: number;
  type: string;
  subType: string;
  date: string;
  gameVersion: number;
  hillCount?: number;
  participantCount?: number;
  top3: FinalStandingResponseModel[];
  competitions: CompetitionResponseModel[];
  cups: CupResponseModel[];
}

export interface FinalStandingResponseModel {
  id: number;
  rank: number;
  rating?: number;
  i: number;
  ii: number;
  iii: number;
  n?: number;
  points: number;
  avg: number;
  jumperId?: number;
  jumperName?: string;
  jumperNation?: string;
  teamId?: number;
  teamNation?: string;
  teamRank?: string;
}

export interface TournamentRankingsResponseModel {
  rank: number;
  jumperId?: number;
  jumperName?: string;
  jumperNation?: string;
  teamId?: number;
  teamNation?: string;
  teamRank?: string;
  competitionRanks: CompetitionToRank;
}

export interface CompetitionToRank {
  [competitionId: string]: number;
}

export interface TournamentTypeWithCount {
  id: number;
  name: string;
  gameVersion: number;
  count: number;
}

export interface CompetitionResponseModel {
  id: number;
  fileNumber: number;
  ko: boolean;
  hillName: string;
  hillNation: string;
}

export interface FinalResultResponseModel {
  id: number;
  bib?: number;
  rank: number;
  luckyLoser?: boolean;
  rating?: number;
  length1?: number;
  length2?: number;
  crashed1?: boolean;
  crashed2?: boolean;
  points: number;
  jumperId?: number;
  jumperName?: string;
  jumperNation?: string;
  teamId?: number;
  teamNation?: string;
  teamRank?: string;
  teamJumpers?: FinalResultResponseModel[];
}

export interface QualificationResultResponseModel {
  id: number;
  bib?: number;
  rank: number;
  rating: number;
  length?: number;
  crashed: boolean;
  points?: number;
  qualified: boolean;
  prequalified: boolean;
  jumperId: number;
  jumperName: string;
  jumperNation: string;
  teamId?: number;
  teamNation?: string;
  teamRank?: string;
}

export interface JumperResponseModel {
  id: number;
  name: string;
  nation: string;
  gravatarHash: string;
  participations: number;
}

export interface JumperAllStatsResponseModel {
  total: JumperStatsResponseModel;
  perType: JumperStatsResponseModel[];
}

export interface JumperStatsResponseModel {
  type?: string;
  gameVersion?: number;

  participations: number;

  bestRank?: number;
  worstRank?: number;
  avgRank?: number;
  bestRating?: number;
  worstRating?: number;
  avgRating?: number;
  bestPoints?: number;
  worstPoints?: number;
  avgPoints?: number;
}

export interface JumperActivityResponseModel {
  date: string;
  tournamentId: number;
  gameVersion: number;
  tournamentType: string;
  rank?: number;
  points?: number;
}

export interface JumperRankingResponseModel {
  date: string;
  tournamentId: number;
  gameVersion: number;
  tournamentType: string;
  rank: number;
}

export interface CupResponseModel {
  id: number;
  name: string;
  gameVersion: number;
  rankMethod: string;
  startDate: string;
  endDate: string;
  tournamentCount: number;
  completedCount: number;
  dates?: CupDateResponseModel[];
}

export interface CupDateResponseModel {
  id: number;
  date: string;
  tournamentTypeId?: number;
  tournamentId?: number;
}

export interface CupStandingResponseModel {
  rank: number;
  jumperId: string;
  name: string;
  nation: string;
  participations: number;
  totalTournaments: number;
  topRank: number;
  topPoints: number;
  i: number;
  ii: number;
  iii: number;
  completedHills: number;
  totalHills: number;
  jumpPoints: number;
  cupPoints: number;
}

export interface CupRankingsResponseModel {
  rank: number;
  jumperId: string;
  name: string;
  nation: string;
  tournamentRanks: TournamentToRank;
}

export interface TournamentToRank {
  [tournamentId: string]: number;
}
