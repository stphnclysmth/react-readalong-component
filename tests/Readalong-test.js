/*global jest:false, describe:false, it:false*/

'use strict';

jest.dontMock('../src/Readalong');

describe('testing', function () {
  it('tests a test', function () {
    var Readalong = require('../src/Readalong');

    expect(true).toBe(true);
  });
});
