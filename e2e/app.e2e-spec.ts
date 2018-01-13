import { JeuxdemotsPage } from './app.po';

describe('jeuxdemots App', () => {
  let page: JeuxdemotsPage;

  beforeEach(() => {
    page = new JeuxdemotsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
