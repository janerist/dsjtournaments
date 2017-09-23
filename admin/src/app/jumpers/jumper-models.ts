export interface JumperResponseModel {
  id: number;
  name: string;
  nation: string;
  gravatarEmail: string;
  gravatarHash: string;
  participations: string;
  lastActive?: string;
}

export interface JumperUpdateModel {
  nation: string;
  gravatarEmail?: string;
}

export interface JumperMergeRequestModel {
  sourceJumperIds: number[];
  destinationJumperId: number;
}
