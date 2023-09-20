import * as Core from '@xcheme/core';

import { Scope, VarValueType } from './scope';

type CacheType<T extends Core.Types> = {
  [key: string]: VarValueType<T>;
};

const globalCache = {};

export const storeCache = <T extends Core.Types>(key: string, value: VarValueType<T>): void => {
  (globalCache as CacheType<T>)[key] = value;
};

export const retrieveCache = <T extends Core.Types>(key: string): VarValueType<T> => {
  return (globalCache as CacheType<T>)[key];
};

export const identifyCache = <T extends Core.Types>(scope: Scope<T>): string | undefined => {
  const pairs = [];

  for (const { identifier, value } of scope) {
    if (value instanceof Core.Node) {
      pairs.push(identifier);
    } else {
      pairs.push(identifier, ':', value);
    }
  }

  if (pairs.length > 0) {
    return pairs.join('_');
  }

  return undefined;
};
