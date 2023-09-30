import { NodeType } from './types';

export type BaseScopeOptions = {
  debug?: boolean;
  enableMemoization?: boolean;
};

export class BaseScope {
  private parentScope: BaseScope | undefined;

  private scopeOptions: BaseScopeOptions;

  closureNode?: NodeType;

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
