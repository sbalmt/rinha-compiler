import * as Core from '@xcheme/core';

import { Metadata } from '../core/metadata';
import { BaseScope, BaseScopeOptions } from '../core/scope';

export type ScopeScopeOptions = BaseScopeOptions & {
  enableHoisting?: boolean;
  constantFolding?: boolean;
  constantPropagation?: boolean;
  enableMemoization?: boolean;
  enableTailCall?: boolean;
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
      enableHoisting: true,
      constantFolding: true,
      constantPropagation: true,
      enableMemoization: true,
      enableTailCall: true,
      ...options
    });

    this.anchorNode = anchorNode;
    this.anchorDirection = anchorDirection;
    this.previousDirection = anchorDirection;
    this.previousNode = anchorNode;
    this.currentNode = anchorNode.get(anchorDirection)!;
  }

  isMatchingDeclaration(node: Core.Node<Metadata>) {
    return this.declarationNode?.fragment.data === node.fragment.data;
  }

  get options(): ScopeScopeOptions {
    return super.options as ScopeScopeOptions;
  }
}
