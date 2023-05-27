import {
  jest,
  describe,
  beforeEach,
  it,
  expect,
  afterEach,
} from '@jest/globals';

import DateUtils from './dateUtils.js';

describe('getThursday', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
  });

  describe('on a day after thursday', () => {
    beforeEach(() => {
      // Known Saturday
      jest.setSystemTime(new Date('2022-01-01T00:00:00Z'));
    });

    it('returns the correct date', () => {
      const expectedDate = '2022-01-06';
      const actualDate = DateUtils.getThursday();

      expect(actualDate).toBe(expectedDate);
    });
  });

  describe('on a day before thursday', () => {
    beforeEach(() => {
      // Known Wednesday
      jest.setSystemTime(new Date('2022-01-05T00:00:00Z'));
    });

    it('returns the next thursday', () => {
      const expectedDate = '2022-01-06';
      const actualDate = DateUtils.getThursday();

      expect(actualDate).toBe(expectedDate);
    });
  });

  describe('on thursday', () => {
    beforeEach(() => {
      // Known Thursday
      jest.setSystemTime(new Date('2022-01-06T00:00:00Z'));
    });

    it('returns the correct date', () => {
      const expectedDate = '2022-01-06';
      const actualDate = DateUtils.getThursday();

      expect(actualDate).toBe(expectedDate);
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});
