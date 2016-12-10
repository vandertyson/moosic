import { AlgwebPage } from './app.po';

describe('algweb App', function() {
  let page: AlgwebPage;

  beforeEach(() => {
    page = new AlgwebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
