import {Injectable} from '@angular/core';
import {Profile, User, UserManager} from 'oidc-client';
import {environment} from '../../../environments/environment';

@Injectable()
export class AuthService {
  userManager: UserManager;
  public user?: User;

  constructor() {
    this.userManager = new UserManager({
      client_id: 'admin',
      authority: environment.idUrl,
      scope: 'openid dsjt',
      response_type: 'code',
      redirect_uri: environment.redirectUri,
      post_logout_redirect_uri: environment.postLogoutRedirectUri,
      automaticSilentRenew: true,
      silent_redirect_uri: environment.silentRedirectUri,
      includeIdTokenInSilentRenew: false,
      loadUserInfo: false
    });

    if (environment.production === false) {
      this.userManager.events.addUserLoaded(user => console.log('user loaded ', user));
      this.userManager.events.addUserUnloaded(() => console.log('user unloaded'));
      this.userManager.events.addUserSignedOut(() => console.log('user signed out'));
      this.userManager.events.addSilentRenewError(err => console.log('silent renew error', err));
      this.userManager.events.addUserSessionChanged(() => console.log('user session changed'));
      this.userManager.events.addAccessTokenExpiring(() => console.log('access token expiring'));
      this.userManager.events.addAccessTokenExpired(() => console.log('access token expired'));
    }
  }

  async loadUser(): Promise<void> {
    this.user = await this.userManager.getUser();
  }

  async handleCallback(url: string): Promise<string> {
    this.user = await this.userManager.signinCallback(url);
    return sessionStorage.getItem('returnUrl') || '/';
  }

  get isAccessTokenValid(): boolean {
    return this.user && !this.user.expired;
  }

  get accessToken(): string {
    return this.user?.access_token;
  }

  get userProfile(): Profile {
    return this.user?.profile;
  }

  login(returnUrl = '/') {
    sessionStorage.setItem('returnUrl', returnUrl);
    this.userManager.signinRedirect();
  }

  logout() {
    this.userManager.signoutRedirect();
  }
}
