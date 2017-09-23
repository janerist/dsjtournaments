import { DsjtournamentsWebPage } from './app.po';

describe('dsjtournaments.web App', () => {
  let page: DsjtournamentsWebPage;

  beforeEach(() => {
    page = new DsjtournamentsWebPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
