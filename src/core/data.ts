import * as Core from '@xcheme/core';

import { VarValueType } from '../evaluator/scope';
import { LazyCall } from '../evaluator/lazy';
import { Metadata } from './metadata';

export const ensureInt32 = (value: number): number => {
  return value | 0;
};

export const convertToNumber = (value: string) => {
  return parseInt(value, 10);
};

export const convertToString = <T extends Metadata>(value: VarValueType<T>) => {
  if (value instanceof Core.Node || value instanceof Function) {
    return '<#closure>';
  }

  if (value instanceof LazyCall) {
    return '<#lazy-call>';
  }

  if (value instanceof Array) {
    return '(term, term)';
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (typeof value === 'number') {
    return ensureInt32(value).toString();
  }

  return value!;
};
