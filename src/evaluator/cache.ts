import * as Core from '@xcheme/core';

import { Metadata } from '../core/metadata';
import { Scope, VarValueType } from './scope';

type CacheType<T extends Metadata> = {
  [key: string]: VarValueType<T>;
};

const globalCache: CacheType<Metadata> = {};

export const storeCache = <T extends Metadata>(key: string, value: VarValueType<T>): void => {
  (globalCache as CacheType<T>)[key] = value;
};

export const retrieveCache = <T extends Metadata>(key: string): VarValueType<T> => {
  return globalCache[key];
};

export const identifyCache = <T extends Metadata>(scope: Scope<T>): string | undefined => {
  const pairs = [];

  for (const { identifier, value } of scope) {
    if (value instanceof Core.Node || value instanceof Function) {
      pairs.push(identifier);
    } else {
      pairs.push(value);
    }
  }

  if (pairs.length > 0) {
    return pairs.join(':');
  }

  return undefined;
};
