import * as Core from '@xcheme/core';

import { BaseScope, BaseScopeOptions } from '../core/scope';
import { Metadata } from '../core/metadata';

export type ScopeOptions = BaseScopeOptions & {
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

  closureNode?: Core.Node<Metadata>;

  constructor(
    anchorNode: Core.Node<Metadata>,
    anchorDirection: Core.NodeDirection,
    parentScope?: Scope,
    options?: ScopeOptions
  ) {
    super({
      enableHoisting: true,
      constantFolding: true,
      constantPropagation: true,
      enableMemoization: true,
      enableTailCall: true,
      ...(options ?? parentScope?.options)
    });

    this.anchorNode = anchorNode;
    this.anchorDirection = anchorDirection;
    this.previousDirection = anchorDirection;
    this.previousNode = anchorNode;
    this.currentNode = anchorNode.get(anchorDirection)!;

    if (parentScope) {
      this.declarationNode = parentScope.declarationNode;
      this.closureNode = parentScope.closureNode;
    }
  }

  isMatchingDeclaration(node: Core.Node<Metadata>) {
    return this.declarationNode?.fragment.data === node.fragment.data;
  }

  get options(): ScopeOptions {
    return super.options as ScopeOptions;
  }
}
