export interface JumperResponseModel {
  id: number;
  name: string;
  nation: string;
  participations: string;
  lastActive?: string;
}

export interface JumperUpdateModel {
  nation?: string;
}

export interface JumperMergeRequestModel {
  sourceJumperIds: number[];
  destinationJumperId: number;
}
