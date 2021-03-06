export interface CupResponseModel {
  id: number;
  name: string;
  gameVersion: number;
  rankMethod: string;
  startDate: string;
  endDate: string;
  tournamentCount: number;
  completedCount: number;

  dates: CupDateResponseModel[];
}

export interface CupRequestModel {
  name: string;
  rankMethod: string;
  gameVersion: number;

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
