import * as Core from '@xcheme/core';

import { VarValueType } from '../evaluator/scope';

export const isNumber = <T extends Core.Types>(value: VarValueType<T>): value is number => {
  return typeof value === 'number';
};

export const convertToNumber = (value: string) => {
  return parseInt(value, 10);
};

export const ensureInt32 = (value: number): number => {
  return value | 0;
};

export const convertToString = <T extends Core.Types>(value: VarValueType<T>) => {
  if (value instanceof Core.Node || value instanceof Function) {
    return '<#closure>';
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
