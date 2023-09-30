import * as Core from '@xcheme/core';

import { ValueTypes } from '../core/types';
import { Scope } from './scope';

type CacheResults = {
  [key: string]: ValueTypes;
};

export class Cache {
  private results: CacheResults = {};

  static buildKey(scope: Scope): string {
    const pairs = [];

    for (const { value } of scope) {
      if (value instanceof Core.Node) {
        pairs.push(`#${value.fragment.begin}`);
      } else {
        pairs.push(value);
      }
    }

    return pairs.join('/');
  }

  store(key: string, value: ValueTypes) {
    this.results[key] = value;
  }

  retrieve(key: string): ValueTypes {
    return this.results[key];
  }
}
