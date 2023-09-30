import * as Core from '@xcheme/core';

import { Metadata } from './metadata';

export type BaseScopeOptions = {
  debug?: boolean;
  enableMemoization?: boolean;
};

export class BaseScope {
  private parentScope: BaseScope | undefined;

  private scopeOptions: BaseScopeOptions;

  closureNode?: Core.Node<Metadata>;

  constructor(parentScope?: BaseScope, options?: BaseScopeOptions) {
    this.parentScope = parentScope;

    this.scopeOptions = {
      debug: false,
      enableMemoization: true,
      ...options
    };

    if (parentScope) {
      this.closureNode = parentScope.closureNode;
    }
  }

  get parent() {
    return this.parentScope;
  }

  get options() {
    return this.scopeOptions;
  }
}
