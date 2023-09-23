import * as Core from '@xcheme/core';

import * as Expression from './nodes/expression';

import { Metadata } from '../core/metadata';
import { Scope } from './scope';

export class LazyCall<T extends Metadata> {
  private scope: Scope<T>;

  private node: Core.Node<T>;

  constructor(scope: Scope<T>, node: Core.Node<T>) {
    this.scope = scope;
    this.node = node;
  }

  invoke() {
    this.scope.lazyCall = true;
    const value = Expression.consumeNode(this.scope, this.node);
    this.scope.lazyCall = false;
    return value;
  }
}
