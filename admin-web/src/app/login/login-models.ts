export interface TokenResponseModel {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface TokenErrorModel {
  error: string;
  error_description: string;
}
