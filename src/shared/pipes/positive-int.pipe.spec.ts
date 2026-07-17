import { BadRequestException } from '@nestjs/common';

import { PositiveIntPipe } from './positive-int.pipe';

describe('PositiveIntPipe', () => {
  const pipe = new PositiveIntPipe();

  test('given a positive integer when transform then it returns the value', () => {
    expect(pipe.transform(1)).toBe(1);
  });

  test('given zero when transform then it throws a bad request exception', () => {
    expect(() => pipe.transform(0)).toThrow(BadRequestException);
  });

  test('given a negative integer when transform then it throws a bad request exception', () => {
    expect(() => pipe.transform(-1)).toThrow(BadRequestException);
  });
});
