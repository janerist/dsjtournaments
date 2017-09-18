export interface CupResponseModel {
  id: number;
  name: string;
  rankMethod: string;
  gameVersion: string;
  tournamentCount: number;
  completedCount: number;
  startDate: string;
  endDate: string;

  dates: CupDateResponseModel[];
}

export interface CupRequestModel {
  name: string;
  slug: string;
  rankMethod: string;
  gameVersion: string;

  cupDates: CupDateRequestModel[];
}

export interface CupDateResponseModel {
  id: number;
  date: string;
  tournamentTypeId?: number;
  tournamentId?: number;
}

export interface CupDateRequestModel {
  id?: number;
  date: string;
  time: string;
  typeId?: number;
  destroy: boolean;
}
