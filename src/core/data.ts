import * as Core from '@xcheme/core';

import { ValueTypes } from './types';

export const isLiteral = (value: ValueTypes) => {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value instanceof Array;
};

export const ensureInt32 = (value: number): number => {
  return value | 0;
};

export const convertToNumber = (value: string) => {
  return parseInt(value, 10);
};

export const convertToString = (value: ValueTypes) => {
  if (value instanceof Core.Node || value instanceof Function) {
    return '<#closure>';
  }

  if (value instanceof Array) {
    return '(term, term)';
  }

  if (value instanceof Object) {
    return '<#object>';
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (typeof value === 'number') {
    return ensureInt32(value).toString();
  }

  return value!;
};
