import * as Core from '@xcheme/core';

import { Metadata } from '../core/metadata';
import { BaseScope, BaseScopeOptions } from '../core/scope';

export type ScopeScopeOptions = BaseScopeOptions & {
  debugPreOptimization?: boolean;
  debugMidOptimization?: boolean;
  debugEndOptimization?: boolean;

  enableHoisting?: boolean;
  resolveReferences?: boolean;
  resolveLiterals?: boolean;
  removeDeadCode?: boolean;
};

export class Scope extends BaseScope {
  anchorNode: Core.Node<Metadata>;

  anchorDirection: Core.NodeDirection;

  previousNode: Core.Node<Metadata>;

  previousDirection: Core.NodeDirection;

  currentNode: Core.Node<Metadata>;

  declarationNode?: Core.Node<Metadata>;

  scopeNode?: Core.Node<Metadata>;

  constructor(anchorNode: Core.Node<Metadata>, anchorDirection: Core.NodeDirection, options?: ScopeScopeOptions) {
    super({
      debugPreOptimization: false,
      debugMidOptimization: false,
      debugEndOptimization: false,
      enableHoisting: true,
      resolveReferences: true,
      resolveLiterals: true,
      removeDeadCode: true,
      ...options
    });

    this.anchorNode = anchorNode;
    this.anchorDirection = anchorDirection;
    this.previousDirection = anchorDirection;
    this.previousNode = anchorNode;
    this.currentNode = anchorNode.get(anchorDirection)!;
  }

  get options(): ScopeScopeOptions {
    return super.options as ScopeScopeOptions;
  }
}
