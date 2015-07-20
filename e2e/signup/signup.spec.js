'use strict';

describe('Sign-up', function() {
  var page;

  beforeEach(function() {
    browser.get('/');
    page = require('./signup.po');
  });

  it('page should include a link to the signup form', function() {
    expect(page.h1El.getText()).toBe('\'Allo, \'Allo!');
    expect(page.imgEl.getAttribute('src')).toMatch(/assets\/images\/yeoman.png$/);
    expect(page.imgEl.getAttribute('alt')).toBe('I\'m Yeoman');
  });

  it('the user should be able to navigate to the sign-up form', function() {

  });
});
