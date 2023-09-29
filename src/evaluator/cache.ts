import { ValueTypes } from '../core/types';
import { Scope } from './scope';

type CacheType = {
  [key: string]: ValueTypes;
};

const globalCache: CacheType = {};

export const storeCache = (key: string, value: ValueTypes): void => {
  globalCache[key] = value;
};

export const retrieveCache = (key: string): ValueTypes => {
  return globalCache[key];
};

export const identifyCache = (scope: Scope): string | undefined => {
  const pairs = [];

  for (const { value } of scope) {
    pairs.push(value);
  }

  if (pairs.length > 0) {
    return pairs.join(':');
  }

  return undefined;
};
