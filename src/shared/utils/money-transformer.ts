import type { ValueTransformer } from 'typeorm';

export const moneyTransformer: ValueTransformer = {
  from(value: number) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  },
  to(value: number) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  },
};
